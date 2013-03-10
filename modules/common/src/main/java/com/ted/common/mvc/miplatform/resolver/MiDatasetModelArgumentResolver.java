package com.ted.common.mvc.miplatform.resolver;

import java.lang.reflect.InvocationTargetException;

import javax.inject.Inject;

import org.apache.commons.beanutils.ConstructorUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ted.common.mvc.miplatform.annotation.MiDataSetModel;
import com.ted.common.mvc.miplatform.exception.MiException;
import com.ted.common.mvc.miplatform.factory.MiPlatformFactory;
import com.tobesoft.platform.data.ColumnInfo;
import com.tobesoft.platform.data.Dataset;

public class MiDatasetModelArgumentResolver implements HandlerMethodArgumentResolver {

	@Inject
	private MiPlatformFactory miFactory;
	
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(MiDataSetModel.class) != null; 
	}
	
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
			WebDataBinderFactory binderFactory) throws Exception {

//		MiHttpServletRequest miRequest = webRequest.getNativeRequest(MiHttpServletRequest.class);
//		MiHttpServletRequest miRequest = WebUtils.getNativeRequest(servletRequest, MiHttpServletRequest.class);

		Object bean = ConstructorUtils.invokeConstructor(parameter.getParameterType(), null);

		Dataset dataset = miFactory.getDatasetList().get(parameter.getParameterName());
		int columnCount = dataset.getColumnCount() - dataset.getConstColumnCount(); 
		
		for(int i=0;i<columnCount;i++){
			String key = dataset.getColumnInfo(i).getColumnID();
			Object value = null;	
			short type = dataset.getColumnInfo(i).getType();
			
			switch(type) {
				case ColumnInfo.COLTYPE_DATE : value = dataset.getColumnAsDate(0, key); break;
				case ColumnInfo.COLTYPE_DECIMAL : value = dataset.getColumnAsDouble(0, key); break;
				case ColumnInfo.COLTYPE_INT : value = dataset.getColumnAsInteger(0, key); break;
				case ColumnInfo.COLTYPE_BLOB : value = dataset.getColumnAsByteArray(0, key); break;
				default : value = dataset.getColumnAsString(0, key);
			}
			
			try {
				PropertyUtils.setProperty(bean, key, value);
			} catch (IllegalAccessException e) {
	            throw new MiException("IllegalAccessException");
			}catch (InvocationTargetException e) {
				throw new MiException("InvocationTargetException");
			}catch (NoSuchMethodException e) {
				throw new MiException("can't find method set"+key+"() in class" + parameter.getParameterType());
			}
			
		}
			
		return bean;
	}
	
}
