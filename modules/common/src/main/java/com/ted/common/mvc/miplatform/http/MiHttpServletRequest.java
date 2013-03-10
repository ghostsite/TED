package com.ted.common.mvc.miplatform.http;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import com.tobesoft.platform.PlatformRequest;
import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;

@Deprecated
public class MiHttpServletRequest extends HttpServletRequestWrapper implements MiRequest{

	PlatformRequest platformRequest;
	
	public MiHttpServletRequest(HttpServletRequest request) {
		super(request);
		try {
			platformRequest = new PlatformRequest((HttpServletRequest)request, "utf-8");
			platformRequest.receiveData();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public VariableList getVariableList() {
		return platformRequest.getVariableList();
	}

	@Override
	public DatasetList getDatasetList() {
		return platformRequest.getDatasetList();
	}

}
