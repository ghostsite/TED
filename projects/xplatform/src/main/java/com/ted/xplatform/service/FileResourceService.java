package com.ted.xplatform.service;

import java.util.List;

import javax.inject.Inject;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Lists;
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
     * 保存,<b>NOTE</b>:注意，由于是上传，不同于MenuResource的添加，可以在添加的时候指定权限。
     * 这里指写死：canView权限。
     */
    @Transactional
    public void save(FileResource fileResource) {
        //比Attachment多了code ,name
        resourceService.addOperationProperties2Operations(fileResource);
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
    
    //========================一下是给分级授权用的========================//
    //-----------------工具方法-----------------//
    /**
     * 工具方法:根据当前用户过滤FileResource
     * 注意：这个只能在事务中运行。并且不过滤admin
     * @param List<MenuResource> menuResourceList
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    private List<FileResource> filterFileResourceByCurrentSubject(List<FileResource> fileResourceList) {
        Subject currentUser = SecurityUtils.getSubject();
        List<FileResource> filteredFileList = Lists.newArrayList();
        for (FileResource file : fileResourceList) {
            if (resourceService.hasViewPermission(currentUser, file)) {
                filteredFileList.add(file);
            }
        }
        return filteredFileList;
    };

    //--------------------业务方法用public,否则用private,但是除了依赖注入方法menuResource的显示,后台管理的级联授权的部分--------------------//
    /**
     * 根据上一级MenuId，根据当前用户，得到所有的一级孩子,并且过滤掉没有权限的菜单。
     * @param String menuid
     * @return List<MenuResource>
     */
    @Transactional(readOnly = true)
    //public List<MenuResource> getMenusByParentIdFilterByCurrentSubject(Serializable menuid) {
    public List<FileResource> getFilesFilterByCurrentSubject() {
        List<FileResource> fileResourceList = getFileResourceList();
        return filterFileResourceByCurrentSubject(fileResourceList);
    };

    /**
     * 根据当前用户，得到所有的FileResource,并且过滤掉没有权限的FileResource。并且是带checkbox的acl
     * @return List<FileResource>
     */
    @Transactional(readOnly = true)
    public List<FileResource> getFilesLoadOperationsFilterByCurrentSubject() {
        List<FileResource> filteredFileList = getFilesFilterByCurrentSubject();
        resourceService.loadOperations(filteredFileList);
        return filteredFileList;
    };

    /**
     * 得到所有的FileResource，没有级联。
     * @return List<FileResource>
     */
    @Transactional(readOnly = true)
    public List<FileResource> getFileResourceList() {
        return jpaSupportDao.getAll(FileResource.class);
    };

    /**
     * 根据resourceId得到一个FileResource的详细信息
     * @param resourceId
     * @return FileResource
     */
    @Transactional(readOnly = true)
    public FileResource getFileResourceByIdWithOperations(Long resourceId) {
        if (null == resourceId) {
            return null;
        }
        FileResource fileResource = (FileResource) jpaSupportDao.getEntityManager().find(FileResource.class, resourceId);
        fileResource.loadOperations2Properties();
        return fileResource;
    };
}
