package com.ted.xplatform.extension.springmvc;

import java.nio.charset.Charset;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.MDC;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springside.modules.utils.Exceptions;

import ch.qos.logback.classic.LoggerContext;

import com.ted.common.exception.BusinessException;
import com.ted.common.log.slf4j.appender.Slf4jDBAppender;
import com.ted.common.log.slf4j.event.Slf4jLoggingEvent;
import com.ted.common.spring.mvc.method.annotation.ExtensionExceptionHandlerExceptionResolver;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.util.ConvertUtils;
import com.ted.common.util.DateUtils;

/**
 * A class with "global" {@code @ExceptionHandler} methods for use across controllers. 
 * <p>Enabled through {@link ExtensionExceptionHandlerExceptionResolver}.
 * 
 * <b>这个是配置在spring的mvc-servlet.xml中的exceptionHandler配置项.</b>
 */
public class XPlatformGlobalExceptionHandler implements InitializingBean {
    static Slf4jDBAppender                 jdbcExtAppender           = null;

    /**
     * 判断是否需要插入数据库
     */
    private boolean                        insertDb                  = false;
    private String                         dbAppenderName            = null;

    //get dbappender
    public void afterPropertiesSet() throws Exception {
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        jdbcExtAppender = (Slf4jDBAppender) context.getLogger(Logger.ROOT_LOGGER_NAME).getAppender(dbAppenderName);
    }

    public void setDbAppenderName(String dbAppenderName) {
        this.dbAppenderName = dbAppenderName;
    }

    public boolean isInsertDb() {
        return insertDb;
    }

    public void setInsertDb(boolean insert) {
        this.insertDb = insert;
    }

    private Slf4jLoggingEvent getEvent(String userId, String userName, int type, String createTime, String errorCode, String msg) {
        Slf4jLoggingEvent event = new Slf4jLoggingEvent();
        event.setUserId(userId);
        event.setUserName(userName);
        event.setType(type);
        event.setErrorCode(errorCode);
        event.setMessage(msg);
        event.setCreateTime(createTime);
        return event;
    }

    private void insert(int type, String errorCode, String msg) throws SQLException {
        String userId = (String) MDC.get("userId");
        String userName = (String) MDC.get("userName");
        String createTime = DateUtils.getCurrentStringDate(DateUtils.PATTERN_YYYYMMDDHHMMSS);
        Slf4jLoggingEvent evet = getEvent(userId, userName, type, createTime, errorCode, msg);
		if(null != jdbcExtAppender){
        	jdbcExtAppender.append(evet);
        }        
    }

    @ExceptionHandler(value = { MaxUploadSizeExceededException.class, BusinessException.class, Exception.class })
    public ResponseEntity<String> handle(Exception exception) throws SQLException {
        exception.printStackTrace();
        
        if (insertDb) {
            if (exception instanceof BusinessException) {
                BusinessException businessException = (BusinessException) exception;
                insert(Slf4jLoggingEvent.BUSINESS, businessException.getErrorCode() + "", businessException.getMessage());
            } else {
                insert(Slf4jLoggingEvent.EXCEPTION, "", getTrimedStackTraceString(exception));
            }
        }

        if (exception instanceof BusinessException) {
            BusinessException businessException = (BusinessException) exception;
            HttpHeaders headers = new HttpHeaders();
            MediaType mt = new MediaType("text", "html", Charset.forName("utf-8"));
            headers.setContentType(mt);
            //headers.set("Accept-Charset", "UTF-8");
            //headers.setContentType(MediaType.TEXT_HTML);
            //return new ResponseEntity<String>("{success:false, errorMessage:'" + businessException.getMessage() + "'}", headers, HttpStatus.METHOD_FAILURE);//EXCEPTION_FAILURE
            return new ResponseEntity<String>(new JsonOut(false, "", businessException.getMessage()).toString(), headers, HttpStatus.METHOD_FAILURE);//EXCEPTION_FAILURE
        } else if (exception instanceof MaxUploadSizeExceededException) {

        } else if(exception instanceof BindException){
            BindException bindException = (BindException)exception;
            List<ObjectError> allErrors = bindException.getAllErrors();
            return getAjaxResult(ConvertUtils.convertObjectErrorsToString(allErrors));
        } else if (exception instanceof RuntimeException) {
            return getAjaxResult(getTrimedStackTraceString(exception));
        }
        return null;
    };
    
    private ResponseEntity<String> getAjaxResult(String message){
        HttpHeaders headers = new HttpHeaders();
        MediaType mt = new MediaType("text", "html", Charset.forName("utf-8"));
        headers.setContentType(mt);
        return new ResponseEntity<String>(new JsonOut(false, "", message).toString(), headers, HttpStatus.METHOD_FAILURE);//EXCEPTION_FAILURE
    }

    public String getTrimedStackTraceString(Exception exception) {
        String trace = Exceptions.getStackTraceAsString(exception);
        if (trace.length() < 2000) {
            return trace;
        } else {
            return trace.substring(0, 2000);
        }
    }

}
