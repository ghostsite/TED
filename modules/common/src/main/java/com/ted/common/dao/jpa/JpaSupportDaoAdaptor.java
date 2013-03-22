package com.ted.common.dao.jpa;

import java.io.Serializable;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.FetchParent;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.collections.MapUtils;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.ted.common.dao.DaoTemplateHelper;
import com.ted.common.dao.jpa.support.JpaHelper;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.CommonUtils;

/**
 * 
 * @date 20130305
 */
@SuppressWarnings("all")
@Transactional
//@Repository("jpaSupportDao") 这个在xml里面配置，不通过扫描了
public class JpaSupportDaoAdaptor implements JpaSupportDao {
    //@PersistenceContext
    @Inject
    EntityManager entityManager;

    //@Inject
    //EntityManagerFactory entityManagerFactory;

    //public void setEntityManagerFactory(EntityManagerFactory entityManagerFactory) {
    // this.entityManagerFactory = entityManagerFactory;
    //}

    public EntityManager getEntityManager() {
        //return entityManagerFactory.createEntityManager();
        return entityManager;
    }

    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void saveOrUpdateAll(Collection collections) {
        for (Object entity : collections) {
            getEntityManager().merge(entity);
        }
    }

    public void deleteAll(Collection<?> entities) {
        for (Object entity : entities) {
            getEntityManager().remove(entity);
        }
    }

