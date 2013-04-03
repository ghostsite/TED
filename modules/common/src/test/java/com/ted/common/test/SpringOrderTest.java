package com.ted.common.test;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PropertyComparator;

public class SpringOrderTest {
    public static void main(String[] args) {
        WorkDay wd1 = new WorkDay();
        wd1.setSequence(1);
        
        WorkDay wd2 = new WorkDay();
        wd2.setSequence(0);
        
        List<WorkDay> sortedPets = new ArrayList<WorkDay>();
        sortedPets.add(wd1);
        sortedPets.add(wd2);
        
        PropertyComparator.sort(sortedPets, new MutableSortDefinition("sequence", true, true));
        
        for(WorkDay wd: sortedPets){
            System.out.println(wd.getSequence());
        }
        
    }
}
