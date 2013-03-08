package com.ted.common.exception;

import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.Map;
import java.util.TreeMap;

public class BusinessException extends RuntimeException {
    private static final long         serialVersionUID = 1L;
    private ErrorCode                 errorCode;
    private final Map<String, Object> properties       = new TreeMap<String, Object>();

    public static BusinessException wrap(Throwable exception, ErrorCode errorCode) {
        if (exception instanceof BusinessException) {
            BusinessException se = (BusinessException) exception;
            if (errorCode != null && errorCode != se.getErrorCode()) {
                return new BusinessException(exception.getMessage(), exception, errorCode);
            }
            return se;
        } else {
            return new BusinessException(exception.getMessage(), exception, errorCode);
        }
    }

    public static BusinessException wrap(Throwable exception) {
        return wrap(exception, null);
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String name) {
        return (T) properties.get(name);
    }

    public BusinessException set(String name, Object value) {
        properties.put(name, value);
        return this;
    }

    public void printStackTrace(PrintStream s) {
        synchronized (s) {
            printStackTrace(new PrintWriter(s));
        }
    }

    public void printStackTrace(PrintWriter s) {
        synchronized (s) {
            s.println(this);
            s.println("\t-------------------------------");
            if (errorCode != null) {
                s.println("\t" + errorCode + ":" + errorCode.getClass().getName());
            }
            for (String key : properties.keySet()) {
                s.println("\t" + key + "=[" + properties.get(key) + "]");
            }
            s.println("\t-------------------------------");
            StackTraceElement[] trace = getStackTrace();
            for (int i = 0; i < trace.length; i++)
                s.println("\tat " + trace[i]);

            Throwable ourCause = getCause();
            if (ourCause != null) {
                ourCause.printStackTrace(s);
            }
            s.flush();
        }
    };

    //===================constructor and getter and setter======================
    public BusinessException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessException(Throwable cause, ErrorCode errorCode) {
        super(cause);
        this.errorCode = errorCode;
    }

    public BusinessException(String message, Throwable cause, ErrorCode errorCode) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public BusinessException setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
        return this;
    }

}
