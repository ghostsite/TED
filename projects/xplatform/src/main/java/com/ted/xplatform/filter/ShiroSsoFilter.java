package com.ted.xplatform.filter;

import java.security.Principal;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.web.filter.authc.AuthenticatingFilter;

public class ShiroSsoFilter extends AuthenticatingFilter {

    @Override
    protected AuthenticationToken createToken(ServletRequest request, ServletResponse response) throws Exception {
        final HttpServletRequest httpservletrequest = (HttpServletRequest) request;
        Principal principal = httpservletrequest.getUserPrincipal();
        if (principal != null) {
            // 这里是多源数据库的选择,系统根据用户组的不同会选择不同的数据库操作
            //DatasourceContextHolder.setGroupType(GroupType.CUSTOMER);
            UsernamePasswordToken token = new UsernamePasswordToken(principal.getName(), principal.getName()); //ok?
            return token;
        }else{
            return null;
        }
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        return executeLogin(request,response);//ok?
    }

}
