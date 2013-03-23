package com.ted.xplatform.service;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.support.page.JsonPage;
import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.util.AttachmentUtils;

/**
 * 附件的service
 */
@Transactional
@Service("attachmentService")
public class AttachmentService {
    @Inject
    private JpaSupportDao jpaSupportDao;

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
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

    /**
     * Attachment的删除
     */
    @Transactional
    public void delete(Long attachId) {
        Attachment attachment = jpaSupportDao.getEntityManager().find(Attachment.class, attachId);
        jpaSupportDao.getEntityManager().remove(attachment);
    }

    /**
     * @TODO to refactor ,by DownloadHelper.java
     * @param attachmentId
     * @param response
     */
    @Transactional(readOnly = true)
    public void download(Long attachmentId, HttpServletResponse response) {
        Attachment attachment = (Attachment) getAttachmentById(attachmentId);
        try {
            if (null != attachment) {
                String fullPath = AttachmentUtils.getAttachFullPath(attachment.getFilePath());
                FileSystemResource fileResource = new FileSystemResource(fullPath);
                IOUtils.copy(fileResource.getInputStream(), response.getOutputStream());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    };

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
}
