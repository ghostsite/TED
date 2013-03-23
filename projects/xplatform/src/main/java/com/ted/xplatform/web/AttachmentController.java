package com.ted.xplatform.web;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest;

import com.ted.common.Constants;
import com.ted.xplatform.service.AttachmentService;
import com.ted.xplatform.util.AttachmentUtils;
import com.ted.xplatform.vo.AttachmentVO;

import com.ted.xplatform.pojo.common.Attachment;

/**
 * 公共附件的Controller
 */
@Controller
@RequestMapping(value = "/attachment/*")
@SuppressWarnings("all")
public class AttachmentController {
    final Logger              logger = LoggerFactory.getLogger(AttachmentController.class);

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

    /**
     * 上传,stop here,参考mes的上传，不一定带pics参数
     */
    @RequestMapping(value = "/upload")
    public @ResponseBody
    String upload(DefaultMultipartHttpServletRequest multipartRequest) throws Exception {
        List<AttachmentVO> attachmentVOList = AttachmentUtils.getAttachmentVOList(multipartRequest, "pics");
        attachmentService.upload(attachmentVOList);
        return Constants.SUCCESS_JSON;
    };

    @RequestMapping(value = "/getAttachmentByTypeCode")
    public List<Attachment> getAttachmentByTypeCode(String typeCode) {
        return attachmentService.getAttachmentByTypeCode(typeCode);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public void download(Long attachmentId, HttpServletResponse response) {
        this.attachmentService.download(attachmentId, response);
    }

}
