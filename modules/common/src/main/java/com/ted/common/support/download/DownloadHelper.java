package com.ted.common.support.download;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

/**
 * 组装附件准备下载
 */
public abstract class DownloadHelper {
    /**
     * 下载组装
     */
    public static final ResponseEntity<byte[]> getResponseEntity(String showName, byte[] bytes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", showName);
        return new ResponseEntity<byte[]>(bytes, headers, HttpStatus.CREATED);
    }
}
