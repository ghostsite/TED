package com.ted.xplatform.web;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.extjs4.tree.CheckTreeNodeWithChildren2;
import com.ted.common.support.extjs4.tree.TreeNode;
import com.ted.common.support.extjs4.tree.TreeNodeUtil;
import com.ted.common.support.extjs4.tree.TreeNodeWithChildren;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.UrlResource;
import com.ted.xplatform.service.UrlResourceService;

@Controller
@RequestMapping(value = "/urlresource/*")
@SuppressWarnings("all")
public class UrlResourceController {
    final Logger       logger = LoggerFactory.getLogger(UrlResourceController.class);

    @Inject
    UrlResourceService urlResourceService;

    @Inject
    MessageSource      messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setUrlResourceService(UrlResourceService urlResourceService) {
        this.urlResourceService = urlResourceService;
    };

    //-------------------后台管理的分级授权的显示--------------------//
    //分级授权：显示右边的菜单,注意是带角色过滤的.
    @RequestMapping(value = "/getUrlsFilterByRole")
    public @ResponseBody
    List<TreeNode> getUrlsFilterByRole() {
        List<UrlResource> urlResourceList = urlResourceService.getUrlsFilterByCurrentSubject();
        return DozerUtils.mapList(urlResourceList, TreeNode.class);
    };

    //分级授权：显示左边的菜单,注意是带角色过滤的.连带权限的leaf append to menu
    //这个是特定的二级目录，也就是page 带widget，这个方法是给分解授权用的。要展示page and widget with operations
    @RequestMapping(value = "/getUrlsFilterByRoleWithACLCheckBox")
    public @ResponseBody
    List<CheckTreeNodeWithChildren2> getUrlsFilterByRoleWithACLCheckBox() {
        List<UrlResource> urlResourceList = urlResourceService.getUrlsLoadOperationsFilterByCurrentSubject();
        List<CheckTreeNodeWithChildren2> treeNodeList = DozerUtils.mapList(urlResourceList, CheckTreeNodeWithChildren2.class);
        TreeNodeUtil.setChildrenNotLeafCascade(treeNodeList);
        TreeNodeUtil.setChildren2LeafCascade(treeNodeList);
        TreeNodeUtil.moveChildren2ToChildrenCascade(treeNodeList);
        return treeNodeList;
    };

    //-------------------前台展现-------------------//
    /**
     * 根据用户的角色，展示应有的PageResource 
     */
    @RequestMapping(value = "/getCurrentUserUrls")
    public @ResponseBody
    List<TreeNodeWithChildren> getCurrentUserUrls() {
        List<UrlResource> urlResourceList = urlResourceService.getUrlsFilterByCurrentSubject();
        List<TreeNodeWithChildren> treeNodeList = DozerUtils.mapList(urlResourceList, TreeNodeWithChildren.class);
        return treeNodeList;
    };

    //-------------------后台管理--------------------//
    /**
     * 系统管理->页面管理：显示左边的PageResource,注意是不带角色过滤的.
     */
    @RequestMapping(value = "/getUrlResourceList")
    public @ResponseBody
    List<TreeNode> getUrlResourceList() {
        List<UrlResource> urlResourceList = urlResourceService.getUrlResourceList();
        return DozerUtils.mapList(urlResourceList, TreeNode.class);
    };

    /**
     * 系统管理->页面管理：显示左边的UrlResource,注意是带角色过滤的.
     */
    @RequestMapping(value = "/pagedUrlResourceList")
    public @ResponseBody
    JsonPage<UrlResource> pagedUrlResourceList(int start, int limit) {
        JsonPage<UrlResource> urlResourcePage = urlResourceService.pagedUrlResourceList(start, limit);
        return urlResourcePage;
    };

    /**
     * 系统管理->页面管理：获得一个页面的详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getUrlResourceById")
    public @ResponseBody
    Map<String, Object> getUrlResourceById(@RequestParam Long resourceId) {
        UrlResource urlResource = urlResourceService.getUrlResourceById(resourceId);
        return JsonUtils.getJsonMap(urlResource);
    };

    /**
     * 系统管理->页面管理：保存
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(UrlResource urlResource) {
        urlResourceService.save(urlResource);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->页面管理：delete
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam Long resourceId) {
        //check has sub menus
        UrlResource urlResource = urlResourceService.getUrlResourceById(resourceId);
        urlResourceService.delete(resourceId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

}
