package com.ted.xplatform.pojo.common;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * 日期类型
 */
@Entity
@DiscriminatorValue("datetime")
public class NameRuleDateTime extends NameRuleItem {
    private static final long serialVersionUID = 123L;
    public static final String CATEGORY = "datetime"; 

    private String            dateFormat;

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public String getCategory() {
        return CATEGORY;
    }

}
