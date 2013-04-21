package com.ted.common.spring.mvc.bind.annotation;


import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 
 * 该注解用于绑定请求参数（JSON字符串）
 * 
 * @author Zhang Kaitao
 * zhang add comments: 这个是使用在一般字符串接受中有json格式的数据。
 * 如果是Ext.jsonData，则不要这种方式，用一般的格式@RequestParam就好。前提是xml中配置了jackson接受json
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestJsonParam {

    /**
     * 用于绑定的请求参数名字
     */
    String value() default "";
    
    /**
     * 是否必须，默认是
     */
    boolean required() default true;

}
