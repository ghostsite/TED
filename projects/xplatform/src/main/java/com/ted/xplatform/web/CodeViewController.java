package com.ted.xplatform.web;

import javax.inject.Inject;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.exception.BusinessException;
import com.ted.common.support.page.JsonPage;
import com.ted.xplatform.service.CodeViewService;
import com.ted.xplatform.vo.codeview.CodeViewParam;

/**
 * @create at 2012.12.05
 * @modifed 2013.04.20 : add gcm (type), table, service(Except), sqlquery
 */
@Controller
@RequestMapping(value = "/codeview/*")
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
    //@RequestMapping(value = "/pagedQuery", consumes = "application/json")
    @RequestMapping(value = "/pagedQuery")
    public @ResponseBody
    //JsonPage pagedQuery(@RequestJsonParam( CodeViewParam params) throws ClassNotFoundException {
    //JsonPage pagedQuery(@RequestParam CodeViewParam params) throws ClassNotFoundException {
    JsonPage pagedQuery(@RequestBody  CodeViewParam params) throws ClassNotFoundException {
        Assert.notNull(params.getType());
        //Assert.notNull(params.getTable());
        //Assert.notNull(params.getSelect());

        if ("table".equals(params.getType()) || "gcm".equals(params.getType())) {
            return codeViewService.pagedTableOrGcm(params);
        } else if ("sqlquery".equals(params.getType())) {//sql query
            return codeViewService.pagedSqlQuery(params);
        } else {
            throw new BusinessException("如果是service的CodeView,请url指定controller!");
        }
    };

}