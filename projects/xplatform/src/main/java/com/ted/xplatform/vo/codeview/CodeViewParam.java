package com.ted.xplatform.vo.codeview;

import java.util.List;

/**
 * for code view params
 * @author ghostzhang
 * CodeView的进入参数,@see BasViewCodeListIn.java
 * 注意：bind到springmvc的时候，用json bind
 */
public class CodeViewParam {
    private Integer         start;
    private Integer         limit;

    private String          type;
    private String          table;
    private List<String>    select;
    private List<Condition> condition;
    private List<Order>     order;
    private String          query;

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public List<String> getSelect() {
        return select;
    }

    public void setSelect(List<String> select) {
        this.select = select;
    }

    public List<Condition> getCondition() {
        return condition;
    }

    public void setCondition(List<Condition> condition) {
        this.condition = condition;
    }

    public List<Order> getOrder() {
        return order;
    }

    public void setOrder(List<Order> order) {
        this.order = order;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

}
