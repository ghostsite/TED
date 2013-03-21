package com.ted.common.test;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import org.joda.time.LocalDateTime;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.ted.common.util.JsonUtils;

public class JsonTest {
    public static void main(String[] args) throws JsonMappingException, JsonParseException, IOException {
        WorkDay wd = new WorkDay();
        wd.setDayDate(new LocalDateTime());
        wd.setEndDate(new Date());
        
        String str = JsonUtils.toJson(wd);
        Map<String,String> map = (Map<String,String>)JsonUtils.fromJson(str, Map.class);
        System.out.println(map);
    }
}
