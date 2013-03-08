package com.ted.common.util;

/**
 * @date 2011-7-9
 * @version 1.0
 */
public abstract class FileUtils {
    public static final String getExtension(String filename, boolean withDot) {
        if ((filename != null) && (filename.length() > 0)) {
            int i = filename.lastIndexOf('.');
            if ((i > -1) && (i < (filename.length() - 1))) {
                if(withDot){
                    return filename.substring(i);
                }else{
                    return filename.substring(i + 1);
                }
            }
        }
        return "";
    };
}
