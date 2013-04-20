package com.ted.common.support.extjs4.grid;

import java.io.Serializable;

/**
 * 适配Ext，给动态Grid用的
 * @author ghostzhang
 * @created 2013-04-20 
 */
public class Field implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private String type;
    private String format; //yyyy-MM-dd for java Date ,and 12,122,122 digital
    
    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

}