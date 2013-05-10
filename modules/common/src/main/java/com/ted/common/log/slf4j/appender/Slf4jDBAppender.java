package com.ted.common.log.slf4j.appender;

import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import ch.qos.logback.classic.db.DBAppender;
import ch.qos.logback.classic.spi.ILoggingEvent;

import com.ted.common.log.slf4j.event.Slf4jLoggingEvent;
import com.ted.common.util.ConfigUtils;
import com.ted.common.util.DateUtils;

public class Slf4jDBAppender extends DBAppender {

    /**
     * 注意：如果是oracle，如果logs表没有EVENT_ID字段，则会报错。number类型。手工建一个EVENT_ID吧。
     */
    @Override
    public void start() {
        super.start();
        if(ConfigUtils.isMysql()){
            insertSQL = "INSERT INTO logs(user_id, user_name,type, clazz, method, create_time, log_level, error_code, msg) VALUES (?,?,?,'','',?,'',?,?)";
        }
        if(ConfigUtils.isOracle()){
            insertSQL = "INSERT INTO logs(id,user_id, user_name,type, clazz, method, create_time, log_level, error_code, msg) VALUES (HIBERNATE_SEQUENCE.nextval , ?,?,?,'','',?,'',?,?)";
        }
    }

    @Override
    protected void subAppend(ILoggingEvent event, Connection connection, PreparedStatement insertStatement) throws Throwable {
        bindLoggingEvent(insertStatement, event);
        int updateCount = insertStatement.executeUpdate();
        if (updateCount != 1) {
            addWarn("Failed to insert loggingEvent");
        }
    };

    void bindLoggingEvent(PreparedStatement stmt, ILoggingEvent event) throws SQLException {
        if (event instanceof Slf4jLoggingEvent) {
            Slf4jLoggingEvent slf4jEvent = (Slf4jLoggingEvent) event;
            stmt.setString(1, slf4jEvent.getUserId());
            stmt.setString(2, slf4jEvent.getUserName());
            stmt.setInt(3, slf4jEvent.getType());
            stmt.setString(4, slf4jEvent.getCreateTime());
            stmt.setString(5, slf4jEvent.getErrorCode());
            stmt.setString(6, slf4jEvent.getFormattedMessage());
        } else {
            stmt.setString(1, null);
            stmt.setString(2, null);
            stmt.setInt(3, Slf4jLoggingEvent.LOG4J);
            stmt.setString(4, DateUtils.getCurrentStringDateYMDHMS());
            stmt.setString(5, null);
            stmt.setString(6, event.getFormattedMessage());
        }
    }

    //复写，都空着
    @Override
    protected long selectEventId(PreparedStatement insertStatement, Connection connection) throws SQLException, InvocationTargetException {
        return 0L;
    }

    //复写，都空着
    @Override
    protected void secondarySubAppend(ILoggingEvent eventObject, Connection connection, long eventId) throws Throwable {

    };

}
