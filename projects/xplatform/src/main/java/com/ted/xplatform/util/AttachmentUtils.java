package com.ted.xplatform.util;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest;

import com.google.common.collect.Lists;
import com.ted.common.util.ConfigUtils;
import com.ted.common.util.FileUtils;
import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.vo.AttachmentVO;

/**
 * 附件的工具类
 */
public abstract class AttachmentUtils {
    private static final Logger logger = LoggerFactory.getLogger(AttachmentUtils.class);

    public static final String genRelativePath(String fileName, String middlePath) {
        return StringUtils.trimToEmpty(middlePath) + getRandomFileName(fileName);
    }

    //relativePath 为除root的全相对路径,relativePath不用带/
    public static final String getAttachFullPath(String relativePath) {
        return ConfigUtils.getAttachFileDir() + relativePath;
    }

    public static final String getRandomFileName(String fileName) {
        String randomFileName = UUID.randomUUID().toString();
        String extension = FileUtils.getExtension(fileName, true);
        String newFileName = randomFileName + extension;
        return newFileName;
    }

    //检验文件夹是否存在
    public static final void checkAttachFileDir(String fullPath) {
        String dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
        File file = new File(dir);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    //saveFile2Disk
    public static final <T extends Attachment> T saveAttachFile2Disk(Class<T> T, AttachmentVO attachmentVO) throws Exception {
        if (null == attachmentVO) {
            return null;
        }
        String relativePath = genRelativePath(attachmentVO.getFileName(), attachmentVO.getMiddlePath());
        logger.debug("附件上传的相对路径是:{},请核查。", relativePath);
        String fullPath = AttachmentUtils.getAttachFullPath(relativePath);
        logger.debug("附件上传的绝对路径是:{},请核查。", fullPath);
        AttachmentUtils.checkAttachFileDir(fullPath);
        FileOutputStream fos = new FileOutputStream(fullPath);
        Long fileSize = new Long(FileCopyUtils.copy(attachmentVO.getInputstream(), fos));

        T attach = T.newInstance();
        attach.setFileName(attachmentVO.getFileName());
        attach.setFilePath(relativePath);
        attach.setFileSize(fileSize);
        return attach;
    }

    //saveFile2Disk
    public static final <T extends Attachment> Set<T> saveAttachFile2Disk(Class<T> T, Collection<AttachmentVO> attachmentVOSet) throws Exception {
        Set<T> attachSet = new HashSet<T>();
        for (AttachmentVO attachmentVO : attachmentVOSet) {
            T t = saveAttachFile2Disk(T, attachmentVO);
            if (null != t) {
                attachSet.add(t);
            }
        }
        return attachSet;
    }

    public static final InputStream convert(File file) throws Exception {
        Assert.notNull(file);
        return new FileInputStream(file);
    }

    public static final InputStream convert(byte[] bytes) throws Exception {
        Assert.notNull(bytes);
        return new ByteArrayInputStream(bytes);
    }

    //Constants.UPLOAD_FILE
    public static final AttachmentVO getAttachmentVO(DefaultMultipartHttpServletRequest multipartRequest, String key) throws Exception {
        MultipartFile upLoadFile = multipartRequest.getFile(key);
        if (upLoadFile != null && !upLoadFile.isEmpty()) {
            InputStream ios = upLoadFile.getInputStream();
            String originalFilename = upLoadFile.getOriginalFilename();
            AttachmentVO attachmentVO = new AttachmentVO();
            attachmentVO.setFileName(originalFilename);
            attachmentVO.setInputstream(ios);
            return attachmentVO;
        } else {
            return null;
        }
    };

    //获得多个附件
    public static final List<AttachmentVO> getAttachmentVOList(DefaultMultipartHttpServletRequest multipartRequest, String key) throws Exception {
        List<MultipartFile> upLoadFileList = multipartRequest.getFiles(key);
        List<AttachmentVO> AttachmentVOList = Lists.newArrayList();
        if (upLoadFileList != null && !upLoadFileList.isEmpty()) {
            for (MultipartFile upLoadFile : upLoadFileList) {
                InputStream ios = upLoadFile.getInputStream();
                String originalFilename = upLoadFile.getOriginalFilename();
                AttachmentVO attachmentVO = new AttachmentVO();
                attachmentVO.setFileName(originalFilename);
                attachmentVO.setInputstream(ios);
                AttachmentVOList.add(attachmentVO);
            }
        }
        return AttachmentVOList;
    };

}
