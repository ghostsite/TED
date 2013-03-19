package com.ted.xplatform.web;

import java.util.Collection;
import java.util.Date;

import javax.inject.Inject;

import org.joda.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.Constants;
import com.ted.common.spring.mvc.bind.annotation.RequestJsonParam;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.WorkDay;
import com.ted.xplatform.service.WorkDayService;

/**
 * 日期管理等的Controller
 *
 */
@Controller
@RequestMapping(value = "/workday/*")
public class WorkDayController {
    final Logger   logger = LoggerFactory.getLogger(WorkDayController.class);

    @Inject
    WorkDayService workDayService;

    @Inject
    MessageSource  messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * generate
     */
    @RequestMapping(value = "/generate")
    public @ResponseBody
    String generate(@RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDateTime from, @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDateTime to) {
        workDayService.generate(from, to);
        //return Constants.SUCCESS_JSON;
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 查询
     */
    @RequestMapping(value = "/query")
    public @ResponseBody
    JsonPage<WorkDay> query(@RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDateTime from, @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDateTime to, Boolean workDay, int start, int limit) {
        return workDayService.query(from, to, workDay, start, limit);
    };

    /**
     * 更新state：workDay
     */
    @RequestMapping(value = "/setWorkDay")
    public @ResponseBody
    String setWorkDay(@RequestParam Long id, boolean workDay) {
        workDayService.setWorkDay(id, workDay);
        return Constants.SUCCESS_JSON;
    };
    
    /**
     * 更新state：workDay
     */
    @RequestMapping(value = "/deleteWorkDay")
    public @ResponseBody
    String deleteWorkDay(@RequestJsonParam Collection<Long> ids) {
        workDayService.deleteWorkDay(ids);
        //return Constants.SUCCESS_JSON;
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };
}
