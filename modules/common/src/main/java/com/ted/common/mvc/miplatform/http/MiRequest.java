package com.ted.common.mvc.miplatform.http;

import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;

@Deprecated
public interface MiRequest {
	VariableList getVariableList();
	DatasetList getDatasetList();
}
