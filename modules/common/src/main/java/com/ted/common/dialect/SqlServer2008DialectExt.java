package com.ted.common.dialect;

import java.sql.Types;

import org.hibernate.dialect.SQLServer2008Dialect;

public class SqlServer2008DialectExt extends SQLServer2008Dialect {
    public SqlServer2008DialectExt() {   
        super();   
        registerHibernateType(1, "string");   
        registerHibernateType(-9, "string");   
        registerHibernateType(-16, "string");   
        registerHibernateType(3, "double");
        
        registerColumnType(Types.NVARCHAR,"varbinary(MAX)");   
        registerColumnType(Types.LONGNVARCHAR, "varbinary(MAX)");   
        registerColumnType(Types.DECIMAL, "bigint");
        

        /**
         *  registerColumnType( Types.BLOB, "varbinary(MAX)" );
        registerColumnType( Types.VARBINARY, "varbinary(MAX)" );
        registerColumnType( Types.VARBINARY, MAX_LENGTH, "varbinary($l)" );
        registerColumnType( Types.LONGVARBINARY, "varbinary(MAX)" );

        registerColumnType( Types.CLOB, "varchar(MAX)" );
        registerColumnType( Types.LONGVARCHAR, "varchar(MAX)" );
        registerColumnType( Types.VARCHAR, "varchar(MAX)" );
        registerColumnType( Types.VARCHAR, MAX_LENGTH, "varchar($l)" );

        registerColumnType( Types.BIGINT, "bigint" );
        registerColumnType( Types.BIT, "bit" );
        registerColumnType( Types.BOOLEAN, "bit" );
        
        registerColumnType( Types.VARBINARY, "image" );
        registerColumnType( Types.VARBINARY, 8000, "varbinary($l)" );
        registerColumnType( Types.LONGVARBINARY, "image" );
        registerColumnType( Types.LONGVARCHAR, "text" );

         */
    }}
