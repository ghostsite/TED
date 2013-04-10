package com.ted.xplatform.pojo.common;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;

/**
 * 页面资源,这个super的属性够用了。
 */
@Entity
//@Table(name = "page_resource")
@DiscriminatorValue("page")
public class PageResource extends Resource {
    private static final long serialVersionUID = 1L;
 
    //@OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY, mappedBy = "page")
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "page", fetch = FetchType.LAZY , targetEntity = WidgetResource.class)
    private List<WidgetResource> widgets;

    public List<WidgetResource> getWidgets() {
        return widgets;
    }

    public void setWidgets(List<WidgetResource> widgets) {
        this.widgets = widgets;
    }
    
}
