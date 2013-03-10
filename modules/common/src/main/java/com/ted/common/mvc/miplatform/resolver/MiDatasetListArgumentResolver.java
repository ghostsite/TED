package com.ted.common.mvc.miplatform.resolver;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.beanutils.ConstructorUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ted.common.mvc.miplatform.annotation.MiDataSetList;
import com.ted.common.mvc.miplatform.exception.MiException;
import com.ted.common.mvc.miplatform.factory.MiPlatformFactory;
import com.tobesoft.platform.data.ColumnInfo;
import com.tobesoft.platform.data.Dataset;

public class MiDatasetListArgumentResolver implements HandlerMethodArgumentResolver {

	@Inject
	private MiPlatformFactory miFactory;
	
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(MiDataSetList.class) != null; 
	}
	
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
			WebDataBinderFactory binderFactory) throws Exception {
		
//		HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
//		MiHttpServletRequest miRequest = WebUtils.getNativeRequest(servletRequest, MiHttpServletRequest.class);
		
		String name = parameter.getParameterName();
		Type gpt = parameter.getGenericParameterType();
		if(!(gpt instanceof ParameterizedType)){
			throw new Exception("method "+parameter.getMethod()+"'s parameter "+ name +" is not List");
		}
		
		Class<?> clazz = (Class<?>)((ParameterizedType)gpt).getActualTypeArguments()[0];

		List<Object> target = new ArrayList<Object>();
		
		Dataset dataset = miFactory.getDatasetList().get(name);
		for(int row = 0; row < dataset.getRowCount(); row++){
			int columnCount = dataset.getColumnCount() - dataset.getConstColumnCount(); 
			Object bean = ConstructorUtils.invokeConstructor(clazz, null);
			for(int i=0;i<columnCount;i++){
				String key = dataset.getColumnInfo(i).getColumnID();
				Object value;	
				short j = dataset.getColumnInfo(i).getType();
				
				switch(j) {
					case ColumnInfo.COLTYPE_DATE : value = dataset.getColumnAsDate(row, key); break;
					case ColumnInfo.COLTYPE_DECIMAL : value = dataset.getColumnAsDouble(row, key); break;
					case ColumnInfo.COLTYPE_INT : value = dataset.getColumnAsInteger(row, key); break;
					case ColumnInfo.COLTYPE_BLOB : value = dataset.getColumnAsByteArray(row, key); break;
					default : value = dataset.getColumnAsString(row, key);
				}
				try {
					PropertyUtils.setProperty(bean, key, value);
				} catch (IllegalAccessException e) {
		            throw new MiException("can't get match property" + key + "in class" + clazz);
				}catch (InvocationTargetException e) {
					throw new MiException("InvocationTargetException");
				}catch (NoSuchMethodException e) {
					throw new MiException("NoSuchMethodException");
				}
			}
			target.add(bean);
		}
			
		return target;
	}
	
}
