package com.ted.xplatform.pojo.common;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * 这个是没有归属的附件对象。用于演示。
 * @date 20130322
 */
@Entity
@DiscriminatorValue("default")
public class DefaultAttachment extends Attachment {
    /**
     * 没有归属对象，只能空着，如果有归属，添加归属对象，举例如下
     * 如果有3个对象都有附件，则需要在attachment table 中增加3列，用于每个宿主的外键。
     * 可以合并为一个外键么？恐怕不行.db也有约束啊。
     */
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "contract_contractid", nullable = true)
//    private Contract contract; //跟父亲的主键一样，这里是外键，形成1：n的关系
//
//    @JsonIgnore
//    public Contract getContract() {
//        return contract;
//    }
//
//    public void setContract(Contract contract) {
//        this.contract = contract;
//    }
}
