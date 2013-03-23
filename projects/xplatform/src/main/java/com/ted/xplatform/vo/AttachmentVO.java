package com.ted.xplatform.vo;

import java.io.InputStream;

public class AttachmentVO {
    InputStream is;
    String      fileName;
    String      middlePath; //这个需要在Service里面定义。
    
    public InputStream getInputstream() {
        return is;
    }
    public void setInputstream(InputStream is) {
        this.is = is;
    }
    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    public String getMiddlePath() {
        return middlePath;
    }
    public void setMiddlePath(String middlePath) {
        this.middlePath = middlePath;
    }
    
}
