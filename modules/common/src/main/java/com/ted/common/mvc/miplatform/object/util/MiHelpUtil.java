package com.ted.common.mvc.miplatform.object.util;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.util.Map;

import com.tobesoft.platform.data.ColumnInfo;
import com.tobesoft.platform.data.Dataset;
import com.tobesoft.platform.data.Variant;

public class MiHelpUtil {

	public static final int MI_COLUMN_LENGTH = 255;
	
	public static Dataset setDatasetHeaderByMap(Map<String, ?> headerMap, Dataset dataset){
		
		for (Map.Entry<String, ?> entry : headerMap.entrySet()) {
			dataset.addColumn(entry.getKey(), ColumnInfo.COLTYPE_STRING, MI_COLUMN_LENGTH);
		}
		return dataset;
	}
	
	public static Dataset setDatasetContentByMap(Map<?, ?> headerMap, Dataset dataset){
		for (Map.Entry<?, ?> entry : headerMap.entrySet()) {
			int row = dataset.appendRow();
			dataset.setColumn(row, (String) entry.getKey(), (String) entry.getValue());
		}
		return dataset;
	}
	
	public static Dataset setDatasetHeaderByField(Field[] fields, Dataset dataset){
		
		for(Field field : fields){
			Class<?> fieldClazz = field.getType();
			
			short type = ColumnInfo.COLTYPE_STRING;
			
	        if (Long.class.isAssignableFrom(fieldClazz)) {
	            type = ColumnInfo.COLTYPE_LONG;
	        } else if (Integer.class.isAssignableFrom(fieldClazz) || int.class.isAssignableFrom(fieldClazz)) {
	            type = ColumnInfo.COLTYPE_INT;
	        } else if (Character.class.isAssignableFrom(fieldClazz)) {
	            type = ColumnInfo.COLTYPE_CHAR;
	        } else if (Float.class.isAssignableFrom(fieldClazz) || Double.class.isAssignableFrom(fieldClazz) || BigDecimal.class.isAssignableFrom(fieldClazz)) {
	            type = ColumnInfo.COLTYPE_DECIMAL;
	        } else if (java.util.Date.class.isAssignableFrom(fieldClazz) ||java.sql.Date.class.isAssignableFrom(fieldClazz) || java.sql.Timestamp.class.isAssignableFrom(fieldClazz)) {
	            type = ColumnInfo.COLTYPE_DATE;
	        } else if (byte[].class.isAssignableFrom(fieldClazz)) {
	            type = ColumnInfo.COLTYPE_BLOB;
	        }else{
	        	type = ColumnInfo.COLTYPE_STRING;
	        }
	        dataset.addColumn(field.getName(), type, 255);
		}
		return dataset;
	}
	
	public static Dataset setDatasetContentByObject(Object object, Field[] fields, Dataset dataset){
		int row = dataset.appendRow();
		for(Field field : fields){
			field.setAccessible(true);
			Variant variant = new Variant();
            try {
				variant.setObject(field.get(object));
			} catch (IllegalArgumentException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			}
	        dataset.setColumn(row, field.getName(), variant);
		}
		return dataset;
	}
}
