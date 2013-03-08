package com.ted.common.util;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@SuppressWarnings("all")
public abstract class BeanUtils {
    protected static final Log logger = LogFactory.getLog(BeanUtils.class);

    private BeanUtils() {
    }

    public static final void copyNotNullProperties(Object dest, Object orig) {
        try {
            Map<Object, Object> origmap = org.apache.commons.beanutils.BeanUtils.describe(orig);
            Set<Map.Entry<Object, Object>> set = origmap.entrySet();
            Map<Object, Object> tomap = new HashMap<Object, Object>();
            for (Iterator<Map.Entry<Object, Object>> iterator = set.iterator(); iterator.hasNext();) {
                Map.Entry<Object, Object> entry = (Map.Entry<Object, Object>) iterator.next();
                Object name = entry.getKey();
                Object v = entry.getValue();
                if (null != v)
                    tomap.put(name, v);
            }
            org.apache.commons.beanutils.BeanUtils.populate(dest, tomap);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    };

    // 20090304
    public static final void copyNotBlankProperties(Object dest, Object orig, String[] excludeProperties) {
        try {
            Map origmap = org.apache.commons.beanutils.BeanUtils.describe(orig);
            Set set = origmap.entrySet();
            Map tomap = new HashMap();
            for (Iterator iterator = set.iterator(); iterator.hasNext();) {
                Map.Entry entry = (Map.Entry) iterator.next();
                Object name = entry.getKey();
                Object v = entry.getValue();
                if (!"class".equals(name) && ArrayUtils.indexOf(excludeProperties, name.toString()) < 0)
                    if (v instanceof String) {
                        String va = (String) v;
                        if (StringUtils.isNotBlank(va))
                            tomap.put(name, v);
                    } else
                        tomap.put(name, v);
            }
            org.apache.commons.beanutils.BeanUtils.populate(dest, tomap);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    //20090304 
    public static final String getPropValueString(Object obj, String[] excludeProperties) {
        try {
            Map origmap = org.apache.commons.beanutils.BeanUtils.describe(obj);
            Set set = origmap.keySet();
            StringBuilder b = new StringBuilder();
            for (Iterator iterator = set.iterator(); iterator.hasNext();) {
                String key = (String) iterator.next();
                String value = (String) origmap.get(key);
                if (!"class".equals(key) && ArrayUtils.indexOf(excludeProperties, key) < 0)
                    b.append(value + " ");
            }
            return b.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    };

    public static final void copyPropertiesByExclude(Object dest, Object orig, String[] excludeProperties) {
        try {
            Map origmap = PropertyUtils.describe(orig);
            Set set = origmap.entrySet();
            for (Iterator iterator = set.iterator(); iterator.hasNext();) {
                Map.Entry entry = (Map.Entry) iterator.next();
                String name = entry.getKey().toString();
                Object v = entry.getValue();
                if (!"class".equals(name) && ArrayUtils.indexOf(excludeProperties, name.toString()) < 0)
                    org.apache.commons.beanutils.PropertyUtils.setProperty(dest, name, v);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    };

    public static final void copyPropertiesByInclude(Object dest, Object orig, String[] includeProperties) {
        try {
            for (int i = 0; i < includeProperties.length; i++) {
                String property = includeProperties[i];
                org.apache.commons.beanutils.PropertyUtils.setProperty(dest, property, org.apache.commons.beanutils.PropertyUtils.getProperty(orig, property));
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    };

    //20120218,, usage: pojo o = newInstance(pojo.class,"id",123L,"name","ghost");
    public static final <T> T newInstance(Class<T> clazz, Object... objects) {
        try {
            T obj = clazz.newInstance();
            if (objects == null || objects.length == 0) {
                return obj;
            }
            for (int i = 0; i < objects.length - 1;) {
                org.apache.commons.beanutils.PropertyUtils.setProperty(obj, (String) objects[i++], objects[i++]);
            }
            return obj;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    };

}
