package com.ted.xplatform.util;

import java.util.Collection;
import java.util.Iterator;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.mgt.RealmSecurityManager;
import org.apache.shiro.realm.Realm;

import com.ted.xplatform.service.ShiroDbRealm;

public abstract class ShiroUtils {
    
    /**
     * clear缓存，否则改变不起作用,注意是针对ShiroDbRealm,因为里面提供了简单的方法，否则还要自己写循环。
     */
    public static final void clearCachedAuthenticationInfo() {
        RealmSecurityManager mgr = (RealmSecurityManager) SecurityUtils.getSecurityManager();
        Collection<Realm> realmCollection = mgr.getRealms();
        Iterator<Realm> i = realmCollection.iterator();
        if (i.hasNext()) {
            ShiroDbRealm shiroDbRealm = (ShiroDbRealm) i.next();
            shiroDbRealm.clearAllCachedAuthorizationInfo();
        }
    };
}
