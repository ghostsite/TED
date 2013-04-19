package com.ted.xplatform.pojo.common;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ted.xplatform.pojo.base.PersistEntity;

/**
 * 子
 */
@Entity
@Table(name = "name_rule_item")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "category", discriminatorType = DiscriminatorType.STRING)
public class NameRuleItem extends PersistEntity {
    private static final long serialVersionUID = 123L;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "rule_id")
    private NameRule          rule;

    private Integer           idx;

    public Integer getIdx() {
        return idx;
    }

    public NameRule getRule() {
        return rule;
    }

    public void setRule(NameRule rule) {
        this.rule = rule;
    }

    public void setIdx(Integer idx) {
        this.idx = idx;
    }

}
