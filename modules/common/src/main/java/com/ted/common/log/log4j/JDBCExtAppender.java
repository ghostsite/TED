package com.ted.common.log.log4j;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Date;

import org.apache.log4j.Category;
import org.apache.log4j.Logger;
import org.apache.log4j.jdbc.JDBCAppender;
import org.apache.log4j.spi.LoggingEvent;

import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * 主要是提升性能用连接池，否则的话，每次都要重建连接池，费时。
 * @deprecated use Slf4jDBAppender
 */
public class JDBCExtAppender extends JDBCAppender {
    /**
     * 前提是类路径下面必须有一个c3p0-config.xml,内容如下：
     * <c3p0-config>
            <default-config>  
            </default-config>
            
            <named-config name="log4j">
                <property name="user">root</property>
                <property name="password">zwz</property>
                <property name="driverClass">com.mysql.jdbc.Driver</property>
                <property name="jdbcUrl">jdbc:mysql://localhost:3306/xplatform</property>
                <property name="initialPoolSize">1</property>
                <property name="maxIdleTime">3</property>
                <property name="maxPoolSize">9</property>
                <property name="minPoolSize">1</property>
            </named-config>
        </c3p0-config>
     */
    private static ComboPooledDataSource ds = new ComboPooledDataSource("log4j");

    /**
     * Override this to link with your connection pooling system.
     *
     * By default this creates a single connection which is held open
     * until the object is garbage collected.
     */
    protected Connection getConnection() throws SQLException {
        return ds.getConnection();
    }

    /**
     * Override this to return the connection to a pool, or to clean up the
     * resource.
     *
     * The default behavior holds a single connection open until the appender
     * is closed (typically when garbage collected).
     * <b>调用con.close()是归还连接到连接池，否则连接池里面的连接会被用光.</b>
     */
    protected void closeConnection(Connection con) {
        try {
            if (null != con) {
                con.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    };

    protected void execute(String sql) throws SQLException {
        //System.out.println("sql===" + sql);
        super.execute(sql);
    }

    protected String getLogStatement(LoggingEvent event) {
        //String fqnOfCategoryClass = event.fqnOfCategoryClass;
        Category logger = Logger.getRootLogger();
        //Priority level = event.getLevel();
        //Object message = event.getMessage();
        Throwable throwable = null;
        Date currentDate = new Date();
        long timeStamp = currentDate.getTime();
        //ReLoggingEvent bEvent = new ReLoggingEvent(fqnOfCategoryClass,  logger, timeStamp, level, message, throwable);
        //return super.getLogStatement(bEvent);
        return null;
    }
    
    //这个是给外部用的
    public void call(String sql)throws SQLException {
        execute(sql);
    };

}
