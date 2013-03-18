package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;

import org.springframework.data.jpa.domain.AbstractPersistable;
@MappedSuperclass
public class PersistEntity extends AbstractPersistable<Long> {
    private static final long serialVersionUID = 1L;

    @Override
    public void setId(final Long id) {
        super.setId(id);
    }

}
