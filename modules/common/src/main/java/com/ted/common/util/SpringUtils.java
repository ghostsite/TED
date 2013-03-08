package com.ted.common.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

/**
 *
 */
public abstract class SpringUtils {
    public static final List<Map<String, Object>> convert(SqlRowSet rowset) {
        SqlRowSetMetaData metaData = rowset.getMetaData();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        while (rowset.next()) {
            Map<String, Object> map = getMapFromRow(rowset, metaData);
            list.add(map);
        }
        return list;
    };

    private static final Map<String, Object> getMapFromRow(SqlRowSet rs, SqlRowSetMetaData metaData) {
        Map<String, Object> map = new HashMap<String, Object>();
        String[] columnNames = metaData.getColumnNames();
        for (String columnName : columnNames) {
            map.put(columnName, rs.getObject(columnName));
        }
        return map;
    };

    public static final String getMessage(String code, MessageSource messageSource) {
        return getMessage(code, new String[] {}, messageSource);
    }
    
    public static final String getMessage(String code, Object[] args, MessageSource messageSource) {
        return messageSource.getMessage(code, args, Locale.getDefault());
    }
}
