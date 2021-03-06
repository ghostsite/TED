package com.ted.common.web.download;

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
        return getResponseEntity(showName, bytes, MediaType.APPLICATION_OCTET_STREAM);
    }

    /**
     * 增加了MediaType
     */
    public static final ResponseEntity<byte[]> getResponseEntity(String showName, byte[] bytes, MediaType mediaType) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", URLEncoder.encode(showName, "UTF8"));
        headers.setContentLength(bytes.length);
        headers.setCacheControl("no-cache");
        return new ResponseEntity<byte[]>(bytes, headers, HttpStatus.CREATED);
    }

    /**
     * 最原始的下载方式
     *  response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/gif");
     */
    public static final void doDownload(HttpServletResponse response, String showName, byte[] bytes) throws IOException {
        doDownload(response, showName, bytes, MediaType.APPLICATION_OCTET_STREAM_VALUE);
    };

    /**
     * 扩展方法
     */
    public static final void doDownload(HttpServletResponse response, String showName, byte[] bytes, String contentType) throws IOException {
        response.setContentType(contentType);
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(showName, "UTF8"));
        OutputStream os = response.getOutputStream();
        os.write(bytes);
        os.flush();
        response.flushBuffer();
    };

}
