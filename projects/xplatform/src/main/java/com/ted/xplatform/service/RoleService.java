package com.ted.xplatform.service;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.support.extjs4.menu.CheckItem;
import com.ted.common.support.extjs4.menu.Item;
import com.ted.common.support.extjs4.menu.Menu;
import com.ted.common.util.CollectionUtils;
import com.ted.common.util.DozerUtils;
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.Operation;
import com.ted.xplatform.pojo.common.Role;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.util.PlatformUtils;

/**
 * 角色的服务
 */
@Transactional
@Service("roleService")
public class RoleService {
    final Logger               logger        = LoggerFactory.getLogger(RoleService.class);
    //this is hack parentId can be null to set
    public static final String SUBROLES_JPQL = "from Role m where m.parent.id=:roleId or (m.parent.id is null and :roleId is null) order by m.idx asc";

    @Inject
    JdbcTemplateDao            jdbcTemplateDao;

    @Inject
    JpaSupportDao              jpaSupportDao;

    @Inject
    JpaTemplateDao             jpaTemplateDao;

    
    public void setJdbcTemplateDao(JdbcTemplateDao jdbcTemplateDao) {
        this.jdbcTemplateDao = jdbcTemplateDao;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    //-----------------工具方法-----------------//
    public Menu<Item> getRolesCascade(List<Role> roleList) {
        Menu<Item> menu = new Menu<Item>();
        for (Role role : roleList) {
            Menu<? super CheckItem> subMenu = getRolesCascade(role.getSubRoles());
            CheckItem checkItem = DozerUtils.map(role, CheckItem.class);
            checkItem.setMenu(subMenu);
            menu.addLastItem(checkItem);
        }
        return menu;
    };

    /**
     * 获得一个用户的最大Role的超集。初始化返回的所有的子集角色。
     */
    public Set<Role> getBiggestSetRoleCascade(Serializable userId) {
        User user = jpaSupportDao.getEntityManager().find(User.class, userId);
        Set<Role> filteredRoleSet = getBiggestSetRole(user.getRoleList());
        initSubRoleCascade(filteredRoleSet);
        return filteredRoleSet;
    };

    /**
     * 初始化所有的子角色
     * @param roles
     */
    public void initSubRoleCascade(Collection<Role> roles) {
        if (null == roles || roles.size() == 0) {
            return;
        }
        for (Role role : roles) {
            initSubRoleCascade(role.getSubRoles());
        }
    };

    /**
     * 获得一个用户的最大Role的超集。
     */
    public Set<Role> getBiggestSetRole(String userId) {
        User user = jpaSupportDao.getEntityManager().find(User.class, userId);
        return getBiggestSetRole(user.getRoleList());
    }

    /**
     * 得到role过滤最大后的结果集 
     */
    public Set<Role> getBiggestSetRole(List<Role> roles) {
        Set<Role> filteredRoleSet = Sets.newHashSet();
        for (Role role : roles) {
            filterSetByBigger(filteredRoleSet, role);
        }
        return filteredRoleSet;
    };

    /**
     * 过滤剩下最大的Role的集合，用在角色分配用户上。
     * 如果role比set中的任何一个都小，则不处理。
     * 如果大，则删除小的，放入大的。
     * 如果比不出来大小，则roleSet.add(role)
     */
    public void filterSetByBigger(Collection<Role> roleSet, Role role) {
        if (roleSet.size() == 0) {
            roleSet.add(role);
            return;
        }
        for (Role setRole : roleSet) {
            if (isSmaller(setRole, role)) {
                roleSet.remove(setRole);
                roleSet.add(role);
            } else if (isSmaller(role, setRole)) {

            } else {
                roleSet.add(role);
            }
        }
    };

    /**
     * pathThrough,getBigger的子方法, role1向上回溯，如果途径role2则返回true，否则返回false
     */
    public boolean isSmaller(Role role1, Role role2) {
        if (null == role1 || null == role2) {
            return false;
        }
        if (isRootRole(role1)) {
            return false;
        }
        if (role1.getId().equals(role2.getId())) {
            return true;
        }
        return isSmaller(role1.getParent(), role2);
    };

    /**
     * 判断是否是根
     */
    public boolean isRootRole(Role role) {
        if (null == role) {
            return false;
        }
        if (null == role.getId()) {
            return true;
        } else {
            return false;
        }
    };

    //--------------------以下是针对级联授权的方法：业务方法用public,否则用private,但是除了依赖注入方法--------------------//
    /**
     * 是RoleList开始，包含下面的Role,注意：是Lazy的
     */
    @Transactional(readOnly = true)
    public Menu<Item> getRolesCascadeByCurrentUserRoleList() {
        User currentUser = PlatformUtils.getCurrentUser();
        User user = jpaSupportDao.getEntityManager().find(User.class, currentUser.getId());
        return getRolesCascade(user.getRoleList());
    };

    /**
     * 根据角色返回此角色拥有的针对资源的权限列表
     */
    @Transactional(readOnly = true)
    public List<Operation> getRoleHasOperationListToResourceId(Long roleId, Long resourceId) {
        Assert.notNull(roleId);
        Assert.notNull(resourceId);
        Role role = jpaSupportDao.getEntityManager().find(Role.class, roleId);
        List<ACL> aclList = role.getAcls();
        List<Operation> operationList = Lists.newArrayList();
        for (ACL acl : aclList) {
            if (resourceId.equals(acl.getResourceId())) {
                operationList.add(acl.getOperation());
            }
        }
        return operationList;
    };

    /**
     * 返回角色拥有的ACL：即对XX资源拥有XX操作的1:1的列表
     */
    @Transactional(readOnly = true)
    public List<ACL> getRoleHasACLList(Long roleId) {
        Assert.notNull(roleId);
        Role role = jpaSupportDao.getEntityManager().find(Role.class, roleId);
        List<ACL> aclList = role.getAcls();
        return aclList;
        //        for(ACL acl:aclList){//for lazy 其实不用：因为是EAGER
        //            acl.getResouce().getId();
        //            acl.getOperation().getId();
        //        }
        // return new ArrayList();
    };

    /**
     *  保存一个角色对应的所有的权限：ACL 
     */
    public void saveRoleToAcls(Long roleId, Collection<Long> aclIds) {
        Role role = jpaSupportDao.getEntityManager().find(Role.class, roleId);
        role.getAcls().clear();
        for (Long aclId : aclIds) {
            ACL acl = jpaSupportDao.getEntityManager().find(ACL.class, aclId);
            if (null != acl) {
                role.getAcls().add(acl);
            }
        }
        jpaSupportDao.getEntityManager().persist(role);
    };

    //---------------------------------以下是针对角色的管理----------------------------------------//
    /**
     * 根据roleId得到下面的所有的Role，不级联。
     */
    @Transactional(readOnly = true)
    public List<Role> getSubRoleListByRoleId(Long roleId) {
        Map<String, Object> newMap = CollectionUtils.newMap("roleId", roleId);
        List<Role> subRoleList = jpaSupportDao.find(SUBROLES_JPQL, newMap);
        return subRoleList;
    };

    /**
     * 根据roleId得到一个Role的详细信息
     * @param roleId
     * @return List<Role>
     */
    @Transactional(readOnly = true)
    public Role getRoleById(Serializable roleId) {
        Role role = jpaSupportDao.getEntityManager().find(Role.class, roleId);
        role.loadParentName();
        return role;
    };

    /**
     * 保存，包括新增和修改
     * 注意：要saveParentId
     */
    @Transactional
    public Role save(Role role) {
        Role parentRole = jpaSupportDao.getEntityManager().find(Role.class, role.getParentId());
        if (null == parentRole) {
            role.setParent(null);
        }
        role.setParent(parentRole);
        jpaSupportDao.getEntityManager().merge(role);
        return role;
    }

    /**
     * 删除，
     * 注意：是否要级联删除:不删除用户，users.parent_id = null, 级联删除下属Role。这个是通过Role的pojo配置来实现的。
     */
    @Transactional
    public void delete(Long roleId) {
        Role role = jpaSupportDao.getEntityManager().find(Role.class, roleId);
        jpaSupportDao.getEntityManager().remove(role);
    }

    /**
     * 查询一个角色下的用户,给用户非配角色使用的。
     */
    @Transactional(readOnly = true)
    public List<User> getUserListByRoleId(Long roleId) {
        Role role = jpaSupportDao.findByIdWithDepth(Role.class, roleId, "users");
        List<User> userList = role.getUsers();
        return userList;
    };

    /**
     * 保存一个角色下：这些用户
     */
    @Transactional
    public void saveRoleHasUsers(Long roleId, Collection<Long> userIds) {
        Role role = jpaSupportDao.getEntityManager().find(Role.class, roleId);
        role.getUsers().clear();
        if (userIds != null) {
            for (Long userId : userIds) {
                User user = jpaSupportDao.getEntityManager().find(User.class, userId);
                if (!user.getRoleList().contains(role)) {
                    user.getRoleList().add(role);
                }
                role.getUsers().add(user);
            }
        }
        jpaSupportDao.getEntityManager().merge(role);
    }

    /**
     * 保存一个用户下：这些角色.
     * 这个操作比较复杂，不同于saveRoleHasUsers()，因为要控制关系的主控方。也就是Role，而不是User。因为配置的User就不控制关系表的。因为它配置了mappedBy.
     */
    @Transactional
    public void saveUserHasRoles(Long userId, Collection<Long> roleIds) {
        User user = jpaSupportDao.getEntityManager().find(User.class, userId);
        List<Role> dbRoleList = user.getRoleList();
        for (Long roleId : roleIds) {
            Role role = jpaSupportDao.getEntityManager().find(Role.class, roleId);
            if (dbRoleList.contains(role)) {
                dbRoleList.remove(role);
            } else {
                role.getUsers().add(user);
                jpaSupportDao.getEntityManager().merge(role);
            }
        }
        for (Role role : dbRoleList) {
            role.getUsers().remove(user);
            jpaSupportDao.getEntityManager().merge(role);
        }
    };

    /**
     * 级联Menu：根据上一级MenuId，根据当前用户，得到所有的一级孩子,并且过滤掉没有权限的菜单。并且是带checkbox的acl
     * @param menuid
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public List<Role> getSubRolesCascadeFilterByRoleWithCheckBox(Serializable roleId) {
        List<Role> roleList = getRoleById(roleId).getSubRoles();
        for (Role role : roleList) {
            List<Role> subRoleeList = getSubRolesCascadeFilterByRoleWithCheckBox(role.getId());
            role.setSubRoles(subRoleeList);
        }
        return roleList;
    };

}
