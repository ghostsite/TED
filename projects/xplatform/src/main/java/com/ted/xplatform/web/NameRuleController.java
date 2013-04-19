package com.ted.xplatform.web;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.exception.BusinessException;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.NameRule;
import com.ted.xplatform.pojo.common.NameRuleDateTime;
import com.ted.xplatform.pojo.common.NameRuleItem;
import com.ted.xplatform.pojo.common.NameRulePrefix;
import com.ted.xplatform.pojo.common.NameRuleSequence;
import com.ted.xplatform.pojo.common.NameRuleUserDef;
import com.ted.xplatform.service.NameRuleService;

@Controller
@RequestMapping(value = "/namerule/*")
@SuppressWarnings("all")
public class NameRuleController {
    final Logger    logger = LoggerFactory.getLogger(NameRuleController.class);

    @Inject
    NameRuleService nameRuleService;

    @Inject
    MessageSource   messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setNameRuleService(NameRuleService nameRuleService) {
        this.nameRuleService = nameRuleService;
    }

    //-------------------后台管理--------------------//
    /**
     * 系统管理->NameRule管理
     * 获得所有的NameRule
     */
    @RequestMapping(value = "/getNameRuleList")
    public @ResponseBody
    List<NameRule> getNameRuleList() {
        List<NameRule> nameRuleList = nameRuleService.getNameRuleList();
        return nameRuleList;
    };

    /**
     * 系统管理->NameRule管理,
     * 获得所有的NameRule
     */
    @RequestMapping(value = "/getNameRuleById")
    public @ResponseBody
    Map<String, Object> getNameRuleById(@RequestParam Long ruleId) {
        NameRule nameRule = nameRuleService.getNameRuleById(ruleId);
        return JsonUtils.getJsonMap(nameRule);
    };

    /**
     * 系统管理->根据ruleId获得所有的NameRuleItem
     */
    @RequestMapping(value = "/getNameRuleItemListByRuleId")
    public @ResponseBody
    List<NameRuleItem> getNameRuleItemListByRuleId(@RequestParam Long ruleId) {
        List<NameRuleItem> nameRuleItemList = nameRuleService.getNameRuleItemListByRuleId(ruleId);
        return nameRuleItemList;
    };

    /**
     * 系统管理->NameRuleItem管理,
     */
    @RequestMapping(value = "/getNameRuleItemById")
    public @ResponseBody
    Map<String, Object> getNameRuleItemById(@RequestParam Long ruleItemId) {
        NameRuleItem nameRuleDef = nameRuleService.getNameRuleItemById(ruleItemId);
        return JsonUtils.getJsonMap(nameRuleDef);
    };

    /**
     * 系统管理->NameRule管理：保存
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public @ResponseBody
    String save(NameRule nameRule) {
        nameRuleService.save(nameRule);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->NameRuleUserDef管理：保存
     */
    @RequestMapping(value = "/saveNameRuleUserDef", method = RequestMethod.POST)
    public @ResponseBody
    String saveNameRuleUserDef(NameRuleUserDef nameRuleUserDef) {
        nameRuleService.save(nameRuleUserDef);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->NameRuleUserPrefix管理：保存
     */
    @RequestMapping(value = "/saveNameRulePrefix", method = RequestMethod.POST)
    public @ResponseBody
    String saveNameRulePrefix(NameRulePrefix nameRulePrefix) {
        nameRuleService.save(nameRulePrefix);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->NameRuleDateTime管理：保存
     */
    @RequestMapping(value = "/saveNameRuleDateTime", method = RequestMethod.POST)
    public @ResponseBody
    String saveNameRuleDateTime(NameRuleDateTime nameRuleDateTime) {
        nameRuleService.save(nameRuleDateTime);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->NameRuleSequence管理：保存
     */
    @RequestMapping(value = "/saveNameRuleSequence", method = RequestMethod.POST)
    public @ResponseBody
    String saveNameRuleSequence(NameRuleSequence nameRuleSequence) {
        nameRuleService.save(nameRuleSequence);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->页面管理：delete
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam Long ruleId) {
        NameRule nameRule = nameRuleService.getNameRuleById(ruleId);
        if (CollectionUtils.isNotEmpty(nameRule.getRuleItems())) {
            throw BusinessException.create("message.common.hasNameRuleItem", messageSource);
        }

        nameRuleService.delete(ruleId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

    /**
     * 系统管理->管理：deleteNameRuleItem
     */
    @RequestMapping(value = "/deleteNameRuleItem", method = RequestMethod.POST)
    public @ResponseBody
    String deleteNameRuleItem(@RequestParam Long itemId) {
        nameRuleService.deleteNameRuleItem(itemId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };
    
    /**
     * 生成一个
     */
    @RequestMapping(value = "/generate")
    public @ResponseBody
    String generate(@RequestParam String ruleCode, @RequestParam String userDefs) {
        String newCode = nameRuleService.generate(ruleCode, StringUtils.split(userDefs,","));
        return JsonUtils.toJson(newCode);
    };

}
