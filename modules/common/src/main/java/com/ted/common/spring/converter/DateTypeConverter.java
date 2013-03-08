package com.ted.common.spring.converter;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.core.convert.converter.Converter;
import org.springframework.util.StringUtils;

/**
 * copy from cms
 *
 */
public class DateTypeConverter implements Converter<String, Date> {
    public static final DateFormat DF_LONG    = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    public static final DateFormat DF_SHORT   = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * 短类型日期长度
     */
    public static final int        SHORT_DATE = 10;

    @Override
    public Date convert(String source) {
        source = source.trim();
        if (!StringUtils.hasText(source)) {
            return null;
        }
        try {
            if (source.length() <= SHORT_DATE) {
                return DF_SHORT.parse(source);
            } else {
                return new java.sql.Timestamp(DF_LONG.parse(source).getTime());
            }
        } catch (ParseException ex) {
            IllegalArgumentException iae = new IllegalArgumentException("Could not parse date: " + ex.getMessage());
            iae.initCause(ex);
            throw iae;
        }
    }

}
