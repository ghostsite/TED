package com.ted.xplatform.service;

import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.support.page.JsonPage;
import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.pojo.common.FileResource;

/**
 * File的Service,类比MenuResourceService,
 * 具体可以参考AttachmentService
 */
@Transactional
@Service("fileResourceService")
public class FileResourceService {
    final Logger               logger        = LoggerFactory.getLogger(FileResourceService.class);

    @Inject
    JpaSupportDao              jpaSupportDao;

    @Inject
    MessageSource              messageSource;
    
    @Inject
    ResourceService            resourceService;


    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setResourceService(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * 保存
     */
    @Transactional
    public void save(FileResource fileResource) {
        //比Attachment多了code ,name
        jpaSupportDao.getEntityManager().persist(fileResource);
    }
    
    @Transactional(readOnly = true)
    public FileResource getFileResourceById(Long id) {
        return jpaSupportDao.getEntityManager().find(FileResource.class, id);
    };

    /**
     * 根据codeType
     */
    @Transactional(readOnly = true)
    public List<FileResource> getFileResourceByTypeCode(String typeCode) {
        Attachment example = new Attachment();
        example.setTypeCode(typeCode);
        return jpaSupportDao.findByExample(example);
    };

    /**
     * 根据codeType
     */
    @Transactional(readOnly = true)
    public List<FileResource> getFileResourceByCodeTypeForeignId(String typeCode, Long foreignId) {
        FileResource example = new FileResource();
        example.setTypeCode(typeCode);
        example.setForeignId(foreignId);
        return jpaSupportDao.findByExample(example);
    };

    /**
     * FileResource的删除
     */
    @Transactional
    public void delete(Long id) {
        FileResource fileResource = jpaSupportDao.getEntityManager().find(FileResource.class, id);
        jpaSupportDao.getEntityManager().remove(fileResource);
    }

    /**
     * 获得所有的附件信息,only from db
     */
    @Transactional(readOnly = true)
    public List<FileResource> getAllFileResource() {
        return jpaSupportDao.getAll(FileResource.class);
    }

    /**
     * 获得所有的附件信息,only from db, paged
     */
    @Transactional(readOnly = true)
    public JsonPage<FileResource> pagedAllFileResource(int start, int limit) {
        return jpaSupportDao.pagedAll(FileResource.class, start, limit);
    }
}
