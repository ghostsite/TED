package com.ted.common.mvc.miplatform.object.type.dataset;

import java.lang.reflect.Field;

import com.ted.common.mvc.miplatform.object.util.MiHelpUtil;
import com.tobesoft.platform.data.DatasetList;

public class MiObjectDatasetType extends MiDatasetType<Object>{

	private Field[] fields;
	
	@Override
	public void describe(Object object) {
		
		Class<?> clazz = object.getClass();
		this.fields = clazz.getDeclaredFields();
		
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
//	public void setDatasetHeader(Object object) {
//		MiHelpUtil.setDatasetHeaderByField(fields, dataset);
//	}

	@Override
	public void setContent(Object object) {
		MiHelpUtil.setDatasetContentByObject(object, fields, dataset);
	}

}
