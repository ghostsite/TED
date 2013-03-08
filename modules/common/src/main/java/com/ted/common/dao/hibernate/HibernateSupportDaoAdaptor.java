package com.ted.common.dao.hibernate;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.collections.MapUtils;
import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Example;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.internal.CriteriaImpl;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.transform.Transformers;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.ReflectionUtils;
import org.springside.modules.utils.Reflections;

import com.ted.common.support.page.JsonPage;
import com.ted.common.util.CommonUtils;

//由于spring3.0.1开始，建议使用HibernateSession,所以很多例子需要参考HibernateTemplate
@SuppressWarnings("all")
@Transactional
public class HibernateSupportDaoAdaptor implements HibernateSupportDao {
    @Inject
    SessionFactory sessionFactory;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    public void saveOrUpdateAll(Collection collections) {
        for (Object entity : collections) {
            getSession().saveOrUpdate(entity);
        }
    }

    public void deleteAll(Collection<?> entities) {
        for (Object entity : entities) {
            getSession().delete(entity);
        }
    }

    //sample:User user = (User)baseDaoServices.findEntityAssociate(User.class, "1", new String[]{"user2roles/role/role2menus/menu"});
    public <T> T findEntityAssociate(Class<T> clazz, Serializable id, String[] properties) {
        T obj = (T) this.getSession().get(clazz, id);
        initialize(obj, properties);
        return obj;
    };
    
    public <T> T findEntityAssociate(Class<T> clazz, String propertyName, Object value, String[] properties){
        Assert.hasText(propertyName);
        T obj = (T) createCriteria(clazz, Restrictions.eq(propertyName, value)).uniqueResult();
        if(null != obj){
            initialize(obj, properties);
        }
        return obj;
    }
    
    public void initialize(Object obj, String[] properties){
        if (null != obj && properties != null && properties.length > 0) {
            for (int i = 0; i < properties.length; i++) {
                initialize(obj, 0, properties[i].split("/"));
            }
        }
    }

    private void initialize(Object proxyObject, int depth, String[] propertyNames) {
        Object[] proxyArray = new Object[] { proxyObject };
        if (proxyObject instanceof Object[]) {
            proxyArray = (Object[]) proxyObject;
        }
        if (proxyObject instanceof Collection) {
            Collection collObject = (Collection) proxyObject;
            proxyArray = collObject.toArray();
        }

        for (int i = 0; proxyArray != null && i < proxyArray.length; i++) {
            Object _proxyObject = proxyArray[i];
            if (!Hibernate.isInitialized(_proxyObject)) {
                Hibernate.initialize(_proxyObject);
            }
            String propertyName = propertyNames[depth];
            try {
                String methodstr = "get" + org.springframework.util.StringUtils.capitalize(propertyName);
                Method method = _proxyObject.getClass().getMethod(methodstr, null);
                Object resultObject = method.invoke(_proxyObject, null);
                Hibernate.initialize(resultObject);
                if (resultObject != null && propertyNames.length > (depth + 1)) {
                    initialize(resultObject, depth + 1, propertyNames);
                }
            } catch (Exception e1) {
                e1.printStackTrace();
            }
        }
    };

    public Query createQuery(String hql, Object... values) {
        Assert.hasText(hql);
        Query query = getSession().createQuery(hql);
        if (null == values)
            return query;
        for (int i = 0; i < values.length; i++) {
            query.setParameter(i, values[i]);
        }
        return query;
    }

    public <T> Criteria createCriteria(Class<T> entityClass, String orderBy, boolean isAsc, Criterion... criterions) {
        Assert.hasText(orderBy);
        Criteria criteria = createCriteria(entityClass, criterions);
        if (isAsc) {
            criteria.addOrder(Order.asc(orderBy));
        } else {
            criteria.addOrder(Order.desc(orderBy));
        }
        return criteria;
    };

    public <T> Criteria createCriteria(Class<T> entityClass, Criterion... criterions) {
        Criteria criteria = getSession().createCriteria(entityClass);
        if (null != criterions)
            for (Criterion c : criterions) {
                if (null != c) {
                    criteria.add(c);
                }
            }
        return criteria;
    };

