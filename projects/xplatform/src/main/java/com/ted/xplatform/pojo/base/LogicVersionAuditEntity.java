package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

@MappedSuperclass
public class LogicVersionAuditEntity extends LogicAuditEntity {
    private static final long serialVersionUID = -5573178944029108012L;
    /**
     * 乐观版本锁
     */
    private Long versionLock;

    /**
     * @return the versionLock
     */
    @Version
    public Long getVersionLock() {
        return versionLock;
    }

    /**
     * @param versionLock the versionLock to set
     */
    public void setVersionLock(Long versionLock) {
        this.versionLock = versionLock;
    }
}
