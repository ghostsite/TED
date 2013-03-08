/**
 *
 */
package com.ted.xplatform.listener;

import java.util.Date;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.ted.xplatform.pojo.AuditableEntity;
import com.ted.xplatform.util.PlatformUtils;

/**
 * 在自动为entity添加审计信息的Hibernate EventListener.
 *
 * 在hibernate执行saveOrUpdate()时,自动为AuditableEntity的子类添加审计信息.
 * for JPA
 * @author calvin
 */
@SuppressWarnings("serial")
public class AuditListener {
    private enum Type {
        PERSIST, UPDATE
    }

    @PrePersist
    public void checkPersist(final Object entity) {
        if (entity instanceof AuditableEntity) {
            this.setTime((AuditableEntity) entity, Type.PERSIST);
        }
    }

    @PreUpdate
    public void checkUpdate(final Object entity) {
        if (entity instanceof AuditableEntity) {
            this.setTime((AuditableEntity) entity, Type.UPDATE);
        }
    }

    private void setTime(final AuditableEntity entity, final Type persist) {
        switch (persist) {
        case PERSIST:
            entity.setCreateTime(new Date());
            entity.setCreateBy(PlatformUtils.getCurrentUser().getUserName());
            break;
        case UPDATE:
            entity.setLastModifyTime(new Date());
            entity.setLastModifyBy(PlatformUtils.getCurrentUser().getUserName());
            break;
        default:
            break;
        }
    }

}
