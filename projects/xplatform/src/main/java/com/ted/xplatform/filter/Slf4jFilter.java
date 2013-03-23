package com.ted.xplatform.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.slf4j.MDC;

import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.util.PlatformUtils;

public class Slf4jFilter implements Filter {
    private static final String DEFAULT_USERID = "";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        User user = PlatformUtils.getCurrentUser();
        if (user == null) {
            MDC.put("userId", DEFAULT_USERID);
            MDC.put("userName", DEFAULT_USERID);
        } else {
            MDC.put("userId", user.getLoginName());
            MDC.put("userName", user.getUserName());
        }
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        
    }

}
