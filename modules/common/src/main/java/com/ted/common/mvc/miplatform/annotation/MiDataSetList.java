package com.ted.common.mvc.miplatform.annotation;

/**
 * 这个mvc.miplatform整个部分来源于octopus,thanks.
 * 目前还不完整,有一些没有完全实现,需后期补充.
 * 整体框架出来了,还有待细节完善.
 */
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MiDataSetList {
}