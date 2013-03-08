package com.ted.xplatform.extension.springmvc;

import java.nio.charset.Charset;
import java.sql.SQLException;
import java.util.Properties;

import org.apache.log4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.PropertyPlaceholderHelper;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springside.modules.utils.Exceptions;

import com.ted.common.exception.BusinessException;
import com.ted.common.log4j.JDBCExtAppender;
import com.ted.common.spring.mvc.method.annotation.ExtensionExceptionHandlerExceptionResolver;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.util.DateUtils;

/**
 * A class with "global" {@code @ExceptionHandler} methods for use across controllers. 
 * <p>Enabled through {@link ExtensionExceptionHandlerExceptionResolver}.
 * 
 * <b>这个是配置在spring的mvc-servlet.xml中的exceptionHandler配置项.</b>
 */
public class XPlatformGlobalExceptionHandler {
    public static final String             LOG4J                     = "1";                                                                                                                                                                                           //for type column
    public static final String             BUSINESS                  = "2";
    public static final String             EXCEPTION                 = "3";

    static final PropertyPlaceholderHelper propertyPlaceholderHelper = new PropertyPlaceholderHelper("${", "}", ":", false);
    static final JDBCExtAppender           jdbcExtAppender           = new JDBCExtAppender();

    static final String                    templateSql               = "INSERT INTO log4jlog(userId, userName,type, clazz, method, createTime, loglevel, errorCode, msg) VALUES ('${userId}','${userName}',${type},'','','${createTime}','','${errorCode}','${msg}')";

    /**
     * 判断是否需要插入数据库
     */
    private boolean                        insertDb                  = false;

    public boolean isInsertDb() {
        return insertDb;
    }

    public void setInsertDb(boolean insert) {
        this.insertDb = insert;
    }

    private String getSql(String userId, String userName, String type, String createTime, String errorCode, String msg) {
        Properties properties = new Properties();
        properties.setProperty("userId", getRenderedMessage(userId));
        properties.setProperty("userName", getRenderedMessage(userName));
        properties.setProperty("type", getRenderedMessage(type));
        properties.setProperty("createTime", getRenderedMessage(createTime));
        properties.setProperty("msg", getRenderedMessage(msg));
        properties.setProperty("errorCode", getRenderedMessage(errorCode));
        return propertyPlaceholderHelper.replacePlaceholders(templateSql, properties);
    }

    private void insert(String type, String errorCode, String msg) throws SQLException {
        String userId = (String) MDC.get("userId");
        String userName = (String) MDC.get("userName");
        String createTime = DateUtils.getCurrentStringDate(DateUtils.PATTERN_YYYYMMDDHHMMSS);
        String sql = getSql(userId, userName, type, createTime, errorCode, msg);
        jdbcExtAppender.call(sql);
    }

    /**  
    * 对插入的message中包含的单引号(')做处理 
    */
    private String getRenderedMessage(String renderedMessage) {
        if (null == renderedMessage) {
            return "";
        }
        if (renderedMessage.indexOf("'") != -1)
            renderedMessage = renderedMessage.replaceAll("'", "\"");
        return renderedMessage;
    }

    @ExceptionHandler(value = { MaxUploadSizeExceededException.class, BusinessException.class, Exception.class })
    public ResponseEntity<String> handle(Exception exception) throws SQLException {
        if (insertDb) {
            if (exception instanceof BusinessException) {
                BusinessException businessException = (BusinessException) exception;
                insert(BUSINESS, businessException.getErrorCode() + "", businessException.getMessage());
            } else {
                insert(EXCEPTION, "", getTrimedStackTraceString(exception));
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

        } else if (exception instanceof RuntimeException) {
            HttpHeaders headers = new HttpHeaders();
            MediaType mt = new MediaType("text", "html", Charset.forName("utf-8"));
            headers.setContentType(mt);
            return new ResponseEntity<String>(new JsonOut(false, "", getTrimedStackTraceString(exception)).toString(), headers, HttpStatus.METHOD_FAILURE);//EXCEPTION_FAILURE
        }
        return null;
    };

    public String getTrimedStackTraceString(Exception exception) {
        String trace = Exceptions.getStackTraceAsString(exception);
        if (trace.length() < 1000) {
            return trace;
        } else {
            return trace.substring(0, 1000);
        }
    }

}
