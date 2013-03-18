package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;

/**
 * 只能逻辑删除的基类
 * @author sunrie
 * @version 1.0
 * @updated 28-三月-2011 13:47:35
 */
@MappedSuperclass
public abstract class LogicAuditEntity extends AuditEntity {
    private static final long serialVersionUID = -5709669867685604876L;
    /**
     * 删除标志，0：未删除，非0：已删除
     */
    private Long deleted = 0L;

    /**
     * @return the deleted
     */
    public Long getDeleted() {
        return deleted;
    }

    /**
     * @param deleted the deleted to set
     */
    public void setDeleted(Long deleted) {
        this.deleted = deleted;
    }

}