package com.ted.common.support.extjs4;

import java.io.Serializable;

import com.ted.common.util.JsonUtils;

/**
 * 这个是给extjs最后输出用的，妥协于mes，so添加了msgcode and msg fields.
 * 参考ServiceOut.java
 * @author ghostzhang
 * @date 2013-02-16
 */
public class JsonOut implements Serializable{
    private boolean success;
    
    private String msgcode ;
    
    private String msg;

    public JsonOut(boolean success,String msgcode, String msg ){
        this.success = success;
        this.msgcode = msgcode;
        this.msg = msg;
    }
    
    public JsonOut(String msgcode, String msg ){
        this(true, msgcode, msg);
    }
    
    public JsonOut(String msg ){
        this(true, "Success", msg);
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    @Override
    public String toString(){
        return JsonUtils.toJson(this);
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMsgcode() {
        return msgcode;
    }

    public void setMsgcode(String msgcode) {
        this.msgcode = msgcode;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
    
}
