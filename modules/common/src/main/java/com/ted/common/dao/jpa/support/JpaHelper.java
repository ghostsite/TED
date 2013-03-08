package com.ted.common.dao.jpa.support;

import java.util.Map;
import java.util.Set;

import javax.persistence.Parameter;
import javax.persistence.Query;

/**
 * <b> NOTE: 这个不是copy过来的，是自己写的</b>
 */
public abstract class JpaHelper {
    public static final Query setProperties(Query query, Map<String, ?> params) {
        Set<Parameter<?>> parameters = query.getParameters();
        for (Parameter<?> parameter : parameters) {
            String namedParam = parameter.getName();
            final Object object = params.get(namedParam);
            if (object == null) {
                continue;
            }
            query.setParameter(namedParam, object);
        }
        return query;
    };

    public static final String getQueryString(Query query) {
        return ((org.hibernate.ejb.QueryImpl) query).getHibernateQuery().getQueryString();
        //Map<String, Object> hints = query.getHints(); //这个不好用，上面的好用
        //return hints != null ? (String) hints.get("query") : null;
    }
}
