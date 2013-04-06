package com.ted.common.test;

import java.util.Iterator;

import com.google.common.base.Splitter;

public class Split {
    public static void main(String[] args) {
        String relation ="abc";
       // String[] split = relation.split(".");
        //System.out.println(split[0]);
        
        Iterable a = Splitter.on(".").split(relation);
        Iterator itr = a.iterator();
        while(itr.hasNext()){
            System.out.println(itr.next());
        }

    }
}
