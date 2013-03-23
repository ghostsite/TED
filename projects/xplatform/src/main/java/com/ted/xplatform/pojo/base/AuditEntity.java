package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;

import org.springframework.data.jpa.domain.AbstractAuditable;

import com.ted.xplatform.pojo.common.User;

@MappedSuperclass
public class AuditEntity extends AbstractAuditable<User, Long> {
    private static final long serialVersionUID = 1L;

    /**
     * 这个方法之所以要放开为public，是因为有地方要设置。
     */
    @Override
    public void setId(final Long id) {
        super.setId(id);
    }
}
