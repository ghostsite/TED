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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.ted.xplatform.pojo.base.LogicAuditEntity;
import com.ted.xplatform.util.ACLUtils;

/**
 * 资源的超类,用户权限框架中。
 * 注意：数据库中这个表可以删除了。
 * 子类包括：MenuResource,FileResource,PageResource,WidgetResource.
 * @created 2012-02-13
 */
@Entity
@Table(name = "resource")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn(name = "category", discriminatorType = DiscriminatorType.STRING)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public abstract class Resource extends LogicAuditEntity {
    private static final long serialVersionUID = -7567811003498408234L;

    /**
     * 资源名称,必须唯一,用在权限中user.hasPermission("code:CRUD")
     */
    private String            code;

    /**
     * 名字,显示给用户看的名字。
     */
    private String            name;                                    //等同于Operation的description字段

    /**
     * 描述,备注
     */
    private String            description;                             //这个纯粹的注释。

    
    /**
     * 为了简化资源关联Operation的模型，暂时定义权限的CRUD属性在这里 注意，不序列化到DB,参照：Operation.Type
     */
    @Transient
    private boolean canView;
    @Transient
    private boolean canAdd;
    @Transient
    private boolean canUpdate;
    @Transient
    private boolean canDelete;
    @Transient
    private boolean canReadOnly; //灰色，canView是不变灰色
    
    /**
     * 资源所拥有的所有的可以操作的ACL,通过ACL获得所有的Operation
     * cascade = { CascadeType.ALL} ,是因为要save的时候，把acl也save到。
     */
    @OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY, mappedBy = "resource", orphanRemoval = true)
    private Set<ACL>          acls             = Sets.newHashSet();

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

    @Transient
    public boolean isCanView() {
        return canView;
    }

    public void setCanView(boolean canView) {
        this.canView = canView;
    }

    @Transient
    public boolean isCanAdd() {
        return canAdd;
    }

    public void setCanAdd(boolean canAdd) {
        this.canAdd = canAdd;
    }

    @Transient
    public boolean isCanUpdate() {
        return canUpdate;
    }

    public void setCanUpdate(boolean canUpdate) {
        this.canUpdate = canUpdate;
    }

    @Transient
    public boolean isCanDelete() {
        return canDelete;
    }

    public void setCanDelete(boolean canDelete) {
        this.canDelete = canDelete;
    }
    
    @Transient
    public boolean isCanReadOnly() {
        return canReadOnly;
    }

    public void setCanReadOnly(boolean canReadOnly) {
        this.canReadOnly = canReadOnly;
    }
    
 // ----------Methods------------//
    /**
     * 这个方法是给canView...赋值。注意，要在Hibernate的session中完成此动作。
     */
    @Transient
    @JsonIgnore
    public void loadOperations2Properties() {
        List<Operation> operationList = getOperationList();
        for (Operation operation : operationList) {
            if (null == operation) {
                continue;
            }
            boolean canView = ACLUtils.isView(operation);
            boolean canAdd = ACLUtils.isAdd(operation);
            boolean canUpdate = ACLUtils.isUpdate(operation);
            boolean canDelete = ACLUtils.isDelete(operation);
            if (canView) {
                setCanView(canView);
            }
            if (canAdd) {
                setCanAdd(canAdd);
            }
            if (canUpdate) {
                setCanUpdate(canUpdate);
            }
            if (canDelete) {
                setCanDelete(canDelete);
            }
        }
    }
}
