package com.ted.xplatform.web;

import java.io.IOException;
import java.util.Collection;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.Constants;
import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.service.AttachmentService;
import com.ted.xplatform.util.AttachmentUtils;

@Controller
@RequestMapping(value = "/defaultattachment/*")
@SuppressWarnings("all")
public class DefaultAttachmentController {
    final Logger              logger = LoggerFactory.getLogger(DefaultAttachmentController.class);

    @Inject
    private AttachmentService attachmentService;

    public void setAttachmentService(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    /**
     * 删除用户:批量删除
     */
    @RequestMapping(value = "/deleteAll")
    public @ResponseBody
    String delete(@RequestParam Collection<Long> attachIds) {
        for (Long attachId : attachIds) {
            attachmentService.delete(attachId);
        }
        return Constants.SUCCESS_JSON;
    };

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public void download(Long attachmentId, HttpServletResponse response) {
        this.attachmentService.download(attachmentId, response);
    }

}
