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

import com.google.common.collect.Lists;
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.exception.BusinessException;
import com.ted.common.util.BeanUtils;
import com.ted.common.util.CollectionUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.MenuResource;
import com.ted.xplatform.pojo.common.Operation;
import com.ted.xplatform.pojo.common.Resource;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.repository.OperationDao;
import com.ted.xplatform.util.PlatformUtils;

/**
 * 菜单的Service
 */

@Transactional
@Service("menuResourceService")
public class MenuResourceService {
    final Logger               logger        = LoggerFactory.getLogger(MenuResourceService.class);
    public static final String SUBMENUS_JPQL = "from MenuResource m where m.parentId=:resourceId or (m.parentId is null and :resourceId is null)  order by m.idx asc";

    @Inject
    JdbcTemplateDao            jdbcTemplateDao;

    @Inject
    JpaSupportDao              jpaSupportDao;

    @Inject
    JpaTemplateDao             jpaTemplateDao;

    @Inject
    OperationDao               operationDao;

    @Inject
    MessageSource              messageSource;

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

    //-----------------工具方法-----------------//
    /**
     * 工具方法:根据当前用户过滤菜单
     * 注意：这个只能在事务中运行。并且不过滤admin
     * @param List<MenuResource> menuResourceList
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    private List<MenuResource> filterMenuResourceByCurrentSubject(List<MenuResource> menuResourceList) {
        Subject currentUser = SecurityUtils.getSubject();
        List<MenuResource> filteredMenuList = Lists.newArrayList();
        for (MenuResource menu : menuResourceList) {
            if (hasViewPermission(currentUser, menu)) {
                filteredMenuList.add(menu);
            }
        }
        return filteredMenuList;
    };

    /**
     * 工具方法:currentSubject是否对MenuResource有view的权限
     * 注意：这个只能在事务中运行。
     * 超级用户可以看，也就是不过滤超级用户
     * @param Subject currentUser, MenuResource menu
     * @return boolean
     */
    @Transactional(readOnly = true)
    private boolean hasViewPermission(Subject currentUser, MenuResource menu) {
        User user = PlatformUtils.getCurrentUser();
        if (user.isSuperUser()) {
            return true;
        } else {
            String permission = menu.getCode() + ":" + Operation.Type.view;
            return currentUser.isPermitted(permission);
        }
    };

