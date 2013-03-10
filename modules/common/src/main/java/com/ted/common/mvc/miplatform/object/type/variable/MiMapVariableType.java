package com.ted.common.mvc.miplatform.object.type.variable;

import java.util.Map;

import com.tobesoft.platform.data.VariableList;

public class MiMapVariableType extends MiVariableType<Map<String, ?>>{

//	private Map<String, ?> kv;
	
	@Override
	public void describe(Object object) {
//		kv = (Map<String, ?>) object;
	}

	@Override
	public VariableList getVariableList() {
		return variableList;
	}

	@Override
	public void setContent(Map<String, ?> object) {
		for (Map.Entry<?, ?> entry : object.entrySet()) {
			variableList.add((String) entry.getKey(), entry.getValue());
		}
	}

}
