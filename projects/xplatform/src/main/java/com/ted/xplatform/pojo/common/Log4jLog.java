package com.ted.xplatform.pojo.common;

import javax.persistence.Entity;

import com.ted.common.domain.IdEntity;

@Entity
public class Log4jLog extends IdEntity {
    public static final int LOG4J     = 1; //for type column
    public static final int BUSINESS  = 2;
    public static final int EXCEPTION = 3;

    private String          userId;       //loginName;
    private String          userName;     //userName;
    private String          clazz;        //clazz;
    private String          method;       //method;
    private String          createTime;   //createTime;
    private String          msg;          //msg;
    private int             type;         //type;
    
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
    public String getClazz() {
        return clazz;
    }
    public void setClazz(String clazz) {
        this.clazz = clazz;
    }
    public String getMethod() {
        return method;
    }
    public void setMethod(String method) {
        this.method = method;
    }
    public String getCreateTime() {
        return createTime;
    }
    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }
    public int getType() {
        return type;
    }
    public void setType(int type) {
        this.type = type;
    }
    public static int getLog4j() {
        return LOG4J;
    }
    public static int getBusiness() {
        return BUSINESS;
    }
    public static int getException() {
        return EXCEPTION;
    }

}
