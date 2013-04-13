package com.ted.xplatform.service;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.exception.BusinessException;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.Operation;
import com.ted.xplatform.pojo.common.Resource;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.repository.OperationDao;
import com.ted.xplatform.util.PlatformUtils;

/**
 * Resource的Service
 * 这个不对外提供，只提供给MenuResource,PageResource,WidgetResource,FileResource用。
 */

@Transactional
@Service("resourceService")
public class ResourceService {
    final Logger    logger = LoggerFactory.getLogger(ResourceService.class);

    @Inject
    JdbcTemplateDao jdbcTemplateDao;

    @Inject
    JpaSupportDao   jpaSupportDao;

    @Inject
    JpaTemplateDao  jpaTemplateDao;

    @Inject
    OperationDao    operationDao;

    @Inject
    MessageSource   messageSource;

    public void setJdbcTemplateDao(JdbcTemplateDao jdbcTemplateDao) {
        this.jdbcTemplateDao = jdbcTemplateDao;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setOperationDao(OperationDao operationDao) {
        this.operationDao = operationDao;
    }

    /**
     * 工具方法:currentSubject是否对MenuResource有view的权限
     * 注意：这个只能在事务中运行。
     * 超级用户可以看，也就是不过滤超级用户
     * @param Subject currentUser, MenuResource menu
     * @return boolean
     */
    @Transactional(readOnly = true)
    protected boolean hasViewPermission(Subject currentUser, Resource resource) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            return hasAuthority(currentUser, resource, Operation.Type.view.name());
            //String permission = resource.getCode() + ":" + Operation.Type.view;
            //return currentUser.isPermitted(permission);
        }
    };

    @Transactional(readOnly = true)
    protected boolean hasReadOnlyPermission(Subject currentUser, Resource resource) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            return hasAuthority(currentUser, resource, Operation.Type.readonly.name());
           // String permission = resource.getCode() + ":" + Operation.Type.readonly;
           // return currentUser.isPermitted(permission);
        }
    };
    
    @Transactional(readOnly = true)
    protected boolean hasDisabledPermission(Subject currentUser, Resource resource) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            return hasAuthority(currentUser, resource, Operation.Type.disabled.name());
        }
    }
    
    public static final boolean hasAuthority(Subject currentUser, Resource resource, String operation){
        return currentUser.isPermitted(resource.getCode()+":"+ operation);
    }

    /**
     * 工具方法，带checkbox的acls
     * 注意：此方法也是在事务中执行。
     * @param List<MenuResource> menuResourceList
     * @return void
     */
    @Transactional(readOnly = true)
    protected void loadOperations(List<? extends Resource> resourceList) {
        for (Resource menu : resourceList) {
            menu.getOperationList();
        }
    };

    /**
     * 把 private boolean            canView;
        private boolean             canAdd;
        private boolean             canUpdate;
        private boolean             canDelete;
                 转化为acl
                 工具类辅助方法 ：add MenuResource时需要挑出来operation
     * @param menuResource
     */
    public void addOperationProperties2Operations(Resource resource) {
        if (resource.isCanView()) {
            Operation viewOperation = operationDao.getByCode(Operation.Type.view.name());
            setOperation2Resource(viewOperation, resource);
        }
        if (resource.isCanAdd()) {
            Operation addOperation = operationDao.getByCode(Operation.Type.add.name());
            setOperation2Resource(addOperation, resource);
        }
        if (resource.isCanUpdate()) {
            Operation updateOperation = operationDao.getByCode(Operation.Type.update.name());
            setOperation2Resource(updateOperation, resource);
        }
        if (resource.isCanDelete()) {
            Operation deleteOperation = operationDao.getByCode(Operation.Type.delete.name());
            setOperation2Resource(deleteOperation, resource);
        }
        if (resource.isCanReadOnly()) {
            Operation readonlyOperation = operationDao.getByCode(Operation.Type.readonly.name());
            setOperation2Resource(readonlyOperation, resource);
        }
    }

    /**
     * 工具方法：看MenuResource含有的ACLList 是否包含add view update delete operation
     */
    protected static final boolean contain(Set<ACL> aclSet, String operationCode) {
        for (ACL acl : aclSet) {
            if (acl.getOperation().getCode().equals(operationCode)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 工具类辅助方法：更新MenuResource时需要挑出来operation，
     * @param menuResource
     */
    public void updateOperationProperties2Operations(Resource resource) {
        Set<ACL> aclSet = resource.getAcls();
        Iterator<ACL> iter = aclSet.iterator();
        while (iter.hasNext()) {
            ACL acl = iter.next();
            if (acl.getOperation().isViewOperation() && !resource.isCanView()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isAddOperation() && !resource.isCanAdd()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isUpdateOperation() && !resource.isCanUpdate()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isDeleteOperation() && !resource.isCanDelete()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isReadOnlyOperation() && !resource.isCanReadOnly()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isDisabledOperation() && !resource.isCanReadOnly()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
        }

        if (resource.isCanView() && !contain(aclSet, Operation.Type.view.name())) {
            Operation viewOperation = operationDao.getByCode(Operation.Type.view.name());
            setOperation2Resource(viewOperation, resource);
        }

        if (resource.isCanAdd() && !contain(aclSet, Operation.Type.add.name())) {
            Operation addOperation = operationDao.getByCode(Operation.Type.add.name());
            setOperation2Resource(addOperation, resource);
        }
        if (resource.isCanUpdate() && !contain(aclSet, Operation.Type.update.name())) {
            Operation updateOperation = operationDao.getByCode(Operation.Type.update.name());
            setOperation2Resource(updateOperation, resource);
        }
        if (resource.isCanDelete() && !contain(aclSet, Operation.Type.delete.name())) {
            Operation deleteOperation = operationDao.getByCode(Operation.Type.delete.name());
            setOperation2Resource(deleteOperation, resource);
        }
        if (resource.isCanReadOnly() && !contain(aclSet, Operation.Type.readonly.name())) {
            Operation readonlyOperation = operationDao.getByCode(Operation.Type.readonly.name());
            setOperation2Resource(readonlyOperation, resource);
        }
        if (resource.isCanDisabled() && !contain(aclSet, Operation.Type.disabled.name())) {
            Operation disabledOperation = operationDao.getByCode(Operation.Type.disabled.name());
            setOperation2Resource(disabledOperation, resource);
        }
    }

    public static final void setOperation2Resource(Operation operation, Resource resource) {
        ACL acl = new ACL();
        acl.setResource(resource);
        acl.setOperation(operation);
        resource.getAcls().add(acl);
    }

}
