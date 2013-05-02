package com.ted.xplatform.web;

import java.util.Collection;
import java.util.Date;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.spring.mvc.bind.annotation.RequestJsonParam;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.CollectionUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.Notification;
import com.ted.xplatform.service.NotificationService;
import com.ted.xplatform.util.PlatformUtils;

/**
 * Notification管理等的Controller
 */
@Controller
@RequestMapping(value = "/notification/*")
public class NotificationController {
    final Logger        logger = LoggerFactory.getLogger(NotificationController.class);

    @Inject
    NotificationService notificationService;

    @Inject
    MessageSource       messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 查询
     */
    @RequestMapping(value = "/query")
    public @ResponseBody
    JsonPage<Notification> query(int start, int limit) {
        return notificationService.query(start, limit);
    };

    /**
     * save
     */
    @RequestMapping(value = "/save")
    public @ResponseBody
    Map save(Notification notification) {
        notification.setCreatedDate(new Date());
        notification.setWriter(PlatformUtils.getCurrentUser().getLoginName());
        notificationService.save(notification);
        //stop here, to title and message and success:true object
        return CollectionUtils.newMap("success", true, "title", notification.getTitle(), "message", notification.getMessage());
       //return Constants.SUCCESS_JSON;
    };

    /**
     * delete
     */
    @RequestMapping(value = "/delete")
    public @ResponseBody
    String delete(@RequestJsonParam Collection<Long> ids) {
        notificationService.delete(ids);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };
}
