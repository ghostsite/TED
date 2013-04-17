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
        },
        hide {
            @SuppressWarnings("all")
            public String getText() {
                return "隐藏";
            }
        },
        execute {
            @SuppressWarnings("all")
            public String getText() {
                return "执行";
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
    
    @Transient
    @JsonIgnore
    public boolean isHideOperation(){
        return Type.hide.name().equals(this.code);
    }
    
    @Transient
    @JsonIgnore
    public boolean isExecuteOperation(){
        return Type.execute.name().equals(this.code);
    }
    
    /**
     * 资源名称: add, update, delete, view, readonly, disabled, download,hide, execute
     * FileResource: view, download, delete, hide (默认是view,如果不可见，需要配置hide)
     * WidgetResource: view, readonly, disbled, hide (默认是view，如果是不可见，需要配置hide)
     * PageResource: view (默认是不可以view，so需要配置view)              -----------这个是最特殊的，跟别的都不一样。
     * MenuResource: view (这个默认是不可见，so需要配置可见, 没有hide选项) -----------这个是最特殊的，跟别的都不一样。
     * UrlResource: hide, execute (这个默认是可执行，so需要配置hide)
     * 
     */
    String code;

    /**
     * 描述,备注: 查看,新增,更新,删除,只读,隐藏,执行,只见,下载
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
