package com.ted.common.util;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.MapUtils;
import org.springframework.util.ObjectUtils;

import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

/**
 * 
 * @date 2010-3-26
 */
public abstract class CollectionUtils {
    /**
     * Check whether the given Iterator contains the given element.
     * @param iterator the Iterator to check
     * @param element the element to look for
     * @return <code>true</code> if found, <code>false</code> else
     */
    public static boolean contains(Collection<Object> collection, Object element) {
        if (collection != null) {
            for (Object o : collection) {
                if (ObjectUtils.nullSafeEquals(o, element)) {
                    return true;
                }
            }
        }
        return false;
    };

    //map 的打印
    public static final void printMap(Map<Object,Object> map) {
        if (MapUtils.isEmpty(map)) {
            return;
        }
        Iterator<Object> iter = map.keySet().iterator();
        while (iter.hasNext()) {
            Object key = iter.next();
            Object value = map.get(key);
            System.out.print(key + ":" + value + "  ");
        }
        System.out.println();
    };

    public static final Map<String,Object> newMap(Object... objects) {
        int len = objects.length;
        Map<String,Object> map = Maps.newHashMap();
        for (int i = 0; i < len; i = i + 2) {
            map.put((String)objects[i], objects[i + 1]);
        }
        return map;
    }

    public static final Set<Object> newSet(Object... objects) {
        Set<Object> set = Sets.newHashSet();
        int len = objects.length;
        for (int i = 0; i < len; i++) {
            set.add(objects[i]);
        }
        return set;
    }
}
