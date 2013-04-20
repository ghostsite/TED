package com.ted.common.support.extjs4.grid;

import java.io.Serializable;

/**
 * 动态grid用的,适配Ext column
 * @author ghostzhang
 * @created 2013-04-20 
 */
public class Column implements Serializable {
    private static final long serialVersionUID = 1L;
    private String header;
    private String dataIndex;

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getDataIndex() {
        return dataIndex;
    }

    public void setDataIndex(String dataIndex) {
        this.dataIndex = dataIndex;
    }

}