package com.ted.common.mvc.miplatform.object.type.dataset;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.List;

import org.springframework.core.MethodParameter;

import com.ted.common.mvc.miplatform.object.util.MiHelpUtil;
import com.tobesoft.platform.data.DatasetList;

public class MiListDatasetType extends MiDatasetType<List<?>>{

	private Field[] fields;
	
	@Override
	public void describe(Object object) {
		MethodParameter returnType = (MethodParameter)object;
		
		Class<?> returnClass = (Class<?>)((ParameterizedType)returnType.getGenericParameterType()).getActualTypeArguments()[0];
		fields = returnClass.getDeclaredFields();
		
		MiHelpUtil.setDatasetHeaderByField(fields, dataset);
	}

	@Override
	public DatasetList getDatasetList(String datasetName) {
		dataset.setId(datasetName);
		datasetList.add(dataset);
		return datasetList;
	}

//	@Override
//	public void setDatasetId(String name) {
//		dataset.setId(name);
//	}

//	@Override
//	public void setDatasetHeader(List<?> object) {
//		MiHelpUtil.setDatasetHeaderByField(fields, dataset);
//	}

	@Override
	public void setContent(List<?> object) {
		for(Object o : object){
			MiHelpUtil.setDatasetContentByObject(o, fields, dataset);
		}
		
	}

}
