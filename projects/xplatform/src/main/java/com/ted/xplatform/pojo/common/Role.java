package com.ted.xplatform.pojo.common;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;
import com.ted.xplatform.pojo.base.PersistEntity;

/**
 * 角色,用户权限框架中。
 * @version 1.0
 * @created 2012-02-13
 */

@Entity
@Table(name = "role")
public class Role extends PersistEntity {
    private static final long serialVersionUID = 6538222617721177737L;

    /**
     * 角色名称
     */
    String               code;

    /**
     */
    String               name;

    /**
     * 角色拥有的用户,many-to-many的关系
     */
    @ManyToMany(cascade = CascadeType.DETACH)
    @JoinTable(name = "user_role", joinColumns = { @JoinColumn(name = "role_id") }, inverseJoinColumns = { @JoinColumn(name = "user_id") })
    List<User>           users    = new ArrayList<User>();

    /**
     * 角色拥有的权限
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_acl", joinColumns = { @JoinColumn(name = "role_id") }, inverseJoinColumns = { @JoinColumn(name = "acl_id") })
    @OrderBy("id")
    List<ACL>            acls     = new ArrayList<ACL>();

    /**
     * 父亲角色
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    Role                 parent;

    /**
     * 为了方便查询，添加了private Long parentId;
     * 跟parent引用的是同一个字段,这个在Hibernate可以，但是在JPA下不行。
     */
    @Transient
    private Long parentId;

    /**
     * 父亲机构的名字，注意是：Transient，不是给持久化用的，是给页面显示用的。
     */
    @Transient
    private String       parentName;

    /**
     * 子角色
     * @OneToMany(cascade = { CascadeType.DETACH }, mappedBy = "parent", fetch = FetchType.LAZY)
     */
    @OneToMany(cascade = { CascadeType.DETACH }, mappedBy = "parent", fetch = FetchType.LAZY )//, targetEntity = Role.class)
    List<Role>           subRoles = new ArrayList<Role>();

    /**
     * 索引号
     */
    private Integer      idx;

    /**
     * 注释
     */
    private String       remark;

    
    //=====tool============//
    //获得所有的角色，包括孩子,还没有人调用这个方法。暂时放着。
    @JsonIgnore
    public List<Role> getAllSubRoles(List<Role> roleList, Role role){
        List<Role> allRoleList = null;
        if(roleList != null){
            allRoleList = roleList;
        }else{
            allRoleList = Lists.newArrayList();
        }
        
        allRoleList.add(role);
        for(Role subRole :subRoles){
            allRoleList.addAll(getAllSubRoles(allRoleList, subRole));
        }
        
        return allRoleList;
    }
    
    
    //----------methods------------//

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

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

//    @Column(name = "parent_id")
    public Long getParentId() {
        if (getParent() == null) {
            return parentId;
        } else {
            return getParent().getId();
        }
    }
    
  //这个跟getParent不是1:1对应的，这个是给临时变量parentId赋值，getParentId()是通过parent对象获得parentId的。
    public void setParentId(Long parentId){
        this.parentId = parentId;
    }

    public void setAcls(List<ACL> acls) {
        this.acls = acls;
    }

    @JsonIgnore
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
    public Role getParent() {
        return parent;
    }

    public void setParent(Role parent) {
        this.parent = parent;
    }

    @JsonIgnore
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
