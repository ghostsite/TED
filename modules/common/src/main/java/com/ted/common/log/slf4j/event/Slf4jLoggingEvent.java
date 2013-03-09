package com.ted.common.log.slf4j.event;

import ch.qos.logback.classic.spi.LoggingEvent;

public class Slf4jLoggingEvent extends LoggingEvent {
    public static final int LOG4J     = 1; //for type column
    public static final int BUSINESS  = 2;
    public static final int EXCEPTION = 3;

    private String          userId;
    private String          userName;
    private int             type;
    private String          errorCode;
    private String          createTime;

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Override
    public String getThreadName() {
        String threadName = super.getThreadName();
        if (threadName.indexOf("'") != -1) {
            threadName = threadName.replaceAll("'", "\"");
        }
        return threadName;
    }

    @Override
    public String getMessage() {
        String msg = super.getMessage();
        if (msg.indexOf("'") != -1) {
            msg = msg.replaceAll("'", "\"");
        }
        return msg;
    };

}
