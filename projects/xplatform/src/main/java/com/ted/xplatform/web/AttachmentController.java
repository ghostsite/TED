package com.ted.xplatform.web;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ted.common.Constants;
import com.ted.common.support.file.FileManager;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.CollectionUtils;
import com.ted.common.util.FileUtils;
import com.ted.common.web.download.DownloadHelper;
import com.ted.xplatform.pojo.common.Attachment;
import com.ted.xplatform.service.AttachmentService;
import com.ted.xplatform.util.AttachmentUtils;

/**
 * 公共附件的Controller
 */
@Controller
@RequestMapping(value = "/attachment/*")
@SuppressWarnings("all")
public class AttachmentController {

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
     * 上传需要做的事情有：
     * 1 获得路径
     * 2 保存文件到磁盘orFTP
     * 3 生成Attachment对象，并保存。
     */
    @RequestMapping(value = "/upload")
    public @ResponseBody
    Map<String, Object> upload(MultipartHttpServletRequest multipartRequest) throws Exception {
        Attachment attachment = attachmentService.save(multipartRequest);
        return CollectionUtils.newMap("success", true, "fileId", attachment.getId());
    };

    @RequestMapping(value = "/getAttachmentByTypeCode")
    @ResponseBody
    public List<Attachment> getAttachmentByTypeCode(String typeCode) {
        return attachmentService.getAttachmentByTypeCode(typeCode);
    }

    @RequestMapping(value = "/getAllAttachment")
    @ResponseBody
    public List<Attachment> getAllAttachment() {
        return attachmentService.getAllAttachment();
    }

    @RequestMapping(value = "/pagedAllAttachment")
    @ResponseBody
    public JsonPage<Attachment> pagedAllAttachment(int start, int limit) {
        return attachmentService.pagedAllAttachment(start, limit);
    }

    @RequestMapping(value = "/download/{fileId}")
    public void download(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        Attachment attachment = attachmentService.getDownloadAttachment(fileId);
        DownloadHelper.doDownload(response, attachment.getOriginName(), attachment.getBytes());
    };

    /**
     * 下载图片
     */
    @RequestMapping(value = "/downloadPic/{fileId}")
    public void downloadPic(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        Attachment attachment = attachmentService.getDownloadAttachment(fileId);
        if (null != attachment) {
            String mediaType = getMediType(attachment);
            if (null != mediaType) {
                DownloadHelper.doDownload(response, attachment.getOriginName(), attachment.getBytes(), mediaType);
            }
        }
    };

    //根据attachment的扩展名，获得MediaType
    public static final String getMediType(Attachment attachment) {
        String type = attachment.getFileType().toLowerCase();
        if (type.equals(".jpg")) {
            return MediaType.IMAGE_JPEG_VALUE;
        } else if (type.equals(".gif")) {
            return MediaType.IMAGE_GIF_VALUE;
        } else if (type.equals(".jpeg")) {
            return MediaType.IMAGE_JPEG_VALUE;
        } else if (type.equals(".png")) {
            return MediaType.IMAGE_PNG_VALUE;
        } else if (type.equals(".bmp")) {
            return MediaType.IMAGE_JPEG_VALUE;
        } else {
            return null;
        }
    };

}
