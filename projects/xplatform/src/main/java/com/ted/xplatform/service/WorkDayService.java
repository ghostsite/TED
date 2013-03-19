package com.ted.xplatform.service;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

import javax.inject.Inject;

import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Maps;
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.CollectionUtils;
import com.ted.xplatform.pojo.common.WorkDay;

/**
 * 工作日管理的服务类
 * @date 20120310
 */
@Transactional
@Service("workDayService")
public class WorkDayService {
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
    public void generate(LocalDateTime from, LocalDateTime to) {
        //删除
        Map<String, Object> params = CollectionUtils.newMap("from", from, "to", to);
        jpaTemplateDao.executeJPQLUpdate("admin-jpql-deleteWorkDay", params);

        //插入
        while (from.isBefore(to)) {
            generateDay(from);
            from = from.plusDays(1);
        }
    };

    /**
     * 辅助方法，插入一个数据到workday
     * @param dt
     */
    private void generateDay(LocalDateTime dt) {
        WorkDay wd = new WorkDay();
        wd.setDayDate(dt);
        wd.setWeekDay(dt.getDayOfWeek());//注意：1 表示星期一
        if (dt.getDayOfWeek() == 6 || dt.getDayOfWeek() == 7) {
            wd.setWorkDay(false);
        } else {
            wd.setWorkDay(true);
        }
        this.jpaSupportDao.getEntityManager().persist(wd);
    }

    /**
     * 查询from to 
     */
    @Transactional(readOnly = true)
    public JsonPage<WorkDay> query(LocalDateTime from, LocalDateTime to, Boolean workDay, int start, int limit) {
        Map<String, Object> params = Maps.newHashMap();
        params.put("from", from);
        params.put("to", to);
        params.put("workDay", workDay);
        JsonPage<WorkDay> page = jpaTemplateDao.pagedByJPQLQuery("admin-jpql-queryWorkDay", params, WorkDay.class, start, limit);
        return page;
    };

    /**
     * 设置工作日的状态：工作日和非工作日
     * @param args
     */
    @Transactional
    public void setWorkDay(Long id, boolean workDay) {
        WorkDay wd = jpaSupportDao.getEntityManager().find(WorkDay.class, id);
        wd.setWorkDay(workDay);
        jpaSupportDao.getEntityManager().merge(wd);
    };

    /**
     * 删除，选择性删除个别几个
     * @param ids
     */
    @Transactional
    public void deleteWorkDay(Collection<Long> ids) {
        jpaSupportDao.bulkUpdate("delete WorkDay where id in (:ids)", ids);
    }

    public static void main(String[] args) {
        DateTime dt = DateTime.now();
        System.out.println(dt.getDayOfWeek());

        Calendar cd = Calendar.getInstance();
        // 获得今天是一周的第几天，星期日是第一天，星期二是第二天......
        int dayOfWeek = cd.get(Calendar.DAY_OF_WEEK);
        System.out.println(dayOfWeek);
    }
}
