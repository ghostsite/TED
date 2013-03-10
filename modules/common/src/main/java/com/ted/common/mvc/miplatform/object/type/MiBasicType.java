package com.ted.common.mvc.miplatform.object.type;

import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;

public interface MiBasicType<T> {
	
	public DatasetList getDatasetList(String datasetName);
	
	public VariableList getVariableList();
	
	public void describe(Object object);
	
	public void setContent(T object);
}
