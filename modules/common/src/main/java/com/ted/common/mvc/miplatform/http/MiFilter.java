package com.ted.common.mvc.miplatform.http;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

@Deprecated
public class MiFilter implements Filter {

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		
		MiHttpServletRequest miRequest = new MiHttpServletRequest((HttpServletRequest)request);

		chain.doFilter(miRequest, response);
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

}
