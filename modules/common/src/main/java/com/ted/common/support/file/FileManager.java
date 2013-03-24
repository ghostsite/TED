package com.ted.common.support.file;


public interface FileManager {
    //保存文件，可能是磁盘，也可能是FTP,返回的是带文件名的相对路径  201201/abc.txt
    public void save(String dir, String name, byte[] bytes);

    //读取文件，根据路径
    public byte[] load(String dir, String name);
    
    //删除文件
    public void remove(String dir, String name);
}
