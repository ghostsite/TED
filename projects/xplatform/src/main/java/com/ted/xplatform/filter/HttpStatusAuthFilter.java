package com.ted.xplatform.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.web.filter.authc.AuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;

/**
 * 主要shi为了Ajax调用的时候返回401错误头
 * @author ghostzhang
 *
 */
public class HttpStatusAuthFilter extends AuthenticationFilter {
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        if (isLoginRequest(request, response)) {
            return true;
        } else {
            HttpServletResponse httpResponse = WebUtils.toHttp(response);
            httpResponse.addHeader("WWW-Authentication", "ACME-AUTH");
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED); //401
            return false;
        }
    }

}
