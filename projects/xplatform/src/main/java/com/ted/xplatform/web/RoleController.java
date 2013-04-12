package com.ted.xplatform.web;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.Constants;
import com.ted.common.exception.BusinessException;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.extjs4.menu.Item;
import com.ted.common.support.extjs4.menu.Menu;
import com.ted.common.support.extjs4.menu.MenuUtil;
import com.ted.common.support.extjs4.tree.CheckTreeNodeWithChildren;
import com.ted.common.support.extjs4.tree.TreeNode;
import com.ted.common.util.CollectionUtils;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.FileResource;
import com.ted.xplatform.pojo.common.MenuResource;
import com.ted.xplatform.pojo.common.Operation;
import com.ted.xplatform.pojo.common.PageResource;
import com.ted.xplatform.pojo.common.Resource;
import com.ted.xplatform.pojo.common.Role;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.pojo.common.WidgetResource;
import com.ted.xplatform.service.RoleService;
import com.ted.xplatform.util.ACLUtils;
import com.ted.xplatform.util.PlatformUtils;

@Controller
@RequestMapping(value = "/role/*")
@SuppressWarnings("all")
public class RoleController {
    final Logger  logger = LoggerFactory.getLogger(RoleController.class);

    @Inject
    RoleService   roleService;

    @Inject
    MessageSource messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @Inject
    private NamedParameterJdbcTemplate namedJdbcTemplate;

    public void setRoleService(RoleService roleService) {
        this.roleService = roleService;
    }

    public void setNamedJdbcTemplate(NamedParameterJdbcTemplate namedJdbcTemplate) {
        this.namedJdbcTemplate = namedJdbcTemplate;
    }

    //------------------------------以下是针对角色的级联授权------------------------------//
    /**
     * for HierarchicalAuthority.js 
     * 列出当前用户所拥有的RoleList，包括下级。组成一个菜单。Menu, CheckItem
     */
    @RequestMapping(value = "/getRolesCascadeByRoleList")
    public @ResponseBody
    Menu<Item> getRolesCascadeByCurrentUserRoleList() {
        Menu<Item> menu = roleService.getRolesCascadeByCurrentUserRoleList();
        MenuUtil.addCheckAllAndSeparatorItemCascade(menu);
        MenuUtil.moveId2BeanId(menu);
        return menu;
    };

    /**
     * for HierarchicalAuthority.js
     * 列出角色拥有的针对资源的operation列表
     */
    @RequestMapping(value = "/getRoleHasOperationListToResourceId")
    public @ResponseBody
    List<Operation> getRoleHasOperationListToResourceId(Long roleId, Long resourceId) {
        return roleService.getRoleHasOperationListToResourceId(roleId, resourceId);
    };

    /**
     * for HierarchicalAuthority.js
     * 列出角色拥有的针对资源的operation列表
     */
    @RequestMapping(value = "/getRoleHasACLList")
    public @ResponseBody
    List<Map<String, Object>> getRoleHasACLList(Long roleId) {
        List<ACL> aclList = roleService.getRoleHasACLList(roleId);
        
        //set acl type for 显示
        for(ACL acl :aclList){
            Resource res = acl.getResource();
            if(res instanceof MenuResource){
                acl.setType(MenuResource.TYPE);
            }else if(res instanceof FileResource){
                acl.setType(FileResource.TYPE);
            }else if(res instanceof PageResource){
                acl.setType(PageResource.TYPE);
            }else if(res instanceof WidgetResource){
                acl.setType(WidgetResource.TYPE);
            }
        }
        
        return ACLUtils.acl2MapList(aclList);
    };

    /**
     * 保存一个角色对应的所有的权限：ACL 
     */
    @RequestMapping(value = "/saveRoleToAcls")
    public @ResponseBody
    String saveRoleToAcls(@RequestParam Long roleId, @RequestParam Collection<Long> aclIds) {
        roleService.saveRoleToAcls(roleId, aclIds);
        return Constants.SUCCESS_JSON;
    };

    //-------------------------------一下是针对角色管理--------------------------------------//
    /**
     * 系统管理->角色管理：显示左边的菜单,注意是带角色过滤的.
     * @param roleId
     * @return getSubTypeListByRoleId
     */
    @RequestMapping(value = "/getSubRoleListByRoleId")
    public @ResponseBody
    List<TreeNode> getSubRoleListByRoleId(@RequestParam(required = true) Long roleId) {
        List<Role> subRoleList = roleService.getSubRoleListByRoleId(roleId);
        return DozerUtils.mapList(subRoleList, TreeNode.class);
    };

