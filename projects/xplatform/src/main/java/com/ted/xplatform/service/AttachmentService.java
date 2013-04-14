package com.ted.xplatform.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.support.file.FileManager;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.FileUtils;
import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.util.AttachmentUtils;

/**
 * 附件的service,关于附件种类：typeCode在每个Service类里面自己定义吧。
 * or 在这Attachment.Type定义.
 */
@Transactional
@Service("attachmentService")
public class AttachmentService {
    @Inject
    private JpaSupportDao jpaSupportDao;

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    @Inject
    FileManager fileManager = null;

    public void setFileManager(FileManager fileManager) {
        this.fileManager = fileManager;
    }

    /**
     * 保存，这个只保存对象
     */
    @Transactional
    public void save(Attachment attachment) {
        jpaSupportDao.getEntityManager().persist(attachment);
    }

    @Transactional
    public Attachment save(MultipartHttpServletRequest multipartRequest) throws Exception {
        MultipartFile multipartFile = AttachmentUtils.getMultipartFile(multipartRequest);
        String middleDir = AttachmentUtils.getMiddleDir();
        String dir = AttachmentUtils.getDir(middleDir);
        String fileName = AttachmentUtils.getRandomFileName(multipartFile.getOriginalFilename());
        fileManager.save(dir, fileName, multipartFile.getBytes());
        Attachment attachment = new Attachment();
        attachment.setOriginName(multipartFile.getOriginalFilename());
        attachment.setFileName(fileName);
        attachment.setFilePath(middleDir);
        attachment.setFileSize(new Long(multipartFile.getBytes().length));
        attachment.setFileType(FileUtils.getExtension(multipartFile.getOriginalFilename(), true));
        save(attachment);
        return attachment;
    }

    /**
     * 
     */
    @Transactional(readOnly = true)
    public Attachment getAttachmentById(Long attachId) {
        Attachment attachment = jpaSupportDao.getEntityManager().find(Attachment.class, attachId);
        return attachment;
    };

    /**
     * 根据codeType
     */
    @Transactional(readOnly = true)
    public List<Attachment> getAttachmentByTypeCode(String typeCode) {
        Attachment example = new Attachment();
        example.setTypeCode(typeCode);
        return jpaSupportDao.findByExample(example);
    };

    /**
     * 根据codeType
     */
    @Transactional(readOnly = true)
    public List<Attachment> getAttachmentByCodeTypeForeignId(String typeCode, Long foreignId) {
        Attachment example = new Attachment();
        example.setTypeCode(typeCode);
        example.setForeignId(foreignId);
        return jpaSupportDao.findByExample(example);
    };

    /**
     * Attachment的删除
     */
    @Transactional
    public void delete(Long attachId) {
        Attachment attachment = jpaSupportDao.getEntityManager().find(Attachment.class, attachId);
        jpaSupportDao.getEntityManager().remove(attachment);
    }

    /**
     * 获得所有的附件信息,only from db
     */
    @Transactional(readOnly = true)
    public List<Attachment> getAllAttachment() {
        return jpaSupportDao.getAll(Attachment.class);
    }

    /**
     * 获得所有的附件信息,only from db, paged
     */
    @Transactional(readOnly = true)
    public JsonPage<Attachment> pagedAllAttachment(int start, int limit) {
        return jpaSupportDao.pagedAll(Attachment.class, start, limit);
    }

    @Transactional(readOnly = true)
    public Attachment getDownloadAttachment(Long fileId) {
        Attachment attachment = (Attachment) getAttachmentById(fileId);
        if (null != attachment) {
            String fullPath = AttachmentUtils.getDir(attachment.getFilePath());
            byte[] bytes = fileManager.load(fullPath, attachment.getFileName());
            attachment.setBytes(bytes);
        }
        return attachment;
    };

}
