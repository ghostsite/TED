package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;

import org.springframework.data.jpa.domain.AbstractAuditable;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    
    /**
     * 避免json输出的时候出现循环以来
     */
    @JsonIgnore
    public User getLastModifiedBy() {
        return (User)super.getLastModifiedBy();
    }
    
    @JsonIgnore
    public User getCreatedBy() {
        return  (User)super.getLastModifiedBy();
    }
}
