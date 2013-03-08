package com.ted.xplatform.pojo.common;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.hibernate.annotations.Where;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ted.xplatform.pojo.LogicDeleteEntity;

/**
 * 组织机构
 * @since 1.0
 * 注意：id=1为根
 */
@Entity
public class Organization extends LogicDeleteEntity {

    /**
     * 所属组织
     */
    @JsonProperty("parentId")
    private Organization       parent;

    /**
     * 组织类型
     */
    private Type               type;

    /**
     * 地址
     */
    private String             address;

    /**
     * 传真
     */
    private String             fax;

    /**
     * 主页
     */
    private String             homePage;

    /**
     * 组织名称
     */
    private String             name;

    /**
     * 邮编
     */
    private String             postalCode;

    /**
     * 备注
     */
    private String             remark;

    /**
     * 组织短名
     */
    private String             shortName;

    /**
     * 电话
     */
    private String             telephone;

    /**
     * 索引号
     */
    private Integer            idx;

    /**
     * 子部门机构
     */
    private List<Organization> subOrganizations;

    /**
     * 机构下的用户
     */
    private List<User>         users;

    /**
     * 父亲机构的主键
     */
    private Long               parentId;

    /**
     * 父亲机构的名字，注意是：Transient，不是给持久化用的，是给页面显示用的。
     */
    private String             parentName;

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

    @Column(name = "parent_id")
    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    @JsonIgnore
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "organization", fetch = FetchType.LAZY)
    //@JoinColumn(name = "organization_id")
    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    /**
     * @return the parent
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true, insertable = false, updatable = false)
    public Organization getParent() {
        return parent;
    }

    /**
     * @param parent the parent to set
     */
    public void setParent(Organization parent) {
        this.parent = parent;
    }

    /**
     * @return the type
     */
    @ManyToOne
    public Type getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(Type type) {
        this.type = type;
    }

    /**
     * @return the address
     */
    public String getAddress() {
        return address;
    }

    /**
     * @param address the address to set
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * @return the fax
     */
    public String getFax() {
        return fax;
    }

    /**
     * @param fax the fax to set
     */
    public void setFax(String fax) {
        this.fax = fax;
    }

    /**
     * @return the homePage
     */
    public String getHomePage() {
        return homePage;
    }

    /**
     * @param homePage the homePage to set
     */
    public void setHomePage(String homePage) {
        this.homePage = homePage;
    }

    /**
     * @return the name
     */
    @Column(nullable = false)
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the postalCode
     */
    public String getPostalCode() {
        return postalCode;
    }

    /**
     * @param postalCode the postalCode to set
     */
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    /**
     * @return the remark
     */
    public String getRemark() {
        return remark;
    }

    /**
     * @param remark the remark to set
     */
    public void setRemark(String remark) {
        this.remark = remark;
    }

    /**
     * @return the shortName
     */
    public String getShortName() {
        return shortName;
    }

    /**
     * @param shortName the shortName to set
     */
    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    /**
     * @return the telephone
     */
    public String getTelephone() {
        return telephone;
    }

    /**
     * @param telephone the telephone to set
     */
    public void setTelephone(String telephone) {
        this.telephone = telephone;
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

    @JsonIgnore
    @OneToMany(targetEntity = Organization.class, cascade = { CascadeType.ALL }, fetch = FetchType.LAZY, mappedBy = "parent")
    //, mappedBy="subOrganizations" 
    @Where(clause = "deleted=0")
    //@JoinColumn(name = "parent_id")
    public List<Organization> getSubOrganizations() {
        return subOrganizations;
    }

    public void setSubOrganizations(List<Organization> subOrganizations) {
        this.subOrganizations = subOrganizations;
    }

}