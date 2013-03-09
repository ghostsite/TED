package com.ted.common.log.log4j;

import org.apache.log4j.Category;
import org.apache.log4j.Priority;
import org.apache.log4j.spi.LoggingEvent;

/**
 * ' 在插入数据库中有问题，需要转义。
 * 由于不用log4j,故编译不过，注释掉。
 * 放着只是参考
 */
public class ReLoggingEvent extends LoggingEvent {
    private static final long serialVersionUID = 1L;

    public ReLoggingEvent(String fqnOfCategoryClass, Category logger, long timeStamp, Priority level, Object message, Throwable throwable) {
       // super(fqnOfCategoryClass, logger, timeStamp, level, message, throwable);
    }

    /** 
     * 线程名单引号做处理 
     */
    public String getThreadName() {
//        String thrdName = super.getThreadName();
//        if (thrdName.indexOf("'") != -1) {
//            thrdName = thrdName.replaceAll("'", "\"");
//        }
//        return thrdName;
        return null;
    }

    /**  
     * 对插入的message中包含的单引号(')做处理 
     * @see org.apache.log4j.spi.LoggingEvent#getRenderedMessage() 
     */
    public String getRenderedMessage() {
        return null;
//        String renderedMessage = super.getRenderedMessage();
//        //插入的message中包含(')单引号需要处理  
//        if (renderedMessage.indexOf("'") != -1)
//            renderedMessage = renderedMessage.replaceAll("'", "\"");
//        return renderedMessage;
    }

}
