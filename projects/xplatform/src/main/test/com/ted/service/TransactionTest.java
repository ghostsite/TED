package com.ted.service;


import java.util.List;

import javax.inject.Inject;

import org.junit.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import com.ted.common.dao.jpa.JpaSupportDao;

/**
 * 测试jpa mybatis的事务
 */
@DirtiesContext
@ContextConfiguration(locations = { "/spring/applicationContext.xml" })
// 如果存在多个transactionManager，可以需显式指定
public class TransactionTest extends SpringTransactionalTestCase {

    @Inject
    JpaSupportDao   jpaSupportDao;

    @Inject
    SqlSessionTemplate sqlSessionTemplate ;
    
    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }


    public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
        this.sqlSessionTemplate = sqlSessionTemplate;
    }


    @Test
    public void testTransactionWithJpaAndMybatis(){
        com.ted.xplatform.pojo.common.WorkDay wd = new com.ted.xplatform.pojo.common.WorkDay();
        
        wd.setSequence(3444);
        
        jpaSupportDao.getEntityManager().persist(wd);
        
        List<com.ted.xplatform.pojo.common.WorkDay> wds = sqlSessionTemplate.selectList("test.getWorkDayList");
        
        System.out.println(wds.size());
    }

}
