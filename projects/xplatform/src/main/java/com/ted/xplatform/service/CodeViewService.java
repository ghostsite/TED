package com.ted.xplatform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.context.MessageSource;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.dao.jpa.support.JpaHelper;
import com.ted.common.support.extjs4.grid.DynamicGrid;
import com.ted.common.support.extjs4.grid.Field;
import com.ted.common.support.page.JsonPage;
import com.ted.common.support.page.PageMetaData;
import com.ted.common.util.CommonUtils;
import com.ted.common.util.ConfigUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.vo.codeview.CodeViewParam;
import com.ted.xplatform.vo.codeview.Condition;
import com.ted.xplatform.vo.codeview.Order;

/**
 * CodeView Service
 */
@Transactional
@Service("codeViewService")
public class CodeViewService {
    @Inject
    JdbcTemplateDao jdbcTemplateDao;

    @Inject
    JpaSupportDao   jpaSupportDao;

    @Inject
    JpaTemplateDao  jpaTemplateDao;

    @Inject
    MessageSource   messageSource;

    @Inject
    ResourceService resourceService;

    public void setJdbcTemplateDao(JdbcTemplateDao jdbcTemplateDao) {
        this.jdbcTemplateDao = jdbcTemplateDao;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setResourceService(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    //=========================================//
    /**
     * 对外提供的业务方法,  for 'table' or 'gcm' ,not others
     */
    @Transactional(readOnly = true)
    public JsonPage pagedTableOrGcm(CodeViewParam param) throws ClassNotFoundException {
        String pojoName = "table".equals(param.getType()) ? param.getTable() : "common.Type"; // table 是pojo下的java bean 的类名
        CriteriaBuilder criteriaBuilder = jpaSupportDao.getEntityManager().getCriteriaBuilder();
        Class<?> entityClass = Thread.currentThread().getContextClassLoader().loadClass(ConfigUtils.getPackageScan()[0] + '.' + pojoName);
        CriteriaQuery<?> criteriaQuery = criteriaBuilder.createQuery(entityClass);
        Root root = criteriaQuery.from(entityClass);

        if (param.getCondition() != null) {
            for (Condition filter : param.getCondition()) {
                if (filter.getOperator() == null || filter.getOperator().equals("=")) {
                    Predicate condition = criteriaBuilder.equal(root.get(filter.getColumn()), filter.getValue());
                    criteriaQuery.where(condition);
                } else if (filter.getOperator().toLowerCase().equals("like")) {
                    Predicate condition = criteriaBuilder.like(root.get(filter.getColumn()), filter.getValue());
                    criteriaQuery.where(condition);
                } else if (filter.getOperator().equals("!=")) {
                    Predicate condition = criteriaBuilder.notEqual(root.get(filter.getColumn()), filter.getValue());
                    criteriaQuery.where(condition);
                }
            }
        }
        criteriaQuery.select(root);

        if (param.getOrder() != null) {
            for (Order order : param.getOrder()) {
                if (order.getAscending()) {
                    criteriaQuery.orderBy(criteriaBuilder.asc(root.get(order.getColumn())));
                } else {
                    criteriaQuery.orderBy(criteriaBuilder.desc(root.get(order.getColumn())));
                }
            }
        }

        TypedQuery<?> typedQuery = jpaSupportDao.getEntityManager().createQuery(criteriaQuery);
        int totalCount = JpaHelper.count(jpaSupportDao.getEntityManager(), criteriaQuery).intValue();
        if (param.getStart() != null)
            typedQuery.setFirstResult(param.getStart());
        if (param.getLimit() != null && param.getLimit() > 0) {
            typedQuery.setMaxResults(param.getLimit());
        }
        List<?> result = typedQuery.getResultList();
        return new JsonPage(result, null, totalCount);
    };

    /**
     * sqlquery
     * TODO fix it , add param to sql and order by...
     * JsonPage = PageMetaData, json输出，2者是一样的。
     * 暂时不支持sql中带参数
     */
    @Transactional(readOnly = true)
    public JsonPage pagedSqlQuery(CodeViewParam param) {
        //JPA的事务传不到jdbcTemplaate，现象时查询两次（one:count, another is list)第二次会出错：说can't open a closed connection!!!
        //@see http://stackoverflow.com/questions/14567180/spring-jpa-hibernate-valid-configuration-not-working-with-jdbctemplate
        //@see https://jira.springsource.org/browse/SPR-10395 important
        PageMetaData pagedData = jdbcTemplateDao.pagedByNativeSQLWithMetaData(param.getQuery(), new HashMap(), param.getStart(), param.getLimit());
        return CommonUtils.pageMetaData2JsonPage(pagedData);
    };

    /**
     * back up for 动态查询sql然后然会到grid中,这个方法暂时没人用。
     */
    @Transactional(readOnly = true)
    public JsonPage pagedSqlQuery1(CodeViewParam param) {
        String sql = param.getQuery();
        SqlRowSet sqlRowSet = jdbcTemplateDao.getNamedJdbcOperation().queryForRowSet(sql, new HashMap());
        List<Map<String, Object>> list = SpringUtils.convert(sqlRowSet);
        DynamicGrid gridInfo = new DynamicGrid();
        gridInfo.setContent(list);
        SqlRowSetMetaData metaData = sqlRowSet.getMetaData();
        String[] columnNames = metaData.getColumnNames();
        for (String columnName : columnNames) {
            Field field = new Field();
            field.setType("string");
            field.setName(columnName); //应该是大写 for Oracle
            gridInfo.getFields().add(field);
        }
        Map map = new HashMap();
        map.put("success", true);
        map.put("columns", gridInfo.getFields());//适配前端js
        map.put("rows", gridInfo.getContent());
        return new JsonPage();
    };

}
