package com.ted.xplatform.service;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import org.apache.shiro.SecurityUtils;
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
import com.ted.xplatform.pojo.common.PageResource;
import com.ted.xplatform.pojo.common.Resource;
import com.ted.xplatform.pojo.common.Role;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.repository.OperationDao;
import com.ted.xplatform.util.ACLUtils;
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
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.view.name());
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
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.readonly.name());
        }
    };

    @Transactional(readOnly = true)
    protected boolean hasDisabledPermission(Subject currentUser, Resource resource) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.disabled.name());
        }
    }

    @Transactional(readOnly = true)
    protected boolean hasDownloadPermission(Subject currentUser, Resource resource) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.download.name());
        }
    }
    
    @Transactional(readOnly = true)
    protected boolean hasHidePermission(Subject currentUser, Resource resource) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.hide.name());
        }
    }
    
    @Transactional(readOnly = true)
    protected boolean hasExecutePermission(Subject currentUser, Resource resource) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.execute.name());
        }
    }

    /**
     * 工具方法，带checkbox的acls
     * 注意：此方法也是在事务中执行。
     * @param List<MenuResource> menuResourceList
     * @return void
     */
    @Transactional(readOnly = true)
    protected void loadOperations(List<? extends Resource> resourceList) {
        for (Resource resource : resourceList) {
            resource.getOperationList();
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
        if (resource.isCanDisabled()) {
            Operation disabledOperation = operationDao.getByCode(Operation.Type.disabled.name());
            setOperation2Resource(disabledOperation, resource);
        }
        if (resource.isCanDownload()) {
            Operation downloadOperation = operationDao.getByCode(Operation.Type.download.name());
            setOperation2Resource(downloadOperation, resource);
        }
        if (resource.isCanHide()) {
            Operation hideOperation = operationDao.getByCode(Operation.Type.hide.name());
            setOperation2Resource(hideOperation, resource);
        }
        if (resource.isCanExecute()) {
            Operation executeOperation = operationDao.getByCode(Operation.Type.execute.name());
            setOperation2Resource(executeOperation, resource);
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
            if (acl.getOperation().isDisabledOperation() && !resource.isCanDisabled()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isDownloadOperation() && !resource.isCanDownload()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isHideOperation() && !resource.isCanHide()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isExecuteOperation() && !resource.isCanExecute()) {
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
        if (resource.isCanDownload() && !contain(aclSet, Operation.Type.download.name())) {
            Operation downloadOperation = operationDao.getByCode(Operation.Type.download.name());
            setOperation2Resource(downloadOperation, resource);
        }
        if (resource.isCanHide() && !contain(aclSet, Operation.Type.hide.name())) {
            Operation hideOperation = operationDao.getByCode(Operation.Type.hide.name());
            setOperation2Resource(hideOperation, resource);
        }
        if (resource.isCanExecute() && !contain(aclSet, Operation.Type.execute.name())) {
            Operation executeOperation = operationDao.getByCode(Operation.Type.execute.name());
            setOperation2Resource(executeOperation, resource);
        }
    }

    public static final void setOperation2Resource(Operation operation, Resource resource) {
        ACL acl = new ACL();
        acl.setResource(resource);
        acl.setOperation(operation);
        resource.getAcls().add(acl);
    }

    /**
     * 当前登陆用户对给定code的resource是否有view权限,注意widgetresource 的code不是唯一的，只有menuresource, pageresource的code才是唯一的。
     * <b>NOTE:</b> 先找一下resource表，如果没有找到，则返回true
     */
    @Transactional
    public boolean currentUserCanView(String code) {
        Resource resource = this.jpaSupportDao.findSingleByProperty(Resource.class, "code" , code);
        return currentUserCanView(resource);
    };
    
    /**
     * 当前登陆用户对给定code的resource是否有view权限,注意widgetresource 的code不是唯一的，只有menuresource, pageresource的code才是唯一的。
     * <b>NOTE:</b> 先找一下resource表，如果没有找到，则返回true
     */
    @Transactional
    public boolean currentUserCanView(Resource resource) {
        if(null == resource){
            return true;
        }
        Subject currentUser = SecurityUtils.getSubject();
        User cu = PlatformUtils.getCurrentUser();
        if (cu.isSuperUser()) {
            return true;
        } else {
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.view.name());
        }
    };
    
    /**
     * 当前登陆用户对给定code的resource是否有view权限,注意widgetresource 的code不是唯一的，只有menuresource, pageresource的code才是唯一的。
     * <b>NOTE:</b> 先找一下resource表，如果没有找到，则返回true
     */
    @Transactional
    public boolean currentUserCanDownload(String code) {
        Resource resource = this.jpaSupportDao.findSingleByProperty(Resource.class, "code" , code);
        return currentUserCanDownload(resource);
    };
    
    /**
     * 当前登陆用户对给定code的resource是否有download权限
     * <b>NOTE:</b> 先找一下resource表，如果没有找到，则返回false
     */
    @Transactional
    public boolean currentUserCanDownload(Resource resource) {
        if(null == resource){
            return false;
        }
        Subject currentUser = SecurityUtils.getSubject();
        User cu = PlatformUtils.getCurrentUser();
        if (cu.isSuperUser()) {
            return true;
        } else {
            return ACLUtils.hasAuthority(currentUser, resource, Operation.Type.download.name());
        }
    };
    
    /**
     * 删除，
     * 注意：是否要级联删除: 级联删除下属组织WidgetResource。这个是通过Resource的pojo配置来实现的。
     * 要手工删除角色对应的acl关系，也就是通过控制Role来达到删除role_acl的目的。
     */
    @Transactional
    public void delete(Long resourceId) {
        Resource resource = (Resource) jpaSupportDao.getEntityManager().find(Resource.class, resourceId);
        Set<ACL> acls = resource.getAcls();
        for (ACL acl : acls) {//这个地方一定要小心，分清cascade and mappedBy(谁是主控方)
            List<Role> roles = acl.getRoles();
            for (Role role : roles) {
                role.getAcls().remove(acl);
                jpaSupportDao.getEntityManager().merge(role);
            }
        }
        jpaSupportDao.getEntityManager().remove(resource);
    }
    
    
}
