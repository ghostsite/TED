package com.ted.common.util;

import javax.servlet.http.HttpServletRequest;

/**
 * Servlet部门的工具类，使用前可以先参考springside Servlets.java
 * author: ghost
 * TODO @see org.springframework.web.util.UrlPathHelper.java,看能否有相同的作用
 *  UrlPathHelper helper = new UrlPathHelper();
        System.out.println(helper.getContextPath(request));
        System.out.println(helper.getLookupPathForRequest(request));
        System.out.println(helper.getOriginatingContextPath(request));
        System.out.println(helper.getOriginatingQueryString(request));
        System.out.println(helper.getOriginatingRequestUri(request));
        System.out.println(helper.getOriginatingServletPath(request));
        System.out.println(helper.getPathWithinApplication(request));
        System.out.println(helper.getPathWithinServletMapping(request));
        System.out.println(helper.getRequestUri(request));
        System.out.println(helper.getRequestUri(request));
        System.out.println(helper.getServletPath(request)); 
 */
public abstract class ServletUtils {
    //copy from com.mesplus.util.sub.Values.java
    public static String getUrlPath(HttpServletRequest request) {
        return toUrlPathByUri(request.getRequestURI(), request.getContextPath());
    }

    //copy from com.mesplus.util.sub.Values.java
    public static String toUrlPath(String url, String contextPath) {
        String uri = url;
        if (url.startsWith("http://"))
            uri = uri.substring(7);
        else if (url.startsWith("https://")) {
            uri = uri.substring(8);
        }
        int index = uri.indexOf('/');
        if (index > 0)
            uri = uri.substring(index);
        return toUrlPathByUri(uri, contextPath);
    }

    //copy from com.mesplus.util.sub.Values.java
    private static String toUrlPathByUri(String uri, String contextPath) {
        int pathParamIndex = uri.indexOf(';');
        if (pathParamIndex > 0) {
            uri = uri.substring(0, pathParamIndex);
        }

        int queryParamIndex = uri.indexOf('?');
        if (queryParamIndex > 0) {
            uri = uri.substring(0, queryParamIndex);
        }
        if (!"".equals(contextPath)) {
            uri = uri.replaceFirst(contextPath, "");
        }
        return uri;
    }
}
