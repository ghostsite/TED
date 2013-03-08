package com.ted.common.dao.jpa;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.ted.common.dao.TemplateDao;
import com.ted.common.support.page.JsonPage;

/**
 * 这个是参照以前的JdbcTemplateDao写的，主要是针对jpql的动态模板查询语句。
 * 关于createNativeQuery的都没实现，请调用JdbcTemplateDao.java
 * @date 20130307
 */
public interface JpaTemplateDao extends TemplateDao{
    EntityManager getEntityManager();
    //-----------------------JPQL-----------------------//
    int executeJPQLUpdate(String namedQL, Map<String, Object> params);

    Object findByJPQLUnique(String namedQL, Map<String, Object> params);

    <T> List<T> findByJPQLList(String namedQL, Map<String, Object> params, Class<T> resultClass, int start, int limit);

    <T> List<T> findByJPQLList(String namedQL, Map<String, Object> params, Class<T> resultClass);

    <T> JsonPage<T> pagedByJPQLQuery(String namedQL, Map<String, Object> params, Class<T> resultClass, int start, int limit);

}
