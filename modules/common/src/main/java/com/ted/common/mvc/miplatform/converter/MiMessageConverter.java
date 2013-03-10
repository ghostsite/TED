package com.ted.common.mvc.miplatform.converter;

import java.io.IOException;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotWritableException;

public abstract class MiMessageConverter<T> implements HttpMessageConverter<T>{
	
	public abstract void writeInternal(T returnValue,
			MethodParameter returnType, HttpOutputMessage outputMessage)throws Exception;
	
	public abstract boolean canWrite(Class<?> clazz);

	public boolean canWrite(Class<?> clazz, MediaType mediaType) {
		return false;
	}
	
	public void write(T t, MediaType contentType,
			HttpOutputMessage outputMessage) throws IOException,
			HttpMessageNotWritableException {
		
	}
}
