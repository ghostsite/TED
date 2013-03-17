package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;

import org.springframework.data.jpa.domain.AbstractAuditable;

import com.ted.xplatform.pojo.common.User;

/**
 * 只能逻辑删除的基类
 * @author sunrie
 * @version 1.0
 * @updated 28-三月-2011 13:47:35
 */
@MappedSuperclass
public abstract class LogicDeleteEntity extends AbstractAuditable<User, Long> {

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