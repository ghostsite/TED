package com.ted.common.mvc.miplatform.converter;

import java.io.IOException;
import java.util.List;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;

import com.tobesoft.platform.PlatformRequest;
import com.tobesoft.platform.PlatformResponse;
import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;

public class MiVariableMessageConverter extends MiMessageConverter<VariableList>{

	@Override
	public boolean canRead(Class<?> clazz, MediaType mediaType) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public List<MediaType> getSupportedMediaTypes() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public VariableList read(Class<? extends VariableList> clazz,
			HttpInputMessage inputMessage) throws IOException,
			HttpMessageNotReadableException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void writeInternal(VariableList returnValue,
			MethodParameter returnType, HttpOutputMessage outputMessage)
			throws Exception {
		PlatformResponse platformResponse = new PlatformResponse(
				outputMessage.getBody(), PlatformRequest.XML, "utf-8");		
		
		platformResponse.sendData(returnValue, new DatasetList());		
	}

	@Override
	public boolean canWrite(Class<?> clazz) {
		return VariableList.class.isAssignableFrom(clazz);
	}

}
