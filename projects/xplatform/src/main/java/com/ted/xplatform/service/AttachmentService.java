package com.ted.xplatform.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.support.page.JsonPage;
import com.ted.xplatform.pojo.common.Attachment;

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

    /**
     * 保存
     */
    @Transactional
    public void save(Attachment attachment) {
        jpaSupportDao.getEntityManager().persist(attachment);
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

}
