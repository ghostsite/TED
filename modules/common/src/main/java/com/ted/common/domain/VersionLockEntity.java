package com.ted.common.domain;

import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

/**
 * 带版本锁的基类
 * @author sunrie
 * @version 1.0
 * @updated 28-三月-2011 13:47:36
 */
@MappedSuperclass
public abstract class VersionLockEntity extends IdEntity {

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