package com.ted.xplatform.vo.grid;

/**
 * 这个是给Extjs4 
 * 来源于华为的动态输出前台extjs4 or output for excel
 */
import java.io.Serializable;

@SuppressWarnings("serial")
public class Field implements Serializable {
    private String header; //for show title for user to see
    private String name;  //key ,for map key  or bean's field name
    private String type;  //string, date, int,float ....
    private String format; //yyyy-MM-dd for java Date ,and 12,122,122 digital

    public Field(String header, String name, String type, String format) {
        this.header = header;
        this.name = name;
        this.type = type;
        this.format = format;
    }

    public Field(String header, String name, String type) {
        this(header, name, type, null);
    }

    public Field(String header, String name) {
        this(header, name, null);
    }
    
    public Field(){
        
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

}