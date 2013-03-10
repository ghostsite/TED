package com.ted.common.mvc.miplatform.converter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;

import com.tobesoft.platform.PlatformRequest;
import com.tobesoft.platform.PlatformResponse;
import com.tobesoft.platform.data.DatasetList;
import com.tobesoft.platform.data.VariableList;
@Deprecated
public class MiMapMessageConverter extends MiMessageConverter<Map<String,?>> {

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
	public Map<String, ?> read(Class<? extends Map<String, ?>> clazz,
			HttpInputMessage inputMessage) throws IOException,
			HttpMessageNotReadableException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void writeInternal(Map<String, ?> returnValue,
			MethodParameter returnType, HttpOutputMessage outputMessage)
			throws Exception {
		PlatformResponse platformResponse = new PlatformResponse(
				outputMessage.getBody(), PlatformRequest.XML, "utf-8");

			VariableList list = new VariableList();

			for (Map.Entry<String, ?> entry : returnValue.entrySet()) {
				list.add(entry.getKey(), entry.getValue());
			}
			platformResponse.sendData(list, new DatasetList());		
	}

	@Override
	public boolean canWrite(Class<?> clazz) {
		return Map.class.isAssignableFrom(clazz);
	}

}
