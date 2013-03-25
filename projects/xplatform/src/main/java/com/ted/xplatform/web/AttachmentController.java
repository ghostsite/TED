package com.ted.xplatform.web;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ted.common.Constants;
import com.ted.common.support.file.FileManager;
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
    FileManager               fileManager = null;

    @Inject
    private AttachmentService attachmentService;

    public void setFileManager(FileManager fileManager) {
        this.fileManager = fileManager;
    }

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
        MultipartFile multipartFile = AttachmentUtils.getMultipartFile(multipartRequest);
        String middleDir = AttachmentUtils.getMiddleDir();
        String dir = AttachmentUtils.getDir(middleDir);
        String fileName = AttachmentUtils.getRandomFileName(multipartFile.getOriginalFilename());
        fileManager.save(dir, fileName, multipartFile.getBytes());
        Attachment attachment = new Attachment();
        attachment.setOriginName(multipartFile.getOriginalFilename());
        attachment.setFileName(fileName);
        attachment.setFilePath(middleDir);
        attachment.setFileSize(new Long(multipartFile.getBytes().length));
        attachment.setFileType(FileUtils.getExtension(multipartFile.getOriginalFilename(), true));
        attachmentService.save(attachment);
        //return JsonUtils.getJsonMap(attachment.getId());
        return CollectionUtils.newMap("success", true, "fileId", attachment.getId());
    };

    @RequestMapping(value = "/getAttachmentByTypeCode")
    public List<Attachment> getAttachmentByTypeCode(String typeCode) {
        return attachmentService.getAttachmentByTypeCode(typeCode);
    }

    @RequestMapping(value = "/download/{fileId}")
    public void download(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        Attachment attachment = (Attachment) attachmentService.getAttachmentById(fileId);
        if (null != attachment) {
            String fullPath = AttachmentUtils.getDir(attachment.getFilePath());
            byte[] bytes = fileManager.load(fullPath, attachment.getFileName());
            DownloadHelper.doDownload(response, attachment.getOriginName(), bytes);
        }
    }

}
