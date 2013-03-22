package com.ted.xplatform.web;

import java.util.Collection;
import java.util.Date;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.spring.mvc.bind.annotation.RequestJsonParam;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.Log;
import com.ted.xplatform.service.LogService;

/**
 * Log管理等的Controller
 * @date 20130218
 */
@Controller
@RequestMapping(value = "/log/*")
public class LogController {
    final Logger   logger = LoggerFactory.getLogger(LogController.class);

    @Inject
    LogService logService;

    @Inject
    MessageSource  messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 查询
     */
    @RequestMapping(value = "/query")
    public @ResponseBody
    JsonPage<Log> query(@RequestParam @DateTimeFormat(iso = ISO.DATE) Date from, @RequestParam @DateTimeFormat(iso = ISO.DATE) Date to, Integer type, int start, int limit) {
        return logService.query(from, to, type, start, limit);
    };

    @RequestMapping(value = "/deleteLog")
    public @ResponseBody
    String deleteLog(@RequestJsonParam Collection<Long> ids) {
        logService.deleteLog(ids);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };
}
