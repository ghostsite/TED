package com.ted.common.test;

import java.io.File;

import org.springside.modules.utils.Reflections;


public class Son extends BaseObject {
    public static void main(String[] args) throws Exception{
        BaseObject b = new Son();
        System.out.println(Reflections.getFieldValue(b, "name"));
        
        File file = new File("D:\\temp2\\a.txt");
        System.out.println(file.lastModified());
        
        System.out.println(file.lastModified());
    }
}
