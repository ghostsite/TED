package com.ted.xplatform.util;

/**
 * 公共工具类
 * @since 1.0
 * @date 2012-02-24
 */
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import com.google.common.collect.Lists;
import com.ted.common.Constants;
import com.ted.xplatform.pojo.common.MenuResource;
import com.ted.xplatform.pojo.common.User;

public abstract class PlatformUtils {
    private static Properties   jdbcProperties;
    private static final String jdbcPropsFile = "/jdbc.properties"; // 配置文件路径

    public static final String getFileSeparator() {
        return System.getProperty("file.separator");
    }

    public static Properties getContextProperties() {
        if (null == jdbcProperties) {
            jdbcProperties = new Properties();
            try {
                InputStream is = PlatformUtils.class.getResourceAsStream(jdbcPropsFile);
                jdbcProperties.load(is);
                is.close();
            } catch (IOException ex) {
                System.out.println("装载文件--->失败!");
                ex.printStackTrace();
            }
        }
        return jdbcProperties;
    };

    // 设置当前登录的用户
    public static final void setCurrentUser(User user) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (null != session) {
                session.setAttribute(Constants.CURRENT_LOGINUSER_KEY, user);
            }
        }
    };

    // 获取当前登录的用户
    public static final <T extends User> T getCurrentUser() {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (null != session) {
                T user = (T) session.getAttribute(Constants.CURRENT_LOGINUSER_KEY);
                if (null != user) {
                    return user;
                }
            }
        }
        return null;
    };
    
    //获取当前登录的用户 
    public static final Session getSession() {
        Subject currentUser = SecurityUtils.getSubject();
        return currentUser.getSession();
    };

    public static void print(HttpServletResponse response, String s) {
        try {
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().print(s);
            response.getWriter().flush();
            //response.getWriter().close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    };
    
    //ghostzhang added 20121130 favorite menu
    public static final List<MenuResource> getFavorite(List<MenuResource> menuResourceList){
    	List<MenuResource> favoriteList = Lists.newArrayList();
    	for(MenuResource menu : menuResourceList){
    		if(menu.isLeaf() && menu.isFavorite()){
    			favoriteList.add(menu);
    		}
    		favoriteList.addAll(getFavorite(menu.getSubMenuResources()));
    	}
    	return favoriteList;
    };

}
