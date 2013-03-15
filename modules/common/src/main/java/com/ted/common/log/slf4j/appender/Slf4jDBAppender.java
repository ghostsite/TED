package com.ted.common.log.slf4j.appender;

import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import ch.qos.logback.classic.db.DBAppender;
import ch.qos.logback.classic.spi.ILoggingEvent;

import com.ted.common.log.slf4j.event.Slf4jLoggingEvent;
import com.ted.common.util.DateUtils;

public class Slf4jDBAppender extends DBAppender {

    @Override
    public void start() {
        super.start();
        insertSQL = "INSERT INTO log4jlog(userId, userName,type, clazz, method, createTime, loglevel, errorCode, msg) VALUES (?,?,?,'','',?,'',?,?)";
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
