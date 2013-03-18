package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class LogicPersistEntity extends PersistEntity {
    private static final long serialVersionUID = -5399222967163949116L;
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
