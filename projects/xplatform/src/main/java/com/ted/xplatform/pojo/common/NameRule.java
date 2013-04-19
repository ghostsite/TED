package com.ted.xplatform.pojo.common;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ted.xplatform.pojo.base.PersistEntity;

@Entity
@Table(name = "name_rule")
public class NameRule extends PersistEntity {
    private static final long  serialVersionUID = 4978719868761544398L;

    private String             code;
    private String             name;
    private String             remark;

    @JsonIgnore
    @OneToMany(cascade = { CascadeType.ALL }, mappedBy = "rule", fetch = FetchType.LAZY)
    @OrderBy("idx")
    private List<NameRuleItem> ruleItems;

    public List<NameRuleItem> getRuleItems() {
        return ruleItems;
    }

    public void setRuleItems(List<NameRuleItem> ruleItems) {
        this.ruleItems = ruleItems;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

}
