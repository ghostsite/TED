package com.ted.common.dao.jpa;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.springframework.data.domain.PageRequest;

import com.ted.common.dao.DaoTemplateHelper;
import com.ted.common.dao.TemplateDaoSupport;
import com.ted.common.dao.jpa.support.JpaHelper;
import com.ted.common.support.page.JsonPage;
import com.ted.common.support.page.PageHelper;

public class JpaTemplateDaoAdaptor extends TemplateDaoSupport implements JpaTemplateDao {
    //@PersistenceContext
    //EntityManager em;
    @Inject
    EntityManager entityManager;

    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public EntityManager getEntityManager() {
        //return entityManagerFactory.createEntityManager();
        return entityManager;
    }

    @Override
    public int executeJPQLUpdate(String namedQL, Map<String, Object> params) {
        Query query = findJPQLThenBindParams(namedQL, params);
        return query.executeUpdate();
    }

    @Override
    public Object findByJPQLUnique(String namedQL, Map<String, Object> params) {
        Query query = findJPQLThenBindParams(namedQL, params);
        return query.getSingleResult();
    }

    @Override
    public <T> List<T> findByJPQLList(String namedQL, Map<String, Object> params, Class<T> resultClass, int start, int limit) {
        TypedQuery<T> typedQuery = findJPQLThenBindParams(namedQL, params, resultClass);
        if (start >= 0 && limit > 0) {
            typedQuery.setFirstResult(start);
            typedQuery.setMaxResults(limit);
        }
        return typedQuery.getResultList();
    }

    @Override
    public <T> List<T> findByJPQLList(String namedQL, Map<String, Object> params, Class<T> resultClass) {
        return findByJPQLList(namedQL, params, resultClass);
    }

    @Override
    public <T> JsonPage<T> pagedByJPQLQuery(String namedQL, Map<String, Object> params, Class<T> resultClass, int start, int limit) {
        TypedQuery<T> typedQuery = findJPQLThenBindParams(namedQL, params, resultClass);
        String countJpql = "select count(*)" + DaoTemplateHelper.removeSelect(DaoTemplateHelper.removeOrders(JpaHelper.getQueryString(typedQuery)));
        Query countQuery = getEntityManager().createQuery(countJpql);
        JpaHelper.setProperties(countQuery, params);
        Number count = (Number) countQuery.getSingleResult();
        int totalCount = count.intValue();
        if (start >= 0 && limit > 0) {
            typedQuery.setFirstResult(start);
            typedQuery.setMaxResults(limit);
        }
        PageRequest pageRequest = PageHelper.getPageRequestByStartLimit(start, limit);
        return new JsonPage(typedQuery.getResultList(), pageRequest, totalCount);
    }

    //==================internal helper===============================
    private <T> TypedQuery<T> findJPQLThenBindParams(String namedQL, Map<String, Object> params, Class<T> resultClass) {
        String jpql = getTemplatedQLString(namedQL, params);
        TypedQuery<T> typedQuery = getEntityManager().createQuery(jpql, resultClass);
        JpaHelper.setProperties(typedQuery, params);
        return typedQuery;
    }

    private Query findJPQLThenBindParams(String namedQL, Map<String, Object> params) {
        String jpql = getTemplatedQLString(namedQL, params);
        Query typedQuery = getEntityManager().createQuery(jpql);
        JpaHelper.setProperties(typedQuery, params);
        return typedQuery;
    }

}
