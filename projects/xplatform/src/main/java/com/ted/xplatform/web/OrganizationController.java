package com.ted.xplatform.web;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.Constants;
import com.ted.common.exception.BusinessException;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.extjs4.tree.TreeNode;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.Organization;
import com.ted.xplatform.service.OrganizationService;

/**
 * 组织机构的Controller
 */
@Controller
@RequestMapping(value = "/organization/*")
public class OrganizationController {
    final Logger        logger = LoggerFactory.getLogger(OrganizationController.class);

    @Inject
    OrganizationService organizationService;
    
    @Inject
    MessageSource     messageSource;
    
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 系统管理->组织机构管理：显示左边的菜单,注意是带角色过滤的.
     * @param orgId
     * @return
     */
    @RequestMapping(value = "/getSubOrgListByOrgId")
    public @ResponseBody
    List<TreeNode> getSubOrgListByOrgId(@RequestParam(required = true) Long orgId) {
        List<Organization> subOrgList = organizationService.getSubOrgListByOrgId(orgId);
        return DozerUtils.mapList(subOrgList, TreeNode.class);
    };

    /**
     * 系统管理->组织机构管理：获得一个机构的详细信息，右边的FormPanel
     * @param orgId
     * @return
     */
    @RequestMapping(value = "/getOrgById")
    public @ResponseBody
    Map<String, Object> getOrgById(@RequestParam(required = true) Long orgId) {
        Organization org = organizationService.getOrgById(orgId);
        return JsonUtils.getJsonMap(org);
    };

    /**
     * 系统管理->组织机构管理：获得一个机构父亲的orgId , orgName详细信息，右边的FormPanel
     * @param orgId
     * @return
     */
    @RequestMapping(value = "/getOrgAsSuperInfoById")
    public @ResponseBody
    Map<String, Object> getOrgAsSuperInfoById(@RequestParam(required = true) Long orgId) {
        Organization org = organizationService.getOrgById(orgId);
        Organization newOrg = new Organization();
        //newOrg.setId(-1L); //this is hack ,否则页面显示不出来。
        newOrg.setParent(org);
        newOrg.setParentName(org.getName());
        return JsonUtils.getJsonMap(newOrg);
    };

    /**
     * 系统管理->组织机构管理：保存
     * @param org
     * @return
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(Organization org) {
        organizationService.save(org);
        return new JsonOut("保存成功!").toString();
    };

    /**
     * 系统管理->组织机构管理：delete
     * @param orgId
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam(required = true) Long orgId) {//here ,need to check 子信息，比如人员和子机构。因为有外键，如果不检查，直接删除org，则会db层报错。
        //1 check subOrgs
        List<Organization> subOrgList = organizationService.getSubOrgListByOrgId(orgId);
        if (CollectionUtils.isNotEmpty(subOrgList)) {
            //return new ExtMsg(false, "还有子部门，请先删除.").toString();
            throw new BusinessException(SpringUtils.getMessage("message.common.hasSubOrgs", messageSource));
        }
        //1 check men
        Organization org = organizationService.getOrgById(orgId);
        if (org != null && CollectionUtils.isNotEmpty(org.getUsers())) {
            //return new ExtMsg(false, "还有人员信息，请先删除.").toString();
            throw new BusinessException(SpringUtils.getMessage("message.common.hasSubUsers", messageSource));
        }

        organizationService.delete(orgId);
        return Constants.SUCCESS_JSON;
    };

    /**
     * 系统管理->组织机构管理：move 移动,tree drag and drop
     * @param sourceOrgId
     * @param destOrgId
     * @return
     */
    @RequestMapping(value = "/move", method = RequestMethod.POST)
    public @ResponseBody
    String move(@RequestParam(required = true) Long sourceOrgId, @RequestParam(required = true) Long destOrgId) {
        organizationService.move(sourceOrgId, destOrgId);
        return Constants.SUCCESS_JSON;
    };
}
