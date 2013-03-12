package com.ted.xplatform.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.collections.KeyValue;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Maps;
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.dao.mybatis.spring.ReloadableSqlSessionTemplate;
import com.ted.common.exception.BusinessException;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.PasswordUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.Organization;
import com.ted.xplatform.pojo.common.User;

/**
 */
@Transactional
@Service("userService")
public class UserService {
    @Inject
    JdbcTemplateDao jdbcTemplateDao;

    @Inject
    JpaSupportDao   jpaSupportDao;

    @Inject
    JpaTemplateDao  jpaTemplateDao;

    @Inject
    MessageSource   messageSource;
    
    @Inject
    ReloadableSqlSessionTemplate sqlSessionTemplate;
    
    public void setSqlSessionTemplate(ReloadableSqlSessionTemplate sqlSessionTemplate) {
        this.sqlSessionTemplate = sqlSessionTemplate;
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

    @Transactional(readOnly = true)
    public User getUserByLoginNameAssociate(String loginName) {
        return jpaSupportDao.findByPropertyWithDepth(User.class, "loginName", loginName, "organization", "roleList");
    }
    
    /**
     * 根据用户的loginName判断已经存在于db
     * @param loginName
     * @return
     */
    @Transactional(readOnly = true)
    public User getUserByLoginName(String loginName) {
        return (User) jpaSupportDao.findSingleByProperty(User.class, "loginName", loginName);
    };

    /**
     * 带机构和角色的。
     */
    @Transactional(readOnly = true)
    public User getUserByUserIdPwd(String loginName, String password) {
        List<User> userList = jpaSupportDao.find(" from User where loginName=?0 and password=?1", loginName, password);
        if (null != userList && userList.size() > 0) {
            User user = jpaSupportDao.findByIdWithDepth(User.class, userList.get(0).getId(), "organization", "roleList");
            return user;
        }
        return null;
    }

    /**
     * 更新密码
     * @param userId
     * @param password
     */
    @Transactional
    public void updatePassword(Long userId, String passwordKey, String password) {
        User user = jpaSupportDao.getEntityManager().find(User.class, userId);
        user.setPassword(password);
        user.setPasswordKey(passwordKey);
        this.jpaSupportDao.getEntityManager().merge(user);
    }

    /**
     * 用户移到Organization下
     */
    @Transactional
    public void move2Org(Long userId, Long orgId) {
        User user = jpaSupportDao.getEntityManager().find(User.class, userId);
        Organization destOrg = jpaSupportDao.getEntityManager().find(Organization.class, orgId);
        user.setOrganization(destOrg);
        destOrg.getUsers().add(user);
        this.jpaSupportDao.getEntityManager().merge(user);
    }

    public static final String SEARCHTYPE_LOGINNAME = "1";
    public static final String SEARCHTYPE_USERNAME  = "2";
    public static final String SEARCHTYPE_EMAIL     = "3";
    public static final String SEARCHTYPE_STATE     = "4";

    /**
     * 根据用户名和登陆名进行查询
     * @param searchType:1 表示按照LoginName进行查询，2 表示按照UserName进行查询
     * @param password
     */
    @Transactional(readOnly = true)
    public JsonPage<User> getUserByTypeAndValue(String searchType, String searchValue, int start, int limit) {
        Map<String, Object> params = Maps.newHashMap();
        if (SEARCHTYPE_LOGINNAME.equals(searchType)) {
            params.put("loginName", "%" + searchValue + "%");
        }
        if (SEARCHTYPE_USERNAME.equals(searchType)) {
            params.put("userName", "%" + searchValue + "%");
        }
        if (SEARCHTYPE_EMAIL.equals(searchType)) {
            params.put("email", "%" + searchValue + "%");
        }
        if (SEARCHTYPE_STATE.equals(searchType)) {
            params.put("state", NumberUtils.toInt(searchValue));
        }
        return jpaTemplateDao.pagedByJPQLQuery("admin-jpql-queryUser", params, User.class, start, limit);
    };

    /**
     * 查询一个部门下的所有人员，不分页,然后通过过滤查找人。
     */
    @Transactional(readOnly = true)
    public List<User> getUserListByOrgId(Long orgId) {
        //List<User> users = sqlSessionTemplate.selectList("test.getUserList");
        //Organization org = (Organization)hibernateSupport.getSession().load(Organization.class, orgId);
        return jpaSupportDao.find("from User u where u.organization.id=?0", orgId);
    };

    /**
     * 用户的保存
     */
    @Transactional
    public void save(User user) {
        //如果用户属于一个机构
        if (user.getOrganization() != null && user.getOrganization().getId() != null) {
            Organization org = (Organization) jpaSupportDao.getEntityManager().find(Organization.class, user.getOrganization().getId());
            user.setOrganization(org);
        } else {//没有机构的用户,不设置为空，则抛错。
            user.setOrganization(null);
        }
        //判断如果是新增，则要求user.getLoginName()不重复
        if (null == user.getId()) {//新增用户
            User dbUser = getUserByLoginName(user.getLoginName());
            if (dbUser != null) {
                throw new BusinessException(SpringUtils.getMessage("message.common.user.duplicated", messageSource));
            } else { //密码初始化
                //String[] keyEncrypto = PasswordUtils.getDefaultKeyEncrypto();
                KeyValue saltPwd = PasswordUtils.getDefaultKeyEncrypt();
                user.setPasswordKey((String)saltPwd.getKey());
                user.setPassword((String)saltPwd.getValue());
            }
        } else {//修改，则需要把密码load进来
            User dbUser = jpaSupportDao.getEntityManager().find(User.class, user.getId());
            user.setPassword(dbUser.getPassword());
            user.setPasswordKey(dbUser.getPasswordKey());
        }
        jpaSupportDao.getEntityManager().merge(user);
    }

    /**
     * 用户的删除
     */
    @Transactional
    public void delete(Long userId) {
        User user = jpaSupportDao.getEntityManager().find(User.class, userId);
        jpaSupportDao.getEntityManager().remove(user);
    }

    /**
     * 用户的删除:批量
     */
    @Transactional
    public void deleteAll(Collection<Long> userIds) {
        for (Long userId : userIds) {
            delete(userId);
        }
    }

    /**
     * 获得一个用户的详细信息
     * @param userId
     * @return
     */
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        User user = jpaSupportDao.getEntityManager().find(User.class, userId);
        return user;
    }

}
