package com.ted.common.mvc.miplatform.converter;

import java.io.IOException;
import java.util.List;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;

import com.ted.common.mvc.miplatform.annotation.MiResponseBody;
import com.ted.common.mvc.miplatform.object.factory.MiListFactory;
import com.ted.common.mvc.miplatform.object.type.MiBasicType;
import com.tobesoft.platform.PlatformRequest;
import com.tobesoft.platform.PlatformResponse;


public class MiListMessageConverter extends MiMessageConverter<List<Object>>{

	@Override
	public boolean canRead(Class<?> clazz, MediaType mediaType) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean canWrite(Class<?> clazz) {
		return List.class.isAssignableFrom(clazz);
	}
	
	@Override
	public List<MediaType> getSupportedMediaTypes() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Object> read(Class<? extends List<Object>> clazz,
			HttpInputMessage inputMessage) throws IOException,
			HttpMessageNotReadableException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void writeInternal(List<Object> returnValue, MethodParameter returnType,
			HttpOutputMessage outputMessage) throws Exception {
		
		PlatformResponse platformResponse = new PlatformResponse(
				outputMessage.getBody(), PlatformRequest.XML, "utf-8");
		
		MiResponseBody miResponseBody = returnType.getMethodAnnotation(MiResponseBody.class);

		MiBasicType<List<?>> miMap = MiListFactory.createInstance(miResponseBody.isDataset());
		miMap.describe(returnType);
		miMap.setContent(returnValue);
		platformResponse.sendData(miMap.getVariableList(), miMap.getDatasetList(miResponseBody.returnDatasetName()));		
	
		
	}

	
}
