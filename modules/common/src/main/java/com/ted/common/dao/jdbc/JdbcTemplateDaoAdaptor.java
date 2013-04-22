package com.ted.common.dao.jdbc;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import com.ted.common.dao.DaoTemplateHelper;
import com.ted.common.dao.TemplateDaoSupport;
import com.ted.common.support.page.JsonPage;
import com.ted.common.support.page.PageHelper;
import com.ted.common.support.page.PageMetaData;
import com.ted.common.util.ConfigUtils;
import com.ted.common.util.SpringUtils;

@SuppressWarnings("all")
public class JdbcTemplateDaoAdaptor extends TemplateDaoSupport implements JdbcTemplateDao {

    private NamedParameterJdbcTemplate                           namedJdbcTemplate;

    private org.springframework.beans.factory.xml.DocumentLoader documentLoader = new org.springframework.beans.factory.xml.DefaultDocumentLoader();

    public void setNamedJdbcTemplate(NamedParameterJdbcTemplate namedJdbcTemplate) {
        this.namedJdbcTemplate = namedJdbcTemplate;
    }

    @Override
    public <T> List<T> queryForList(String sql, Class<T> clazz, Object... args) {
        return namedJdbcTemplate.getJdbcOperations().query(sql, new BeanPropertyRowMapper(clazz), args);
    }

    @Override
    public <T> List<T> findBySQLBeanQuerySpring(String queryName, Map<String, Object> params, Class<?> clazz) {
        String sql = getTemplatedQLString(queryName, params);
        List list = namedJdbcTemplate.getJdbcOperations().query(sql, new BeanPropertyRowMapper(clazz), params);
        return list;
    };

    /**
     * NOTE: query params like id = :id , 而不是用的?来表示参数。
     * ?是给getJdbcOperations().调用的,而 :id 是给NamedJdbcTemplate用的. 
     */
    @Override
    public <T> JsonPage<T> pagedBySQLBeanQuerySpring(String queryName, Map<String, Object> params, Class<?> clazz, int start, int limit) {
        String sql = getTemplatedQLString(queryName, params);
        String countSql = "select count(*) from(" + DaoTemplateHelper.removeOrders(sql) + ")t"; //sql server 要求有别名,注意order by 最好写在最后，并且是最后一行。如果要不是最后怎么办？？
        int totalCount = namedJdbcTemplate.queryForObject(countSql, params, Integer.class);

        if (start >= 0 && limit > 0) {
            if (ConfigUtils.isOracle()) {
                sql = "select * from (select row_.*, rownum rownum_ from (" + sql + ")row_ where rownum<=" + (start + limit) + ") where rownum_>" + start;
            } else if (ConfigUtils.isMysql()) {
                sql = sql + " limit " + start + "," + start + limit;
            } else if (ConfigUtils.isSqlServer()) {
                sql = DaoTemplateHelper.getLimitString(sql, start, limit);
            }
        }

        PageRequest pageRequest = PageHelper.getPageRequestByStartLimit(start, limit);
        //return new Page(pageRequest, totalCount, namedJdbcTemplate.getJdbcOperations().query(sql, new BeanPropertyRowMapper(clazz), params));
        //return new JsonPage(pageRequest, totalCount, namedJdbcTemplate.query(sql, params, new BeanPropertyRowMapper(clazz)));//this is good
        return new JsonPage(namedJdbcTemplate.query(sql, params, new BeanPropertyRowMapper(clazz)), pageRequest, totalCount);
    };

    // metadata and data all return 
    //queryName is only name in xml (defined sql name)
    @Override
    public PageMetaData pagedBySQLWithMetaData(String queryName, Map<String, Object> paramMap) {
        String sql = getTemplatedQLString(queryName, paramMap);
        return pagedByNativeSQLWithMetaData(sql, paramMap);
    };

    @Override
    public PageMetaData pagedBySQLWithMetaData(String queryName, Map<String, Object> paramMap, int start, int limit) {
        String sql = getTemplatedQLString(queryName, paramMap);
        return pagedByNativeSQLWithMetaData(sql, paramMap);
    }

    @Override
    public NamedParameterJdbcOperations getNamedJdbcOperation() {
        return namedJdbcTemplate;
    }

    @Override
    public PageMetaData pagedByNativeSQLWithMetaData(String sql, Map<String, Object> paramMap) {
        SqlRowSet sqlRowSet = namedJdbcTemplate.queryForRowSet(sql, paramMap);
        List<Map<String, Object>> list = SpringUtils.convert(sqlRowSet);
        return new PageMetaData(list, list.size(), sqlRowSet.getMetaData());
    }

    @Override
    public PageMetaData pagedByNativeSQLWithMetaData(String sql, Map<String, Object> paramMap, int start, int limit) {
        String countSql = "select count(*) from(" + DaoTemplateHelper.removeOrders(sql) + ")t";
        int totalCount = namedJdbcTemplate.queryForObject(countSql, paramMap, Integer.class);
        if (start >= 0 && limit > 0) {
            if (ConfigUtils.isOracle()) {
                sql = "select * from (select row_.*, rownum rownum_ from (" + sql + ")row_ where rownum<=" + (start + limit) + ") where rownum_>" + start;
            } else if (ConfigUtils.isMysql()) {
                sql = sql + " limit " + start + "," + start + limit;
            } else if (ConfigUtils.isSqlServer()) {
                sql = DaoTemplateHelper.getLimitString(sql, start, limit);
            }
        }
        SqlRowSet sqlRowSet = namedJdbcTemplate.queryForRowSet(sql, paramMap);
        List<Map<String, Object>> list = SpringUtils.convert(sqlRowSet);
        return new PageMetaData(list, totalCount, sqlRowSet.getMetaData());
    }

}
