package com.ted.xplatform.pojo.base;

import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import org.springframework.data.jpa.domain.AbstractPersistable;

/**
 * 带版本锁的基类
 * @author sunrie
 * @version 1.0
 * @updated 28-三月-2011 13:47:36
 * 这个类很少用
 */
@MappedSuperclass
public abstract class VersionLockWithAuditEntity extends AbstractPersistable<Long> {

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