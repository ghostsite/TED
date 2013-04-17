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
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.BeanUtils;
import com.ted.xplatform.pojo.common.UrlResource;

/**
 * Url的Service
 * singleton ,be careful
 */
@Transactional
@Service("urlResourceService")
public class UrlResourceService {
    final Logger                                 logger              = LoggerFactory.getLogger(UrlResourceService.class);

    @Inject
    JdbcTemplateDao                              jdbcTemplateDao;

    @Inject
    JpaSupportDao                                jpaSupportDao;

    @Inject
    JpaTemplateDao                               jpaTemplateDao;

    @Inject
    MessageSource                                messageSource;

    @Inject
    ResourceService                              resourceService;

    public void setJdbcTemplateDao(JdbcTemplateDao jdbcTemplateDao) {
        this.jdbcTemplateDao = jdbcTemplateDao;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public void setResourceService(ResourceService resourceService) {
        this.resourceService = resourceService;
    }
    
    public ResourceService getResourceService() {
        return resourceService;
    }

    //-----------------工具方法-----------------//
    /**
     * 工具方法:根据当前用户过滤菜单
     * 注意：这个只能在事务中运行。并且不过滤admin
     * @param List<PageResource> pageResourceList
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    private List<UrlResource> filterUrlResourceByCurrentSubject(List<UrlResource> urlResourceList) {
        Subject currentUser = SecurityUtils.getSubject();
        List<UrlResource> filteredUrlList = Lists.newArrayList();
        for (UrlResource url : urlResourceList) {
            if (resourceService.hasExecutePermission(currentUser, url)) {
                filteredUrlList.add(url);
            }
        }
        return filteredUrlList;
    };
    
    //--------------------业务方法用public,否则用private,但是除了依赖注入方法menuResource的显示,后台管理的级联授权的部分--------------------//
    /**
     * 根据当前用户，得到所有的孩子,并且过滤掉没有权限的菜单。(注意,PageResource不再有子关联关系，也就是一层，不会有多层的关系)
     * 但是：有WidgetResource关联，也就是要去除WidgetResource
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public List<UrlResource> getUrlsFilterByCurrentSubject() {
        List<UrlResource> urlResourceList = getUrlResourceList();
        return filterUrlResourceByCurrentSubject(urlResourceList);
    };

    /**
     * 根据当前用户，得到所有的孩子,并且过滤掉没有权限的菜单。并且是带checkbox的acl
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public List<UrlResource> getUrlsLoadOperationsFilterByCurrentSubject() {
        List<UrlResource> filteredUrlList = getUrlsFilterByCurrentSubject();
        resourceService.loadOperations(filteredUrlList);
        return filteredUrlList;
    };

    ///===========================MenuResource的管理================================//
    /**
     * 根据resourceId(PageResource 中的ID)得到下面的所有的UrlResource，不级联。
     * @return List<UrlResource>
     */
    @Transactional(readOnly = true)
    public List<UrlResource> getUrlResourceList() {
        return jpaSupportDao.getAll(UrlResource.class);
    };

    /**
     * 根据resourceId(UrlResource 中的ID)得到下面的所有的UrlResource，不级联。
     * @return List<UrlResource>
     */
    @Transactional(readOnly = true)
    public JsonPage<UrlResource> pagedUrlResourceList(int start, int limit) {
        return jpaSupportDao.pagedAll(UrlResource.class, start, limit);
    };

    /**
     * 根据resourceId得到一个UrlResource的详细信息
     * @return List<UrlResource>
     */
    @Transactional(readOnly = true)
    public UrlResource getUrlResourceById(Long resourceId) {
        if (null == resourceId) {
            return null;
        }
        UrlResource urlResource = (UrlResource) jpaSupportDao.getEntityManager().find(UrlResource.class, resourceId);
        urlResource.loadOperations2Properties();
        return urlResource;
    };

    /**
     * 保存，包括新增和修改
     */
    @Transactional
    public UrlResource save(UrlResource urlResource) {
        //判断是add还是update
        if (urlResource.isNew()) {//add
            //if (null != menuResource.getParent() && null != menuResource.getParent().getId()) {
            resourceService.addOperationProperties2Operations(urlResource);
            jpaSupportDao.getEntityManager().persist(urlResource);
        } else {//update
            UrlResource dbUrlResource = (UrlResource) jpaSupportDao.getEntityManager().find(UrlResource.class, urlResource.getId());
            //DozerUtils.copy(menuResource, dbMenuResource);//这个不好用,copy all
            BeanUtils.copyPropertiesByInclude(dbUrlResource, urlResource, new String[] { "code", "name", "description", "idx", "canExecute" });
            resourceService.updateOperationProperties2Operations(dbUrlResource);
            jpaSupportDao.getEntityManager().merge(dbUrlResource);
        }
        return urlResource;
    };

    /**
     * 删除，
     * 要手工删除角色对应的acl关系，也就是通过控制Role来达到删除role_acl的目的。
     */
    @Transactional
    public void delete(Long resourceId) {
        this.resourceService.delete(resourceId);
    }

}
