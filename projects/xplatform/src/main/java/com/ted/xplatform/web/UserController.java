package com.ted.xplatform.web;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.Constants;
import com.ted.common.spring.mvc.bind.annotation.RequestJsonParam;
import com.ted.common.support.extjs4.JsonOut;
import com.ted.common.support.page.JsonPage;
import com.ted.common.util.JsonUtils;
import com.ted.common.util.PasswordUtils;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.service.UserService;

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
     * 保存用户：新增和修改
     */
    @RequestMapping(value = "/save")
    public @ResponseBody
    String save(User user) {
        userService.save(user);
        return new JsonOut(SpringUtils.getMessage("message.common.submit.success", messageSource)).toString();
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
        String[] keyEncrypto = PasswordUtils.getDefaultKeyEncrypto();
        for (Long userId : userIds) {
            userService.updatePassword(userId, keyEncrypto[0], keyEncrypto[1]);
        }
        return Constants.SUCCESS_JSON;
    };
    
    /**
     * 用户自己更新重置, id is userId
     */
    @RequestMapping(value = "/updatePassword")
    public @ResponseBody
    String resetPassword(@RequestParam Long id,@RequestParam String oldPassword, @RequestParam String newPassword) {
        //check oldPassword is right
        User user = userService.getUserById(id);
        String passwordKey = user.getPasswordKey();
        String encodedOldPassword = PasswordUtils.encrypto(oldPassword, passwordKey);
        if(encodedOldPassword.equals(user.getPassword())){
            String[] keyEncrypto = PasswordUtils.encrypto(newPassword);
            userService.updatePassword(id, keyEncrypto[0], keyEncrypto[1]);
            return Constants.SUCCESS_JSON;
        }else{
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
    @RequestMapping(value = "/getUserById/{userId}")
    public @ResponseBody
    Map<String, Object> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return JsonUtils.getJsonMap(user);
    };
}
