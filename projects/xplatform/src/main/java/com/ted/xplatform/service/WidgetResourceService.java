package com.ted.xplatform.service;

import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import javax.inject.Inject;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.collect.Lists;
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.util.BeanUtils;
import com.ted.xplatform.pojo.common.ACL;
import com.ted.xplatform.pojo.common.PageResource;
import com.ted.xplatform.pojo.common.Role;
import com.ted.xplatform.pojo.common.WidgetResource;

/**
 * WidgetResource的Service
 * 注意：widgetResource的code是由PageCode|widget's itemId 组合而成，因为itemId容易重复。
 * 小心：在页面上取widgetResource's itemId的时候要split一下。
 * singleton
 */
@Transactional
@Service("widgetResourceService")
public class WidgetResourceService  implements InitializingBean{
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

    //key = 'SYS.view.type.TypeManage|itemId,view'   ; result = ture or false  , enable 
    //key = 'SYS.view.type.TypeManage|itemId,readonly' ; result = ture or false, readonly
    private static LoadingCache<String, Boolean> cachedCurrentUserToResourceHasAuthority = null; //记录的是当前登陆用户对XXX资源是否有view reaonly等权限。 key is code , like 'SYS.view.type.TypeManage', Operation 

    
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


    public static final Boolean hasAuthority(String code) throws ExecutionException{
        if(null == cachedCurrentUserToResourceHasAuthority){
            return true;
        }else{
            return cachedCurrentUserToResourceHasAuthority.get(code);
        }
    }
    
    public void afterPropertiesSet() throws Exception {
        cachedCurrentUserToResourceHasAuthority = CacheBuilder.newBuilder().maximumSize(5000).expireAfterWrite(1, TimeUnit.MINUTES).build(new CacheLoader<String, Boolean>() {
            @Override
            public Boolean load(String code) throws Exception { // code like 'SYS.view.type.TypeManage|itemId,readonly'
                String[] codeAndOperation = code.split(",");
                WidgetResource resource = jpaSupportDao.findSingleByProperty(WidgetResource.class, "code", codeAndOperation[0]);
                Subject currentUser = SecurityUtils.getSubject();
                return ResourceService.hasAuthority(currentUser, resource, codeAndOperation[1]);
            }
        });
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
        for (WidgetResource widget : widgetResourceList) {
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
    public List<WidgetResource> getWidgetsByPageIdFilterByCurrentSubject(Long pageId) {
        List<WidgetResource> widgetResourceList = getWidgetResourceListByPageId(pageId);
        return filterWidgetResourceByCurrentSubject(widgetResourceList);
    };

    /**
     * 根据当前用户，得到所有的孩子,并且过滤掉没有权限的WidgetResource。并且是带checkbox的acl
     * @return List<WidgetResource>
     */
    @Transactional(readOnly = true)
    public List<WidgetResource> getWidgetsLoadOperationsByPageIdFilterByCurrentSubject(Long pageId) {
        List<WidgetResource> filteredWidgetList = getWidgetsByPageIdFilterByCurrentSubject(pageId);
        resourceService.loadOperations(filteredWidgetList);
        return filteredWidgetList;
    };

    ///===========================MenuResource的管理================================//
    /**
     * 根据resourceId(WidgetResource 中的ID)得到下面的所有的WidgetResource，不级联。
     * @return List<WidgetResource>
     */
    @Transactional(readOnly = true)
    public List<WidgetResource> getWidgetResourceListByPageId(Long pageId) {
        PageResource pageResource = jpaSupportDao.getEntityManager().find(PageResource.class, pageId);
        return pageResource.getWidgets();
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
        //如果用户属于一个PageResource
        if (widgetResource.getPage() != null && widgetResource.getPage().getId() != null) {
            PageResource page = (PageResource) jpaSupportDao.getEntityManager().find(PageResource.class, widgetResource.getPage().getId());
            widgetResource.setPage(page);
        } else {//没有机构的用户,不设置为空，则抛错。
            widgetResource.setPage(null);
        }
        
        //判断是add还是update
        if (widgetResource.isNew()) {//add
            //if (null != menuResource.getParent() && null != menuResource.getParent().getId()) {
            resourceService.addOperationProperties2Operations(widgetResource);
            jpaSupportDao.getEntityManager().persist(widgetResource);
        } else {//update
            WidgetResource dbWidgetResource = (WidgetResource) jpaSupportDao.getEntityManager().find(WidgetResource.class, widgetResource.getId());
            //DozerUtils.copy(menuResource, dbMenuResource);//这个不好用,copy all
            BeanUtils.copyPropertiesByInclude(dbWidgetResource, widgetResource, new String[] { "code", "name", "description", "idx", "canReadOnly", "canView", "canAdd", "canUpdate", "canDelete" });
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
