package com.ted.common.test;

import org.springframework.beans.BeanWrapperImpl;

public class PropertyAccesserTest {
    public static void main(String[] args) {
        WorkDay wd = new WorkDay();
        wd.setWorkDay(true);
        wd.setWeekDay(11);
        BeanWrapperImpl accessor = new BeanWrapperImpl(wd);
        Object orgName = accessor.getPropertyValue("weekDay");
        System.out.println(orgName);
    }
}
