package com.ted.xplatform.web;

import javax.inject.Inject;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.exception.BusinessException;
import com.ted.common.spring.mvc.bind.annotation.RequestJsonParam;
import com.ted.common.support.page.JsonPage;
import com.ted.xplatform.service.CodeViewService;
import com.ted.xplatform.vo.codeview.CodeViewParam;

/**
 * @create at 2012.12.05
 * 由于是查询，故没有service，只查询。
 * @modifed 2013.04.20 : add gcm (type), table, service(Except), sqlquery
 */
@Controller
@RequestMapping(value = "/codeview/*")
@SuppressWarnings("all")
public class CodeViewController {
    @Inject
    private CodeViewService codeViewService;

    @Inject
    MessageSource           messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setCodeViewService(CodeViewService codeViewService) {
        this.codeViewService = codeViewService;
    }

    /**
     * 这个是关键的入口
     */
    @RequestMapping(value = "/pagedQuery")
    public @ResponseBody
    JsonPage pagedQuery(@RequestJsonParam CodeViewParam param) throws ClassNotFoundException {
        Assert.notNull(param.getType());
        Assert.notNull(param.getTable());
        Assert.notNull(param.getSelect());

        if ("table".equals(param.getType()) || "gcm".equals(param.getType())) {
            return codeViewService.pagedTableOrGcm(param);
        } else if ("sqlquery".equals(param.getType())) {//sql query
            return codeViewService.pagedSqlQuery(param);
        } else {
            throw new BusinessException("如果是service的CodeView,请url指定controller!");
        }
    };

}