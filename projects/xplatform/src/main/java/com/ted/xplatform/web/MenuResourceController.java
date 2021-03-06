package com.ted.xplatform.web;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.ServletContext;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PropertyComparator;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.ted.common.Constants;
import com.ted.common.exception.BusinessException;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.extjs4.tree.CheckTreeNodeWithChildren2;
import com.ted.common.support.extjs4.tree.TreeNode;
import com.ted.common.support.extjs4.tree.TreeNodeUtil;
import com.ted.common.support.extjs4.tree.TreeNodeWithChildren;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.MenuResource;
import com.ted.xplatform.service.MenuResourceService;
import com.ted.xplatform.util.PlatformUtils;

@Controller
@RequestMapping(value = "/menuresource/*")
@SuppressWarnings("all")
public class MenuResourceController implements ServletContextAware {
    final Logger           logger = LoggerFactory.getLogger(MenuResourceController.class);

    @Inject
    MenuResourceService    menuResourceService;

    @Inject
    MessageSource          messageSource;

    private ServletContext servletContext;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setMenuResourceService(MenuResourceService menuResourceService) {
        this.menuResourceService = menuResourceService;
    };

    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    //-------------------后台管理的分级授权的显示--------------------//
    //分级授权：显示左边的菜单,注意是带角色过滤的.
    @RequestMapping(value = "/getMenusByIdFilterByRole")
    public @ResponseBody
    List<TreeNode> getMenusByIdFilterByRole(@RequestParam Long resourceId) {
        List<MenuResource> menuResourceList = menuResourceService.getMenusByParentIdFilterByCurrentSubject(resourceId);
        return DozerUtils.mapList(menuResourceList, TreeNode.class);
    };

    //分级授权：显示左边的菜单,注意是带角色过滤的.连带权限的leaf append to menu
    @RequestMapping(value = "/getSubMenusCascadeFilterByRoleWithACLCheckBox")
    public @ResponseBody
    List<CheckTreeNodeWithChildren2> getSubMenusCascadeFilterByRoleWithACLCheckBox(@RequestParam Long resourceId) {//menuid=resourceId is parent_id
        List<MenuResource> menuResourceList = menuResourceService.getSubMenusCascadeLoadOperationsByParentIdFilterByCurrentSubject(resourceId);
        List<CheckTreeNodeWithChildren2> treeNodeList = DozerUtils.mapList(menuResourceList, CheckTreeNodeWithChildren2.class);
        TreeNodeUtil.setChildrenNotLeafCascade(treeNodeList);
        TreeNodeUtil.setChildren2LeafCascade(treeNodeList);
        TreeNodeUtil.moveChildren2ToChildrenCascade(treeNodeList);
        return treeNodeList;
    };

    //-------------------前台展现-------------------//
    /**
     * 根据用户的角色，展示应有的菜单 
     */
    @RequestMapping(value = "/getCurrentUserMenusCascade/{menuid}")
    public @ResponseBody
    List<TreeNodeWithChildren> getCurrentUserMenusCascade(@PathVariable() Long menuid) {
        List<MenuResource> menuResourceList = menuResourceService.getSubMenusCascadeByParentIdFilterByCurrentSubject(menuid);
        List<TreeNodeWithChildren> treeNodeList = DozerUtils.mapList(menuResourceList, TreeNodeWithChildren.class);
        return treeNodeList;
    };

    /**
     * 由于PathVariable不能为空，故只能写2个方法
     * @return
     */
    @RequestMapping(value = "/getCurrentUserMenusCascade")
    public @ResponseBody
    List<TreeNodeWithChildren> getCurrentUserMenusCascade() {
        return getCurrentUserMenusCascade(null);
    };

    /**
     * 根据用户的角色，展示应有的菜单 ghostzhang 20121130 for favorite
     * change from goshen menuresourcecontroller.java
     */
    @RequestMapping(value = "/getCurrentUserFavoriteMenusCascade")
    public @ResponseBody
    List<TreeNode> getCurrentUserFavoriteMenusCascade() {
        List<MenuResource> menuResourceList = menuResourceService.getSubMenusCascadeByParentIdFilterByCurrentSubject(null);
        List<MenuResource> favoriteList = PlatformUtils.getFavorite(menuResourceList);//

        //升序排序
        PropertyComparator.sort(favoriteList, new MutableSortDefinition("idx", true, true));

        List<TreeNode> favoriteMenuList = DozerUtils.mapList(favoriteList, TreeNode.class);

        return favoriteMenuList;
    };

