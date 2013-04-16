package com.ted.xplatform.web;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.inject.Inject;
import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ServletContextAware;

import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.extjs4.tree.CheckTreeNodeWithChildren2;
import com.ted.common.support.extjs4.tree.TreeNode;
import com.ted.common.support.extjs4.tree.TreeNodeUtil;
import com.ted.common.support.extjs4.tree.TreeNodeWithChildren;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.Operation;
import com.ted.xplatform.pojo.common.WidgetResource;
import com.ted.xplatform.service.WidgetResourceService;

@Controller
@RequestMapping(value = "/widgetresource/*")
@SuppressWarnings("all")
public class WidgetResourceController implements ServletContextAware {
    final Logger           logger = LoggerFactory.getLogger(WidgetResourceController.class);

    @Inject
    WidgetResourceService    widgetResourceService;

    @Inject
    MessageSource          messageSource;

    private ServletContext servletContext;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setWidgetResourceService(WidgetResourceService widgetResourceService) {
        this.widgetResourceService = widgetResourceService;
    };

    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    //-------------------后台管理的分级授权的显示--------------------//
    //分级授权：显示右边的菜单,注意是带角色过滤的.
    @RequestMapping(value = "/getWidgetsFilterByRole")
    public @ResponseBody
    List<TreeNode> getWidgetsFilterByRole(@RequestParam Long resourceId) {
        List<WidgetResource> widgetResourceList = widgetResourceService.getWidgetsByPageIdFilterByCurrentSubject(resourceId);
        return DozerUtils.mapList(widgetResourceList, TreeNode.class);
    };

    //分级授权：显示左边的WidgetResource,注意是带角色过滤的.连带权限的leaf append to menu
    @RequestMapping(value = "/getWidgetsFilterByRoleWithACLCheckBox")
    public @ResponseBody
    List<CheckTreeNodeWithChildren2> getWidgetsFilterByRoleWithACLCheckBox(@RequestParam Long resourceId) {
        List<WidgetResource> widgetResourceList = widgetResourceService.getWidgetsLoadOperationsByPageIdFilterByCurrentSubject(resourceId);
        List<CheckTreeNodeWithChildren2> treeNodeList = DozerUtils.mapList(widgetResourceList, CheckTreeNodeWithChildren2.class);
        TreeNodeUtil.setChildrenNotLeafCascade(treeNodeList);
        TreeNodeUtil.setChildren2LeafCascade(treeNodeList);
        TreeNodeUtil.moveChildren2ToChildrenCascade(treeNodeList);
        return treeNodeList;
    };

    //-------------------前台展现-------------------//
    /**
     * 根据用户的角色，展示应有的WidgetResource 
     */
    @RequestMapping(value = "/getCurrentUserWidgets/{resourceId}")
    public @ResponseBody
    List<TreeNodeWithChildren> getCurrentUserWidgets(@PathVariable() Long resourceId) {
        List<WidgetResource> widgetResourceList = widgetResourceService.getWidgetsByPageIdFilterByCurrentSubject(resourceId);
        List<TreeNodeWithChildren> treeNodeList = DozerUtils.mapList(widgetResourceList, TreeNodeWithChildren.class);
        return treeNodeList;
    };

    //-------------------后台管理--------------------//
    /**
     * 系统管理->页面管理：显示左边的WidgetResource,注意是带角色过滤的.
     */
    @RequestMapping(value = "/getWidgetResourceListByPageId")
    public @ResponseBody
    List<WidgetResource> getWidgetResourceListByPageId(@RequestParam(required = true) Long resourceId) {
        List<WidgetResource> widgetResourceList = widgetResourceService.getWidgetResourceListByPageId(resourceId);
        return widgetResourceList;
    };
    
    /**
     * 系统管理->页面管理：获得一个页面的详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getWidgetResourceById")
    public @ResponseBody
    Map<String, Object> getWidgetResourceById(@RequestParam Long resourceId) {
        WidgetResource widgetResource = widgetResourceService.getWidgetResourceById(resourceId);
        return JsonUtils.getJsonMap(widgetResource);
    };

    /**
     * 系统管理->Widget管理：保存
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(WidgetResource widgetResource) {
        widgetResourceService.save(widgetResource);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->页面管理：delete
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam Long resourceId) {
        //check has sub menus
        WidgetResource widgetResource = widgetResourceService.getWidgetResourceById(resourceId);
        widgetResourceService.delete(resourceId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };
    
    /**
     * 获得当前登陆用户，对给定code的widgetResoruce的权限列表
     * 在WidgetAuthorityPlugin.js init方法中调用。
     * 注意：是根据pageCode
     * Map<String, List<Operation>> : key is widget's itemId, List<Operation>是权限列表。
     * 受限于CommonFunction.js的callServiceSync的要求，只能最后包装一层。不能return acls directly.
     */
    @RequestMapping(value="/currentUserWidgetAcls")
    @ResponseBody
    Map<String, Object> currentUserWidgetAcls(@RequestParam String pageCode) throws ExecutionException{ //'SYS.view.admin.UserManage'
        Map<String, List<Operation>> acls = widgetResourceService.currentUserWidgetAcls(pageCode);
        return JsonUtils.getJsonMap(acls);
    }

}
