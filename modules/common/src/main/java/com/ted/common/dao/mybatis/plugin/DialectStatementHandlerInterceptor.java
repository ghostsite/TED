package com.ted.common.dao.mybatis.plugin;

import java.sql.Connection;
import java.util.Properties;

import org.apache.ibatis.executor.statement.PreparedStatementHandler;
import org.apache.ibatis.executor.statement.RoutingStatementHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.RowBounds;
import org.hibernate.dialect.Dialect;
import org.springframework.data.domain.PageRequest;
import org.springside.modules.persistence.Hibernates;
import org.springside.modules.utils.Reflections;

/**
 * copy from octopus ,and changed
 */
@Intercepts({ @Signature(type = StatementHandler.class, method = "prepare", args = { Connection.class }) })
public class DialectStatementHandlerInterceptor implements Interceptor {

    Dialect            dialect    = null;
    private Properties properties = null;

    public Object intercept(Invocation invocation) throws Throwable {
        Connection connection = (Connection) invocation.getArgs()[0];
        RoutingStatementHandler statement = (RoutingStatementHandler) invocation.getTarget();
        PreparedStatementHandler handler = (PreparedStatementHandler) Reflections.getFieldValue(statement, "delegate");
        /*
         * RowBounds rowBounds = (RowBounds)
         * ReflectionUtil.getFieldValue(handler, "rowBounds");
         */
        BoundSql boundSql = statement.getBoundSql();
        if (boundSql.getParameterObject() instanceof PageRequest) {
            PageRequest mybatisPageRequest = (PageRequest) boundSql.getParameterObject();

            RowBounds rowBounds = new RowBounds(mybatisPageRequest.getOffset(), mybatisPageRequest.getPageSize());
            Reflections.setFieldValue(handler, "rowBounds", new RowBounds());

            if (rowBounds.getLimit() > 0 && rowBounds.getLimit() < RowBounds.NO_ROW_LIMIT) {
                String sql = boundSql.getSql();
                sql = getDialect(connection).getLimitString(sql, rowBounds.getOffset(), rowBounds.getLimit());
                Reflections.setFieldValue(boundSql, "sql", sql);
            }
        }

        return invocation.proceed();
    }

    private Dialect getDialect(Connection connection) throws Throwable {
        if (null == dialect) {
            String dialectName = Hibernates.getDialect(connection, false);
            dialect = (Dialect) Class.forName(dialectName).newInstance();
        }
        return dialect;
    }

    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

}
