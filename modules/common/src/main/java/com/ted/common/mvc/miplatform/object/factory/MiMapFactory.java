package com.ted.common.mvc.miplatform.object.factory;

import java.util.Map;

import com.ted.common.mvc.miplatform.object.type.MiBasicType;
import com.ted.common.mvc.miplatform.object.type.dataset.MiMapDatasetType;
import com.ted.common.mvc.miplatform.object.type.variable.MiMapVariableType;

public class MiMapFactory {
	public static MiBasicType<Map<String, ?>> createInstance(boolean isDataset){
		if(isDataset){
			return new MiMapDatasetType();
		}else{
			return new MiMapVariableType();
		}
	}
}
