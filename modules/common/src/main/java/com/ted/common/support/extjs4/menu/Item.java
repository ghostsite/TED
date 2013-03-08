package com.ted.common.support.extjs4.menu;

import java.util.Map;

import com.google.common.collect.Maps;

/**
 * 针对Ext的Ext.menu.Item做的java类
 */
public class Item {
    private Long                id;
    private Long                beanId;
    private String              text;
    private String              ref;
    private String              overCls;
    private String              cls;
    private boolean             disabled;
    private String              disabledCls;//this is extjs4  //disabledClass 这个是extjs3 
    private String              fieldLabel;
    private boolean             hidden;
    private boolean             hideLabel;
    private boolean             hideParent;
    private String              href;
    private String              hrefTarget;
    private String              html;
    private String              icon;
    private String              iconCls;
    private String              itemCls = "x-menu-item x-menu-check-item";
    private String              labelSeparator;
    private String              labelStyle;
    private boolean             hideOnClick;
    private Menu                menu;

    
    public Long getBeanId() {
        return beanId;
    }

    public void setBeanId(Long beanId) {
        this.beanId = beanId;
    }

    //附加属性,不属于Extjs的，属于业务的。
    //比如Role 的code属性; text 为Role的name
    private String              code;    

    //其他的属性可以存放在这里，dozer映射还没配置。如果需要，则配置xml,参考TreeNode.java
    private Map<String, Object> beanMap = Maps.newHashMap();               

    public boolean isHideOnClick() {
        return hideOnClick;
    }

    public void setHideOnClick(boolean hideOnClick) {
        this.hideOnClick = hideOnClick;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String value) {
        this.code = value;
    }

    public Map<String, Object> getBeanMap() {
        return beanMap;
    }

    public void setBeanMap(Map<String, Object> beanMap) {
        this.beanMap = beanMap;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getOverCls() {
        return overCls;
    }

    public void setOverCls(String overCls) {
        this.overCls = overCls;
    }

    public String getCls() {
        return cls;
    }

    public void setCls(String cls) {
        this.cls = cls;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    public String getDisabledCls() {
        return disabledCls;
    }

    public void setDisabledCls(String disabledCls) {
        this.disabledCls = disabledCls;
    }

    public String getFieldLabel() {
        return fieldLabel;
    }

    public void setFieldLabel(String fieldLabel) {
        this.fieldLabel = fieldLabel;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public boolean isHideLabel() {
        return hideLabel;
    }

    public void setHideLabel(boolean hideLabel) {
        this.hideLabel = hideLabel;
    }

    public boolean isHideParent() {
        return hideParent;
    }

    public void setHideParent(boolean hideParent) {
        this.hideParent = hideParent;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public String getHrefTarget() {
        return hrefTarget;
    }

    public void setHrefTarget(String hrefTarget) {
        this.hrefTarget = hrefTarget;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public String getItemCls() {
        return itemCls;
    }

    public void setItemCls(String itemCls) {
        this.itemCls = itemCls;
    }

    public String getLabelSeparator() {
        return labelSeparator;
    }

    public void setLabelSeparator(String labelSeparator) {
        this.labelSeparator = labelSeparator;
    }

    public String getLabelStyle() {
        return labelStyle;
    }

    public void setLabelStyle(String labelStyle) {
        this.labelStyle = labelStyle;
    }

    public Menu getMenu() {
        return menu;
    }

}
