/**
 * 
 */
package com.ted.xplatform.pojo.common;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * 页面中的控件资源
 */
@Entity
//@Table(name = "menu_resource")
@DiscriminatorValue("widget")
public class WidgetResource extends Resource {

    private static final long serialVersionUID = 1L;
    public static final String TYPE = "widget"; //区别于FileResource, PageResource
    
    /**
     * 索引号
     */
    private Integer idx;
    
    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE }, targetEntity = PageResource.class)
    @JoinColumn(name = "page_id")
    private PageResource      page;

    public Integer getIdx() {
        return idx;
    }

    public void setIdx(Integer idx) {
        this.idx = idx;
    }
    
    public PageResource getPage() {
        return page;
    }

    public void setPage(PageResource page) {
        this.page = page;
    }

    public String getType(){
        return TYPE;
    }
}
