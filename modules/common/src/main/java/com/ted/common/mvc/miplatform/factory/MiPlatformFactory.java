package com.ted.common.mvc.miplatform.factory;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import com.ted.common.mvc.miplatform.exception.MiException;
import com.tobesoft.platform.PlatformRequest;
import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;

public class MiPlatformFactory {

	private PlatformRequest platformRequest;
	
	public void setPlatformRequest(HttpServletRequest request) throws IOException{
		platformRequest = new PlatformRequest(request, "utf-8");
		platformRequest.receiveData();
	}
	
	public MiPlatformFactory(){
	}

	public DatasetList getDatasetList() throws MiException{
		if(isReceive()){
			return platformRequest == null?null:platformRequest.getDatasetList();
		}else{
			throw new MiException();
		}
	}
	
	public VariableList getVariableList() throws MiException{
		if(isReceive()){
			return platformRequest == null?null:platformRequest.getVariableList();
		}else{
			throw new MiException();
		}
	}
	
	public boolean isReceive(){
		return platformRequest == null?false:platformRequest.getPlatformData() == null?false:true;
	}
	
}
