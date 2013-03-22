package com.ted.xplatform.pojo.common;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.springside.modules.persistence.Hibernates;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.ted.common.support.datetime.deser.DefaultDateTimeDeserializer;
import com.ted.common.support.datetime.deser.DefaultLocalDateTimeDeserializer;
import com.ted.common.support.datetime.ser.DefaultDateTimeSerializer;
import com.ted.common.support.datetime.ser.DefaultLocalDateTimeSerializer;
import com.ted.xplatform.pojo.base.PersistEntity;

/**
 * 工作日
 * @author sunrie
 * @version 1.0
 * @created 18-五月-2011 14:28:23
 */
@Entity
@Table(name = "workday")
public class WorkDay extends PersistEntity {
    private static final long serialVersionUID = -2283083939337288898L;

    /**
     * 日期
     */
    //@Column(name="updated", nullable = false)
    @Type(type=Hibernates.LOCAL_DATETIME_TYPE)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dayDate;
    //private java.util.Date dayDate;

    /**
     * 终止日期
     */
    @Type(type=Hibernates.DATETIME_TYPE)
    @Temporal(TemporalType.TIMESTAMP)
    private DateTime endDate;

    /**
     * 工作日序列
     */
    private int            sequence;

    /**
     * 启用日期
     */
    private java.util.Date startDate;

    /**
     * 星期
     */
    private int            weekDay;

    /**
     * 是否工作日
     */
    private Boolean        workDay;

    /**
     * @return the dayDate
     */
    //@JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+08:00") //this if for java.util.Date
    @JsonSerialize(using = DefaultLocalDateTimeSerializer.class) //this is for Joda Time
    public LocalDateTime getDayDate() {
        return dayDate;
    }

    /**
     * @param dayDate the dayDate to set
     */
    @JsonDeserialize(using = DefaultLocalDateTimeDeserializer.class)
    public void setDayDate(LocalDateTime dayDate) {
        this.dayDate = dayDate;
    }

    /**
     * @return the endDate
     */
    //@JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonSerialize(using = DefaultDateTimeSerializer.class) //this is for Joda Time
    public DateTime getEndDate() {
        return endDate;
    }

    /**
     * @param endDate the endDate to set
     */
    @JsonDeserialize(using = DefaultDateTimeDeserializer.class) //this is for Joda Time
    public void setEndDate(DateTime endDate) {
        this.endDate = endDate;
    }

    /**
     * @return the sequence
     */
    public int getSequence() {
        return sequence;
    }

    /**
     * @param sequence the sequence to set
     */
    public void setSequence(int sequence) {
        this.sequence = sequence;
    }

    /**
     * @return the startDate
     */
    public java.util.Date getStartDate() {
        return startDate;
    }

    /**
     * @param startDate the startDate to set
     */
    public void setStartDate(java.util.Date startDate) {
        this.startDate = startDate;
    }

    /**
     * @return the weekDay
     */
    public int getWeekDay() {
        return weekDay;
    }

    /**
     * @param weekDay the weekDay to set
     */
    public void setWeekDay(int weekDay) {
        this.weekDay = weekDay;
    }

    /**
     * @return the workDay
     */
    public Boolean getWorkDay() {
        return workDay;
    }

    /**
     * @param workDay the workDay to set
     */
    public void setWorkDay(Boolean workDay) {
        this.workDay = workDay;
    }

}