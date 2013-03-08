package com.ted.common.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.util.Assert;

import com.ted.common.Constants;

/**
 * for extjs
 *
 */
public class CommonUtils {
	public static final int getStartIntFromMap(Map<String,Object> params) {
		return getIntFromMap(params, Constants.START);
	}

	public static final int getLimitIntFromMap(Map<String,Object> params) {
		return getIntFromMap(params, Constants.LIMIT);
	}

	public static final int getIntFromMap(Map<String,Object> params, String key) {
		Assert.notNull(params);
		Assert.isTrue(params.keySet().contains(key));
		Assert.isTrue(null != params.get(key));
		Object v = params.get(key);
		Class<?> retType = v.getClass();
		Object ab = null;
		if (retType.isArray()) {
			// Object[] o = ((Object[])v);
			// List a = Arrays.asList(o);
			ab = Arrays.asList((Object[]) v).get(0);
		} else
			ab = v;
		Assert.isTrue(NumberUtils.isNumber(ab.toString()));
		return NumberUtils.createInteger(ab.toString());
	};

	@Deprecated
	public static Object[] getParam(Object object) throws Exception {
		Map<?,?> describe = BeanUtils.describe(object);
		List<String> params = new ArrayList<String>();
		for (Object o : describe.entrySet()) {
			params.add(o.toString());
		}
		return params.toArray();
	}
}
