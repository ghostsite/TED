package com.ted.xplatform.service;

import java.util.List;

import javax.inject.Inject;

import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cas.CasRealm;
import org.apache.shiro.subject.PrincipalCollection;
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
public class ShiroCasRealm extends CasRealm {

    @Inject
    private UserService userService;

    public UserService getUserService() {
        return userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    /**
     * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用.这个还没有走到啊？why
     */
    @Transactional(readOnly = false)
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String loginName = (String) principals.fromRealm(getName()).iterator().next();
        User user = userService.getUserByLoginName(loginName);
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
    };

}
