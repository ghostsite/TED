package com.ted.common.mvc.miplatform.object.type.dataset;

import com.ted.common.mvc.miplatform.object.type.MiAbstractType;
import com.ted.common.mvc.miplatform.object.type.MiBasicType;
import com.tobesoft.platform.data.Dataset;
import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;

public abstract class MiDatasetType<T> extends MiAbstractType implements MiBasicType<T>{

	protected Dataset dataset = new Dataset();
	
	@Override
	public abstract DatasetList getDatasetList(String datasetName);
	
//	public abstract void setDatasetId(String name);
	
//	public abstract void setDatasetHeader(T object);
	
	public abstract void setContent(T object);

	@Override
	public VariableList getVariableList() {
		return variableList;
	}

}
