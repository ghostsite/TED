package com.ted.common.mvc.miplatform.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MiResponseBody{
	
	public static final String DEFAULT_RETURN_TYPE = "dataset";
	
	public static final String OTHER_RETURN_TYPE = "variable";
	
	public static final String DEFAULT_RETURN_VARIABLE_NAME = "returnVariableName";
	
	public static final String DEFAULT_RETURN_DATASET_NAME = "dsResult";
	
	String returnType() default DEFAULT_RETURN_TYPE;// the other "variable"
	
	String returnVariableName() default DEFAULT_RETURN_VARIABLE_NAME;
	
	String returnDatasetName() default DEFAULT_RETURN_DATASET_NAME;
	
	boolean isDataset() default true;
}