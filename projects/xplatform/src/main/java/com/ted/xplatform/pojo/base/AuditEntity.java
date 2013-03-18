package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;

import org.springframework.data.jpa.domain.AbstractAuditable;

import com.ted.xplatform.pojo.common.User;

@MappedSuperclass
public class AuditEntity extends AbstractAuditable<User, Long> {
    private static final long serialVersionUID = 1L;

    @Override
    public void setId(final Long id) {
        super.setId(id);
    }
}
