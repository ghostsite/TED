package com.ted.xplatform.pojo.common;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * 页面资源,这个super的属性够用了。
 */
@Entity
//@Table(name = "page_resource")
@DiscriminatorValue("page")
public class PageResource extends Resource {
    private static final long serialVersionUID = 1L;
    public static final String TYPE = "page"; //区别于FileResource, PageResource
    
    /**
     * 索引号
     */
    private Integer idx;
    
    //@OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY, mappedBy = "page")
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "page", fetch = FetchType.LAZY , targetEntity = WidgetResource.class)
    private List<WidgetResource> widgets;

    //页面是否有Controller，为了Ext.syncRequire使用
    private boolean hasController;
    
    public boolean isHasController() {
        return hasController;
    }

    public void setHasController(boolean hasController) {
        this.hasController = hasController;
    }

    public Integer getIdx() {
        return idx;
    }

    public void setIdx(Integer idx) {
        this.idx = idx;
    }

    @JsonIgnore
    public List<WidgetResource> getWidgets() {
        return widgets;
    }

    public void setWidgets(List<WidgetResource> widgets) {
        this.widgets = widgets;
    }
    
    public String getType(){
        return TYPE;
    }
}
