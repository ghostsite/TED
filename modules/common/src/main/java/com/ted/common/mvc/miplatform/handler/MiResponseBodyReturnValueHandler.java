package com.ted.common.mvc.miplatform.handler;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ted.common.mvc.miplatform.annotation.MiResponseBody;
import com.ted.common.mvc.miplatform.converter.MiMessageConverter;

public class MiResponseBodyReturnValueHandler<T> implements HandlerMethodReturnValueHandler{

	protected List<MiMessageConverter<T>> messageConverters;
	
	public List<MiMessageConverter<T>> getMessageConverters() {
		return messageConverters;
	}

	public void setMessageConverters(
			List<MiMessageConverter<T>> messageConverters) {
		this.messageConverters = messageConverters;
	}

	public MiResponseBodyReturnValueHandler(){
		
	}
	
	public MiResponseBodyReturnValueHandler(List<MiMessageConverter<T>> messageConverters){
		this.messageConverters = messageConverters;
	}
	
	@Override
	public boolean supportsReturnType(MethodParameter returnType) {
		return returnType.getMethodAnnotation(MiResponseBody.class) != null;
	}

	@SuppressWarnings("unchecked")
	@Override
	public void handleReturnValue(Object returnValue,
			MethodParameter returnType, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest) throws Exception {
		
		mavContainer.setRequestHandled(true);
		HttpServletResponse response = webRequest.getNativeResponse(HttpServletResponse.class);
		HttpOutputMessage outputMessage = new ServletServerHttpResponse(response);
		
		for(MiMessageConverter<T> messageConverter: messageConverters){
			if(messageConverter.canWrite(returnValue.getClass())){
				messageConverter.writeInternal((T) returnValue, returnType, outputMessage);
			}
		}
		
	}

}
