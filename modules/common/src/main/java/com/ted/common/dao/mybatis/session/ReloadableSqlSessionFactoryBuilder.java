package com.ted.common.dao.mybatis.session;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class ReloadableSqlSessionFactoryBuilder extends SqlSessionFactoryBuilder {

    @Override
    public SqlSessionFactory build(Configuration config) {
        return new ReloadableSqlSessionFactory(config);
    }
}
