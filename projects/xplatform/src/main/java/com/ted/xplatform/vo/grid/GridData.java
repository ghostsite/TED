package com.ted.xplatform.vo.grid;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 身兼2个职位： grid data and grid field info list
 */
@SuppressWarnings("serial")
public class GridData implements Serializable {
    private String title;//for execl title
	private List<Field> fields = new ArrayList<Field>();// this is mapping
	private List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();

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

	public List<Map<String, Object>> getData() {
		return data;
	}

	public void setData(List<Map<String, Object>> data) {
		this.data = data;
	}

}
