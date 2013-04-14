package com.ted.xplatform.util;

import java.util.List;
import java.util.Map;

import org.apache.shiro.subject.Subject;
import org.springframework.util.Assert;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.Operation;
import com.ted.xplatform.pojo.common.Resource;

/**
 * ACL and Operation and Resource(派生的MenuResource, FileResource, PageItemResource)工具类
 * 注意是否是事务
 */
public abstract class ACLUtils {
    /**
     * 把ACL转换成MAP，属性包括aclId, resource.name, operation.description
     */
    public static final Map<String, Object> acl2Map(ACL acl) {
        Map<String, Object> map = Maps.newHashMap();
        map.put("id", acl.getId());
        map.put("resourceName", acl.getResource().getName());
        map.put("operationName", acl.getOperation().getName());
        map.put("type", acl.getType());
        return map;
    };

    /**
     * ACL to Map List
     */
    public static final List<Map<String, Object>> acl2MapList(List<ACL> aclList) {
        List<Map<String, Object>> mapList = Lists.newArrayList();
        for (ACL acl : aclList) {
            mapList.add(acl2Map(acl));
        }
        return mapList;
    };

    /**
     * 判断Operation是否是View's Operation
     * 不涉及到事务 
     */
    public static final boolean isView(Operation operation) {
        Assert.notNull(operation);
        return Operation.Type.view.name().equals(operation.getCode());
    }

    /**
     * 判断Operation是否是添加's Operation
     * 不涉及到事务 
     */
    public static final boolean isAdd(Operation operation) {
        Assert.notNull(operation);
        return Operation.Type.add.name().equals(operation.getCode());
    }

    /**
     * 判断Operation是否是Update's Operation
     * 不涉及到事务 
     */
    public static final boolean isUpdate(Operation operation) {
        Assert.notNull(operation);
        return Operation.Type.update.name().equals(operation.getCode());
    }

    /**
     * 判断Operation是否是Delete's Operation
     * 不涉及到事务 
     */
    public static final boolean isDelete(Operation operation) {
        Assert.notNull(operation);
        return Operation.Type.delete.name().equals(operation.getCode());
    };

    /**
     * 判断Operation是否是ReadOnly's Operation
     * 不涉及到事务 
     */
    public static final boolean isReadOnly(Operation operation) {
        Assert.notNull(operation);
        return Operation.Type.readonly.name().equals(operation.getCode());
    };
    
    /**
     * 判断Operation是否是Disabled's Operation
     * 不涉及到事务 
     */
    public static final boolean isDisabled(Operation operation) {
        Assert.notNull(operation);
        return Operation.Type.disabled.name().equals(operation.getCode());
    };
    
    /**
     * 判断Operation是否是Downloaed's Operation
     * 不涉及到事务 
     */
    public static final boolean isDownload(Operation operation) {
        Assert.notNull(operation);
        return Operation.Type.download.name().equals(operation.getCode());
    };
    
    /**
     * <b>获取有效的ACLList,原因是ACL表的两个关键字段可以为空，导致肯能ACL有资源，没权限。</b>
     * @param aclList
     * @return
     */
    public static final List<ACL> getValidACLList(List<ACL> aclList) {
        List<ACL> validACLList = Lists.newArrayList();
        for (ACL acl : aclList) {
            if (isValidACL(acl)) {
                validACLList.add(acl);
            }
        }
        return validACLList;
    };

    /**
     * 判断ACL是否有效
     * @param acl
     * @return
     */
    public static final boolean isValidACL(ACL acl) {
        if (acl.getResource() != null && acl.getOperation() != null) {
            return true;
        } else {
            return false;
        }
    };
    
    //moved from ResourceService,判断当前登陆人对资源resource是否有operation权限。暂时没人调用这个方法。
    public static final boolean hasAuthority(Subject currentUser, Resource resource, String operation){
        return currentUser.isPermitted(resource.getCode()+":"+ operation);
    }

}
