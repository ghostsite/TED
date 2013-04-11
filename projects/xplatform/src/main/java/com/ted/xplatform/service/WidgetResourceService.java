package com.ted.xplatform.service;

import java.util.List;
import java.util.Set;

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
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.Role;
import com.ted.xplatform.pojo.common.WidgetResource;

/**
 * WidgetResource的Service
 */
@Transactional
@Service("widgetResourceService")
public class WidgetResourceService {
    final Logger    logger = LoggerFactory.getLogger(WidgetResourceService.class);

    @Inject
    JdbcTemplateDao jdbcTemplateDao;

    @Inject
    JpaSupportDao   jpaSupportDao;

    @Inject
    JpaTemplateDao  jpaTemplateDao;

    @Inject
    MessageSource   messageSource;

    @Inject
    ResourceService resourceService;

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

    //-----------------工具方法-----------------//
    /**
     * 工具方法:根据当前用户过滤菜单
     * 注意：这个只能在事务中运行。并且不过滤admin
     * @param List<WidgetResource> widgetResourceList
     * @return List<WidgetResource>
     */
    @Transactional(readOnly = true)
    private List<WidgetResource> filterWidgetResourceByCurrentSubject(List<WidgetResource> widgetResourceList) {
        Subject currentUser = SecurityUtils.getSubject();
        List<WidgetResource> filteredWidgetList = Lists.newArrayList();
        for (WidgetResource widget : filteredWidgetList) {
            if (resourceService.hasViewPermission(currentUser, widget)) {
                filteredWidgetList.add(widget);
            }
        }
        return filteredWidgetList;
    };

    //--------------------业务方法用public,否则用private,但是除了依赖注入方法widgetResource的显示,后台管理的级联授权的部分--------------------//
    /**
     * 根据当前用户，得到所有的孩子,并且过滤掉没有权限的WidgetResource。(注意,WidgetResource不再有子关联关系，也就是一层，不会有多层的关系)
     * @return List<PageResource>
     */
    @Transactional(readOnly = true)
    public List<WidgetResource> getWidgetsFilterByCurrentSubject() {
        List<WidgetResource> widgetResourceList = getWidgetResourceList();
        return filterWidgetResourceByCurrentSubject(widgetResourceList);
    };

    /**
     * 根据当前用户，得到所有的孩子,并且过滤掉没有权限的WidgetResource。并且是带checkbox的acl
     * @return List<WidgetResource>
     */
    @Transactional(readOnly = true)
    public List<WidgetResource> getWidgetsLoadOperationsFilterByCurrentSubject() {
        List<WidgetResource> filteredWidgetList = getWidgetsFilterByCurrentSubject();
        resourceService.loadOperations(filteredWidgetList);
        return filteredWidgetList;
    };

    ///===========================MenuResource的管理================================//
    /**
     * 根据resourceId(WidgetResource 中的ID)得到下面的所有的WidgetResource，不级联。
     * @return List<WidgetResource>
     */
    @Transactional(readOnly = true)
    public List<WidgetResource> getWidgetResourceList() {
        return jpaSupportDao.getAll(WidgetResource.class);
    };
    
    /**
     * 根据resourceId(WidgetResource 中的ID)得到下面的所有的WidgetResource，不级联。
     * @return List<WidgetResource>
     */
    @Transactional(readOnly = true)
    public JsonPage<WidgetResource> pagedWidgetResourceList(int start, int limit) {
        return jpaSupportDao.pagedAll(WidgetResource.class, start, limit);
    };


    /**
     * 根据resourceId得到一个WidgetResource的详细信息
     * @return List<WidgetResource>
     */
    @Transactional(readOnly = true)
    public WidgetResource getWidgetResourceById(Long resourceId) {
        if (null == resourceId) {
            return null;
        }
        WidgetResource widgetResource = (WidgetResource) jpaSupportDao.getEntityManager().find(WidgetResource.class, resourceId);
        widgetResource.loadOperations2Properties();
        return widgetResource;
    };

    /**
     * 保存，包括新增和修改
     */
    @Transactional
    public WidgetResource save(WidgetResource widgetResource) {
        //判断是add还是update
        if (widgetResource.isNew()) {//add
            //if (null != menuResource.getParent() && null != menuResource.getParent().getId()) {
            resourceService.addOperationProperties2Operations(widgetResource);
            jpaSupportDao.getEntityManager().persist(widgetResource);
        } else {//update
            WidgetResource dbWidgetResource = (WidgetResource) jpaSupportDao.getEntityManager().find(WidgetResource.class, widgetResource.getId());
            //DozerUtils.copy(menuResource, dbMenuResource);//这个不好用,copy all
            BeanUtils.copyPropertiesByInclude(dbWidgetResource, widgetResource, new String[] { "code", "name", "description", "idx", "leaf", "canReadOnly", "canView", "canAdd", "canUpdate", "canDelete" });
            resourceService.updateOperationProperties2Operations(dbWidgetResource);
            jpaSupportDao.getEntityManager().merge(dbWidgetResource);
        }
        return widgetResource;
    };

    /**
     * 删除，
     * 要手工删除角色对应的acl关系，也就是通过控制Role来达到删除role_acl的目的。
     */
    @Transactional
    public void delete(Long resourceId) {
        WidgetResource widgetResource = (WidgetResource) jpaSupportDao.getEntityManager().find(WidgetResource.class, resourceId);
        Set<ACL> acls = widgetResource.getAcls();
        for (ACL acl : acls) {//这个地方一定要小心，分清cascade and mappedBy(谁是主控方)
            List<Role> roles = acl.getRoles();
            for (Role role : roles) {
                role.getAcls().remove(acl);
                jpaSupportDao.getEntityManager().merge(role);
            }
        }
        jpaSupportDao.getEntityManager().remove(widgetResource);
    }

}
