package com.ted.xplatform.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.util.CollectionUtils;
import com.ted.xplatform.pojo.common.Organization;

/**
 * 组织机构的Service
 */
@Transactional
@Service("organizationService")
public class OrganizationService {
    final Logger               logger       = LoggerFactory.getLogger(OrganizationService.class);
    //this is hack parentId can be null to set
    public static final String SUBORGS_JPQL = "from Organization m where m.parent.id=:orgId or (m.parent.id is null and :orgId is null) order by m.idx asc";

    @Inject
    JdbcTemplateDao            jdbcTemplateDao;

    @Inject
    JpaSupportDao              jpaSupportDao;

    @Inject
    JpaTemplateDao             jpaTemplateDao;

    public void setJdbcTemplateDao(JdbcTemplateDao jdbcTemplateDao) {
        this.jdbcTemplateDao = jdbcTemplateDao;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    /**
     * 根据orgId得到下面的所有的部门，不级联。
     * @param orgId
     * @return List<Organization>
     */
    @Transactional(readOnly = true)
    public List<Organization> getSubOrgListByOrgId(Long orgId) {
        Map<String, Object> newMap = CollectionUtils.newMap("orgId", orgId);
        List<Organization> subOrgList = jpaSupportDao.find(SUBORGS_JPQL, newMap);
        return subOrgList;
    };

    /**
     * 根据orgId得到一个部门的详细信息
     * @param orgId
     * @return List<Organization>
     */
    @Transactional(readOnly = true)
    public Organization getOrgById(Long orgId) {
        Organization org = jpaSupportDao.findByIdWithDepth(Organization.class, orgId, "users");
        if (org != null) {
            org.loadParentName();
        }
        return org;
    };

    /**
     * 保存，包括新增和修改
     * 注意：要saveParentId
     * @param org
     * @return Organization
     */
    @Transactional
    public Organization save(Organization org) {
        if (org.getParent() == null || org.getParent().getId() == null) {
            org.setParent(null);
        } else {
            Organization parentOrg = jpaSupportDao.getEntityManager().find(Organization.class, org.getParent().getId());
            if (null == parentOrg) {
                org.setParent(null);
            } else {
                org.setParent(parentOrg);
            }
        }
        jpaSupportDao.getEntityManager().merge(org);
        return org;
    }

    /**
     * 删除，
     * 注意：是否要级联删除:不删除用户，users.parent_id = null, 级联删除下属组织机构。这个是通过Organization的pojo配置来实现的。
     * @param org
     * @return Organization
     */
    @Transactional
    public void delete(Long orgId) {
        Organization org = jpaSupportDao.getEntityManager().find(Organization.class, orgId);
        jpaSupportDao.getEntityManager().remove(org);
    }

    /**
     * 机构的移动:逻辑是这样的：把sourceOrg的所有孩子，都放到sourceOrg.parent下。然后把sourceOrg放到destOrg下。
     * @param sourceOrgId
     * @param destOrgId
     */
    public void move(Long sourceOrgId, Long destOrgId) {
        Organization sourceOrg = jpaSupportDao.getEntityManager().find(Organization.class, sourceOrgId);
        Organization destOrg = jpaSupportDao.getEntityManager().find(Organization.class, destOrgId);

        //把sourceOrg的所有孩子，都放到sourceOrg.parent下
        Organization sourceParentOrg = sourceOrg.getParent();
        sourceParentOrg.getSubOrganizations().addAll(sourceOrg.getSubOrganizations());
        for (Organization son : sourceOrg.getSubOrganizations()) {
            son.setParent(sourceParentOrg);
        }

        //然后把sourceOrg放到destOrg下。
        sourceOrg.setSubOrganizations(null);
        sourceOrg.setParent(destOrg);
        destOrg.getSubOrganizations().add(sourceOrg);

        //保存sourceParentOrg, destOrg
        jpaSupportDao.getEntityManager().persist(sourceParentOrg);
        jpaSupportDao.getEntityManager().persist(destOrg);
    };

}
