package com.ted.xplatform.pojo.common;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.data.jpa.domain.AbstractPersistable;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * 操作：operation or action.
 */

@Entity
@Table(name = "operation")
public class Operation extends AbstractPersistable<Long> {
    public enum Type {
        view {
            @SuppressWarnings("all")
            public String getText() {
                return "查看";
            };
        },
        add {
            @SuppressWarnings("all")
            public String getText() {
                return "新增";
            };
        },
        update {
            @SuppressWarnings("all")
            public String getText() {
                return "更新";
            };
        },
        delete {
            @SuppressWarnings("all")
            public String getText() {
                return "删除";
            }
        }
    }

    @Transient
    @JsonIgnore
    public boolean isViewOperation(){
        return Type.view.name().equals(this.code);
    }
    
    @Transient
    @JsonIgnore
    public boolean isAddOperation(){
        return Type.add.name().equals(this.code);
    }
    
    @Transient
    @JsonIgnore
    public boolean isUpdateOperation(){
        return Type.update.name().equals(this.code);
    }
    
    @Transient
    @JsonIgnore
    public boolean isDeleteOperation(){
        return Type.delete.name().equals(this.code);
    }
    
    /**
     * 资源名称: add,update,delete,view
     */
    String code;

    /**
     * 描述,备注: 查看,新增,更新,删除
     */
    String name;
    
    /**
     * 索引号
     */
    private Integer            idx;
    

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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    

}
