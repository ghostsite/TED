package com.ted.common.util;

import java.net.InetAddress;

import javax.servlet.http.HttpServletRequest;

/**
 * 
 * @date 20100323
 */
public abstract class NetworkUtils {

    /**
     * @return such as: http://localhost:8080/sescportal/
     */
    public static final String getBasePath(HttpServletRequest request) {
        String path = request.getContextPath();
        String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
        return basePath;
    };

    /**
     * 获取访问的客户端的真实的ip地址
     * 
     * @param request
     *            HttpServletRequest
     * @return
     */
    public static String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    };

    public static String getAllIpAddr(HttpServletRequest request) {
        StringBuffer buffer = new StringBuffer();
        buffer.append("x-forwarded-for:").append(request.getHeader("x-forwarded-for")).append(";");
        buffer.append("Proxy-Client-IP:").append(request.getHeader("Proxy-Client-IP")).append(";");
        buffer.append("WL-Proxy-Client-IP:").append(request.getHeader("WL-Proxy-Client-IP")).append(";");
        buffer.append("IP:").append(request.getRemoteAddr()).append(";");
        return buffer.toString();
    };

    // 得到服务器IP
    public static String getServerIP() {
        try {
            InetAddress inet = InetAddress.getLocalHost();
            String hostip = inet.getHostAddress();
            return hostip;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    };

    // 得到服务器IP,hostname
    public static String getServerName() {
        try {
            InetAddress inet = InetAddress.getLocalHost();
            //String hostip = inet.getHostAddress();
            String hostname = inet.getHostName();
            return hostname;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    };
}
