package com.ted.common.util;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

/**
 * java.util.Date
 * org.joda.time.DateTime 
 */
public class DateUtils {

    //    public static final String     Simple_Date_Format         = "yyyy-MM-dd";
    //    public static final int        Simple_Date_Format_Length  = Simple_Date_Format.length();
    //    public static final String     Simple_DateTime_Format     = "yyyy-MM-dd HH:mm:ss";

    public static final String      PATTERN_YYYYMMDD           = "yyyy-MM-dd";
    public static final String      PATTERN_YYYYMMDD2          = "yyyyMMdd";
    public static final String      PATTERN_YYYYMMDDHHMM       = "yyyy-MM-dd HH:mm";
    public static final String      PATTERN_YYYYMMDDHHMMSS     = "yyyy-MM-dd HH:mm:ss";
    public static final String      PATTERN_YYYYMMDDHHMMSS2    = "yyyyMMddHHmmss";
    public static final String      PATTERN_YYYYMMDDHHMMSSMill = "yyyyMMddHHmmssSSS";

    public static SimpleDateFormat  dateFormat                 = new SimpleDateFormat(PATTERN_YYYYMMDD);
    public static DateTimeFormatter dateTimeFormatter          = DateTimeFormat.forPattern(PATTERN_YYYYMMDD);

    // 获得当前日期的字符串形式.
    public static final String getCurrentStringDate(String pattern) {
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat(pattern);
        return formatter.format(currentTime);
    }

    public static void main(String[] args) {
        // System.out.println(getTimeInMillis());
        //String date = getCurrentStringDate(PATTERN_YYYYMMDDHHMMSSMill);
        // long now=System.currentTimeMillis();
        // System.out.println("毫秒数："+now);
        //String date = DateUtils.getNextDay(new Date(),"-7", DateUtils.PATTERN_YYYYMMDD2);
        //System.out.println(date);
        // System.out.println(isDate(date,PATTERN_YYYYMMDDHHMM));
    }

    public static final String getCurrentStringDateYMDHMS() {
        return getCurrentStringDate(PATTERN_YYYYMMDDHHMMSS);
    }

    public static final String getCurrentStringDateYMDHM() {
        return getCurrentStringDate(PATTERN_YYYYMMDDHHMM);
    }

    public static final String getCurrentStringDateYMD() {
        return getCurrentStringDate(PATTERN_YYYYMMDD);
    }

    public static final String getCurrentStringDateYYYYMMDD() {
        return getCurrentStringDate(PATTERN_YYYYMMDD2);
    }

    public static final String getCurrentStringDateYYMDHMSS() {
        return getCurrentStringDate(PATTERN_YYYYMMDDHHMMSS2);
    }

    public static final boolean isDate(String strDate, String pattern) {
        SimpleDateFormat formatter = new SimpleDateFormat(pattern);
        formatter.setLenient(false);
        ParsePosition pos = new ParsePosition(0);
        try {
            formatter.parse(strDate, pos);
            return true;
        } catch (Exception e) {
            return false;
        }
    };

