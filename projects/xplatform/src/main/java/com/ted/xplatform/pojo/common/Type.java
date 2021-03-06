package com.ted.xplatform.pojo.common;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ted.xplatform.pojo.base.PersistEntity;

/**
 * 类型,相当于CommonCode
 *
 * @author sunrie
 * @version 1.0
 * @created 30-三月-2011 10:06:48
 */
@Entity
@Table(name = "type")
public class Type extends PersistEntity { //LogicDeleteEntity
    private static final long serialVersionUID = 5364395051854848597L;

    /**
     * 编码
     */
    private String     code;

    /**
     * 所属类型
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private Type       parent;

    /**
     * 类型名称
     */
    private String     name;

    /**
     * 备注
     */
    private String     remark;

    /**
     * 索引号
     */
    private Integer    idx;

    /**
     * 子类型
     */
    @OneToMany(cascade = { CascadeType.DETACH }, mappedBy = "parent", fetch = FetchType.LAZY)
    //@JoinColumn(name = "parent_id")
    private List<Type> subTypes;

    /**
     * 父亲机构的主键
     */
    @Transient
    private Long parentId;

    /**
     * 父亲机构的名字，注意是：Transient，不是给持久化用的，是给页面显示用的。
     */
    @Transient
    private String     parentName;

    /**
     * 是否是叶子
     */
    public boolean     leaf;

    public boolean isLeaf() {
        return leaf;
    }

    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
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

    @Transient
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

    /**
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * @param code the code to set
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * @return the parent
     */
    @JsonIgnore
    public Type getParent() {
        return parent;
    }

    /**
     * @param parent the parent to set
     */
    public void setParent(Type parent) {
        this.parent = parent;
    }

    /**
     * @return the name
     */
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
    public List<Type> getSubTypes() {
        return subTypes;
    }

    public void setSubTypes(List<Type> subTypes) {
        this.subTypes = subTypes;
    }
    

}