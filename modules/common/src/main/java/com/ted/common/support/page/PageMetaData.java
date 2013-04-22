package com.ted.common.support.page;

import java.util.List;

import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

public class PageMetaData {
    private SqlRowSetMetaData metaData;
    private List              content;       //妥协于JsonPage
    private long              totalElements; //妥协于JsonPage
    protected boolean         success = true; //妥协于JsonPage

    public PageMetaData(List content, long totalElements, SqlRowSetMetaData metaData) {
        this.content = content;
        this.totalElements = totalElements;
        this.metaData = metaData;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List getContent() {
        return content;
    }

    public void setContent(List content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public SqlRowSetMetaData getMetaData() {
        return metaData;
    }

    public void setMetaData(SqlRowSetMetaData metaData) {
        this.metaData = metaData;
    }

}
