package com.ted.common.test;

import java.util.Date;

import org.joda.time.LocalDateTime;

import com.ted.common.util.JsonUtils;


public class JodaTimeTest {
    public static void main(String[] args) {
//        DateTime dt = new DateTime();
//        //DateTimeFormatter fmt = ISODateTimeFormat.date();
//        DateTimeFormatter dateTimeFormatter = DateTimeFormat.forPattern("HH z")
//
//        String str = fmt.print(dt);
//        System.out.println(str);
        
        WorkDay wd = new WorkDay();
        wd.setDayDate(new LocalDateTime());
        wd.setEndDate(new Date());
        JsonUtils.toJson(wd);
    }
}
