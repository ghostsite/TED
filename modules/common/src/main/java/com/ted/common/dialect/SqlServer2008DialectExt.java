package com.ted.common.dialect;

import java.sql.Types;

import org.hibernate.dialect.SQLServer2005Dialect;

import com.ted.common.util.DaoTemplateUtils;

public class SqlServer2008DialectExt extends SQLServer2005Dialect {

    public SqlServer2008DialectExt() {
        super();
        registerHibernateType(1, "string");
        registerHibernateType(-9, "string");
        registerHibernateType(-16, "string");
        registerHibernateType(3, "double");

        registerColumnType(Types.NVARCHAR, "varbinary(MAX)");
        registerColumnType(Types.LONGNVARCHAR, "varbinary(MAX)");
        registerColumnType(Types.DECIMAL, "bigint");
    }

    //注意offset不是第几页，是从哪个记录开始。
    public String getLimitString(String querySqlString, int offset, int limit) {
        return DaoTemplateUtils.getLimitString(querySqlString, offset, limit);
    }

}