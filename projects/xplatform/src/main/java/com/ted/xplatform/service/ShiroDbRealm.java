package com.ted.xplatform.service;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.springframework.transaction.annotation.Transactional;

import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.User;

/**
 * <p>Title: 此类可参考JdbcRealm from shiro</p>
 * <p>Description: 权限的认证类</p>
 * <p>Copyright: Copyright (c) 2011</p>
 * @date 2011-5-17
 * @version 1.1
 * 支持SSO
 */
@Transactional
public class ShiroDbRealm extends AuthorizingRealm {

    @Inject
    private UserService userService;

    public UserService getUserService() {
        return userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    /**
     * 认证回调函数,登录时调用.
     */
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authcToken;
        //Object username = token.getPrincipal();
        User user = userService.getUserByUserIdPwd(token.getUsername(), new String(token.getPassword()));
        if (user != null) {
            return new SimpleAuthenticationInfo(user, user.getPassword(), getName());
        } else {
            return null;
        }
    }

    /**
     * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用.
     */
    @Transactional(readOnly = false)
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        User user = (User) principals.fromRealm(getName()).iterator().next();
        if (user != null) {
            SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
            List<ACL> aclList = user.getAcls();
            for (ACL acl : aclList) {
                info.addStringPermission(acl.getPermissionString());
            }
            return info;
        } else {
            return null;
        }
    }

    /**
     * 设定Password校验的Hash算法与迭代次数.
     */
    @PostConstruct
    public void initCredentialsMatcher() {
        setAuthenticationTokenClass(UsernamePasswordToken.class);
        //HashedCredentialsMatcher matcher = new HashedCredentialsMatcher(PasswordUtils.HASH_ALGORITHM);
        //matcher.setHashIterations(PasswordUtils.HASH_INTERATIONS);
        //setCredentialsMatcher(matcher);//这个注释，是因为密码已经是加密后的密码了。
    }

    /**
     * 清空用户关联权限认证，待下次使用时重新加载。
     * @param principal
     */
    public void clearCachedAuthorizationInfo(String principal) {
        SimplePrincipalCollection principals = new SimplePrincipalCollection(principal, getName());
        clearCachedAuthorizationInfo(principals);
    }

    /**
     * 清空所有关联认证
     */
    public void clearAllCachedAuthorizationInfo() {
        Cache<Object, AuthorizationInfo> cache = getAuthorizationCache();
        if (cache != null) {
            for (Object key : cache.keys()) {
                cache.remove(key);
            }
        }
    };

}
