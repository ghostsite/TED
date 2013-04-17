package com.ted.xplatform.web;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

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
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.MenuResource;
import com.ted.xplatform.pojo.common.PageResource;
import com.ted.xplatform.pojo.common.WidgetResource;
import com.ted.xplatform.service.PageResourceService;
import com.ted.xplatform.util.PlatformUtils;

@Controller
@RequestMapping(value = "/pageresource/*")
@SuppressWarnings("all")
public class PageResourceController {
    final Logger        logger = LoggerFactory.getLogger(PageResourceController.class);

    @Inject
    PageResourceService pageResourceService;

    @Inject
    MessageSource       messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setPageResourceService(PageResourceService pageResourceService) {
        this.pageResourceService = pageResourceService;
    };

    //-------------------后台管理的分级授权的显示--------------------//
    //分级授权：显示右边的菜单,注意是带角色过滤的.
    @RequestMapping(value = "/getPagesFilterByRole")
    public @ResponseBody
    List<TreeNode> getPagesFilterByRole() {
        List<PageResource> pageResourceList = pageResourceService.getPagesFilterByCurrentSubject();
        return DozerUtils.mapList(pageResourceList, TreeNode.class);
    };

    //分级授权：显示左边的菜单,注意是带角色过滤的.连带权限的leaf append to menu
    //这个是特定的二级目录，也就是page 带widget，这个方法是给分解授权用的。要展示page and widget with operations
    @RequestMapping(value = "/getPagesFilterByRoleWithACLCheckBox")
    public @ResponseBody
    List<CheckTreeNodeWithChildren2> getPagesFilterByRoleWithACLCheckBox() {
        List<PageResource> pageResourceList = pageResourceService.getPagesLoadOperationsFilterByCurrentSubject();
        List<CheckTreeNodeWithChildren2> treeNodeList = DozerUtils.mapList(pageResourceList, CheckTreeNodeWithChildren2.class);
        TreeNodeUtil.setChildrenNotLeafCascade(treeNodeList);
        TreeNodeUtil.setChildren2LeafCascade(treeNodeList);
        TreeNodeUtil.moveChildren2ToChildrenCascade(treeNodeList);
        return treeNodeList;
    };

    //-------------------前台展现-------------------//
    /**
     * 根据用户的角色，展示应有的PageResource 
     */
    @RequestMapping(value = "/getCurrentUserPages")
    public @ResponseBody
    List<TreeNodeWithChildren> getCurrentUserPages() {
        List<PageResource> pageResourceList = pageResourceService.getPagesFilterByCurrentSubject();
        List<TreeNodeWithChildren> treeNodeList = DozerUtils.mapList(pageResourceList, TreeNodeWithChildren.class);
        return treeNodeList;
    };

    //-------------------后台管理--------------------//
    /**
     * 系统管理->页面管理：显示左边的PageResource,注意是不带角色过滤的.
     */
    @RequestMapping(value = "/getPageResourceList")
    public @ResponseBody
    List<TreeNode> getPageResourceList() {
        List<PageResource> pageResourceList = pageResourceService.getPageResourceList();
        return DozerUtils.mapList(pageResourceList, TreeNode.class);
    };

    /**
     * 系统管理->页面管理：显示左边的PageResource,注意是带角色过滤的.
     */
    @RequestMapping(value = "/pagedPageResourceList")
    public @ResponseBody
    JsonPage<PageResource> pagedPageResourceList(int start, int limit) {
        JsonPage<PageResource> pageResourcePage = pageResourceService.pagedPageResourceList(start, limit);
        return pageResourcePage;
    };

    /**
     * 系统管理->页面管理：获得一个页面的详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getPageResourceById")
    public @ResponseBody
    Map<String, Object> getPageResourceById(@RequestParam Long resourceId) {
        PageResource pageResource = pageResourceService.getPageResourceById(resourceId);
        return JsonUtils.getJsonMap(pageResource);
    };

    /**
     * 系统管理->页面管理：保存
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(PageResource pageResource) {
        pageResourceService.save(pageResource);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->页面管理：delete
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam Long resourceId) {
        //check has sub menus
        PageResource pageResource = pageResourceService.getPageResourceById(resourceId);
        if (CollectionUtils.isNotEmpty(pageResource.getWidgets())) {
            throw new BusinessException(SpringUtils.getMessage("message.common.hasSubWidgets", messageSource));
        }

        pageResourceService.delete(resourceId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

    /**
     * hasController for UserInterface.js , if true then load controller.js for show page
     */
    @RequestMapping(value = "/hasController")
    @ResponseBody
    Boolean hasController(@RequestParam String pageCode) throws ExecutionException { //'SYS.view.admin.UserManage'
        return PageResourceService.hasController(pageCode);
    }

    /**
     * 获得当前登陆用户，对给定code的pageResoruce的权限列表(目前PageResource只有view权限)
     * 用在：当用户在地址栏中敲一个地址的时候，判断当前登陆用户是否可以看到这个页面。
     * 在UserInterface.js的方法中调用。
     * 返回Map<String, Object>而不是返回boolean是为了适用于CommunFunction.js 中的callServiceSync()方法
     */
    @RequestMapping(value = "/currentUserCanView")
    @ResponseBody
    Map<String, Object> currentUserCanView(@RequestParam String pageCode) throws ExecutionException { //'SYS.view.admin.UserManage'
        boolean b = pageResourceService.getResourceService().currentUserCanView(pageCode);
        return JsonUtils.getJsonMap(b);
    }

}
