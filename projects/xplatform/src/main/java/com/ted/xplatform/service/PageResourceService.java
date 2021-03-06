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
import com.ted.xplatform.pojo.common.PageResource;

/**
 * 菜单的Service
 * singleton ,be careful
 */
@Transactional
@Service("pageResourceService")
public class PageResourceService {
    final Logger                                 logger              = LoggerFactory.getLogger(PageResourceService.class);

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

    @Inject
    WidgetResourceService                        widgetResourceService;

    public void setWidgetResourceService(WidgetResourceService widgetResourceService) {
        this.widgetResourceService = widgetResourceService;
    }

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
    private List<PageResource> filterPageResourceByCurrentSubject(List<PageResource> pageResourceList) {
        Subject currentUser = SecurityUtils.getSubject();
        List<PageResource> filteredPageList = Lists.newArrayList();
        for (PageResource page : pageResourceList) {
            if (resourceService.hasViewPermission(currentUser, page)) {
                filteredPageList.add(page);
            }
        }
        return filteredPageList;
    };
    
    //--------------------业务方法用public,否则用private,但是除了依赖注入方法menuResource的显示,后台管理的级联授权的部分--------------------//
    /**
     * 根据当前用户，得到所有的孩子,并且过滤掉没有权限的菜单。(注意,PageResource不再有子关联关系，也就是一层，不会有多层的关系)
     * 但是：有WidgetResource关联，也就是要去除WidgetResource
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public List<PageResource> getPagesFilterByCurrentSubject() {
        List<PageResource> pageResourceList = getPageResourceList();
        return filterPageResourceByCurrentSubject(pageResourceList);
    };

    /**
     * 根据当前用户，得到所有的孩子,并且过滤掉没有权限的菜单。并且是带checkbox的acl
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public List<PageResource> getPagesLoadOperationsFilterByCurrentSubject() {
        List<PageResource> filteredPageList = getPagesFilterByCurrentSubject();
        resourceService.loadOperations(filteredPageList);

        for (PageResource page : filteredPageList) {
            page.setWidgets(widgetResourceService.getWidgetsLoadOperationsByPageIdFilterByCurrentSubject(page.getId()));
        }

        return filteredPageList;
    };

    ///===========================MenuResource的管理================================//
    /**
     * 根据resourceId(PageResource 中的ID)得到下面的所有的PageResource，不级联。
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public List<PageResource> getPageResourceList() {
        return jpaSupportDao.getAll(PageResource.class);
    };

    /**
     * 根据resourceId(PageResource 中的ID)得到下面的所有的PageResource，不级联。
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public JsonPage<PageResource> pagedPageResourceList(int start, int limit) {
        return jpaSupportDao.pagedAll(PageResource.class, start, limit);
    };

    /**
     * 根据resourceId得到一个PageResource的详细信息
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public PageResource getPageResourceById(Long resourceId) {
        if (null == resourceId) {
            return null;
        }
        PageResource pageResource = (PageResource) jpaSupportDao.getEntityManager().find(PageResource.class, resourceId);
        pageResource.loadOperations2Properties();
        return pageResource;
    };

    /**
     * 保存，包括新增和修改
     */
    @Transactional
    public PageResource save(PageResource pageResource) {
        //判断是add还是update
        if (pageResource.isNew()) {//add
            //if (null != menuResource.getParent() && null != menuResource.getParent().getId()) {
            resourceService.addOperationProperties2Operations(pageResource);
            jpaSupportDao.getEntityManager().persist(pageResource);
        } else {//update
            PageResource dbPageResource = (PageResource) jpaSupportDao.getEntityManager().find(PageResource.class, pageResource.getId());
            //DozerUtils.copy(menuResource, dbMenuResource);//这个不好用,copy all
            BeanUtils.copyPropertiesByInclude(dbPageResource, pageResource, new String[] { "code", "name", "description", "idx", "canView","hasController" });
            resourceService.updateOperationProperties2Operations(dbPageResource);
            jpaSupportDao.getEntityManager().merge(dbPageResource);
        }
        return pageResource;
    };

    /**
     * 删除，
     * 注意：是否要级联删除: 级联删除下属组织WidgetResource。这个是通过PageResource的pojo配置来实现的。
     * 要手工删除角色对应的acl关系，也就是通过控制Role来达到删除role_acl的目的。
     */
    @Transactional
    public void delete(Long resourceId) {
        this.resourceService.delete(resourceId);
    }

}
