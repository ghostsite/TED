package com.ted.common.web.download.xls;

import java.io.Serializable;
import java.util.List;

/**
 * 这个是描述Grid的信息，主要是给excel下载用的,包含很多的ColumnInfo
 * @author ghostzhang
 * @date 20130319
 */
public class GridInfo implements Serializable {
    private static final long serialVersionUID = 839130723750906369L;
    private String            title;                                 //grid title
    private Integer           height;                                //row高度
    private Integer           color;                                 //字体颜色
    private Integer           bgcolor;                               //background颜色
    private String            font;                                  //字体
    private Integer           fontSize;                              //字体大小
    private Integer           colspan;                               //合并几个单元格,默认居中

    private List<ColumnInfo>  columns;

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getColor() {
        return color;
    }

    public void setColor(Integer color) {
        this.color = color;
    }

    public Integer getBgcolor() {
        return bgcolor;
    }

    public void setBgcolor(Integer bgcolor) {
        this.bgcolor = bgcolor;
    }

    public String getFont() {
        return font;
    }

    public void setFont(String font) {
        this.font = font;
    }

    public Integer getFontSize() {
        return fontSize;
    }

    public void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
    }

    public Integer getColspan() {
        return colspan;
    }

    public void setColspan(Integer colspan) {
        this.colspan = colspan;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<ColumnInfo> getColumns() {
        return columns;
    }

    public void setColumns(List<ColumnInfo> columns) {
        this.columns = columns;
    }

}
