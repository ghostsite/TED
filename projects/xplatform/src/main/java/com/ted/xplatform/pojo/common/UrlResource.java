package com.ted.xplatform.pojo.common;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Url资源,这个super的属性够用了。
 */
@Entity
@DiscriminatorValue("url")
public class UrlResource extends Resource {
    private static final long  serialVersionUID = 1L;
    public static final String TYPE             = "url"; //区别于FileResource, PageResource,WidgetResource

    /**
     * 索引号
     */
    private Integer            idx;

    public Integer getIdx() {
        return idx;
    }

    public void setIdx(Integer idx) {
        this.idx = idx;
    }

    public String getType() {
        return TYPE;
    }
}
