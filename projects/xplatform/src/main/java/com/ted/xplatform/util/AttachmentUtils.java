package com.ted.xplatform.util;

import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ted.common.util.ConfigUtils;
import com.ted.common.util.DateUtils;
import com.ted.common.util.FileUtils;

/**
 * 附件的工具类
 * 保存文件的根目录需要到配置文件context.xml中读取
 * 文件路径和文件名的生成规则，需要在这里进行实现。
 */
public abstract class AttachmentUtils {
    public static final String getDir() {
        return getDir(getMiddleDir());
    }
    
    public static final String getDir(String middlePath) {
        return ConfigUtils.getAttachFileDir() + middlePath + "/";
    }
    
    public static final String getMiddleDir() {
        return DateUtils.getCurrentStringDate(DateUtils.PATTERN_YYYYMM2);
    }
    
    
    public static final String getRandomFileName(String originName) {
        String randomFileName = UUID.randomUUID().toString();
        String extension = FileUtils.getExtension(originName, true);
        String newFileName = randomFileName + extension;
        return newFileName;
    }

    /**
     * 这个是不带key参数的
     */
    public static final MultipartFile getMultipartFile(MultipartHttpServletRequest multipartRequest) throws Exception {
        String key = getDefaultKey(multipartRequest);
        if (key == null) {
            return null;
        }
        return multipartRequest.getFile(key);
    };

    /**
     * 获得多个附件,不带参数key
     */
    public static final List<MultipartFile> getMultipartFiles(MultipartHttpServletRequest multipartRequest) throws Exception {
        String key = getDefaultKey(multipartRequest);
        if (key == null) {
            return null;
        }
        return multipartRequest.getFiles(key);
    };

    //获得第一个参数
    private static final String getDefaultKey(MultipartHttpServletRequest multipartRequest) {
        Iterator<String> itr = multipartRequest.getFileNames();
        if (!itr.hasNext()) {
            return null;
        }
        return (String) itr.next();
    };

}
