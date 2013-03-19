package com.ted.common.test;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;
import org.springside.modules.persistence.Hibernates;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.ted.common.support.datetime.ser.DefaultLocalDateTimeSerializer;

/**
 * 工作日
 * @author sunrie
 * @version 1.0
 * @created 18-五月-2011 14:28:23
 */
@Entity
@Table(name = "workday")
public class WorkDay {

    /**
     * 日期
     */
    //@Column(name="updated", nullable = false)
    @Type(type = Hibernates.LOCAL_DATETIME_TYPE)
    private LocalDateTime  dayDate;
    //private java.util.Date dayDate;

    /**
     * 终止日期
     */
    private java.util.Date endDate;

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
    //@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+08:00")
    //@JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+08:00")
    //@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    //@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    @JsonSerialize(using = DefaultLocalDateTimeSerializer.class)
    public LocalDateTime getDayDate() {
        return dayDate;
    }

    /**
     * @param dayDate the dayDate to set
     */
    public void setDayDate(LocalDateTime dayDate) {
        this.dayDate = dayDate;
    }

    /**
     * @return the endDate
     */
    @JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd :: HH:mm:ss")
    public java.util.Date getEndDate() {
        return endDate;
    }

    /**
     * @param endDate the endDate to set
     */
    public void setEndDate(java.util.Date endDate) {
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