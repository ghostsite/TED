package com.ted.xplatform.pojo.common;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ted.xplatform.pojo.base.PersistEntity;

/**
 * 操作：operation or action.
 */

@Entity
@Table(name = "operation")
public class Operation extends PersistEntity {
    private static final long serialVersionUID = 7578466140409914843L;

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
        },
        readonly {
            @SuppressWarnings("all")
            public String getText() {
                return "只读";
            }
        },
        disabled {
            @SuppressWarnings("all")
            public String getText() {
                return "只见";
            }
        },
        download {
            @SuppressWarnings("all")
            public String getText() {
                return "下载";
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
    
    @Transient
    @JsonIgnore
    public boolean isReadOnlyOperation(){
        return Type.readonly.name().equals(this.code);
    }
    
    @Transient
    @JsonIgnore
    public boolean isDisabledOperation(){
        return Type.disabled.name().equals(this.code);
    }
    
    @Transient
    @JsonIgnore
    public boolean isDownloadOperation(){
        return Type.download.name().equals(this.code);
    }
    
    /**
     * 资源名称: add, update, delete, view, readonly, disabled, download
     * FileResource: view, download, delete
     * WidgetResource: view, readonly, disbled.
     * PageResource: view 
     * MenuResource: view
     */
    String code;

    /**
     * 描述,备注: 查看,新增,更新,删除,只读
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