    /**
     * becareful:if no result ,there will <b>NOT</b> be a exception
     */
    @Override
    public <T> T findSingleByProperty(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName);
        CriteriaBuilder criteriaBuilder = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(entityClass);
        Root<T> root = criteriaQuery.from(entityClass);
        Predicate condition = criteriaBuilder.equal(root.get(propertyName), value);
        criteriaQuery.where(condition);
        TypedQuery<T> typedQuery = getEntityManager().createQuery(criteriaQuery);
        List<T> resultList = typedQuery.getResultList();
        if (resultList != null && resultList.size() > 0) {
            return resultList.get(0);
        }
        return null;
    };

    /**原来我的名字叫：  findEntityAssociate
     * copy from http://jdevelopment.nl/fetching-arbitrary-object-graphs-jpa-2/
     * @param type
     * @param id
     * @param fetchRelations
     * @return
     */
    @Override
    public <T> T findByIdWithDepth(Class<T> type, Object id, String... fetchRelations) {
        CriteriaBuilder criteriaBuilder = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(type);
        Root<T> root = criteriaQuery.from(type);
        for (String relation : fetchRelations) {
            FetchParent<T, T> fetch = root;
            for (String pathSegment : relation.split(".")) {
                fetch = fetch.fetch(pathSegment, JoinType.LEFT);
            }
        }
        criteriaQuery.where(criteriaBuilder.equal(root.get("id"), id));
        return getSingleOrNoneResult(getEntityManager().createQuery(criteriaQuery));
    }

    @Override
    public <T> T findByPropertyWithDepth(Class<T> type, String property, Object value, String... fetchRelations) {
        CriteriaBuilder criteriaBuilder = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(type);
        Root<T> root = criteriaQuery.from(type);
        for (String relation : fetchRelations) {
            FetchParent<T, T> fetch = root;
            for (String pathSegment : relation.split(".")) {
                fetch = fetch.fetch(pathSegment, JoinType.LEFT);
            }
        }
        criteriaQuery.where(criteriaBuilder.equal(root.get(property), value));
        return getSingleOrNoneResult(getEntityManager().createQuery(criteriaQuery));
    }

    private <T> T getSingleOrNoneResult(TypedQuery<T> query) {
        query.setMaxResults(1);
        List<T> result = query.getResultList();
        if (result.isEmpty()) {
            return null;
        }
        return result.get(0);
    }

    @Override
    public Query createQuery(String jpql, Object... values) {
        Assert.hasText(jpql);
        Query query = getEntityManager().createQuery(jpql);
        if (null == values)
            return query;
        for (int i = 0; i < values.length; i++) {
            query.setParameter(i, values[i]);
        }
        return query;
    }

    @Override
    public <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName);
        CriteriaBuilder criteriaBuilder = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(entityClass);
        Root<T> root = criteriaQuery.from(entityClass);
        Predicate condition = criteriaBuilder.equal(root.get(propertyName), value);
        criteriaQuery.where(condition);
        TypedQuery<T> typedQuery = getEntityManager().createQuery(criteriaQuery);
        List<T> result = typedQuery.getResultList();
        return result;
    };

    @Override
    public <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value, String orderBy, boolean isAsc) {
        Assert.hasText(propertyName);
        Assert.hasText(orderBy);
        CriteriaBuilder criteriaBuilder = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(entityClass);
        Root<T> root = criteriaQuery.from(entityClass);
        Predicate condition = criteriaBuilder.equal(root.get(propertyName), value);
        criteriaQuery.where(condition);

        criteriaQuery.select(root);
        if (isAsc) {
            criteriaQuery.orderBy(criteriaBuilder.asc(root.get(orderBy)));
        } else {
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get(orderBy)));
        }

        TypedQuery<T> typedQuery = getEntityManager().createQuery(criteriaQuery);
        List<T> result = typedQuery.getResultList();
        return result;
    };

    @Override
    public JsonPage pagedByNamedJPQLQuery(String namedJPQL, int start, int limit, Map params) {
        Query query = getEntityManager().createNamedQuery(namedJPQL);
        //		String countSql = "select count(1) from (" + query.getQueryString() + ") alias";
        String countSql = "select count (*) " + DaoTemplateHelper.removeSelect(DaoTemplateHelper.removeOrders(JpaHelper.getQueryString(query)));
        Query countQuery = getEntityManager().createQuery(countSql);
        JpaHelper.setProperties(countQuery, params);
        try {
            Number count = (Number) countQuery.getSingleResult();
            int totalCount = count.intValue();
            JpaHelper.setProperties(countQuery, params);
            List list = query.setFirstResult(start).setMaxResults(limit).getResultList();
            return new JsonPage(list, null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    @Override
    public JsonPage pagedByNamedJPQLQuery(String namedJPQL, int start, int limit, Object... values) {
        Query query = getEntityManager().createNamedQuery(namedJPQL);
        String countSql = "select count (*) " + DaoTemplateHelper.removeSelect(DaoTemplateHelper.removeOrders(JpaHelper.getQueryString(query)));
        Query countQuery = getEntityManager().createQuery(countSql);
        for (int i = 0; i < values.length; i++) {
            countQuery.setParameter(i, values[i]);
        }
        try {
            Number count = (Number) countQuery.getSingleResult();
            int totalCount = count.intValue();
            for (int i = 0; i < values.length; i++) {
                query.setParameter(i, values[i]);
            }
            List list = query.setFirstResult(start).setMaxResults(limit).getResultList();
            //            return new Page(totalCount, list);
            return new JsonPage(list, null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    @Override
    public JsonPage pagedByJPQLQuery(String jpql, int start, int limit, Object... values) {
        String countQueryString = " select count (*) " + DaoTemplateHelper.removeSelect(DaoTemplateHelper.removeOrders(jpql));
        Query queryObject = getEntityManager().createQuery(countQueryString);
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                queryObject.setParameter(i, values[i]);
            }
        }
        List countlist = queryObject.getResultList();
        long totalCount = (Long) countlist.get(0);
        if (totalCount < 1) {
            return new JsonPage();
        }
        Query query = createQuery(jpql, values);
        List list = query.setFirstResult(start).setMaxResults(limit).getResultList();
        //        return new Page(totalCount, list);
        return new JsonPage(list, null, totalCount);
    };

    @Override
    public JsonPage pagedByNamedSQLQuery(String nameJPQL, Map params) {
        Query query = getEntityManager().createNamedQuery(nameJPQL);
        String countSql = "select count(1) from (" + JpaHelper.getQueryString(query) + ") alias";
        Query countQuery = getEntityManager().createNativeQuery(countSql);
        JpaHelper.setProperties(countQuery, params);
        try {
            Number count = (Number) countQuery.getSingleResult();
            int totalCount = count.intValue();
            JpaHelper.setProperties(query, params);

            int start = CommonUtils.getStartIntFromMap(params);
            int limit = CommonUtils.getLimitIntFromMap(params);
            List list = query.setFirstResult(start).setMaxResults(limit).getResultList();
            //            return new Page(totalCount, list);
            return new JsonPage(list, null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    @Override
    public <E> List<E> findByNamedSQLQuery(String queryName, Map<String, Object> params) {
        List list = null;
        try {
            Query query = getEntityManager().createNamedQuery(queryName);
            JpaHelper.setProperties(query, params);
            list = query.getResultList();
        } catch (DataAccessResourceFailureException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
        return list;
    };

    @Override
    public <E> List<E> findByNamedParam(String jpqlString, Map<String, Object> params) {
        List list = null;
        try {
            Query query = getEntityManager().createQuery(jpqlString);
            JpaHelper.setProperties(query, params);
            list = query.getResultList();
        } catch (DataAccessResourceFailureException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
        return list;
    };

    //update SQL
    public int updateNamedSQLQuery(String queryName, Map params) {
        try {
            Query query = getEntityManager().createNamedQuery(queryName);
            JpaHelper.setProperties(query, params);
            return query.executeUpdate();
        } catch (DataAccessResourceFailureException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
        return 0;
    };

    @SuppressWarnings("all")
    public JsonPage pagedBySQLQuery(String sql, Map params) {
        Query query = getEntityManager().createNativeQuery(sql);
        String countSql = "select count(1) from (" + sql + ") alias";
        Query countQuery = getEntityManager().createNativeQuery(countSql);
        JpaHelper.setProperties(countQuery, params);
        try {
            Number count = (Number) countQuery.getSingleResult();
            int totalCount = count.intValue();
            JpaHelper.setProperties(query, params);

            int start = CommonUtils.getStartIntFromMap(params);
            int limit = CommonUtils.getLimitIntFromMap(params);
            List list = query.setFirstResult(start).setMaxResults(limit).getResultList();
            //return new Page(totalCount, list);
            return new JsonPage(list, null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    //201011210 added 
    public <E> List<E> findBySQLQuery(String sql, Map<String, Object> params) {
        Query query = getEntityManager().createNativeQuery(sql);
        if (null != params && !params.isEmpty()) {
            JpaHelper.setProperties(query, params);
        }
        List list = query.getResultList();
        return list;
    };

    //20101121 added 
    public <T> List<T> findBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass) {
        Query query = getEntityManager().createNativeQuery(sql, entityClass);//.setResultTransformer(Transformers.aliasToBean(entityClass));
        if (null != params && !params.isEmpty()) {
            JpaHelper.setProperties(query, params);
        }
        List<T> list = query.getResultList();
        return list;
    };

    @SuppressWarnings("all")
    public <T> JsonPage pagedBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass) {
        Query query = getEntityManager().createNativeQuery(sql, entityClass);//.setResultTransformer(Transformers.aliasToBean(entityClass));
        String countSql = "select count(1) from (" + sql + ") alias";
        Query countQuery = getEntityManager().createNativeQuery(countSql);
        JpaHelper.setProperties(countQuery, params);
        try {
            Number count = (Number) countQuery.getSingleResult();
            int totalCount = count.intValue();
            JpaHelper.setProperties(query, params);

            int start = CommonUtils.getStartIntFromMap(params);
            int limit = CommonUtils.getLimitIntFromMap(params);
            List<T> list = query.setFirstResult(start).setMaxResults(limit).getResultList();
            //return new Page(totalCount, list);
            return new JsonPage(list, null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    public List findBySQLQuery(String sql) {
        return findBySQLQuery(sql, null);
    };

    public void updateAll(Collection entities) {
        for (Object entity : entities)
            getEntityManager().persist(entity);
    }

    public final static int DEFAULT_BATCH_SIZE = 25;

    public void saveAll(Collection entities) {
        if (entities == null) {
            return;
        }
        Object[] arryObj = entities.toArray();
        int max = arryObj.length;
        for (int i = 0; i < max; i++) {
            getEntityManager().persist(arryObj[i]);
            if ((i != 0 && i % DEFAULT_BATCH_SIZE == 0) || i == max - 1) {
                getEntityManager().flush();
                getEntityManager().clear();
            }
        }
    }

    //@see http://hi.baidu.com/liuzhe041/blog/item/7608ebf55637f729720eecfb.html,主要是为了删除
    public void bulkUpdate(final String queryString, final Object... values) {
        Query query = getEntityManager().createQuery(queryString);
        query.setParameter("ids", values);
        query.executeUpdate();
    }

    //@see http://hi.baidu.com/liuzhe041/blog/item/7608ebf55637f729720eecfb.html,主要是为了删除
    public void bulkUpdate(final String jpqlString, final Collection<? extends Serializable> values) {
        Query query = getEntityManager().createQuery(jpqlString);
        query.setParameter("ids", values);
        query.executeUpdate();
    }

    @Override
    public <E> List<E> find(String jpqlString) throws DataAccessException {
        return find(jpqlString, (Object[]) null);
    }

    @Override
    public <E> List<E> find(String jpqlString, Object value) throws DataAccessException {
        return find(jpqlString, new Object[] { value });
    }

    public <E> List<E> find(String jpqlString, Map<String, Object> params) throws DataAccessException {
        Query queryObject = getEntityManager().createQuery(jpqlString);
        if (MapUtils.isNotEmpty(params)) {
            Iterator<Map.Entry<String, Object>> iterator = params.entrySet().iterator();
            if (iterator.hasNext()) {
                Map.Entry<String, Object> entry = iterator.next();
                String key = entry.getKey();
                Object value = entry.getValue();
                queryObject.setParameter(key, value);
            }
        }
        return queryObject.getResultList();
    };

    @Override
    public <E> List<E> find(String jpqlString, Object... values) throws DataAccessException {
        Query queryObject = getEntityManager().createQuery(jpqlString);
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                queryObject.setParameter(i, values[i]);
            }
        }
        return queryObject.getResultList();
    }

    @Override
    public <E> List<E> findByExample(Object exampleEntity) throws DataAccessException {
        return findByExample(null, exampleEntity, -1, -1);
    }

    @Override
    public <E> List<E> findByExample(String entityName, Object exampleEntity) throws DataAccessException {
        return findByExample(entityName, exampleEntity, -1, -1);
    }

    @Override
    public <E> List<E> findByExample(Object exampleEntity, int firstResult, int maxResults) throws DataAccessException {
        return findByExample(null, exampleEntity, firstResult, maxResults);
    }

    @Override
    public <E> List<E> findByExample(String entityName, Object exampleEntity, int firstResult, int maxResults) throws DataAccessException {
        org.hibernate.Session session = (org.hibernate.Session) getEntityManager().getDelegate();
        // create an example from our customer, exclude all zero valued numeric properties 
        org.hibernate.criterion.Example customerExample = org.hibernate.criterion.Example.create(entityName).excludeZeroes(); //session.createCriteria(entityName) : session.createCriteria(exampleEntity.getClass()));
        // create criteria based on the customer example
        org.hibernate.Criteria criteria = session.createCriteria(entityName).add(customerExample);
        // perform the query

        if (firstResult >= 0) {
            criteria.setFirstResult(firstResult);
        }
        if (maxResults > 0) {
            criteria.setMaxResults(maxResults);
        }
        return criteria.list();
    }

    @Override
    public <T> List<T> getAll(Class<T> clazz) {
        EntityManager em = this.getEntityManager();
        CriteriaQuery<T> cq = em.getCriteriaBuilder().createQuery(clazz);
        cq.select(cq.from(clazz));
        List<T> list = em.createQuery(cq).getResultList();
        return list;
    }

    @Override
    public <T> JsonPage<T> pagedAll(Class<T> clazz, int start, int limit) {
        EntityManager em = this.getEntityManager();
        CriteriaQuery<T> cq = em.getCriteriaBuilder().createQuery(clazz);
        cq.select(cq.from(clazz));
        int totalCount = JpaHelper.count(em, cq).intValue();
        List<T> list = em.createQuery(cq).setFirstResult(start).setMaxResults(limit).getResultList();
        return new JsonPage(list, null, totalCount);
    }

}