    /**
     * 工具方法，带checkbox的acls
     * 注意：此方法也是在事务中执行。
     * @param List<MenuResource> menuResourceList
     * @return void
     */
    @Transactional(readOnly = true)
    private void loadOperations(List<MenuResource> menuResourceList) {
        for (MenuResource menu : menuResourceList) {
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
    public void addOperationProperties2Operations(MenuResource menuResource) {
        if (menuResource.isCanView()) {
            Operation viewOperation = operationDao.getByCode(Operation.Type.view.name());
            setOperation2Resource(viewOperation, menuResource);
        }
        if (menuResource.isCanAdd()) {
            Operation addOperation = operationDao.getByCode(Operation.Type.add.name());
            setOperation2Resource(addOperation, menuResource);
        }
        if (menuResource.isCanUpdate()) {
            Operation updateOperation = operationDao.getByCode(Operation.Type.update.name());
            setOperation2Resource(updateOperation, menuResource);
        }
        if (menuResource.isCanDelete()) {
            Operation deleteOperation = operationDao.getByCode(Operation.Type.delete.name());
            setOperation2Resource(deleteOperation, menuResource);
        }
    }

    /**
     * 工具方法：看MenuResource含有的ACLList 是否包含add view update delete operation
     */
    private static final boolean contain(Set<ACL> aclSet, String operationCode) {
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
    public void updateOperationProperties2Operations(MenuResource menuResource) {
        Set<ACL> aclSet = menuResource.getAcls();
        Iterator<ACL> iter = aclSet.iterator();
        while (iter.hasNext()) {
            ACL acl = iter.next();
            if (acl.getOperation().isViewOperation() && !menuResource.isCanView()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isAddOperation() && !menuResource.isCanAdd()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isUpdateOperation() && !menuResource.isCanUpdate()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
            if (acl.getOperation().isDeleteOperation() && !menuResource.isCanDelete()) {
                if (acl.getRoles().size() > 0) {
                    throw new BusinessException(SpringUtils.getMessage("message.common.user.needtodeleterole2acl", messageSource));
                }
                iter.remove();
            }
        }

        if (menuResource.isCanView() && !contain(aclSet, Operation.Type.view.name())) {
            Operation viewOperation = operationDao.getByCode(Operation.Type.view.name());
            setOperation2Resource(viewOperation, menuResource);
        }

        if (menuResource.isCanAdd() && !contain(aclSet, Operation.Type.add.name())) {
            Operation addOperation = operationDao.getByCode(Operation.Type.add.name());
            setOperation2Resource(addOperation, menuResource);
        }
        if (menuResource.isCanUpdate() && !contain(aclSet, Operation.Type.update.name())) {
            Operation updateOperation = operationDao.getByCode(Operation.Type.update.name());
            setOperation2Resource(updateOperation, menuResource);
        }
        if (menuResource.isCanDelete() && !contain(aclSet, Operation.Type.delete.name())) {
            Operation deleteOperation = operationDao.getByCode(Operation.Type.delete.name());
            setOperation2Resource(deleteOperation, menuResource);
        }
    }

    public static final void setOperation2Resource(Operation operation, Resource resource) {
        ACL acl = new ACL();
        acl.setResource(resource);
        acl.setOperation(operation);
        resource.getAcls().add(acl);
    }

    //--------------------业务方法用public,否则用private,但是除了依赖注入方法menuResource的显示,后台管理的级联授权的部分--------------------//
    /**
     * 根据上一级MenuId，根据当前用户，得到所有的一级孩子,并且过滤掉没有权限的菜单。
     * @param String menuid
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public List<MenuResource> getMenusByParentIdFilterByCurrentSubject(Long menuid) {
        List<MenuResource> menuResourceList = getSubMenuResourceListByResourceId(menuid);
        return filterMenuResourceByCurrentSubject(menuResourceList);
    };

    /**
     * 根据上一级MenuId，根据当前用户，得到所有的一级孩子,并且过滤掉没有权限的菜单。并且是带checkbox的acl
     * @param menuid
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public List<MenuResource> getMenusLoadOperationsByParentIdFilterByCurrentSubject(Long menuid) {
        List<MenuResource> filteredMenuList = getMenusByParentIdFilterByCurrentSubject(menuid);
        loadOperations(filteredMenuList);
        return filteredMenuList;
    };

    /**
     * 级联Menu：根据上一级MenuId，根据当前用户，得到所有的一级孩子,并且过滤掉没有权限的菜单。并且是带checkbox的acl
     * <b>注意:</b>由于这部分涉及到系统管理员admin，他建了一个menu后，是看不到的，因为还没有权限，故，admin有权限看到所有，也就是不过滤admin
     * @param menuid
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public List<MenuResource> getSubMenusCascadeLoadOperationsByParentIdFilterByCurrentSubject(Long menuid) {
        List<MenuResource> menuResourceList = getMenusLoadOperationsByParentIdFilterByCurrentSubject(menuid);
        for (MenuResource menu : menuResourceList) {
            List<MenuResource> subMenuResourceList = getSubMenusCascadeLoadOperationsByParentIdFilterByCurrentSubject(menu.getId());
            menu.setSubMenuResources(subMenuResourceList);
        }
        return menuResourceList;
    };

    /**
     * 级联Menu：根据上一级MenuId，根据当前用户，得到所有的一级孩子,并且过滤掉没有权限的菜单。不带checkbox,without operation
     * @param menuid
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public List<MenuResource> getSubMenusCascadeByParentIdFilterByCurrentSubject(Long menuid) {
        List<MenuResource> menuResourceList = getMenusByParentIdFilterByCurrentSubject(menuid);
        for (MenuResource menu : menuResourceList) {
            List<MenuResource> subMenuResourceList = getSubMenusCascadeByParentIdFilterByCurrentSubject(menu.getId());
            menu.setSubMenuResources(subMenuResourceList);
        }
        return menuResourceList;
    };

    ///===========================MenuResource的管理================================//
    /**
     * 根据resourceId(MenuResource 中的ID)得到下面的所有的MenuResource，不级联。
     * @param resourceId
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public List<MenuResource> getSubMenuResourceListByResourceId(Long resourceId) {
        if (null == resourceId || 0 == resourceId) {
            resourceId = null;
        }
        List<MenuResource> subMenuResourceList = jpaSupportDao.find(SUBMENUS_JPQL, CollectionUtils.newMap("resourceId", resourceId));
        return subMenuResourceList;
    };

    /**
     * 根据resourceId得到一个菜单的详细信息
     * @param resourceId
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public MenuResource getMenuResourceById(Long resourceId) {
        MenuResource menuResource = (MenuResource) jpaSupportDao.getEntityManager().find(MenuResource.class, resourceId);
        menuResource.loadParentName();
        menuResource.loadOperations2Properties();
        return menuResource;
    };

    /**
     * 保存，包括新增和修改
     * 注意：要saveParentId
     */
    @Transactional
    public MenuResource save(MenuResource menuResource) {
        //判断是add还是update
        if (null == menuResource.getId() || -1 == menuResource.getId()) {//add
            if (null != menuResource.getParentId()) {
                MenuResource parentMenuResource = (MenuResource) jpaSupportDao.getEntityManager().find(MenuResource.class, menuResource.getParentId());
                if (null != parentMenuResource) {
                    menuResource.setLeaf(false);
                }
            }
            addOperationProperties2Operations(menuResource);
            jpaSupportDao.getEntityManager().persist(menuResource);
        } else {//update
            MenuResource dbMenuResource = (MenuResource) jpaSupportDao.getEntityManager().find(MenuResource.class, menuResource.getId());
            //DozerUtils.copy(menuResource, dbMenuResource);//这个不好用,copy all
            BeanUtils.copyPropertiesByInclude(dbMenuResource, menuResource, new String[] { "code", "name", "description", "path", "iconCls", "buttonIconCls", "buttonScale", "buttonWidth", "buttonIconAlign", "quicktip", "idx", "leaf", "canView", "canAdd", "canUpdate", "canDelete" });
            updateOperationProperties2Operations(dbMenuResource);
            jpaSupportDao.getEntityManager().persist(dbMenuResource);
        }
        return menuResource;
    }

    /**
     * 删除，
     * 注意：是否要级联删除: 级联删除下属组织菜单。这个是通过MenuResource的pojo配置来实现的。
     */
    @Transactional
    public void delete(Long resourceId) {
        MenuResource menuResource = (MenuResource) jpaSupportDao.getEntityManager().find(MenuResource.class, resourceId);
        jpaSupportDao.getEntityManager().remove(menuResource);
    }

    /**
     * 机构的移动:逻辑是这样的：把sourceMenuResource的所有孩子，都放到sourceMenuResource.parent下。然后把sourceMenuResource放到destMenuResource下。
     */
    public void move(Long sourceResourceId, Long destResourceId) {
        MenuResource sourceMenu = (MenuResource) jpaSupportDao.getEntityManager().find(MenuResource.class, sourceResourceId);
        MenuResource destMenu = (MenuResource) jpaSupportDao.getEntityManager().find(MenuResource.class, destResourceId);

        //把sourceMenu的所有孩子，都放到sourceMenu.parent下
        MenuResource sourceParentMenu = sourceMenu.getParent();
        sourceParentMenu.getSubMenuResources().addAll(sourceMenu.getSubMenuResources());
        for (MenuResource son : sourceMenu.getSubMenuResources()) {
            son.setParent(sourceParentMenu);
        }

        //然后把sourceMenu放到destMenu下。
        sourceMenu.setSubMenuResources(null);
        sourceMenu.setParent(destMenu);
        destMenu.setLeaf(false);
        destMenu.getSubMenuResources().add(sourceMenu);

        //保存sourceParentMenu, destMenu
        jpaSupportDao.getEntityManager().persist(sourceParentMenu);
        jpaSupportDao.getEntityManager().persist(destMenu);
    };
}
