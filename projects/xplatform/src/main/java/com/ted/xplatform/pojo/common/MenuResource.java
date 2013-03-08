package com.ted.xplatform.pojo.common;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.hibernate.annotations.Where;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ted.xplatform.util.ACLUtils;

/**
 * 菜单资源
 * 
 * @version 1.0
 * @created 2012-03-01
 */
@Entity
@DiscriminatorValue("menu")
public class MenuResource extends Resource {

	/**
	 * 所属上级菜单
	 */
	@JsonIgnore
	private MenuResource parent;

	/**
	 * 子菜单集合
	 */
	@JsonIgnore
	private List<MenuResource> subMenuResources;

	/**
	 * 菜单路径
	 */
	private String path;

	/**
	 * 索引号
	 */
	private Integer idx;

	/**
	 * button的装饰CSS
	 */
	private String buttonIconCls;

	/**
	 * buttonScale button menu
	 */
	private String buttonScale;

	/**
	 * buttonWidth button menu
	 */
	private String buttonWidth;

	/**
	 * buttonIconAlign button menu的图片对齐方式
	 */
	private String buttonIconAlign;

	/**
	 * 修饰icon的cls
	 */
	public String iconCls;

	public String icon; //最小的icon,for menu

	public String icon2;//for Short Cut 1
	
	public String icon3;//for Short Cut 2

	public boolean favorite; // 是否是快捷方式

	/**
	 * qtip，之所以命名为quicktip，因为在js文件中qtip有问题。
	 */
	private String quicktip;

	/**
	 * 是否是叶子
	 */
	public boolean leaf;

	/**
	 * 父亲Id
	 */
	private Long parentId;

	/**
	 * 父亲菜单Name，注意是：Transient，不是给持久化用的，是给页面显示用的。
	 */
	private String parentName;

	/**
	 * 为了简化资源关联Operation的模型，暂时定义权限的CRUD属性在这里 注意，不序列化到DB,参照：Operation.Type
	 */
	private boolean canView;
	private boolean canAdd;
	private boolean canUpdate;
	private boolean canDelete;

	
	
	// ----------Methods------------//
	/**
	 * 这个方法是给canView...赋值。注意，要在Hibernate的session中完成此动作。
	 */
	@Transient
	@JsonIgnore
	public void loadOperations2Properties() {
		List<Operation> operationList = getOperationList();
		for (Operation operation : operationList) {
			if (null == operation) {
				continue;
			}
			boolean canView = ACLUtils.isView(operation);
			boolean canAdd = ACLUtils.isAdd(operation);
			boolean canUpdate = ACLUtils.isUpdate(operation);
			boolean canDelete = ACLUtils.isDelete(operation);
			if (canView) {
				setCanView(canView);
			}
			if (canAdd) {
				setCanAdd(canAdd);
			}
			if (canUpdate) {
				setCanUpdate(canUpdate);
			}
			if (canDelete) {
				setCanDelete(canDelete);
			}
		}
	}
	
	public String getIcon3() {
		return icon3;
	}

	public void setIcon3(String icon3) {
		this.icon3 = icon3;
	}



	public String getIcon2() {
		return icon2;
	}

	public void setIcon2(String icon2) {
		this.icon2 = icon2;
	}

	public boolean isFavorite() {
		return favorite;
	}

	public void setFavorite(boolean favorite) {
		this.favorite = favorite;
	}



	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getButtonScale() {
		return buttonScale;
	}

	public void setButtonScale(String buttonScale) {
		this.buttonScale = buttonScale;
	}

	public String getButtonWidth() {
		return buttonWidth;
	}

	public void setButtonWidth(String buttonWidth) {
		this.buttonWidth = buttonWidth;
	}

	public String getButtonIconAlign() {
		return buttonIconAlign;
	}

	public void setButtonIconAlign(String buttonIconAlign) {
		this.buttonIconAlign = buttonIconAlign;
	}

	@Transient
	public boolean isCanView() {
		return canView;
	}

	public void setCanView(boolean canView) {
		this.canView = canView;
	}

	@Transient
	public boolean isCanAdd() {
		return canAdd;
	}

	public void setCanAdd(boolean canAdd) {
		this.canAdd = canAdd;
	}

	@Transient
	public boolean isCanUpdate() {
		return canUpdate;
	}

	public void setCanUpdate(boolean canUpdate) {
		this.canUpdate = canUpdate;
	}

	@Transient
	public boolean isCanDelete() {
		return canDelete;
	}

	public void setCanDelete(boolean canDelete) {
		this.canDelete = canDelete;
	}

	@Transient
	public String getParentName() {
		return parentName;
	}

	public void loadParentName() {
		if (null != parent) {
			this.parentName = parent.getName();
		}
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	/**
	 * @return the parent
	 */
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id", nullable = true, insertable = false, updatable = false)
	public MenuResource getParent() {
		return parent;
	}

	/**
	 * @param parent
	 *            the parent to set
	 */
	public void setParent(MenuResource parent) {
		this.parent = parent;
	}

	/**
	 * @return the subMenuResources
	 */
	@JsonIgnore
	@OneToMany(cascade = { CascadeType.ALL }, mappedBy = "parent", fetch = FetchType.LAZY)
	// mappedBy="subMenuResources"
	@Where(clause = "deleted=0")
	// @JoinColumn(name = "parent_id")
	public List<MenuResource> getSubMenuResources() {
		return subMenuResources;
	}

	/**
	 * @param subMenuResources
	 *            the subMenuResources to set
	 */
	public void setSubMenuResources(List<MenuResource> subMenuResources) {
		this.subMenuResources = subMenuResources;
	}

	/**
	 * @return the path
	 */
	public String getPath() {
		return path;
	}

	/**
	 * @param path
	 *            the path to set
	 */
	public void setPath(String path) {
		this.path = path;
	}

	/**
	 * @return the idx
	 */
	public Integer getIdx() {
		return idx;
	}

	/**
	 * @param idx
	 *            the idx to set
	 */
	public void setIdx(Integer idx) {
		this.idx = idx;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public String getButtonIconCls() {
		return buttonIconCls;
	}

	public void setButtonIconCls(String buttonIconCls) {
		this.buttonIconCls = buttonIconCls;
	}

	@Column(name = "qtip")
	public String getQuicktip() {
		return quicktip;
	}

	public void setQuicktip(String quicktip) {
		this.quicktip = quicktip;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	@Column(name = "parent_id")
	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

}