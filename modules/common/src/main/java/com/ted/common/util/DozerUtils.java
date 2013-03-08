package com.ted.common.util;

import java.util.Collection;
import java.util.List;

import org.dozer.DozerBeanMapper;

import com.google.common.collect.Lists;

/**
 * copy from BeanMapper ,author:calvin
 * 这个类需要考虑多个项目，有基础依赖，非基础的工程需要扩展dozerBeanMapping.xml，故要可配置化。
 */
public abstract class DozerUtils {
    /**
     * 持有Dozer单例, 避免重复创建DozerMapper消耗资源.
     */
    private static DozerBeanMapper dozer = new DozerBeanMapper();
    
    static{
        //List<String> mappingFileUrls = Lists.newArrayList("dozerBeanMapping.xml");
        //dozer.setMappingFiles(mappingFileUrls);
        dozer.setMappingFiles(ConfigUtils.getDozerBeanMappings());
    }

    /**
     * 基于Dozer转换对象的类型.
     */
    public static <T> T map(Object source, Class<T> destinationClass) {
        return dozer.map(source, destinationClass);
    }

    /**
     * 基于Dozer转换Collection中对象的类型.
     */
    public static <T> List<T> mapList(Collection<?> sourceList, Class<T> destinationClass) {
        List<T> destinationList = Lists.newArrayList();
        for (Object sourceObject : sourceList) {
            T destinationObject = dozer.map(sourceObject, destinationClass);
            destinationList.add(destinationObject);
        }
        return destinationList;
    }

    /**
     * 基于Dozer将对象A的值拷贝到对象B中.
     */
    public static void copy(Object source, Object destinationObject) {
        dozer.map(source, destinationObject);
    }
    
}
