package com.ted.common.support.extjs4.menu;

import java.util.List;

import com.google.common.collect.Lists;

/**
 * 典型的泛型。用在类的定义中，不是属性中,比如： List<? extends Item> items,这个T类型从定义Menu的时候就决定了。
 */
public class Menu<T> {
    private Long    id;           //这个是实体主键
    private Long    beanId ;//由于Extjs4的menu json字符串不能有id，故加了beanId，实际上，beanId=id
    private String  cls;
    private boolean disabled;
    private String  disabledCls; // this is change for extjs4
    private String  fieldLabel;
    private String  itemCls;
    private List<T> items = null;

    public Long getBeanId() {
        return beanId;
    }

    public void setBeanId(Long beanId) {
        this.beanId = beanId;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getItemCls() {
        return itemCls;
    }

    public void setItemCls(String itemCls) {
        this.itemCls = itemCls;
    }

    public List<T> getItems() {
        if (items == null) {
            items = Lists.newArrayList();
        }
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    /**
     * 在第一个位置增加
     */
    public void addLastItem(T item) {
        int size = getItems().size();
        getItems().add(size, item);
    }

    /**
     * 在最后一个位置增加
     */
    public void addFirstItem(T item) {
        getItems().add(0, item);
    }
}
