package com.ted.common;

public class Constants {
    public static final String  CHARSET               = "utf-8";
    public static final boolean isDev                 = true;                   //是否是开发环境,不控制webservice的正式、开发与否

    public static final String  TOTALCOUNT            = "totalCount";           //给JsonReader用的配置信息的totalCount
    public static final String  CONTENT                  = "content";              //给JsonReader用的配置信息的root for extjs4
    public static final String  START                 = "start";                //ext 翻页都要用到的起始记录数
    public static final String  LIMIT                 = "limit";                //一页返回多少行。
    public static final String  SUCCESS_JSON          = "{success:true}";
    public static final String  FAIL_JSON             = "{success:false}";

    public static final String  CURRENT_LOGINUSER_KEY = "CURRENT_LOGINUSER_KEY"; //登录用户的key:logininfovo

    public static final String  YES                   = "1";                    //比如:是否保管
    public static final String  NO                    = "0";

    public static final String  YES_Y                 = "Y";
    public static final String  NO_N                  = "N";

    public static final String  LANGUAGE_CN           = "cn"; //语言
    public static final String  LANGUAGE_KO           = "ko";
    public static final String  LANGUAGE_EN           = "en";

}
