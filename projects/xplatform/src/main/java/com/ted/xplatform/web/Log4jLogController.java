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
import com.ted.xplatform.pojo.common.Log4jLog;
import com.ted.xplatform.service.Log4jLogService;

/**
 * Log管理等的Controller
 * @date 20130218
 */
@Controller
@RequestMapping(value = "/log4jlog/*")
public class Log4jLogController {
    final Logger   logger = LoggerFactory.getLogger(Log4jLogController.class);

    @Inject
    Log4jLogService log4jLogService;

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
    JsonPage<Log4jLog> query(@RequestParam @DateTimeFormat(iso = ISO.DATE) Date from, @RequestParam @DateTimeFormat(iso = ISO.DATE) Date to, Integer type, int start, int limit) {
        return log4jLogService.query(from, to, type, start, limit);
    };

    @RequestMapping(value = "/deleteLog4jLog")
    public @ResponseBody
    String deleteLog4jLog(@RequestJsonParam Collection<Long> ids) {
        log4jLogService.deleteLog4jLog(ids);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };
}
