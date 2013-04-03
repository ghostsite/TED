package com.ted.xplatform.pojo.common;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ted.xplatform.pojo.base.AuditEntity;

/**
 * ACL:对资源所有的可以操作的动作集合。
 * ACL : Resource = N:1
 * ACL : Operation = N:1
 * so Resource:Operation = N:N
 * 注意：由于两个外键字段可以为空(设置为可以为空,这样设置的原因是更新时Resource不用删除ACL),
 * 所以循环Acls时，注意，里面可能有null在里面，循环式需要判断
 */

@Entity
@Table(name = "acl")
public class ACL extends AuditEntity {
    private static final long serialVersionUID = 347155964973604095L;

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.PERSIST  })
    @JoinColumn(name = "acl_resourceid")
    Resource   resource;

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "acl_operationid")
    Operation  operation;

    @ManyToMany(cascade = {CascadeType.REFRESH, CascadeType.REMOVE}, mappedBy = "acls", fetch = FetchType.LAZY)
    List<Role> roles = new ArrayList<Role>();

    @Column(name = "acl_resourceid", insertable = false, updatable = false)
    Long       resourceId;

    @Column(name = "acl_operationid", insertable = false, updatable = false)
    Long       operationId;

    //for extcontroller 反射出name
    @Transient
    public String getResourceName() {
        return this.resource.getName();
    }

    //for extcontroller 反射出name
    @Transient
    public String getOperationName() {
        return this.operation.getName();
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public Long getOperationId() {
        return operationId;
    }

    public void setOperationId(Long operationId) {
        this.operationId = operationId;
    }

    @JsonIgnore
    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public Operation getOperation() {
        return operation;
    }

    public void setOperation(Operation operation) {
        this.operation = operation;
    }

    @Transient
    public String getPermissionString() {
        return resource.getCode() + ":" + operation.getCode();
    }


}
