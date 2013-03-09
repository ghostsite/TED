package com.ted.common.dao.mybatis;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;

import com.ted.common.support.page.JsonPage;

/**
 * to test and check
 */
public class MybatisTemplateDaoAdaptor implements MybatisTemplateDao {
    @Inject
    protected SqlSession sqlSession;

    public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Override
    public Object selectOne(String namedQL) {
        sqlSession.selectOne(namedQL);
        return null;
    }

    @Override
    public Object selectOne(String namedQL, Map params) { //Object is suit for map? to check it
        return this.sqlSession.selectOne(namedQL, params);
    }

    @Override
    public <T> List<T> selectList(String namedQL) {
        return this.sqlSession.selectList(namedQL);
    }

    @Override
    public <T> List<T> selectList(String namedQL, Map params) {
        return this.sqlSession.selectList(namedQL, params);
    }

    @Override
    public JsonPage selectPage(String namedQL, int start, int limit) {
        int totalCount = this.sqlSession.selectOne(insertCount(namedQL));
        return new JsonPage(this.sqlSession.selectList(namedQL, new org.apache.ibatis.session.RowBounds(start, limit)), null, totalCount);
    }

    @Override
    public JsonPage selectPage(String namedQL, Map params, int start, int limit) {
        int totalCount = this.sqlSession.selectOne(insertCount(namedQL), params);
        return new JsonPage(this.sqlSession.selectList(namedQL, params, new org.apache.ibatis.session.RowBounds(start, limit)), null, totalCount);
    }

    @Override
    public void flushAndClearCache() {
        this.sqlSession.clearCache();
    }

    //还不知道这个具体干啥的 to check
    protected String insertCount(String namedQL) {
        StringBuilder sb = new StringBuilder(namedQL);
        int index = namedQL.lastIndexOf(".");
        sb.insert(index + 1, "count-");
        return sb.toString();
    }

}
