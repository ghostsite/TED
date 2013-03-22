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
import com.ted.xplatform.pojo.common.Type;

/**
 * 基础数据的Service
 */
@Transactional
@Service("typeService")
public class TypeService {
    final Logger               logger       = LoggerFactory.getLogger(TypeService.class);
    //this is hack parentId can be null to set
    public static final String SUBTYPES_JPQL = "from Type m where m.parent.id=:typeId or (m.parent.id is null and :typeId is null) order by m.idx asc";

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
     * 根据orgId得到下面的所有的Type，不级联。
     * @param orgId
     * @return List<Type>
     */
    @Transactional(readOnly = true)
    public List<Type> getSubTypeListByTypeId(Long typeId) {
        Map<String, Object> newMap = CollectionUtils.newMap("typeId", typeId);
        List<Type> subTypeList = jpaSupportDao.find(SUBTYPES_JPQL, newMap);
        return subTypeList;
    };

    /**
     * 根据orgId得到一个Type的详细信息
     * @param orgId
     * @return List<Type>
     */
    @Transactional(readOnly = true)
    public Type getTypeById(Long typeId) {
        Type type = jpaSupportDao.getEntityManager().find(Type.class, typeId);
        if (null != type) {
            type.loadParentName();
        }
        return type;
    };

    /**
     * 保存，包括新增和修改
     * 注意：要saveParentId
     * @param org
     * @return Type
     */
    @Transactional
    public Type save(Type type) {
        //判断父亲
        if(null == type.getParentId()){
            type.setParent(null);
        }else{
            Type parentType = jpaSupportDao.getEntityManager().find(Type.class, type.getParent().getId());
            if (parentType == null) {
                type.setParent(null);
            }else{
                type.setParent(parentType);
                parentType.setLeaf(false);
                jpaSupportDao.getEntityManager().merge(parentType);
            }
        }
        //判断是新增还是修改
        //if(type.getId() == null || type.getId().intValue() == -1){//new, leaf=true
        if(type.isNew()){//new, leaf=true
            type.setLeaf(true);
        }
        jpaSupportDao.getEntityManager().merge(type);
        return type;
    }

    /**
     * 删除，
     * 注意：是否要级联删除:不删除用户，users.parent_id = null, 级联删除下属Type。这个是通过Type的pojo配置来实现的。
     * @param org
     * @return Type
     */
    @Transactional
    public void delete(Long typeId) {
        Type type = jpaSupportDao.getEntityManager().find(Type.class, typeId);
        jpaSupportDao.getEntityManager().remove(type);
    }

    //-------------------------以上市给管理用的，以下是给前台用的--------------------------------//
    /**
     * 根据code得到下面的所有的Type，不级联。
     * @param code
     * @return List<Type>
     */
    @Transactional(readOnly = true)
    public List<Type> getSubTypeListByCode(String code) {
        List<Type> subTypeList = jpaSupportDao.find("from Type where parent.code=?0 order by idx", code);
        return subTypeList;
    }

    public List<Type> getSubTypeListById(Long id) {
        List<Type> subTypeList = jpaSupportDao.find("from Type where parent.id=?0 order by idx", id);
        return subTypeList;
    };
}
