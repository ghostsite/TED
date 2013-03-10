package com.ted.common.mvc.miplatform.resolver;

import javax.inject.Inject;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ted.common.mvc.miplatform.annotation.MiVariable;
import com.ted.common.mvc.miplatform.factory.MiPlatformFactory;
import com.tobesoft.platform.data.VariableList;

public class MiVariableArgumentResolver implements HandlerMethodArgumentResolver {

	@Inject
	private MiPlatformFactory miFactory;
	
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(MiVariable.class) != null; 
	}
	
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
			WebDataBinderFactory binderFactory) throws Exception {

//		MiHttpServletRequest miRequest = webRequest.getNativeRequest(MiHttpServletRequest.class);
//		MiHttpServletRequest miRequest = WebUtils.getNativeRequest(servletRequest, MiHttpServletRequest.class);
		
		VariableList list = miFactory.getVariableList();

		return list.getValueAsObject(parameter.getParameterName());
	}
	
}
