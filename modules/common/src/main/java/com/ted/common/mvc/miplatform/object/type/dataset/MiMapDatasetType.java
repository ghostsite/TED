package com.ted.common.mvc.miplatform.object.type.dataset;

import java.util.Map;

import com.ted.common.mvc.miplatform.object.util.MiHelpUtil;
import com.tobesoft.platform.data.DatasetList;


public class MiMapDatasetType extends MiDatasetType<Map<String, ?>>{
	
	private Map<String, ?> kv;

	@SuppressWarnings("unchecked")
	@Override
	public void describe(Object object) {
		kv = (Map<String, ?>)object;
		MiHelpUtil.setDatasetHeaderByMap(kv, dataset);
	}

	@Override
	public DatasetList getDatasetList(String datasetName) {
		dataset.setId(datasetName);
		datasetList.add(dataset);
		return datasetList;
	}
//
//	@Override
//	public void setDatasetId(String name) {
//		dataset.setId(name);		
//	}

//	@Override
//	public void setDatasetHeader(Map<String, ?> object) {
//		
//		MiHelpUtil.setDatasetHeaderByMap(object, dataset);
//	}

	@Override
	public void setContent(Map<String, ?> object) {
		dataset = MiHelpUtil.setDatasetContentByMap(object, dataset);
	}

}
