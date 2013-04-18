package com.ted.xplatform.web;

import java.util.List;

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

import com.ted.common.exception.BusinessException;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.NameRule;
import com.ted.xplatform.pojo.common.NameRuleDefine;
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
     * 系统管理->NameRule管理
     * 获得所有的NameRule
     */
    @RequestMapping(value = "/getNameRuleById")
    public @ResponseBody
    NameRule getNameRuleById(@RequestParam Long ruleId) {
        NameRule nameRule = nameRuleService.getNameRuleById(ruleId);
        return nameRule;
    };

    /**
     * 系统管理->根据ruleId获得所有的NameRuleDefine
     */
    @RequestMapping(value = "/getNameRuleDefineListByRuleId")
    public @ResponseBody
    List<NameRuleDefine> getNameRuleDefineListByRuleId(@RequestParam Long ruleId) {
        List<NameRuleDefine> nameRuleDefineList = nameRuleService.getNameRuleDefineListByRuleId(ruleId);
        return nameRuleDefineList;
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
     * 系统管理->NameRule管理：保存
     */
    @RequestMapping(value = "/saveNameRuleDefine", method = RequestMethod.POST)
    public @ResponseBody
    String saveNameRuleDefine(NameRuleDefine nameRuleDefine) {
        nameRuleService.save(nameRuleDefine);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 系统管理->页面管理：delete
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public @ResponseBody
    String delete(@RequestParam Long ruleId) {
        NameRule nameRule = nameRuleService.getNameRuleById(ruleId);
        if (CollectionUtils.isNotEmpty(nameRule.getRuleDefines())) {
            //throw new BusinessException(SpringUtils.getMessage("message.common.hasNameRuleDefine", messageSource));
            throw BusinessException.create("message.common.hasNameRuleGenerate", messageSource);
        }
        if (CollectionUtils.isNotEmpty(nameRule.getRuleGenerates())) {
            //throw new BusinessException(SpringUtils.getMessage("message.common.hasNameRuleGenerate", messageSource));
            throw BusinessException.create("message.common.hasNameRuleGenerate", messageSource);
        }

        nameRuleService.delete(ruleId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

    /**
     * 系统管理->管理：deleteNameRuleDefine
     */
    @RequestMapping(value = "/deleteNameRuleDefine", method = RequestMethod.POST)
    public @ResponseBody
    String deleteNameRuleDefine(@RequestParam Long defineId) {
        nameRuleService.deleteNameRuleDefine(defineId);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

}
