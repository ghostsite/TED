package com.ted.common.dao.mybatis.session;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.defaults.DefaultSqlSessionFactory;

import com.ted.common.dao.mybatis.spring.ReloadableSqlSessionFactoryBean;

/**
 * 抱歉，这个只能加一个依赖spring的属性，来实现reloadable
 */
public class ReloadableSqlSessionFactory extends DefaultSqlSessionFactory{
    private ReloadableSqlSessionFactoryBean reloadableSqlSessionFactoryBean;
    
    public ReloadableSqlSessionFactoryBean getReloadableSqlSessionFactoryBean() {
        return reloadableSqlSessionFactoryBean;
    }

    public void setReloadableSqlSessionFactoryBean(ReloadableSqlSessionFactoryBean reloadableSqlSessionFactoryBean) {
        this.reloadableSqlSessionFactoryBean = reloadableSqlSessionFactoryBean;
    }

    public ReloadableSqlSessionFactory(Configuration configuration) {
        super(configuration);
    }
    
}
