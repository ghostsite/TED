package com.ted.xplatform.pojo.common;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.ted.xplatform.pojo.base.PersistEntity;

/**
 * @author ghostzhang
 * 通知：系统通知和人手工的通知。
 * 暂时使用了人手工通知,
 * 聊天记录暂时不记录到数据库。
 */
@Entity
@Table(name = "notification")
public class Notification extends PersistEntity {
    private static final long serialVersionUID = 4978722868761544398L;

    private boolean           system;                                 //是否是系统消息
    private String            code;                                   //key renamed to code
    private String            writer;                                 //作者
    private String            period;                                 //周期
    private boolean           confirm;                                //是否需要确认。
    private String            title;                                  //标题
    private String            message;                                //交流的信息。
    private int               severity;                               //严重程度,1-5,5最严重

    @Temporal(TemporalType.TIMESTAMP)
    private Date              createdDate;

    //参考springdata auditable
    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(final Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSystem() {
        return system;
    }

    public void setSystem(boolean system) {
        this.system = system;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
