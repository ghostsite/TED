package com.ted.common.mvc.miplatform.interceptor;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.ClassUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.ted.common.mvc.miplatform.annotation.MiResponseBody;
import com.ted.common.mvc.miplatform.factory.MiPlatformFactory;

public class MiMethodInterceptor implements HandlerInterceptor{

	@Inject
	private MiPlatformFactory miFactory;
	
	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		
		if(ClassUtils.isAssignableValue(HandlerMethod.class, handler)){
			
			HandlerMethod methodHandler = (HandlerMethod) handler;
	
			MiResponseBody miAnnoation = methodHandler.getMethodAnnotation(MiResponseBody.class);
			if(miAnnoation != null){
				miFactory.setPlatformRequest(request);
			}
		}
		
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

}
