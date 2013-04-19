package com.ted.xplatform.pojo.common;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * 前缀
 */
@Entity
@DiscriminatorValue("prefix")
public class NameRulePrefix extends NameRuleItem {
    private static final long serialVersionUID = 123L;

    public static final String CATEGORY = "prefix"; //for json 输出有类型，category是不输出的
    
    private String            prefix;

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }
    public String getCategory() {
        return CATEGORY;
    }

}
