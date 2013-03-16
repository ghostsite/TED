package com.ted.xplatform.pojo.common;

import java.util.Iterator;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.NumberFormat;
import org.springframework.format.annotation.NumberFormat.Style;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;
import com.ted.common.util.ConfigUtils;
import com.ted.common.util.ConvertUtils;
import com.ted.xplatform.pojo.LogicDeleteEntity;

/**
 * 用户
 * @author sunrie
 * @version 1.0
 * @updated 28-三月-2011 13:47:36
 */
@Entity
// 表名与类名不相同时重新定义表名.
@Table(name = "users")
// 默认的缓存策略.
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class User extends LogicDeleteEntity {
    public static final long     SUPER_USER_ID = ConfigUtils.getConfig().getLong("superuserid");

    /**
     * 停用状态
     */
    public static final Integer  STATE_DISABLE = 0;

    /**
     * 启用状态
     */
    public static final Integer  STATE_ENABLE  = 1;

    /**
     * 地址
     */
    private String               address;

    /**
     * 电子邮件
     */
    private String               email;

    /**
     * 登录名
     */
    private String               loginName;

    /**
     * 移动电话（手机）
     */
    private String               mobile;

    /**
     * 登录密码
     */
    private String               password;

    /**
     * 密码的key，防止密码被盗
     */
    private String               passwordKey;

    /**
     * 拥有角色集合,不级联。说用户有的角色，只是一级，不包括角色的角色。
     */
    private java.util.List<Role> roleList      = Lists.newArrayList();

    /**
     * 所属组织
     */
    private Organization         organization;

    /**
     * 性别，0：男；1：女; 2：其它
     */
    private Integer              sex;

    /**
     * 电话
     */
    private String               telephone;

    /**
     * 用户名
     */
    private String               userName;

    /**
     * 备注
     */
    private String               remark;

    /**
     * 状态： 0 停用 1 启用
     */
    private Integer              state         = STATE_ENABLE;

    /**
     * 当前登录用户的语言,en, cn, kr. 这个不持久化到数据库。
     */
    @Transient
    private String               language;
    
    /**
     * 机构Id,注意是：Transient的，即不持久化，数据来源于organization属性。主要是为了Extjs json输出
     */
    @Transient
    public Long getOrgId() {
        if (null != organization) {
            return organization.getId();
        } else {
            return null;
        }
    }

    @Transient
    public String getOrgName() {
        if (null != organization) {
            return organization.getName();
        } else {
            return "";
        }
    }

    
    @Transient
    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
    
    @Column(name="passwordKey")
    public String getPasswordKey() {
        return passwordKey;
    }

    public void setPasswordKey(String passwordKey) {
        this.passwordKey = passwordKey;
    }

    /**
     * @return the address
     */
    public String getAddress() {
        return address;
    }

    /**
     * @param address the address to set
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the loginName
     */
    @NotBlank
    @Size(min = 3, max = 20)
    @Column(name="loginName",nullable = false, unique = true)
    public String getLoginName() {
        return loginName;
    }

    /**
     * @param loginName the loginName to set
     */
    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    /**
     * @return the mobile
     */
    public String getMobile() {
        return mobile;
    }

    /**
     * @param mobile the mobile to set
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * @return the password
     */
    @NotEmpty(message = "Password must not be blank.")
    @Size(min = 1, max = 10, message = "Password must between 1 to 10 Characters.")
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the roleList
     */
    // 多对多定义
    // 中间表定义,表名采用默认命名规则
    @JsonIgnore
    @ManyToMany(cascade = CascadeType.ALL, mappedBy = "users", fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    public java.util.List<Role> getRoleList() {
        return roleList;
    }

    /**
     * @param roleList the roleList to set
     */
    public void setRoleList(java.util.List<Role> roleList) {
        this.roleList = roleList;
    }

    /**
     * @return the sex
     */
    @NotNull
    @NumberFormat(style = Style.NUMBER)
    @Min(0)
    @Max(2)
    public Integer getSex() {
        return sex;
    }

    /**
     * @param sex the sex to set
     */
    public void setSex(Integer sex) {
        this.sex = sex;
    }

    /**
     * @return the telephone
     */
    public String getTelephone() {
        return telephone;
    }

    /**
     * @param telephone the telephone to set
     */
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    /**
     * @return the userName
     */
    @NotBlank
    @Column(name="userName")
    public String getUserName() {
        return userName;
    }

    /**
     * @param userName the userName to set
     */
    public void setUserName(String userName) {
        this.userName = userName;
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
     * @return the state
     */
    public Integer getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(Integer state) {
        this.state = state;
    }

    @Transient
    public boolean isSuperUser() {
        return SUPER_USER_ID == id;
    }

    /**
     * @return 用户拥有的角色名称字符串, 多个角色名称用','分隔.
     */
    @Transient
    @JsonIgnore
    public String getRoleNames() {
        if (roleList != null) {
            return ConvertUtils.convertElementPropertyToString(roleList, "name", ", ");
        }
        return null;
    }

    /**
     * @return 用户拥有的角色id列表
     */
    @Transient
    @JsonIgnore
    @SuppressWarnings("unchecked")
    public List<Long> getRoleIds() {
        if (roleList != null) {
            return ConvertUtils.convertElementPropertyToList(roleList, "id");
        }
        return null;
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organization_id")
    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    @JsonIgnore
    @Transient
    public List<ACL> getAcls() {
        List<ACL> acls = Lists.newArrayList();
        Iterator<Role> roleIter = this.getRoleList().iterator();
        while (roleIter.hasNext()) {
            Role role = roleIter.next();
            acls.addAll(role.getAcls());
        }
        return acls;
    }

}