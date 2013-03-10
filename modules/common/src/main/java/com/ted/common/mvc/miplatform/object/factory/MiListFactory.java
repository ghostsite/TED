package com.ted.common.mvc.miplatform.object.factory;

import java.util.List;

import com.ted.common.mvc.miplatform.object.type.MiBasicType;
import com.ted.common.mvc.miplatform.object.type.dataset.MiListDatasetType;

public class MiListFactory {
	public static MiBasicType<List<?>> createInstance(boolean isDataset){
		if(isDataset){
			return new MiListDatasetType();
		}else{
			return null;
		}
	}
}
