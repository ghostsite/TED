package com.ted.xplatform.web;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.collections.KeyValue;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ted.common.Constants;
import com.ted.common.exception.BusinessException;
import com.ted.common.spring.mvc.bind.annotation.RequestJsonParam;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.PasswordUtils;
import com.ted.common.util.SpringUtils;
import com.ted.common.util.xls.ExcelType;
import com.ted.common.util.xls.PoiXlsUtils;
import com.ted.common.web.download.DownloadHelper;
import com.ted.common.web.download.xls.DownloadXlsHelper;
import com.ted.common.web.download.xls.GridInfo;
import com.ted.xplatform.exception.UserErrorCode;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.service.UserService;
import com.ted.xplatform.util.PlatformUtils;

/**
 * 用户管理等的Controller
 *
 */
@Controller
@RequestMapping(value = "/user/*")
public class UserController {
    final Logger  logger = LoggerFactory.getLogger(UserController.class);

    @Inject
    UserService   userService;

    @Inject
    MessageSource messageSource;

    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 用户的查询，根据一个部门查询下面所以，不分页
     * list放回的参数统一用Page，因为Store的java反射机制，ExtController.java
     */
    @RequestMapping(value = "/getUserListByOrgId")
    public @ResponseBody
    //Map<String, Object> getUserListByOrgId(Long orgId) {
    JsonPage<User> getUserListByOrgId(Long orgId) {
        List<User> userList = userService.getUserListByOrgId(orgId);
        return JsonUtils.listToPage(userList);
    };

    @RequestMapping(value = "/getUserListByOrgId4Download")
    public @ResponseBody
    void getUserListByOrgId4Download(Long orgId, @RequestJsonParam GridInfo export, HttpServletResponse response) throws Exception {
        List<User> userList = userService.getUserListByOrgId(orgId);
        Workbook wb = PoiXlsUtils.createWorkBook(ExcelType.XLS);
        DownloadXlsHelper.list2Excel(userList, export, wb);

        //return DownloadHelper.getResponseEntity("normal.xls",PoiXlsUtils.wb2bytes(wb));//这种是乱码,nnd
        DownloadHelper.doDownload(response, "normal.xls", PoiXlsUtils.wb2bytes(wb));
    };

    /**
     * 用户的查询，根据一个用户名或登录名，不分页
     */
    @RequestMapping(value = "/getUserByTypeAndValue")
    public @ResponseBody
    JsonPage<User> getUserByTypeAndValue(String searchType, String searchValue, int start, int limit) {
        JsonPage<User> pageUser = userService.getUserByTypeAndValue(searchType, searchValue, start, limit);
        return pageUser;
    };

    /**
     * 保存用户：新增和修改,这个是给管理员用的。
     * @throws Exception 
     */
    @RequestMapping(value = "/save")
    public @ResponseBody
    String save(@Valid User user, MultipartHttpServletRequest multipartRequest) throws Exception {
        userService.save(user, multipartRequest);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };

    /**
     * 用户在更新自己信息或密码的时候，要校验下是否跟当前登陆用户是同一个，避免把别人的信息更新了。
     */
    @RequestMapping(value = "/updateCurrentUser")
    public @ResponseBody
    String updateCurrentUser(@Valid User user, MultipartHttpServletRequest multipartRequest) throws Exception {
        //check if current user
        User currentUser = PlatformUtils.getCurrentUser();
        if (user.getId() == null) {
            throw new BusinessException("请传入用户ID!", UserErrorCode.NO_USERID);
        }
        if (currentUser.getId().intValue() != user.getId().intValue()) {
            throw new BusinessException("只能更新当前登陆用户!", UserErrorCode.ONLY_UPDATE_CURRENTUSER);
        }
        userService.updateCurrentUser(user,multipartRequest);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
    };
    
    
    /**
     * 用户在更新自己语言的时候，要校验下是否跟当前登陆用户是同一个，避免把别人的locale语言更新了。
     */
    @RequestMapping(value = "/changeLanguage")
    public @ResponseBody
    String changeLanguage(@RequestParam String language) throws Exception {
        User currentUser = PlatformUtils.getCurrentUser();
        currentUser.setLanguage(language);
        return Constants.SUCCESS_JSON;
    };
    
    /**
     * 删除用户
     */
    @RequestMapping(value = "/delete/{userId}")
    public @ResponseBody
    String delete(@PathVariable Long userId) {
        userService.delete(userId);
        return Constants.SUCCESS_JSON;
    };

    /**
     * 删除用户:批量删除
     */
    @RequestMapping(value = "/deleteAll")
    public @ResponseBody
    String delete(@RequestJsonParam Collection<Long> userIds) {
        userService.deleteAll(userIds);
        return new JsonOut(SpringUtils.getMessage("message.common.delete.success", messageSource)).toString();
    };

    /**
     * 密码重置
     */
    @RequestMapping(value = "/resetPassword")
    public @ResponseBody
    String resetPassword(@RequestJsonParam Collection<Long> userIds) {
        KeyValue keyPwd = PasswordUtils.getDefaultKeyEncrypt();
        for (Long userId : userIds) {
            userService.updatePassword(userId, (String) keyPwd.getKey(), (String) keyPwd.getValue());
        }
        return Constants.SUCCESS_JSON;
    };

    /**
     * 用户自己更新重置, id is userId
     */
    @RequestMapping(value = "/updatePassword")
    public @ResponseBody
    String updatePassword(@RequestParam Long id, @RequestParam String oldPassword, @RequestParam String newPassword) {
        //check oldPassword is right
        User user = userService.getUserById(id);
        String passwordKey = user.getPasswordKey();
        String encodedOldPassword = PasswordUtils.encryptPassword(oldPassword, passwordKey);
        if (encodedOldPassword.equals(user.getPassword())) {
            KeyValue saltPwd = PasswordUtils.encryptPassword(newPassword);
            userService.updatePassword(id, (String) saltPwd.getKey(), (String) saltPwd.getValue());
            return Constants.SUCCESS_JSON;
        } else {
            return "{success:false, errorMessage:'旧密码错误'}";
        }
    };

    /**
     * 用户在组织机构的移动
     */
    @RequestMapping(value = "/move2Org")
    public @ResponseBody
    String move2Org(@RequestParam Long userId, @RequestParam Long orgId) {
        userService.move2Org(userId, orgId);
        return Constants.SUCCESS_JSON;
    };

    /**
     * 用户批量在组织机构的移动
     */
    @RequestMapping(value = "/moveAll2Org")
    public @ResponseBody
    String moveAll2Org(@RequestParam Collection<Long> userIds, @RequestParam Long orgId) {
        for (Long userId : userIds) {
            userService.move2Org(userId, orgId);
        }
        return Constants.SUCCESS_JSON;
    };

    /**
     * 系统管理->用户管理：获得一个User的详细信息，右边的FormPanel
     */
    @RequestMapping(value = "/getUserById")
    public @ResponseBody
    //Map<String, Object> getUserById(@RequestParam Long userId) {
    User getUserById(@RequestParam Long userId) {
        User user = userService.getUserById(userId);
        return user;
        //return JsonUtils.getJsonMap(user);
    };
}
