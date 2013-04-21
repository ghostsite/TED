package com.ted.xplatform.filter;

import java.util.List;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.web.filter.AccessControlFilter;

import com.google.common.collect.Lists;
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.Resource;
import com.ted.xplatform.pojo.common.UrlResource;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.util.PlatformUtils;

/**
 * 这个跟HttpStatusAuthFilter的平级，都是给Shiro用的。
 * 这个类的目的是url的权限：当前登陆人是否有权限访问url(Spring mvc Controller中的mapping)
 * 这个跟shiro.xml里面配置的路径权限的区别是：
 * 配置是对所有的用户
 * 而这个是对每个当前登录用户的url权限。
 * @author zhang
 * @date 2013-04-17
 */
public class UrlFilter extends AccessControlFilter {

    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        User currentUser = PlatformUtils.getCurrentUser();
        if (currentUser.isSuperUser()) {
            return true;
        }

        List<UrlResource> urlResourceList = getUserHasUrlResourceList(currentUser);
        for (UrlResource url : urlResourceList) {
            if (pathsMatch(url.getCode(), request)) {
                return true;
            }
        }
        return false;
    };

    protected List<UrlResource> getUserHasUrlResourceList(User currentUser) {
        List<ACL> acls = currentUser.getAcls();
        List<UrlResource> urlResourceList = Lists.newArrayList();
        for (ACL acl : acls) {
            Resource res = acl.getResource();
            if (res instanceof UrlResource) {
                urlResourceList.add((UrlResource) res);
            }
        }
        return urlResourceList;
    }

    /**
     * This default implementation simply calls
     * {@link #saveRequestAndRedirectToLogin(javax.servlet.ServletRequest, javax.servlet.ServletResponse) saveRequestAndRedirectToLogin}
     * and then immediately returns <code>false</code>, thereby preventing the chain from continuing so the redirect may
     * execute.
     */
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        return false;
    }

}
