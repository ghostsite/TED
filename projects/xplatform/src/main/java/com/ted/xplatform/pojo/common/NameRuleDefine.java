package com.ted.xplatform.pojo.common;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ted.xplatform.pojo.base.PersistEntity;

/**
 * 对NameRule的行转列的一个表
 */
@Entity
@Table(name = "name_rule_define")
public class NameRuleDefine extends PersistEntity {
    private static final long serialVersionUID = 123L;

    public enum GenType {
        prefix {
            @SuppressWarnings("all")
            public String getText() {
                return "固定前缀";
            };
        },
        calendar {
            @SuppressWarnings("all")
            public String getText() {
                return "日期";
            };
        },
        userdefine {
            @SuppressWarnings("all")
            public String getText() {
                return "用户定义";
            };
        },
        sequence {
            @SuppressWarnings("all")
            public String getText() {
                return "序列";
            };
        }
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "rule_id")
    private NameRule rule;

    private Integer  idx;    //rule_id and idx 唯一确定一条记录
    private String   name;
    private Integer  length;
    private GenType  genType;
    private String   value;
    private Integer  step;

    public NameRule getRule() {
        return rule;
    }

    public void setRule(NameRule rule) {
        this.rule = rule;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    @Enumerated(EnumType.STRING)
    public GenType getGenType() {
        return genType;
    }

    public void setGenType(GenType genType) {
        this.genType = genType;
    }

    public Integer getIdx() {
        return idx;
    }

    public void setIdx(Integer idx) {
        this.idx = idx;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Integer getStep() {
        return step;
    }

    public void setStep(Integer step) {
        this.step = step;
    }

}
