package com.ted.common.dao.jdbc;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;

import com.ted.common.dao.TemplateDao;
import com.ted.common.support.page.JsonPage;
import com.ted.common.support.page.PageMetaData;

/**
 *  这个是用在动态的native SQL
 *  注意：下面的namedSQL is based on template/ql/sql/*.xml
 *  这个是用spring jdbc实现的，其他的Hibernate和JPA的关于native sql的都不建议调用，而且
 *  JPA的TemplateDao也没有实现native的查询，建议调用JdbcTemplateDao.java
 */
public interface JdbcTemplateDao extends TemplateDao{
    Log LOGGER = LogFactory.getLog(JdbcTemplateDao.class);

    NamedParameterJdbcOperations getNamedJdbcOperation();
    //-----------------------SQL-----------------------//
    <T> List<T> findBySQLBeanQuerySpring(String queryName, Map<String, Object> params, Class<?> clazz);

    <T> JsonPage<T> pagedBySQLBeanQuerySpring(String queryName, Map<String, Object> params, Class<?> clazz, int start, int limit);

    PageMetaData pagedBySQLWithMetaData(String queryName, Map<String, Object> paramMap);

    PageMetaData pagedBySQLWithMetaData(String queryName, Map<String, Object> paramMap, int start, int limit);

}