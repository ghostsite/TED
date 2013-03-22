package com.ted.xplatform.web;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;
import com.ted.common.exception.BusinessException;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.extjs4.tree.CheckNode;
import com.ted.common.support.extjs4.tree.TreeNode;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.Type;
import com.ted.xplatform.service.TypeService;

/**
 * Type的Controller
 */
@Controller
@RequestMapping(value = "/type/*")
public class TypeController {
    final Logger logger = LoggerFactory.getLogger(TypeController.class);

    @Inject
    TypeService  typeService;
    
    @Inject
    MessageSource     messageSource;
    
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 系统管理->基础类型数据管理：显示左边的菜单,注意是带角色过滤的.
     * @param typeId
     * @return getSubTypeListByTypeId
     * 
     */
    @RequiresAuthentication
    @RequestMapping(value = "/getSubTypeListByTypeId", method = RequestMethod.GET)
    public @ResponseBody
    List<TreeNode> getSubTypeListByTypeId(@RequestParam(required = true) Long typeId) {
        List<Type> subTypeList = typeService.getSubTypeListByTypeId(typeId);
        return DozerUtils.mapList(subTypeList, TreeNode.class);
    };
    
    /**
     * 系统管理->基础类型数据管理：显示左边的菜单,注意是带角色过滤的.
     * @param typeId
     * @return getSubTypeListByTypeId
     * 如果是叶子，则带 check
     * 
     */
    @RequiresAuthentication 
    @RequestMapping(value = "/getSubTypeListWithLeafCheckByTypeId/{typeId}", method = RequestMethod.POST)
    public @ResponseBody
    List<TreeNode> getSubTypeListWithLeafCheckByTypeId(@PathVariable Long typeId) {
        List<Type> subTypeList = typeService.getSubTypeListByTypeId(typeId);
        List<TreeNode> treeNodeList = Lists.newArrayList();
        for(Type type: subTypeList){
            if(type.isLeaf()){
                treeNodeList.add(DozerUtils.map(type, CheckNode.class));
            }else{
                treeNodeList.add(DozerUtils.map(type, TreeNode.class));
            }
        }
        return treeNodeList;//DozerUtils.mapList(subTypeList, TreeNode.class);
    };
    
    @RequiresAuthentication 
    @RequestMapping(value = "/getSubTypeListWithLeafCheckByTypeId", method = RequestMethod.POST)
    public @ResponseBody
    List<TreeNode> getSubTypeListWithLeafCheckByTypeId() {
       return getSubTypeListWithLeafCheckByTypeId(null);
    };

    /**
     * 系统管理->基础类型数据管理：获得一个Type的详细信息，右边的FormPanel
     * @param typeId
     * @return Map<String, Object>
     */
    @RequestMapping(value = "/getTypeById")
    public @ResponseBody
    Map<String, Object> getTypeById(@RequestParam(required = true) Long typeId) {
        Type type = typeService.getTypeById(typeId);
        return JsonUtils.getJsonMap(type);
    };

    /**
     * 系统管理->基础类型数据管理：获得一个机构父亲的typeId , typeName详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getTypeAsSuperInfoById")
    public @ResponseBody
    Map<String, Object> getTypeAsSuperInfoById(@RequestParam(required = true) Long typeId) {
        Type type = typeService.getTypeById(typeId);
        Type newType = new Type();
        //newType.setId(-1L); //this is hack ,否则页面显示不出来。
        newType.setParent(type);
        if (null != type) {
            newType.setParentName(type.getName());
            newType.setParentId(type.getId());
        }
        return JsonUtils.getJsonMap(newType);
    };

    /**
     * 系统管理->基础类型数据管理：保存
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(Type type) {
        typeService.save(type);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->组织机构管理：delete
     * @param typeId
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam(required = true) Long typeId) {
    	//here ,need to check 子信息，比如子类型(Type)
        List<Type> subTypeList = typeService.getSubTypeListByTypeId(typeId);
        if (CollectionUtils.isNotEmpty(subTypeList)) {
            //return new ExtMsg(false, "还有子类型，请先删除.").toString();
            throw new BusinessException(SpringUtils.getMessage("message.common.hasSubTypes", messageSource));
        }
        typeService.delete(typeId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

    //------------------------以下给前台使用-------------------------//
    /**
     * 前台：根据code得到下级，不级联，不翻页
     * @param code
     * @return getSubTypeListByCode
     */
    @RequiresAuthentication
    @RequestMapping(value = "/getSubTypeListByCode")
    public @ResponseBody
    List<Type> getSubTypeListByCode(@RequestParam(required = true) String code) {
        List<Type> subTypeList = typeService.getSubTypeListByCode(code);
        return subTypeList;
    };

    @RequiresAuthentication
    @RequestMapping(value = "/getSubTypeListById")
    public @ResponseBody
    List<Type> getSubTypeListById(@RequestParam(required = true) Long id) {
        List<Type> subTypeList = typeService.getSubTypeListById(id);
        return subTypeList;
    };
}
