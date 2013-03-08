package com.ted.xplatform.service;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.util.AttachmentUtils;

/**
 * 附件的service
 */
@Transactional
@Service("attachmentService")
public class AttachmentService {
    @Inject
    private JpaSupportDao   jpaSupportDao;
    
    
    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    /**
     * 工具方法:根据当前用户过滤菜单
     * 注意：这个只能在事务中运行。并且不过滤admin
     * @param List<MenuResource> menuResourceList
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    public Attachment getAttachmentById(Long attachId) {
        Attachment attachment = jpaSupportDao.getEntityManager().find(Attachment.class, attachId);
        return attachment;
    };
    
    /**
     * Attachment的删除
     */
    @Transactional
    public void delete(Long attachId) {
        Attachment attachment = jpaSupportDao.getEntityManager().find(Attachment.class, attachId);
        jpaSupportDao.getEntityManager().remove(attachment);
    }
    
    @Transactional(readOnly = true)
    public void showPic(Long attachmentId, HttpServletResponse response) {
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
    }
}
