package org.springside.modules.persistence;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.hibernate.dialect.H2Dialect;
import org.hibernate.dialect.MySQL5InnoDBDialect;
import org.hibernate.dialect.Oracle10gDialect;
import org.hibernate.dialect.SQLServer2008Dialect;

/**
 * this file is changed by me 20030308
 */
public class Hibernates {

    //here is changed 20130319 , be careful
    public static final String LOCAL_DATETIME_TYPE = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime";
    public static final String DATETIME_TYPE = "org.jadira.usertype.dateandtime.joda.PersistentDateTime";

    /**
     * Initialize the lazy property value.
     * 
     * eg.
     * Hibernates.initLazyProperty(user.getGroups()); 
     */
    public static void initLazyProperty(Object proxyedPropertyValue) {
        Hibernate.initialize(proxyedPropertyValue);
    }

    /**
     * 从DataSoure中取出connection, 根据connection的metadata中的jdbcUrl判断Dialect类型.
     * 仅支持Oracle, H2, MySql，如需更多数据库类型，请仿照此类自行编写。
     */
    public static String getDialect(DataSource dataSource) {
        Connection connection = null;
        try {
            connection = dataSource.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Could not get database connection", e);
        }
        return getDialect(connection);
    }
    
    private static String getJdbcUrlFromConn(Connection connection) {
        return getJdbcUrlFromConn(connection, true);
    };

    private static String getJdbcUrlFromConn(Connection connection, boolean closeConnection) {
        try {
            if (connection == null) {
                throw new IllegalStateException("connection was null");
            }
            return connection.getMetaData().getURL();
        } catch (SQLException e) {
            throw new RuntimeException("Could not get database url", e);
        } finally {
            if (closeConnection) {
                if (connection != null) {
                    try {
                        connection.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    /**
    * 从Connection中取出connection, 根据connection的metadata中的jdbcUrl判断Dialect类型.
    * 此方法不关闭connection
    */
    public static String getDialect(Connection connection) {
        return getDialect(connection, true);
    }
    
    public static String getDialect(Connection connection, boolean closeConnection) {
        // 从connection中取出jdbcUrl.
        String jdbcUrl = getJdbcUrlFromConn(connection,closeConnection);

        // 根据jdbc url判断dialect
        if (StringUtils.contains(jdbcUrl, ":h2:")) {
            return H2Dialect.class.getName();
        } else if (StringUtils.contains(jdbcUrl, ":mysql:")) {
            return MySQL5InnoDBDialect.class.getName();
        } else if (StringUtils.contains(jdbcUrl, ":oracle:")) {
            return Oracle10gDialect.class.getName();
        } else if (StringUtils.contains(jdbcUrl, ":sqlserver:")) {//here is added
            return SQLServer2008Dialect.class.getName();
        } else {
            throw new IllegalArgumentException("Unknown Database of " + jdbcUrl);
        }
    }
}
