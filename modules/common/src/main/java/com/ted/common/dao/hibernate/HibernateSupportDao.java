package com.ted.common.dao.hibernate;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.springframework.dao.DataAccessException;

import com.ted.common.support.page.JsonPage;

/**
 * Hibernate 4
 */
public interface HibernateSupportDao {
    Session getSession();

    public void initialize(Object obj, String[] properties);

    void saveAll(Collection<?> entities);

    void updateAll(Collection<?> entities);

    void deleteAll(Collection<?> entities);

    void bulkUpdate(final String queryString, final Object... values);
    
    void bulkUpdate(final String queryString, final Collection<? extends Serializable> values);

    public int updateNamedSQLQuery(String queryName, Map<String, Object> params);

    <T> T findUniqueBy(Class<T> entityClass, String propertyName, Object value);

    <T> T findEntityAssociate(Class<T> clazz, Serializable id, String[] properties);
    
    <T> T findEntityAssociate(Class<T> clazz, String propertyName, Object value, String[] properties);

    //======================查询without page==========================//
    <T> Criteria createCriteria(Class<T> entityClass, Criterion... criterions);

    <T> Criteria createCriteria(Class<T> entityClass, String orderBy, boolean isAsc, Criterion... criterions);

    Query createQuery(String hql, Object... values);

    <T> List<T> findBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass);

    <E> List<E> findBySQLQuery(String sql);

    <E> List<E> findBySQLQuery(String sql, Map<String, Object> params);

    <E> List<E> findByNamedSQLQuery(String queryName, Map<String, Object> params);

    <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value, String orderBy, boolean isAsc);

    <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value);

    <E> List<E> findByNamedParam(String queryString, Map<String, Object> params);

    //=======================copy from HibernateSupport===========================//
    <E> List<E> find(String hqlString) throws DataAccessException;

    <E> List<E> find(String hqlString, Object value) throws DataAccessException;

    <E> List<E> find(String hqlString, Object... values) throws DataAccessException;

    <E> List<E> find(String hqlString, Map<String, Object> params) throws DataAccessException;

    <E> List<E> findByValueBean(String queryString, Object valueBean) throws DataAccessException;

    <E> List<E> findByCriteria(DetachedCriteria criteria) throws DataAccessException;

    <E> List<E> findByCriteria(DetachedCriteria criteria, int firstResult, int maxResults) throws DataAccessException;

    <E> List<E> findByExample(Object exampleEntity) throws DataAccessException;

    <E> List<E> findByExample(String entityName, Object exampleEntity) throws DataAccessException;

    <E> List<E> findByExample(Object exampleEntity, int firstResult, int maxResults) throws DataAccessException;

    <E> List<E> findByExample(String entityName, Object exampleEntity, int firstResult, int maxResults) throws DataAccessException;

    //=================================page query================================================//
    <T> JsonPage<T> pagedQuery(Class<?> entityClass, int start, int limit, String orderBy, boolean isAsc, Criterion... criterions);

    <T> JsonPage<T> pagedQuery(Class<?> entityClass, int start, int limit, Criterion... criterions);

    <T> JsonPage<T> pagedQuery(Criteria criteria, int start, int limit, String distinctProperty);

    <T> JsonPage<T> pagedQuery(Criteria criteria, int start, int limit);
    
    
    //注意：下面的namedSQL or nameHQL is base from hibernate/hbm directory ,not hibernate/dynamic/**
    <T> JsonPage<T> pagedBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass);

    <T> JsonPage<T> pagedBySQLQuery(String sql, Map<String, Object> params);

    <T> JsonPage<T> pagedByNamedSQLQuery(String sqlName, Map<String, Object> params);
    
    <T> JsonPage<T> pagedByHQLQuery(String hql, int start, int limit, Object... values);

    <T> JsonPage<T> pagedByNamedHQLQuery(String hqlName, int start, int limit, Object... values);

    <T> JsonPage<T> pagedByNamedHQLQuery(String hqlName, int start, int limit, Map<String, Object> params);

}
