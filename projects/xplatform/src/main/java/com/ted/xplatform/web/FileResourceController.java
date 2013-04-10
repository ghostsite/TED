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
import com.ted.common.support.extjs4.tree.CheckTreeNodeWithChildren2;
import com.ted.common.support.extjs4.tree.TreeNode;
import com.ted.common.support.extjs4.tree.TreeNodeUtil;
import com.ted.common.support.file.FileManager;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.CollectionUtils;
import com.ted.common.util.DozerUtils;
import com.ted.common.util.FileUtils;
import com.ted.common.web.download.DownloadHelper;
import com.ted.xplatform.pojo.common.FileResource;
import com.ted.xplatform.service.FileResourceService;
import com.ted.xplatform.util.AttachmentUtils;

/**
 * 公共文件的Controller，类比AttachmentController
 * 注意：数据是放到resource表里面的。
 */
@Controller
@RequestMapping(value = "/fileresource/*")
@SuppressWarnings("all")
public class FileResourceController {

    @Inject
    FileManager                 fileManager = null;

    @Inject
    private FileResourceService fileResourceService;

    public void setFileManager(FileManager fileManager) {
        this.fileManager = fileManager;
    }

    public void setFileResourceService(FileResourceService fileResourceService) {
        this.fileResourceService = fileResourceService;
    }

    //===================以下是给上传、下载用的===============================//
    /**
     * 删除用户:批量删除
     */
    @RequestMapping(value = "/deleteAll")
    public @ResponseBody
    String delete(@RequestParam Collection<Long> ids) {
        for (Long id : ids) {
            fileResourceService.delete(id);
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
        FileResource fileResource = new FileResource();
        fileResource.setOriginName(multipartFile.getOriginalFilename());
        fileResource.setFileName(fileName);
        fileResource.setName(multipartFile.getOriginalFilename());//Resource多出来的
        fileResource.setCode(fileName);//Resource多出来的,存的是9123123asasdfasdf.jpg，随机字符串
        fileResource.setCanView(true);//写死canView权限
        fileResource.setFilePath(middleDir);
        fileResource.setFileSize(new Long(multipartFile.getBytes().length));
        fileResource.setFileType(FileUtils.getExtension(multipartFile.getOriginalFilename(), true));
        fileResourceService.save(fileResource);
        //return JsonUtils.getJsonMap(attachment.getId());
        return CollectionUtils.newMap("success", true, "fileId", fileResource.getId());
    };

    @RequestMapping(value = "/getFileResourceByTypeCode")
    @ResponseBody
    public List<FileResource> getFileResourceByTypeCode(String typeCode) {
        return fileResourceService.getFileResourceByTypeCode(typeCode);
    }

    @RequestMapping(value = "/getAllFileResource")
    @ResponseBody
    public List<FileResource> getAllFileResource() {
        return fileResourceService.getAllFileResource();
    }

    @RequestMapping(value = "/pagedAllFileResource")
    @ResponseBody
    public JsonPage<FileResource> pagedAllFileResource(int start, int limit) {
        return fileResourceService.pagedAllFileResource(start, limit);
    }

    @RequestMapping(value = "/download/{fileId}")
    public void download(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        FileResource fileResource = (FileResource) fileResourceService.getFileResourceById(fileId);
        if (null != fileResource) {
            String fullPath = AttachmentUtils.getDir(fileResource.getFilePath());
            byte[] bytes = fileManager.load(fullPath, fileResource.getFileName());
            DownloadHelper.doDownload(response, fileResource.getOriginName(), bytes);
        }
    };

    /**
     * 下载图片
     */
    @RequestMapping(value = "/downloadPic/{fileId}")
    public void downloadPic(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        FileResource fileResource = (FileResource) fileResourceService.getFileResourceById(fileId);
        if (null != fileResource) {
            String fullPath = AttachmentUtils.getDir(fileResource.getFilePath());
            byte[] bytes = fileManager.load(fullPath, fileResource.getFileName());
            String mediaType = getMediType(fileResource);
            if (null != mediaType) {
                DownloadHelper.doDownload(response, fileResource.getOriginName(), bytes, mediaType);
            }
        }
    };

    //根据attachment的扩展名，获得MediaType
    public static final String getMediType(FileResource fileResource) {
        String type = fileResource.getFileType().toLowerCase();
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

    //===================以下是给分级授权用的===============================//
    //-------------------后台管理的分级授权的显示--------------------//
    //分级授权：显示右边的菜单,注意是带角色过滤的.参考MenuResourceController,好像还做不了分页，因为根据权限，有的要不显示，怎么统计总数和每页的数据呢？
    @RequestMapping(value = "/getFilesByIdFilterByRole")
    public @ResponseBody
    List<TreeNode> getFilesByIdFilterByRole() {
        //List<FileResource> fileResourceList = fileResourceService.getMenusByParentIdFilterByCurrentSubject(resourceId);//TODO 注意带分页
        List<FileResource> fileResourceList = fileResourceService.getFilesFilterByCurrentSubject();//TODO 注意带分页
        List<TreeNode> treeNodeList = DozerUtils.mapList(fileResourceList, TreeNode.class);
        return treeNodeList;
    };

    //分级授权：显示右边的菜单,注意是带角色过滤的.连带权限的leaf append to fileresource
    //@RequestMapping(value = "/getSubMenusCascadeFilterByRoleWithACLCheckBox")
    @RequestMapping(value = "/getFilesFilterByRoleWithACLCheckBox")
    public @ResponseBody
    List<CheckTreeNodeWithChildren2> getFilesFilterByRoleWithACLCheckBox(@RequestParam Long resourceId) {//fileid=resourceId is parent_id
        //List<FileResource> fileResourceList = fileResourceService.getSubMenusCascadeLoadOperationsByParentIdFilterByCurrentSubject(resourceId);
        List<FileResource> fileResourceList = fileResourceService.getFilesLoadOperationsFilterByCurrentSubject();
        List<CheckTreeNodeWithChildren2> treeNodeList = DozerUtils.mapList(fileResourceList, CheckTreeNodeWithChildren2.class);
        TreeNodeUtil.setChildrenNotLeafCascade(treeNodeList);
        TreeNodeUtil.setChildren2LeafCascade(treeNodeList);
        TreeNodeUtil.moveChildren2ToChildrenCascade(treeNodeList);
        return treeNodeList;
    };
    
}
