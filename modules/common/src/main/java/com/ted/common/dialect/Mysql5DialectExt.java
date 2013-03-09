package com.ted.common.dialect;

import org.hibernate.dialect.MySQL5InnoDBDialect;

public class Mysql5DialectExt extends MySQL5InnoDBDialect {

	public String getLimitString(String sql, int offset, int limit) {
		return sql + " limit " + offset + ", " + limit;
	}

}
