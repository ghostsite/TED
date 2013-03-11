package com.ted.common.dao.mybatis;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import com.ted.common.dao.mybatis.spring.ReloadableSqlSessionTemplate;
import com.ted.common.support.page.JsonPage;

/**
 * to test and check
 * 这个之所以不继承TemplateDaoSupport是因为mybatis的xml sql 加载机制不好抽取，只能沿用mybatis的机制。
 */
public class MybatisTemplateDaoAdaptor implements MybatisTemplateDao {
    @Inject
    protected ReloadableSqlSessionTemplate reloadableSqlSessionTemplate;

    //    @Inject
    //    protected SqlSessionManager sqlSessionManager;
    //    
    //    public void setSqlSessionManager(SqlSessionManager sqlSessionManager) {
    //        this.sqlSessionManager = sqlSessionManager;
    //    }

    public ReloadableSqlSessionTemplate getReloadableSqlSessionTemplate() {
        return reloadableSqlSessionTemplate;
    }

    public void setReloadableSqlSessionTemplate(ReloadableSqlSessionTemplate reloadableSqlSessionTemplate) {
        this.reloadableSqlSessionTemplate = reloadableSqlSessionTemplate;
    }

    @Override
    public Object selectOne(String namedQL) {
        reloadableSqlSessionTemplate.selectOne(namedQL);
        return null;
    }

    @Override
    public Object selectOne(String namedQL, Map params) { //Object is suit for map? to check it
        return this.reloadableSqlSessionTemplate.selectOne(namedQL, params);
    }

    @Override
    public <T> List<T> selectList(String namedQL) {
        return this.reloadableSqlSessionTemplate.selectList(namedQL);
    }

    @Override
    public <T> List<T> selectList(String namedQL, Map params) {
        return this.reloadableSqlSessionTemplate.selectList(namedQL, params);
    }

    @Override
    public JsonPage selectPage(String namedQL, int start, int limit) {
        int totalCount = this.reloadableSqlSessionTemplate.selectOne(insertCount(namedQL));
        return new JsonPage(this.reloadableSqlSessionTemplate.selectList(namedQL, new org.apache.ibatis.session.RowBounds(start, limit)), null, totalCount);
    }

    @Override
    public JsonPage selectPage(String namedQL, Map params, int start, int limit) {
        int totalCount = this.reloadableSqlSessionTemplate.selectOne(insertCount(namedQL), params);
        return new JsonPage(this.reloadableSqlSessionTemplate.selectList(namedQL, params, new org.apache.ibatis.session.RowBounds(start, limit)), null, totalCount);
    }

    @Override
    public void flushAndClearCache() {
        this.reloadableSqlSessionTemplate.clearCache();
    }

    //还不知道这个具体干啥的 to check
    protected String insertCount(String namedQL) {
        StringBuilder sb = new StringBuilder(namedQL);
        int index = namedQL.lastIndexOf(".");
        sb.insert(index + 1, "count-");
        return sb.toString();
    }

}
