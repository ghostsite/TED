package com.ted.xplatform.pojo.common;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

//import org.hibernate.annotations.Cache;
//import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.ted.xplatform.pojo.base.LogicAuditEntity;

/**
 * 资源的超类,用户权限框架中。
 * @version 1.0
 * @created 2012-02-13
 */
@Entity
@Table(name = "resource")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "category", discriminatorType = DiscriminatorType.STRING)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public abstract class Resource extends LogicAuditEntity {
    private static final long serialVersionUID = -7567811003498408234L;

    /**
     * 资源名称,必须唯一,用在权限中user.hasPermission("code:CRUD")
     */
    String         code;

    /**
     * 名字,显示给用户看的名字。
     */
    private String name;                    //等同于Operation的description字段

    /**
     * 描述,备注
     */
    String         description;             //这个纯粹的注释。

    /**
     * 资源所拥有的所有的可以操作的ACL,通过ACL获得所有的Operation
     */
    @OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "acl_resourceid")
    Set<ACL>       acls = Sets.newHashSet();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(nullable = false, unique = true)
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @JsonIgnore
    public Set<ACL> getAcls() {
        return acls;
    }

    public void setAcls(Set<ACL> acls) {
        this.acls = acls;
    }

    @JsonIgnore
    @Transient
    public List<Operation> getOperationList() {
        List<Operation> operationList = Lists.newArrayList();
        for (ACL acl : acls) {
            operationList.add(acl.getOperation());
        }
        return operationList;
    }

}
