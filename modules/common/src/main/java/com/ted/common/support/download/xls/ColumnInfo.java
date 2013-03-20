package com.ted.common.support.download.xls;

import java.io.Serializable;

/**
 * 这个是描述column的信息，主要是给excel下载用的
 * 在前台配置好columninfo,这里面包括column key (java 反射获取数据), header(显示的中文)
 * width,color,bgcolor, font,类型(字符串 or 日期等),format(日期的格式化)
 * @author ghostzhang
 * @date 20130319
 */
public class ColumnInfo implements Serializable {
    private static final long serialVersionUID = 3932428387484717770L;
    private String            header;                                 //显示的中文
    private String            dataIndex;                                  //column key (java 反射获取数据) ==dataIndex
    private String            format;                                 //格式化
    private String            xtype;                                  //类型(字符串 or 日期等)默认是字符串 int string date ...
    private Integer           width;                                  //cell宽度
    private Integer           height;                                 //cell高度
    private Integer           color;                                  //字体颜色
    private Integer           bgcolor;                                //background颜色
    private String            font;                                   //字体
    private Integer           fontSize;                               //字体大小
    private String            align;                                  //对齐方式

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getFontSize() {
        return fontSize;
    }

    public void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
    }

    public String getAlign() {
        return align;
    }

    public void setAlign(String align) {
        this.align = align;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getDataIndex() {
        return dataIndex;
    }

    public void setDataIndex(String dataIndex) {
        this.dataIndex = dataIndex;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getXtype() {
        return xtype;
    }

    public void setXtype(String xtype) {
        this.xtype = xtype;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
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

}
