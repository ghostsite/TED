package com.ted.common.util;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.ClassUtils;
import org.springframework.web.context.support.ServletContextResource;

/**
 * 资环的工具类,参照MES Resources.java date 20121119 Spring也有一个ResourceUtils
 */
public abstract class ResourceUtils {
    public static File getFile(String path) throws Exception {
        path = path.trim();
        if ((!path.startsWith("classpath")) && (isResourceByClasspath(path)))
            path = "classpath:" + path;
        return org.springframework.util.ResourceUtils.getFile(path);
    }

    public static String readFileToString(File file) throws Exception {
        return FileUtils.readFileToString(file, "UTF-8");
    }

    public static String readFileToString(String path) throws Exception {
        return readFileToString(getFile(path));
    }

    public static void writeStringToFile(File file, String data) throws Exception {
        FileUtils.writeStringToFile(file, data);
    }

    public static boolean isResourceByClasspath(String path) throws Exception {
        Resource resource = new ClassPathResource(path.trim(), ClassUtils.getDefaultClassLoader());
        return (resource != null) && (resource.exists());
    }

    public static String readResourceToStringByClasspath(String path) throws Exception {
        Resource resource = new ClassPathResource(path.trim(), ClassUtils.getDefaultClassLoader());
        return IOUtils.toString(resource.getInputStream());
    }
    
    public static Resource getResourceByClasspath(String path) throws Exception {
        Resource resource = new ClassPathResource(path.trim(), ClassUtils.getDefaultClassLoader());
        return (resource != null) && (resource.exists())? resource : null;
    }

    public static Resource getResource(HttpServletRequest request, String path) throws Exception {
        if (request == null){
            return null;
        }
        Resource resource = new ServletContextResource(request.getSession().getServletContext(), path);
        return (resource.exists()) && (resource.isReadable()) ? resource : null;
    }
}
