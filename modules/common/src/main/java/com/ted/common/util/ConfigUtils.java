package com.ted.common.util;

import java.util.List;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.lang3.StringUtils;

import com.google.common.collect.Lists;

/**
 * context.properties
 *
 */
public abstract class ConfigUtils {
    private static Configuration config              = null;
    private static final String  CONTEXT_FILE_NAME   = "context.xml";

    private static final String  RUN_MODE            = "runMode";
    private static final String  RUN_MODE_DEV        = "dev";
    private static final String  RUN_MODE_PROD       = "prod";
    private static final String  RUN_MODE_TEST       = "test";

    private static final String  DB_TYPE             = "dbType";
    private static final String  DB_TYPE_ORACLE      = "oracle";
    private static final String  DB_TYPE_MYSQL       = "mysql";
    private static final String  DB_TYPE_SQLSERVER   = "sqlserver";

    private static final String  ATTACH_FILE_DIR     = "attachFileDir";

    private static final String  ID_PREFIX           = "idPrefix";
    private static final String  DEFAULT_PASSWORD    = "defaultPassword";

    private static final String  DOZER_BEAN_MAPPINGS = "dozerBeanMappings";

    private static final String  EXTJSVERSION        = "extjsversion";
    
    private static final String  PRETTY_PRINT        = "prettyPrint"; //json for prettyPrint
    
    private static final String  PACKAGE_SCAN        = "packageScan"; //for ExtModelController pojo and vo

    static {
        try {
            try {
                config = new XMLConfiguration(CONTEXT_FILE_NAME);
            } catch (ConfigurationException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static final Configuration getConfig() {
        return config;
    }

    public static final String getString(String key) {
        return getConfig().getString(key);
    }

    //================下面的方法跟配置内容相关=====================//
    public static final String getRunMode() {
        return getString(RUN_MODE);
    }

    public static final String getDbType() {
        return getString(DB_TYPE);
    }

    public static final boolean isDev() {
        return RUN_MODE_DEV.equals(getRunMode());
    }

    public static final boolean isProd() {
        return RUN_MODE_PROD.equals(getRunMode());
    }

    public static final boolean isTest() {
        return RUN_MODE_TEST.equals(getRunMode());
    }

    public static final boolean isOracle() {
        return DB_TYPE_ORACLE.equals(getDbType());
    }

    public static final boolean isMysql() {
        return DB_TYPE_MYSQL.equals(getDbType());
    }

    public static final boolean isSqlServer() {
        return DB_TYPE_SQLSERVER.equals(getDbType());
    }

    public static final String getAttachFileDir() {
        return getString(ATTACH_FILE_DIR);
    }

    public static final String getIdPrefix() {
        return getString(ID_PREFIX);
    }

    public static final String getDefaultPassword() {
        return ConfigUtils.getConfig().getString(DEFAULT_PASSWORD);
    }

    public static final List<String> getDozerBeanMappings() {
        List<Object> list = ConfigUtils.getConfig().getList(DOZER_BEAN_MAPPINGS);
        List<String> stringList = Lists.newArrayList();
        for (Object object : list) {
            stringList.add(object != null ? object.toString() : null);
        }
        return stringList;
    }

    //20120926 added for extjs version 区分3 or 4
    public static final String getExtJsVersion() {
        return getString(EXTJSVERSION);
    }

    public static final boolean isExtjs4() {
        return "4".equals(getExtJsVersion());
    }

    public static void main(String[] args) {
        System.out.println(isExtjs4());
    }
    
  //prettyPrint
    public static final String getPrettyPrint() {
        return getString(PRETTY_PRINT);
    }
    
    public static final boolean isPrettyPrint() {
        return "true".equals(getPrettyPrint());
    }
    
    //packagescan
    public static final String[] getPackageScan() {
        return StringUtils.split(getString(PACKAGE_SCAN),",");
    }
}
