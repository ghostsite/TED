package com.ted.common.dao.jpa;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.apache.poi.ss.formula.functions.T;
import org.springframework.dao.DataAccessException;

import com.ted.common.support.page.JsonPage;

/**
 * 纯粹的JPASupport，不是spring-data-jpa
 * 这个不是读取模板配置文件(*.xml)中的jpql,
 * 这里面包括原生sql的方法。
 * 建议Service中如果不写dao的话，可以使用这个JpaSupportDao
 */
public interface JpaSupportDao {
    EntityManager getEntityManager();
    
    void saveAll(Collection<?> entities);

    void updateAll(Collection<?> entities);

    void deleteAll(Collection<?> entities);

    void bulkUpdate(final String queryString, final Object... values);
    
    void bulkUpdate(final String queryString, final Collection<? extends Serializable> values);

    public int updateNamedSQLQuery(String queryName, Map<String, Object> params);

    public <T> T findSingleByProperty(Class<T> entityClass, String propertyName, Object value);

    public <T> T findByIdWithDepth(Class<T> type, Object id, String... fetchRelations);
    
    public <T> T findByPropertyWithDepth(Class<T> type, String property, Object value, String... fetchRelations);

    //======================查询without page==========================//
    Query createQuery(String jpql, Object... values);

    <T> List<T> findBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass);

    <E> List<E> findBySQLQuery(String sql);

    <E> List<E> findBySQLQuery(String sql, Map<String, Object> params);

    <E> List<E> findByNamedSQLQuery(String queryName, Map<String, Object> params);

    <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value, String orderBy, boolean isAsc);

    <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value);

    <E> List<E> findByNamedParam(String queryString, Map<String, Object> params);

    //=======================copy from HibernateSupport===========================//
    <E> List<E> find(String jpqlString) throws DataAccessException;

    <E> List<E> find(String jpqlString, Object value) throws DataAccessException;

    <E> List<E> find(String jpqlString, Object... values) throws DataAccessException;

    <E> List<E> find(String jpqlString, Map<String, Object> params) throws DataAccessException;

    <E> List<E> findByExample(Object exampleEntity) throws DataAccessException;

    <E> List<E> findByExample(String entityName, Object exampleEntity) throws DataAccessException;

    <E> List<E> findByExample(Object exampleEntity, int firstResult, int maxResults) throws DataAccessException;

    <E> List<E> findByExample(String entityName, Object exampleEntity, int firstResult, int maxResults) throws DataAccessException;

    //=================================page query================================================//
    /**注意：下面的namedJPQL is based in java file : named@NamedQueries ({
    @NamedQuery (name= "getPerson" , query= "FROM Person WHERE personid=?1" ),
    @NamedQuery (name= "getPersonList" , query= "FROM Person WHERE age>?1" )
    })*/
    <T> JsonPage<T> pagedBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass);

    <T> JsonPage<T> pagedBySQLQuery(String sql, Map<String, Object> params);

    <T> JsonPage<T> pagedByNamedSQLQuery(String nameJPQL, Map<String, Object> params);
    
    <T> JsonPage<T> pagedByJPQLQuery(String jpql, int start, int limit, Object... values);

    <T> JsonPage<T> pagedByNamedJPQLQuery(String namedJPQL, int start, int limit, Object... values);

    <T> JsonPage<T> pagedByNamedJPQLQuery(String namedJPQL, int start, int limit, Map<String, Object> params);

}
