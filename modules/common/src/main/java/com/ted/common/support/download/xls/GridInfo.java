package com.ted.common.support.download.xls;

import java.io.Serializable;
import java.util.List;

/**
 * 这个是描述Grid的信息，主要是给excel下载用的,包含很多的ColumnInfo
 * @author ghostzhang
 * @date 20130319
 */
public class GridInfo implements Serializable {
    private static final long serialVersionUID = 839130723750906369L;
    private String            title;  //grid title
    private List<ColumnInfo>  columnInfos;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<ColumnInfo> getColumnInfos() {
        return columnInfos;
    }

    public void setColumnInfos(List<ColumnInfo> columnInfos) {
        this.columnInfos = columnInfos;
    }

}
