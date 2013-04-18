package com.ted.xplatform.pojo.common;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ted.xplatform.pojo.base.AuditEntity;

/**
 *  rule_id, userdef1, userdef2, userdef3, userdef4, userdef5
 *  唯一确定一条记录
 *  生成的都在这个表里面
 */
@Entity
@Table(name = "name_rule_generate")
public class NameRuleGenerate extends AuditEntity {
    private static final long serialVersionUID = 131L;

    private NameRule          rule;
    private String            userdef1;
    private String            userdef2;
    private String            userdef3;
    private String            userdef4;
    private String            userdef5;

    private String            year;
    private String            month;
    private String            day;
    private Integer           sequence;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "rule_id")
    public NameRule getRule() {
        return rule;
    }

    public void setRule(NameRule rule) {
        this.rule = rule;
    }

    public String getUserdef1() {
        return userdef1;
    }

    public void setUserdef1(String userdef1) {
        this.userdef1 = userdef1;
    }

    public String getUserdef2() {
        return userdef2;
    }

    public void setUserdef2(String userdef2) {
        this.userdef2 = userdef2;
    }

    public String getUserdef3() {
        return userdef3;
    }

    public void setUserdef3(String userdef3) {
        this.userdef3 = userdef3;
    }

    public String getUserdef4() {
        return userdef4;
    }

    public void setUserdef4(String userdef4) {
        this.userdef4 = userdef4;
    }

    public String getUserdef5() {
        return userdef5;
    }

    public void setUserdef5(String userdef5) {
        this.userdef5 = userdef5;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

}