    public <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName);
        return createCriteria(entityClass, Restrictions.eq(propertyName, value)).list();
    };

    public <T> List<T> findBy(Class<T> entityClass, String propertyName, Object value, String orderBy, boolean isAsc) {
        Assert.hasText(propertyName);
        Assert.hasText(orderBy);
        return createCriteria(entityClass, orderBy, isAsc, Restrictions.eq(propertyName, value)).list();
    };

    public <T> T findUniqueBy(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName);
        return (T) createCriteria(entityClass, Restrictions.eq(propertyName, value)).uniqueResult();
    };

    //queryName is hqlName
    public JsonPage pagedByNamedHQLQuery(String queryName, int start, int limit, Map params) {
        Query query = getSession().getNamedQuery(queryName);
        //		String countSql = "select count(1) from (" + query.getQueryString() + ") alias";
        String countSql = "select count (*) " + removeSelect(removeOrders(query.getQueryString()));
        Query countQuery = getSession().createQuery(countSql);
        countQuery.setProperties(params);
        try {
            Number count = (Number) countQuery.uniqueResult();
            int totalCount = count.intValue();
            query.setProperties(params);
            List list = query.setFirstResult(start).setMaxResults(limit).list();
            return new JsonPage(list,null, totalCount);
            //return new Page(start, limit, totalCount, list);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    /**
     * hqlName : @NamedQuery(name = "News.findByHeader", query = "SELECT n FROM News n WHERE n.header = ? order by n.createdDate desc"),
     * java call:
     *  Integer[] param = new Integer[1];
     *	if(null == status)
     *		param[0] = new Integer(0);
     *	else
     *		param[0] = new Integer(status);
     *  Page page = getBaseDaoServices().pagedQuery("News.findByStatus", start, limit, param);
     */

    public JsonPage pagedByNamedHQLQuery(String queryName, int start, int limit, Object... values) {
        Query query = getSession().getNamedQuery(queryName);
        String countSql = "select count (*) " + removeSelect(removeOrders(query.getQueryString()));
        Query countQuery = getSession().createQuery(countSql);
        for (int i = 0; i < values.length; i++) {
            countQuery.setParameter(i, values[i]);
        }
        try {
            Number count = (Number) countQuery.uniqueResult();
            int totalCount = count.intValue();
            for (int i = 0; i < values.length; i++) {
                query.setParameter(i, values[i]);
            }
            List list = query.setFirstResult(start).setMaxResults(limit).list();
//            return new Page(totalCount, list);
           // return new Page(start, limit, totalCount, list);
            return new JsonPage(list,null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    //注意hql的参数用？表示
    public JsonPage pagedByHQLQuery(String hql, int start, int limit, Object... values) {
        String countQueryString = " select count (*) " + removeSelect(removeOrders(hql));
        Query queryObject = getSession().createQuery(countQueryString);
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                queryObject.setParameter(i, values[i]);
            }
        }
        List countlist = queryObject.list();
        long totalCount = (Long) countlist.get(0);
        if (totalCount < 1) {
            return new JsonPage();
        }
        Query query = createQuery(hql, values);
        List list = query.setFirstResult(start).setMaxResults(limit).list();
//        return new Page(totalCount, list);
        //return new Page(start, limit, totalCount, list);
        return new JsonPage(list,null, totalCount);
    };

    public JsonPage pagedByNamedSQLQuery(String queryName, Map params) {
        Query query = getSession().getNamedQuery(queryName);
        String countSql = "select count(1) from (" + query.getQueryString() + ") alias";
        Query countQuery = getSession().createSQLQuery(countSql);
        countQuery.setProperties(params);
        try {
            Number count = (Number) countQuery.uniqueResult();
            int totalCount = count.intValue();
            query.setProperties(params);

            int start = CommonUtils.getStartIntFromMap(params);
            int limit = CommonUtils.getLimitIntFromMap(params);
            List list = query.setFirstResult(start).setMaxResults(limit).list();
//            return new Page(totalCount, list);
            //return new Page(start, limit, totalCount, list);
            return new JsonPage(list,null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    public <E> List<E> findByNamedSQLQuery(String queryName, Map<String, Object> params) {
        List list = null;
        try {
            Query query = getSession().getNamedQuery(queryName);
            query.setProperties(params);
            list = query.list();
        } catch (DataAccessResourceFailureException e) {
            e.printStackTrace();
        } catch (HibernateException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
        return list;
    };

    //queryString is HQL query string
    @Override
    public <E> List<E> findByNamedParam(String queryString, Map<String, Object> params) {
        List list = null;
        try {
            Query query = getSession().createQuery(queryString);
            query.setProperties(params);
            list = query.list();
        } catch (DataAccessResourceFailureException e) {
            e.printStackTrace();
        } catch (HibernateException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
        return list;
    };

    //update SQL
    public int updateNamedSQLQuery(String queryName, Map params) {
        try {
            Query query = getSession().getNamedQuery(queryName);
            query.setProperties(params);
            return query.executeUpdate();
        } catch (DataAccessResourceFailureException e) {
            e.printStackTrace();
        } catch (HibernateException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
        return 0;
    };

    @SuppressWarnings("all")
    //start 基于记录的开始条数,因为criteria是建立连接的，所以这个方法和createCriteria要放到一个事物中，也就是写到service里，不能写到controller里面。
    public JsonPage pagedQuery(Criteria criteria, int start, int limit) {
        Assert.notNull(criteria);
        CriteriaImpl impl = (CriteriaImpl) criteria;
        Projection projection = impl.getProjection();
        List<CriteriaImpl.OrderEntry> orderEntries;
        try {
            orderEntries = (List) Reflections.getFieldValue(impl, "orderEntries");
            Reflections.setFieldValue(impl, "orderEntries", new ArrayList());
        } catch (Exception e) {
            throw new InternalError(" Runtime Exception impossibility throw ");
        }
        int totalCount = ((Long) criteria.setProjection(Projections.rowCount()).uniqueResult()).intValue();
        criteria.setProjection(projection);
        if (projection == null) {
            criteria.setResultTransformer(CriteriaSpecification.ROOT_ENTITY);
        }
        try {
            Reflections.setFieldValue(impl, "orderEntries", orderEntries);
        } catch (Exception e) {
            throw new InternalError(" Runtime Exception impossibility throw ");
        }
        if (totalCount < 1) {
            return new JsonPage();
        }
        List list = criteria.setFirstResult(start).setMaxResults(limit).list();
        //return new Page(start, limit, totalCount, list);
        return new JsonPage(list,null, totalCount);
    }

    //start is 0-based
    public JsonPage pagedQuery(Criteria criteria, int start, int limit, String distinctProperty) {
        Assert.notNull(criteria);
        CriteriaImpl impl = (CriteriaImpl) criteria;
        Projection projection = impl.getProjection();
        List<CriteriaImpl.OrderEntry> orderEntries;
        try {
            orderEntries = (List) Reflections.getFieldValue(impl, "orderEntries");
            Reflections.setFieldValue(impl, "orderEntries", new ArrayList());
        } catch (Exception e) {
            throw new InternalError(" Runtime Exception impossibility throw ");
        }
        criteria.setProjection(Projections.countDistinct(distinctProperty));
        int totalCount = (Integer) criteria.uniqueResult();
        criteria.setProjection(projection);
        if (projection == null) {
            criteria.setResultTransformer(CriteriaSpecification.ROOT_ENTITY);
        }
        try {
            Reflections.setFieldValue(impl, "orderEntries", orderEntries);
        } catch (Exception e) {
            throw new InternalError(" Runtime Exception impossibility throw ");
        }
        if (totalCount < 1) {
            return new JsonPage();
        }
        List list = criteria.setFirstResult(start).setMaxResults(limit).list();
       // return new Page(start, limit, totalCount, list);
        return new JsonPage(list,null, totalCount);
    }

    public JsonPage pagedQuery(Class entityClass, int pageNo, int limit, Criterion... criterions) {
        Criteria criteria = createCriteria(entityClass, criterions);
        return pagedQuery(criteria, pageNo, limit);
    }

    public JsonPage pagedQuery(Class entityClass, int start, int limit, String orderBy, boolean isAsc, Criterion... criterions) {
        Criteria criteria = createCriteria(entityClass, orderBy, isAsc, criterions);
        return pagedQuery(criteria, start, limit);
    }

    public <T> boolean isUnique(Class<T> entityClass, Object entity, String uniquePropertyNames) {
        Assert.hasText(uniquePropertyNames);
        Criteria criteria = createCriteria(entityClass).setProjection(Projections.rowCount());
        String[] nameList = uniquePropertyNames.split(",");
        try {
            for (String name : nameList) {
                criteria.add(Restrictions.eq(name, PropertyUtils.getProperty(entity, name)));
            }
            String idName = getIdName(entityClass);
            Serializable id = getId(entityClass, entity);
            if (id != null) {
                criteria.add(Restrictions.not(Restrictions.eq(idName, id)));
            }
        } catch (Exception e) {
            ReflectionUtils.handleReflectionException(e);
        }
        return (Integer) criteria.uniqueResult() == 0;
    };

    public Serializable getId(Class entityClass, Object entity) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Assert.notNull(entity);
        Assert.notNull(entityClass);
        return (Serializable) PropertyUtils.getProperty(entity, getIdName(entityClass));
    }

    public String getIdName(Class clazz) {
        Assert.notNull(clazz);

        ClassMetadata meta = sessionFactory.getClassMetadata(clazz);
        Assert.notNull(meta, "Class " + clazz + " not define in hibernate session factory.");

        String idName = meta.getIdentifierPropertyName();
        Assert.hasText(idName, clazz.getSimpleName() + " has no identifier property define.");

        return idName;
    }

    /**
     * @see #pagedQuery(String,int,int,Object[])
     */
    private static String removeSelect(String hql) {
        Assert.hasText(hql);
        int beginPos = hql.toLowerCase().indexOf("from");
        Assert.isTrue(beginPos != -1, " hql : " + hql + " must has a keyword 'from'");
        return hql.substring(beginPos);
    }

    /**
     * @see #pagedQuery(String,int,int,Object[])
     */
    private static String removeOrders(String hql) {
        Assert.hasText(hql);
        Pattern p = Pattern.compile("order\\s*by[\\w|\\W|\\s|\\S]*", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(hql);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(sb, "");
        }
        m.appendTail(sb);
        return sb.toString();
    };

    public Session getDaoSession() {
        return getSession();
    }

    @SuppressWarnings("all")
    public JsonPage pagedBySQLQuery(String sql, Map params) {
        Query query = getSession().createSQLQuery(sql);
        String countSql = "select count(1) from (" + sql + ") alias";
        Query countQuery = getSession().createSQLQuery(countSql);
        countQuery.setProperties(params);
        try {
            Number count = (Number) countQuery.uniqueResult();
            int totalCount = count.intValue();
            query.setProperties(params);

            int start = CommonUtils.getStartIntFromMap(params);
            int limit = CommonUtils.getLimitIntFromMap(params);
            List list = query.setFirstResult(start).setMaxResults(limit).list();
            //return new Page(totalCount, list);
            //return new Page(start, limit, totalCount, list);
            return new JsonPage(list,null, totalCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JsonPage();
    };

    //201011210 added 
    public <E> List<E> findBySQLQuery(String sql, Map<String, Object> params) {
        Query query = getSession().createSQLQuery(sql);
        if (null != params && !params.isEmpty()) {
            query.setProperties(params);
        }
        List list = query.list();
        return list;
    };

    //20101121 added 
    public <T> List<T> findBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass) {
        Query query = getSession().createSQLQuery(sql).setResultTransformer(Transformers.aliasToBean(entityClass));
        if (null != params && !params.isEmpty()) {
            query.setProperties(params);
        }
        List<T> list = query.list();
        return list;
    };

    @SuppressWarnings("all")
    public <T> JsonPage pagedBySQLQuery(String sql, Map<String, Object> params, Class<T> entityClass) {
        Query query = getSession().createSQLQuery(sql).setResultTransformer(Transformers.aliasToBean(entityClass));
        String countSql = "select count(1) from (" + sql + ") alias";
        Query countQuery = getSession().createSQLQuery(countSql);
        countQuery.setProperties(params);
        try {
            Number count = (Number) countQuery.uniqueResult();
            int totalCount = count.intValue();
            query.setProperties(params);

            int start = CommonUtils.getStartIntFromMap(params);
            int limit = CommonUtils.getLimitIntFromMap(params);
            List<T> list = query.setFirstResult(start).setMaxResults(limit).list();
            //return new Page(totalCount, list);
           // return new Page(start, limit, totalCount, list);
            return new JsonPage(list,null, totalCount);
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
            getSession().update(entity);
    }

    public final static int DEFAULT_BATCH_SIZE = 25;

    public void saveAll(Collection entities) {
        if (entities == null) {
            return;
        }
        Object[] arryObj = entities.toArray();
        int max = arryObj.length;
        for (int i = 0; i < max; i++) {
            getSession().save(arryObj[i]);
            if ((i != 0 && i % DEFAULT_BATCH_SIZE == 0) || i == max - 1) {
                getSession().flush();
                getSession().clear();
            }
        }
    }

    //@see http://hi.baidu.com/liuzhe041/blog/item/7608ebf55637f729720eecfb.html,主要是为了删除
    public void bulkUpdate(final String queryString, final Object... values) {
        Query query = getSession().createQuery(queryString);
        query.setParameterList("ids", values);
        query.executeUpdate();
    }
    
    //@see http://hi.baidu.com/liuzhe041/blog/item/7608ebf55637f729720eecfb.html,主要是为了删除
    public void bulkUpdate(final String hqlString, final Collection<? extends Serializable> values) {
        Query query = getSession().createQuery(hqlString);
        query.setParameterList("ids", values);
        query.executeUpdate();
    }

    @Override
    public <E> List<E> find(String hqlString) throws DataAccessException {
        return find(hqlString, (Object[]) null);
    }

    @Override
    public <E> List<E> find(String hqlString, Object value) throws DataAccessException {
        return find(hqlString, new Object[] { value });
    }

    /**
     * queryString is HQL Query String
     */
    public <E> List<E> find(String hqlString, Map<String, Object> params) throws DataAccessException {
        Query queryObject = getSession().createQuery(hqlString);
        if (MapUtils.isNotEmpty(params)) {
            Iterator<Map.Entry<String, Object>> iterator = params.entrySet().iterator();
            if (iterator.hasNext()) {
                Map.Entry<String, Object> entry = iterator.next();
                String key = entry.getKey();
                Object value = entry.getValue();
                queryObject.setParameter(key, value);
            }
        }
        return queryObject.list();
    };

    @Override
    public <E> List<E> find(String hqlString, Object... values) throws DataAccessException {
        Query queryObject = getSession().createQuery(hqlString);
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                queryObject.setParameter(i, values[i]);
            }
        }
        return queryObject.list();
    }

    @Override
    public <E> List<E> findByValueBean(String queryString, Object valueBean) throws DataAccessException {
        Query queryObject = getSession().createQuery(queryString);
        queryObject.setProperties(valueBean);
        return queryObject.list();
    }

    @Override
    public <E> List<E> findByCriteria(DetachedCriteria criteria) throws DataAccessException {
        return findByCriteria(criteria, -1, -1);
    }

    @Override
    public <E> List<E> findByCriteria(DetachedCriteria criteria, int firstResult, int maxResults) throws DataAccessException {
        Criteria executableCriteria = criteria.getExecutableCriteria(getSession());
        if (firstResult >= 0) {
            executableCriteria.setFirstResult(firstResult);
        }
        if (maxResults > 0) {
            executableCriteria.setMaxResults(maxResults);
        }
        return executableCriteria.list();
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
        Criteria executableCriteria = (entityName != null ? getSession().createCriteria(entityName) : getSession().createCriteria(exampleEntity.getClass()));
        executableCriteria.add(Example.create(exampleEntity));
        if (firstResult >= 0) {
            executableCriteria.setFirstResult(firstResult);
        }
        if (maxResults > 0) {
            executableCriteria.setMaxResults(maxResults);
        }
        return executableCriteria.list();
    }

}
