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
    private List<Map<String, Object>> data             = new ArrayList<Map<String, Object>>();

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

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

}
