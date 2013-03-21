package com.ted.common.support.download;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletResponse;

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
     * 这种对POI生成的Excel都是乱码，暂时不知道原因。
     * @param showName 下载的文件名称
     */
    public static final ResponseEntity<byte[]> getResponseEntity(String showName, byte[] bytes) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", URLEncoder.encode(showName, "UTF8"));
        headers.setContentLength(bytes.length);
        headers.setCacheControl("no-cache");
        return new ResponseEntity<byte[]>(bytes, headers, HttpStatus.CREATED);
    }

    /**
     * 最原始的下载方式
     */
    public static final void doDownload(HttpServletResponse response, String showName, byte[] bytes) throws IOException {
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(showName, "UTF8"));
        OutputStream os = response.getOutputStream();
        os.write(bytes);
        os.flush();
        response.flushBuffer();
    };
}
