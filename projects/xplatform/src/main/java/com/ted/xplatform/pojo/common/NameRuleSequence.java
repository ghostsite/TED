package com.ted.xplatform.pojo.common;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * 序列
 */
@Entity
@DiscriminatorValue("sequence")
public class NameRuleSequence extends NameRuleItem {
    private static final long serialVersionUID = 1123L;
    public static final String CATEGORY = "sequence"; //for json 输出有类型，category是不输出的

    private String            seqFormat;               //格式化

    private Integer           initValue;               //初始值

    private Integer           step;                    //步长

    private Integer           currentValue;            //当前值

    public String getSeqFormat() {
        return seqFormat;
    }

    public void setSeqFormat(String seqFormat) {
        this.seqFormat = seqFormat;
    }

    public Integer getInitValue() {
        return initValue;
    }

    public void setInitValue(Integer initValue) {
        this.initValue = initValue;
    }

    public Integer getStep() {
        return step;
    }

    public void setStep(Integer step) {
        this.step = step;
    }

    public Integer getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(Integer currentValue) {
        this.currentValue = currentValue;
    }

    public String getCategory() {
        return CATEGORY;
    }

    
}