    /**
     * 系统管理->角色管理：获得一个Type的详细信息，右边的FormPanel
     * @param roleId
     * @return
     */
    @RequestMapping(value = "/getRoleById")
    public @ResponseBody
    Map<String, Object> getRoleById(@RequestParam(required = true) Long roleId) {
        Role role = roleService.getRoleById(roleId);
        return JsonUtils.getJsonMap(role);
    };

    /**
     * 系统管理->角色管理：获得一个机构父亲的roleId , typeName详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getRoleAsSuperInfoById")
    public @ResponseBody
    Map<String, Object> getRoleAsSuperInfoById(@RequestParam(required = true) Long roleId) {
        Role role = roleService.getRoleById(roleId);
        Role newRole = new Role();
        //newRole.setId(-1L); //this is hack ,否则页面显示不出来。
        newRole.setParent(role);
        if (role != null) {
            newRole.setParentId(role.getId());
            newRole.setParentName(role.getName());
        }
        return JsonUtils.getJsonMap(newRole);
    };

    /**
     * 系统管理->角色管理：保存
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(Role role) {
        roleService.save(role);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->角色管理：delete
     * @param roleId
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam(required = true) Long roleId) {
        //check has sub menus
        List<Role> subRoleList = roleService.getSubRoleListByRoleId(roleId);
        if (org.apache.commons.collections.CollectionUtils.isNotEmpty(subRoleList)) {
            throw new BusinessException(SpringUtils.getMessage("message.common.hasSubRoles", messageSource));
        }
        
        roleService.delete(roleId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

    /**
     * 用户的查询，根据一个角色查询下面所以，不分页
     */
    @RequestMapping(value = "/getUserListByRoleId")
    public @ResponseBody
    List<User> getUserListByRoleId(@RequestParam(required = true) Long roleId) {
        List<User> userList = roleService.getUserListByRoleId(roleId);
        return userList;
        //return JsonUtils.listToPage(userList);
    };

    /**
     * 保存一个角色下：这些用户
     */
    @RequestMapping(value = "/saveRoleHasUsers")
    public @ResponseBody
    String saveRoleHasUsers(@RequestParam Long roleId, @RequestParam(required = false) Collection<Long> userIds) {
        roleService.saveRoleHasUsers(roleId, userIds);
        return Constants.SUCCESS_JSON;
    };

    /**
     * 保存一个用户下的这些角色
     */
    @RequestMapping(value = "/saveUserHasRoles")
    public @ResponseBody
    String saveUserHasRoles(@RequestParam Long userId, @RequestParam(required=false) Collection<Long> roleIds) {
        roleService.saveUserHasRoles(userId, roleIds);
        return Constants.SUCCESS_JSON;
    };

    //用户角色分配模块：显示右边的角色Tree,注意是带角色过滤的.连带权限的leaf append to menu
    @RequestMapping(value = "/getCurrentUserBiggestSetRoleCascadeWithCheckBox")
    public @ResponseBody
    List<CheckTreeNodeWithChildren> getCurrentUserBiggestSetRoleCascadeWithCheckBox() {
        Serializable userId = PlatformUtils.getCurrentUser().getId();
        Set<Role> roleSet = roleService.getBiggestSetRoleCascade(userId);
        List<CheckTreeNodeWithChildren> treeNodeList = DozerUtils.mapList(roleSet, CheckTreeNodeWithChildren.class);
        return treeNodeList;
    };

    /**
     * 选择用户拥有的角色，为checkbox做准备。用户角色分配模块
     */
    @RequestMapping(value = "/getUserRolesCheckedData", method = RequestMethod.GET)
    public @ResponseBody
    List<Map<String, Object>> getUserRolesCheckedData(@RequestParam(required = true) Long userId) {
        Map<String, Object> para = CollectionUtils.newMap("userId", userId);
        String sql = "select r.name,r.id,u.user_name as userName, 1 checked from role r inner join user_role ur on r.id=ur.role_id inner join users u on u.id=ur.user_id where u.id=:userId";
        List<Map<String, Object>> list = this.namedJdbcTemplate.queryForList(sql, para);
        return list;
    };

}
