package com.ted.common.mvc.miplatform.object.type.variable;

import com.ted.common.mvc.miplatform.object.type.MiAbstractType;
import com.ted.common.mvc.miplatform.object.type.MiBasicType;
import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;

public abstract class MiVariableType<T> extends MiAbstractType implements MiBasicType<T> {

	@Override
	public DatasetList getDatasetList(String datasetName) {
		return datasetList;
	}

	@Override
	public abstract VariableList getVariableList();
	
	public abstract void setContent(T object);

}
