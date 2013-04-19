package com.ted.xplatform.pojo.common;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * 用户输入的
 */
@Entity
@DiscriminatorValue("userdef")
public class NameRuleUserDef extends NameRuleItem {
    private static final long  serialVersionUID = 1232L;

    public static final String CATEGORY             = "userdef"; //for json 输出有类型，category是不输出的


public String getCategory() {
        return CATEGORY;
    }

    
}
