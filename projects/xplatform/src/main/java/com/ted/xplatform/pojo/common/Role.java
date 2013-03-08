package com.ted.xplatform.pojo.common;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Transient;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;
import com.ted.common.domain.IdEntity;

/**
 * 角色,用户权限框架中。
 * @version 1.0
 * @created 2012-02-13
 */

@Entity
public class Role extends IdEntity {
    //public static final Long ROOT_ROLE_ID = 1L;
    
    /**
     * 资源名称,view ,add, update,delete and so on.
     */
    String code;
    
    /**
     * 描述,备注:新增 , 修改 , 添加, 删除
     */
    String name;
    
    /**
     * 角色拥有的用户,many-to-many的关系
     */
    List<User> users;
    
    /**
     * 角色拥有的权限
     */
    List<ACL> acls = Lists.newArrayList();
    
    /**
     * 父亲角色
     */
    Role parent;
    
    /**
     * 为了方便查询，添加了private Long parentId;
     * 跟parent引用的是同一个字段
     */
    private Long parentId;
    
    /**
     * 父亲机构的名字，注意是：Transient，不是给持久化用的，是给页面显示用的。
     */
    private String     parentName;
    
    /**
     * 子角色
     */
    List<Role> subRoles;
    
    /**
     * 索引号
     */
    private Integer idx;
    
    /**
     * 注释
     */
    private String remark;
    
    //----------methods------------//
    
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_acl", joinColumns = { @JoinColumn(name = "role_id") }, inverseJoinColumns = { @JoinColumn(name = "acl_id") })
    @Fetch(FetchMode.SUBSELECT)
    @OrderBy("id")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    public List<ACL> getAcls() {
        return acls;
    }


    @Transient
    public String getParentName() {
        return parentName;
    }
    
    public void loadParentName() {
        if (null != parent) {
            this.parentName = parent.getName();
        }
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    @Column(name="parent_id")
    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public void setAcls(List<ACL> acls) {
        this.acls = acls;
    }

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "user_role", joinColumns = { @JoinColumn(name = "role_id") }, inverseJoinColumns = { @JoinColumn(name = "user_id") })
    @Fetch(FetchMode.SUBSELECT)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true, insertable = false, updatable = false)
    public Role getParent() {
        return parent;
    }

    public void setParent(Role parent) {
        this.parent = parent;
    }

    @JsonIgnore
    @OneToMany(cascade = { CascadeType.ALL },mappedBy="parent", fetch = FetchType.LAZY)// mappedBy="subRoles"
   // @JoinColumn(name = "parent_id")
    public List<Role> getSubRoles() {
        return subRoles;
    }

    public void setSubRoles(List<Role> subRoles) {
        this.subRoles = subRoles;
    }

    /**
     * @return the idx
     */
    public Integer getIdx() {
        return idx;
    }

    /**
     * @param idx the idx to set
     */
    public void setIdx(Integer idx) {
        this.idx = idx;
    }
}
