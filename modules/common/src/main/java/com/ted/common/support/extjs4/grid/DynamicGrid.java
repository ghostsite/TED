package com.ted.common.support.extjs4.grid;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 动态表格 for extjs4
 * @author ghostzhang
 * @created 2013-04-20 
 */
public class DynamicGrid implements Serializable {
    private static final long         serialVersionUID = 1L;
    private String                    title;
    private List<Field>               fields           = new ArrayList<Field>();
    private List<Column>              columns          = new ArrayList<Column>();
    private List<Map<String, Object>> content          = new ArrayList<Map<String, Object>>();

    private int                       total;
    protected boolean                 success          = true;                                //this is 妥协的结果。for extjs

    public int getNumberOfElements() {
        return total;
    }

    public void setNumberOfElements(int total) {
        this.total = total;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }

    public List<Map<String, Object>> getContent() {
        return content;
    }

    public void setContent(List<Map<String, Object>> content) {
        this.content = content;
    }

}
