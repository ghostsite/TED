package com.ted.xplatform.service;

import java.util.Collection;

import javax.inject.Inject;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.support.page.JsonPage;
import com.ted.xplatform.pojo.common.Notification;

/**
 * 提醒Notification的服务类
 * @date 20130502
 */
@Transactional
@Service("notificationService")
public class NotificationService {
    @Inject
    JdbcTemplateDao jdbcTemplateDao;

    @Inject
    JpaSupportDao   jpaSupportDao;

    @Inject
    JpaTemplateDao  jpaTemplateDao;

    @Inject
    MessageSource   messageSource;

    public void setJdbcTemplateDao(JdbcTemplateDao jdbcTemplateDao) {
        this.jdbcTemplateDao = jdbcTemplateDao;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 生成from to 
     * @param loginName
     * @return
     */
    @Transactional
    public void save(Notification notification) {
        this.jpaSupportDao.getEntityManager().persist(notification);
    };

    /**
     * 查询from to 
     */
    @Transactional(readOnly = true)
    public JsonPage<Notification> query(int start, int limit) {
        JsonPage<Notification> page = jpaSupportDao.pagedByJPQLQuery("from Notification order by createdDate desc", start, limit);
        return page;
    };

    /**
     * 删除，选择性删除个别几个
     * @param ids
     */
    @Transactional
    public void delete(Collection<Long> ids) {
        jpaSupportDao.bulkUpdate("delete Notification where id in (:ids)", ids);
    }

}
