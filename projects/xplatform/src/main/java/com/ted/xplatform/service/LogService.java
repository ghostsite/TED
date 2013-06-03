package com.ted.xplatform.service;

import java.util.Collection;
import java.util.Date;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Maps;
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.support.page.JsonPage;
import com.ted.xplatform.pojo.common.Log;

/**
 * 日志类Service
 * @date 20130218
 */
@Transactional
@Service("logService")
public class LogService {
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

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    /**
     * 查询from to 
     * Integer type:Log type
     */
    @Transactional(readOnly = true)
    public JsonPage<Log> query(Date from, Date to, Integer type, int start, int limit) {
       
        Map<String, Object> params = Maps.newHashMap();
        if(null != from){
        	params.put("from", DateUtils.date2Str(from,DateUtils.PATTERN_YYYYMMDDHHMMSS));
        }
        if(null != to){
        	params.put("to", DateUtils.date2Str(to,DateUtils.PATTERN_YYYYMMDDHHMMSS));
        }
        params.put("type", type);
        JsonPage<Log> page = jpaTemplateDao.pagedByJPQLQuery("admin-jpql-queryLog", params, Log.class, start, limit);
        return page;
    
    };

    /**
     * 删除，选择性删除个别几个
     * @param ids
     */
    @Transactional
    public void deleteLog(Collection<Long> ids) {
        jpaSupportDao.bulkUpdate("delete Log where id in (:ids)", ids);
    }

}