    public static String date2Str(Date date) {
        try {
            return dateFormat.format(date);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    };

    public static String date2Str(Date date, String pattern) {
        try {
            SimpleDateFormat format = new SimpleDateFormat(pattern);
            return format.format(date);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    };

    public static String date2Str(DateTime datetime) {
        try {
            return dateTimeFormatter.print(datetime);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    };

    public static String date2Str(DateTime localdatetime, String pattern) {
        try {
            DateTimeFormatter formatter = DateTimeFormat.forPattern(pattern);
            return formatter.print(localdatetime);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    };

    public static String date2Str(LocalDateTime datetime) {
        try {
            return dateTimeFormatter.print(datetime);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    };

    public static String date2Str(LocalDateTime localdatetime, String pattern) {
        try {
            DateTimeFormatter formatter = DateTimeFormat.forPattern(pattern);
            return formatter.print(localdatetime);
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    };

    public static String date2Str(Object obj, String pattern) {
        if (null == obj) {
            return "";
        }
        if (StringUtils.isBlank(pattern)) {
            pattern = PATTERN_YYYYMMDD;
        }
        Class<?> clazz = obj.getClass();
        if (clazz.isAssignableFrom(Date.class)) {
            return date2Str((Date) obj, pattern);
        }
        if (clazz.isAssignableFrom(DateTime.class)) {
            return date2Str((DateTime) obj, pattern);
        }
        if (clazz.isAssignableFrom(LocalDateTime.class)) {
            return date2Str((LocalDateTime) obj, pattern);
        }
        return "";
    };

    public static String date2Str(Object obj) {
        return date2Str(obj, PATTERN_YYYYMMDD);
    };

    public static Date str2Date(String str) {
        try {
            return dateFormat.parse(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    };

    public static Date str2Date(String str, String pattern) {
        try {
            SimpleDateFormat dateFormat1 = new SimpleDateFormat(pattern);
            return dateFormat1.parse(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    };

    /**
     * 判断给的对象是否是Date: 包括java.util.Date, org.joda.time.DateTime or LocalDateTime
     */
    public static boolean isDate(Object obj) {
        if (obj == null) {
            return false;
        }
        Class<?> clazz = obj.getClass();
        if (clazz.isAssignableFrom(Date.class) || clazz.isAssignableFrom(java.sql.Date.class) || clazz.isAssignableFrom(DateTime.class) || clazz.isAssignableFrom(LocalDateTime.class)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 根据输入的时间的字符串 自动匹配格式  转换时间对象
     * @param send_time  add by  xiaolei1.wang
     * @return
     */
    public Date getDate(String send_time) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(getDateFormat(send_time));
            return sdf.parse(send_time);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    // 验证符合的时间格式  返回对应的时间  
    public static final String REGX_YYYY_MM_DD_HH_MM_SS = "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))($|\\s([0-1]\\d|[2][0-3])\\:[0-5]\\d\\:[0-5]\\d)";
    public static final String REGX_YYYY_MM_DD_H_MM_SS  = "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))($|\\s[0-9]\\:[0-5]\\d\\:[0-5]\\d)";
    public static final String REGX_YYYY_MM_DD_HH_M_SS  = "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))($|\\s([0-1]\\d|[2][0-3])\\:[0-9]\\:[0-5]\\d)";
    public static final String REGX_YYYY_MM_DD_H_M_SS   = "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))($|\\s[0-9]\\:[0-9]\\:[0-5]\\d)";
    public static final String REGX_YYYY_MM_DD_H_M_S    = "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))($|\\s[0-9]\\:[0-9]\\:[0-9])";
    public static final String REGX_YYYY_MM_DD_HH_MM_S  = "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))($|\\s([0-1]\\d|[2][0-3])\\:[0-5]\\d\\:[0-9])";

    public static final String YYYY_MM_DD_HH_MM_SS      = "yyyy-MM-dd HH:mm:ss";
    public static final String YYYY_MM_DD_H_MM_SS       = "yyyy-MM-dd H:mm:ss";
    public static final String YYYY_MM_DD_HH_M_SS       = "yyyy-MM-dd HH:m:ss";
    public static final String YYYY_MM_DD_HH_MM_S       = "yyyy-MM-dd HH:mm:s";
    public static final String YYYY_MM_DD_H_M_SS        = "yyyy-MM-dd H:m:ss";
    public static final String YYYY_MM_DD_H_M_S         = "yyyy-MM-dd H:m:s";

    /**
     * 输入 时间字符串  返回对应的  时间格式  提供 SimpleDateFormat 使用
     * @param time	add by  xiaolei1.wang
     * @return
     */
    public String getDateFormat(String time) {
        String[] formats = { REGX_YYYY_MM_DD_H_MM_SS, REGX_YYYY_MM_DD_HH_M_SS, REGX_YYYY_MM_DD_HH_MM_S, REGX_YYYY_MM_DD_HH_MM_SS, REGX_YYYY_MM_DD_H_M_S, REGX_YYYY_MM_DD_H_M_SS };
        Map<String, String> hash = new HashMap<String, String>() {
            private static final long serialVersionUID = 1L;
            {
                put(REGX_YYYY_MM_DD_HH_MM_SS, YYYY_MM_DD_HH_MM_SS);
                put(REGX_YYYY_MM_DD_H_MM_SS, YYYY_MM_DD_H_MM_SS);
                put(REGX_YYYY_MM_DD_HH_M_SS, YYYY_MM_DD_HH_M_SS);
                put(REGX_YYYY_MM_DD_HH_MM_S, YYYY_MM_DD_HH_MM_S);
                put(REGX_YYYY_MM_DD_H_M_S, YYYY_MM_DD_H_M_S);
                put(REGX_YYYY_MM_DD_H_M_SS, YYYY_MM_DD_H_M_SS);
            }
        };
        for (String reg : formats) {
            if (Pattern.matches(reg, time)) {
                return hash.get(reg);
            }
        }
        return null;
    };

}
