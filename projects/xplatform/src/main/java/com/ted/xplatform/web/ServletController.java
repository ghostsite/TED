package com.ted.xplatform.web;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.service.AttachmentService;
import com.ted.xplatform.util.AttachmentUtils;

/**
 * download and image as a pic controller
 *
 */
@Controller
@RequestMapping(value = "/servlet/*")
public class ServletController {
    @Inject
    private AttachmentService   attachmentService;
    
    public void setAttachmentService(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    /**
     * 生成图片，根据附件attachment 的主键attachId
     * @param attachId
     * @param response
     * @return
     */
    @RequestMapping(value = "/getPic/{attachId}")
    public void getPic(@PathVariable Long attachId, HttpServletResponse response) {
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/gif");
        
        Attachment attachment = attachmentService.getAttachmentById(attachId);
        String fullPath = AttachmentUtils.getAttachFullPath(attachment.getFilePath());
        try {
            InputStream input = new FileInputStream(fullPath);
            //ImageIO.write(image, "PNG", response.getOutputStream());
            IOUtils.copy(input, response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
