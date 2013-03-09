package com.ted.common.dao.mybatis;

import java.util.List;
import java.util.Map;

import com.ted.common.support.page.JsonPage;

public interface MybatisTemplateDao {
    public abstract Object selectOne(String namedQL);

    public abstract Object selectOne(String namedQL,  Map params);

    public abstract <T> List<T> selectList(String namedQL);

    public abstract <T> List<T> selectList(String namedQL, Map params);

    public abstract JsonPage selectPage(String namedQL, int start, int limit);

    public abstract JsonPage selectPage(String namedQL, Map params, int start, int limit);

    public abstract void flushAndClearCache();
}
