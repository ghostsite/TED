package com.ted.common.mvc.miplatform.object.type.variable;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtils;

import com.tobesoft.platform.data.VariableList;

public class MiObjectVariableType extends MiVariableType<Object>{

	private Map<String, String> kv;
	
	@SuppressWarnings("unchecked")
	@Override
	public void describe(Object object) {
		try {
			kv = PropertyUtils.describe(object);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		}
	}

	@Override
	public VariableList getVariableList() {
		return variableList;
	}

	@Override
	public void setContent(Object object) {
		for (Map.Entry<?, ?> entry : kv.entrySet()) {
			variableList.add((String) entry.getKey(), (String) entry.getValue());
		}
	}

}
