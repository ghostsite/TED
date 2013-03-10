package com.ted.common.mvc.miplatform.object.factory;

import com.ted.common.mvc.miplatform.object.type.MiBasicType;
import com.ted.common.mvc.miplatform.object.type.dataset.MiObjectDatasetType;
import com.ted.common.mvc.miplatform.object.type.variable.MiObjectVariableType;

public class MiObjectFactory {
	public static MiBasicType<Object> createInstance(boolean isDataset){
		if(isDataset){
			return new MiObjectDatasetType();
		}else{
			return new MiObjectVariableType();
		}
	}
}
