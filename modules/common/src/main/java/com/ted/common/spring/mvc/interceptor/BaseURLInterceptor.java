package com.ted.common.spring.mvc.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ted.common.util.NetworkUtils;

public class BaseURLInterceptor extends HandlerInterceptorAdapter {
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		if(null != modelAndView){
		    modelAndView.getModel().put("baseURL", NetworkUtils.getBasePath(request));
		}
	}
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
	        throws Exception {
	    System.out.println("preHandler...........................................");
	        return true;
	    }
}
