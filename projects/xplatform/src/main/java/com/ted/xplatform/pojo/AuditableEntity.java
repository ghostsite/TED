package com.ted.xplatform.pojo;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;

import com.ted.common.domain.VersionLockEntity;
import com.ted.xplatform.listener.AuditListener;

/**
 * 增加了创建修改信息的基类
 *
 * @author sunrie
 * @version 1.0
 * @created 28-三月-2011 13:56:11
 */
@MappedSuperclass
@EntityListeners({ AuditListener.class })
public abstract class AuditableEntity extends VersionLockEntity {

    /**
     * 创建人
     */
    private String         createBy;

    /**
     * 创建时间
     */
    private java.util.Date createTime;

    /**
     * 最后修改人
     */
    private String         lastModifyBy;

    /**
     * 最后修改时间
     */
    private java.util.Date lastModifyTime;

    /**
     * @return the createBy
     */
    @Column(updatable = false)
    public String getCreateBy() {
        return createBy;
    }

    /**
     * @param createBy the createBy to set
     */
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /**
     * @return the createTime
     */
    @Column(updatable = false)
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /**
     * @param createTime the createTime to set
     */
    public void setCreateTime(java.util.Date createTime) {
        this.createTime = createTime;
    }

    /**
     * @return the lastModifyBy
     */
    @Column(updatable = false)
    public String getLastModifyBy() {
        return lastModifyBy;
    }

    /**
     * @param lastModifyBy the lastModifyBy to set
     */
    public void setLastModifyBy(String lastModifyBy) {
        this.lastModifyBy = lastModifyBy;
    }

    /**
     * @return the lastModifyTime
     */
    @Column(updatable = false)
    public java.util.Date getLastModifyTime() {
        return lastModifyTime;
    }

    /**
     * @param lastModifyTime the lastModifyTime to set
     */
    public void setLastModifyTime(java.util.Date lastModifyTime) {
        this.lastModifyTime = lastModifyTime;
    }

}