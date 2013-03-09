package com.ted.common.dialect;

import org.hibernate.dialect.Oracle10gDialect;

public class Oracle10gDialectExt extends Oracle10gDialect {
    public String getLimitString(String sql, int offset, int limit) {
        sql = sql.trim();
        String forUpdateClause = null;
        boolean isForUpdate = false;
        final int forUpdateIndex = sql.toLowerCase().lastIndexOf("for update");
        if (forUpdateIndex > -1) {
            // save 'for update ...' and then remove it
            forUpdateClause = sql.substring(forUpdateIndex);
            sql = sql.substring(0, forUpdateIndex - 1);
            isForUpdate = true;
        }

        StringBuilder pagingSelect = new StringBuilder(sql.length() + 100);
        if (offset > 1) {
            pagingSelect.append("select * from ( select row_.*, rownum rownum_ from ( ");
        } else {
            pagingSelect.append("select * from ( ");
        }
        pagingSelect.append(sql);
        if (offset > 1) {
            pagingSelect.append(" ) row_ where rownum <= ").append(offset + limit).append(" )where rownum_ > ").append(offset);
        } else {
            pagingSelect.append(" ) where rownum <= ").append(limit);
        }

        if (isForUpdate) {
            pagingSelect.append(" ");
            pagingSelect.append(forUpdateClause);
        }

        return pagingSelect.toString();
    }
}
