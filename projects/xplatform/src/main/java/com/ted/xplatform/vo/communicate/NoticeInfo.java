package com.ted.xplatform.vo.communicate;

/**
 * @author ghostzhang
 */
public class NoticeInfo implements java.io.Serializable, Cloneable {
    private static final long serialVersionUID = 1L;
    private String            msg;                  //交流的信息。
    private boolean           system;               //是否是系统消息
    private String            key;                  //key
    private String            writer;               //作者
    private String            period;               //周期
    private boolean           confirm;              //是否需要确认。
    private String            title;                //标题
    private int               severity;             //严重程度

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public boolean isSystem() {
        return system;
    }

    public void setSystem(boolean system) {
        this.system = system;
    }

    public boolean isConfirm() {
        return confirm;
    }

    public void setConfirm(boolean confirm) {
        this.confirm = confirm;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    
}
