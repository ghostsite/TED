package com.ted.common.dao;

import java.util.Map;

/**
 * 这个是自己写的根据Freemarker模板语言读取动态的QL
 * 这个是给JpaTempateDao and JdbcTemplateDao用的，把公共的方法、属性都可以写到这里来
 */
public interface TemplateDao {
    public String getTemplatedQLString(String namedQL, Map<String, Object> params);
}