    /**
     * 一级菜单，主要是为手风琴的panel是否添加使用的，然后再根据这些一级菜单的Id，调用getCurrentUserMenusCascade()方法，如上。 
     */
    @RequestMapping(value = "/getCurrentUserLevel1Menus")
    public @ResponseBody
    List<TreeNode> getCurrentUserLevel1Menus() {
        List<MenuResource> menuResourceList = menuResourceService.getMenusByParentIdFilterByCurrentSubject(null);
        List<TreeNode> treeNodeList = DozerUtils.mapList(menuResourceList, TreeNode.class);
        return treeNodeList;
    };

    @RequestMapping(value = "/getMenuIconList/{size}")
    public @ResponseBody
    List<Map> getMenuIconList(@PathVariable Long size) throws IOException {
        return getMenuIcons("_" + size);
    }

    //for combobox in 后台管理页面
    protected List<Map> getMenuIcons(final String filter) throws IOException {
        String path = "resources/image/menuIcon/";
        ServletContextResource contextResource = new ServletContextResource(servletContext, path);
        File[] files = contextResource.getFile().listFiles(new FilenameFilter() {
            public boolean accept(File dir, String name) {
                if (name.indexOf(filter) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        List<Map> list = Lists.newArrayList();
        for (File file : files) {
            Map icon = Maps.newHashMap();
            String fileName = file.getName();
            icon.put("path", "image/menuIcon/" + fileName);
            icon.put("shortpath", fileName);

            list.add(icon);
        }
        return list;
    }

    //-------------------后台管理--------------------//
    /**
     * 系统管理->菜单管理：显示左边的菜单,注意是带角色过滤的.
     */
    @RequestMapping(value = "/getSubMenuResourceListByResourceId")
    public @ResponseBody
    List<TreeNode> getSubMenuResourceListByResourceId(@RequestParam(required = true) Long resourceId) {
        List<MenuResource> subMenuResourceList = menuResourceService.getSubMenuResourceListByResourceId(resourceId);
        return DozerUtils.mapList(subMenuResourceList, TreeNode.class);
    };

    /**
     * 系统管理->菜单管理：获得一个菜单的详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getMenuResourceById")
    public @ResponseBody
    Map<String, Object> getMenuResourceById(@RequestParam Long resourceId) {
        MenuResource menuResource = menuResourceService.getMenuResourceById(resourceId);
        return JsonUtils.getJsonMap(menuResource);
    };

    /**
     * 系统管理->菜单管理：获得一个菜单父亲的menuId , menuName详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getMenuResourceAsSuperInfoById")
    public @ResponseBody
    Map<String, Object> getMenuResourceAsSuperInfoById(@RequestParam Long resourceId) {
        MenuResource menuResource = menuResourceService.getMenuResourceById(resourceId);
        MenuResource newMenu = new MenuResource();
        //newMenu.setId(-1L); //this is hack ,否则页面显示不出来。
        newMenu.setParent(menuResource);
        if (null != menuResource) {
            newMenu.setParentId(menuResource.getId());
            newMenu.setParentName(menuResource.getName());
        }
        return JsonUtils.getJsonMap(newMenu);
    };

    /**
     * 系统管理->菜单管理：保存
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(MenuResource menuResource) {
        menuResourceService.save(menuResource);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->菜单管理：delete
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam Long resourceId) {
        //check has sub menus
        List<MenuResource> subMenuResourceList = menuResourceService.getSubMenuResourceListByResourceId(resourceId);
        if (CollectionUtils.isNotEmpty(subMenuResourceList)) {
            throw new BusinessException(SpringUtils.getMessage("message.common.hasSubMenus", messageSource));
        }

        menuResourceService.delete(resourceId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

    /**
     * 系统管理->菜单管理：move 移动,tree drag and drop
     */
    @RequestMapping(value = "/move", method = RequestMethod.POST)
    public @ResponseBody
    String move(@RequestParam Long sourceResourceId, @RequestParam Long destResourceId) {
        menuResourceService.move(sourceResourceId, destResourceId);
        return Constants.SUCCESS_JSON;
    };

}
