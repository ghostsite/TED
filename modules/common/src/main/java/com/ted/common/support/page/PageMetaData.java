package com.ted.common.support.page;

import java.util.List;

import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

public class PageMetaData {
    private SqlRowSetMetaData metaData;
    private List data;
    private long totalCount;

    public PageMetaData(List data, long totalCount, SqlRowSetMetaData metaData) {
        this.data = data;
        this.totalCount = totalCount;
        this.metaData = metaData;
    }

    public List getData() {
        return data;
    }

    public void setData(List data) {
        this.data = data;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public SqlRowSetMetaData getMetaData() {
        return metaData;
    }

    public void setMetaData(SqlRowSetMetaData metaData) {
        this.metaData = metaData;
    }
    
    
}
