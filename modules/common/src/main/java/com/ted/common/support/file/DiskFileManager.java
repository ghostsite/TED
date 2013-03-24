package com.ted.common.support.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;
import org.springframework.util.FileCopyUtils;

/**
 * 本地磁盘的文件管理

 */
public class DiskFileManager implements FileManager {

    @Override
    public void save(String dir, String name, byte[] bytes) {
        checkAttachFileDir(dir);
        try {
            if (!dir.endsWith("/")) {
                dir = dir + "/";
            }
            FileOutputStream fos = new FileOutputStream(dir + name);
            FileCopyUtils.copy(bytes, fos);
        } catch (Exception e) {
            e.printStackTrace();
        }
    };

    /**
     * 思考一下这种方式是不是会很占内存?
     */
    @Override
    public byte[] load(String dir, String name) {
        if (!dir.endsWith("/")) {
            dir = dir + "/";
        }
        try {
            InputStream input = new FileInputStream(dir + name);
            return IOUtils.toByteArray(input);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    @Override
    public void remove(String dir, String name) {
        // TODO Auto-generated method stub

    }

    //检验文件夹是否存在
    public static final void checkAttachFileDir(String dir) {
        File file = new File(dir);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

}
