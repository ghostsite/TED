package com.ted.xplatform.pojo.common;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

import com.ted.xplatform.pojo.base.PersistEntity;


/**
 * 字段类型
 * @author sunrie
 * @version 1.0
 * @created 14-六月-2011 10:14:41
 */
@Entity
@Table(name = "fieldtype")
public class FieldType extends PersistEntity {

	/**
	 * type为Class时的具体类全名
	 */
	private String className;

	/**
	 * 描述
	 */
	private String description;

	/**
	 * 备注
	 */
	private String remark;

	/**
	 * 类型为Type或Class时，如为树形结构时的根ID
	 */
	private Long rootId;

	/**
	 * 类型：Long、Integer、Boolean、String、Double、Float、日期(yyyy-MM-dd)、时间(yyyy-MM-dd HH:mm:ss)等基本类型，Type，Class
	 */
	private FieldTypes type;


	/**
	 * @return the className
	 */
	public String getClassName() {
		return className;
	}


	/**
	 * @param className the className to set
	 */
	public void setClassName(String className) {
		this.className = className;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the remark
	 */
	public String getRemark() {
		return remark;
	}

	/**
	 * @param remark the remark to set
	 */
	public void setRemark(String remark) {
		this.remark = remark;
	}

	/**
	 * @return the rootId
	 */
	public Long getRootId() {
		return rootId;
	}

	/**
	 * @param rootId the rootId to set
	 */
	public void setRootId(Long rootId) {
		this.rootId = rootId;
	}

	/**
	 * @return the type
	 */
	@Enumerated(EnumType.STRING)
	public FieldTypes getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(FieldTypes type) {
		this.type = type;
	}
	
}