package com.ted.common.dao;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.util.Assert;

/**
 * 模板dao的工具类
 * @date 20130307
 */
public abstract class DaoTemplateHelper {
    //=============以下2个方法是从springside 3拷贝过来的===========
    public static final String removeSelect(String ql) {
        Assert.hasText(ql);
        int beginPos = ql.toLowerCase().indexOf("from");
        Assert.isTrue(beginPos != -1, " hql : " + ql + " must has a keyword 'from'");
        return ql.substring(beginPos);
    }

    public static final String removeOrders(String ql) {
        Assert.hasText(ql);
        Pattern p = Pattern.compile("order\\s*by[\\w|\\W|\\s|\\S]*", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(ql);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(sb, "");
        }
        m.appendTail(sb);
        return sb.toString();
    };

    //============辅助方法,tools copy from SqlServer2005Dialect=========
    private static final String  SELECT        = "select";
    private static final String  FROM          = "from";
    private static final String  DISTINCT      = "distinct";

    /**
     * Regular expression for stripping alias
     */
    private static final Pattern ALIAS_PATTERN = Pattern.compile("\\sas\\s[^,]+(,?)");

    /**
     *  这个方法也就是sqlserver的查询，有2点注意：1 查询出来的列都是小写，因为调用了toLowerCase(); 2 返回的pojo要有__hibernate_row_nr__这个属性。BigInteger
     *  <b>注意</b>：sql写的时候，如果有order by，请小写,很有可能这里出现bug，http://lists.jboss.org/pipermail/hibernate-dev/2012-June/008538.html，仿照
     *  pagedBySQLBeanQueryHibernate() 放啊进行修改
     */
    public static final String getLimitString(String querySqlString, int offset, int limit) {
        //StringBuilder sb = new StringBuilder( querySqlString.trim().toLowerCase() );
        StringBuilder sb = new StringBuilder(querySqlString.trim());

        int orderByIndex = sb.indexOf("order by");
        CharSequence orderby = orderByIndex > 0 ? sb.subSequence(orderByIndex, sb.length()) : "ORDER BY CURRENT_TIMESTAMP";

        // Delete the order by clause at the end of the query
        if (orderByIndex > 0) {
            sb.delete(orderByIndex, orderByIndex + orderby.length());
        }

        // HHH-5715 bug fix
        replaceDistinctWithGroupBy(sb);

        insertRowNumberFunction(sb, orderby);

        // Wrap the query within a with statement:
        sb.insert(0, "WITH query AS (").append(") SELECT * FROM query ");
        sb.append("WHERE __hibernate_row_nr__ >= " + (offset + 1) + " AND __hibernate_row_nr__ <= " + (limit + offset));

        return sb.toString();
    }

    /**
     * Utility method that checks if the given sql query is a select distinct one and if so replaces the distinct select
     * with an equivalent simple select with a group by clause.
     *
     * @param sql an sql query
     */
    public static void replaceDistinctWithGroupBy(StringBuilder sql) {
        int distinctIndex = sql.indexOf(DISTINCT);
        int selectEndIndex = sql.indexOf(FROM);
        if (distinctIndex > 0 && distinctIndex < selectEndIndex) {
            sql.delete(distinctIndex, distinctIndex + DISTINCT.length() + 1);
            sql.append(" group by").append(getSelectFieldsWithoutAliases(sql));
        }
    }

    /**
     * This utility method searches the given sql query for the fields of the select statement and returns them without
     * the aliases.
     *
     * @param sql sql query
     *
     * @return the fields of the select statement without their alias
     */
    protected static CharSequence getSelectFieldsWithoutAliases(StringBuilder sql) {
        String select = sql.substring(sql.indexOf(SELECT) + SELECT.length(), sql.indexOf(FROM));

        // Strip the as clauses
        return stripAliases(select);
    }

    /**
     * Utility method that strips the aliases.
     *
     * @param str string to replace the as statements
     *
     * @return a string without the as statements
     */
    protected static String stripAliases(String str) {
        Matcher matcher = ALIAS_PATTERN.matcher(str);
        return matcher.replaceAll("$1");
    }

    /**
     * Right after the select statement of a given query we must place the row_number function
     *
     * @param sql the initial sql query without the order by clause
     * @param orderby the order by clause of the query
     */
    protected static final void insertRowNumberFunction(StringBuilder sql, CharSequence orderby) {
        // Find the end of the select statement
        int selectEndIndex = sql.indexOf(FROM);

        // Insert after the select statement the row_number() function:
        sql.insert(selectEndIndex - 1, ", ROW_NUMBER() OVER (" + orderby + ") as __hibernate_row_nr__");
    }
}
