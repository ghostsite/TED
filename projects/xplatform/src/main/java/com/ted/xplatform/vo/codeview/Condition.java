package com.ted.xplatform.vo.codeview;

import java.util.List;

public class Condition {
    private String       column;
    private String       operator;
    private List<String> value;

    public String getColumn() {
        return this.column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getOperator() {
        return this.operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public List<String> getValue() {
        return this.value;
    }

    public void setValue(List<String> value) {
        this.value = value;
    }
}