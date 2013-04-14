package com.ted.xplatform.web;
 
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.ted.common.util.ConfigUtils;
import com.ted.common.util.PasswordUtils;
import com.ted.xplatform.pojo.common.User;
import com.ted.xplatform.service.UserService;
import com.ted.xplatform.util.PlatformUtils;

/**
 * 登陆的controller
 */

@Controller
//@RequestMapping(value = "/security/*")
//@RequestMapping(value = "/*")
public class SecurityController {

    @Inject
    UserService      userService;

    @RequestMapping(value = "/login")
    public String login(RedirectAttributes model, @RequestParam(value = "username") String loginName, @RequestParam(value = "password") String password, @RequestParam(value = "language",required = false) String language) {
        User user = userService.getUserByLoginNameAssociate(loginName);
        if (null != user) {
            String encrypto = PasswordUtils.encryptPassword(password, user.getPasswordKey());
            if (encrypto.equals(user.getPassword())) {
                setLogin(user.getLoginName(), user.getPassword());
                user.setLanguage(language);
                PlatformUtils.setCurrentUser(user);
                //model.addAttribute(user);
                model.addFlashAttribute(user);//由于用的是RedirectAttributes， so要用addFlashAttribute，不能用addAttribute
                return "redirect:main";
            } 
        }
        model.addFlashAttribute("error", "用户名或密码错误!");
        return "redirect:/"; //返回登录页
    }
    
    /**
     * 这个是登陆后，cas认证后跳转到的页面,这个是给sso登陆用的
     * 如果是sso登陆，请访问 http://wsria.com:8080/xp/loginSso
     */
    @RequestMapping(value ="/loginSso")
    public String loginSso(Model model) {
        Subject currentUser = SecurityUtils.getSubject();
        Object principal = currentUser.getPrincipal();
        User user = userService.getUserByLoginNameAssociate((String)principal); 
        if (null != user) {
            user.setLanguage("cn");
            PlatformUtils.setCurrentUser(user);
            model.addAttribute(user);
            return "redirect:main";
        } else {
            return "login"; //返回登录页
        }
    };

    // 设置登录信息,userId 主键 profile
    public static final void setLogin(String userId, String password) {
        Subject currentUser = SecurityUtils.getSubject();
        if (!currentUser.isAuthenticated()) {
            UsernamePasswordToken token = new UsernamePasswordToken(userId, password);
            token.setRememberMe(true);
            currentUser.login(token);
        }
    };

    @RequestMapping(value = "logout")
    public String logout(HttpServletRequest request) {
        Subject subject = SecurityUtils.getSubject();
        if (subject != null) {
            // see:http://incubator.apache.org/shiro/static/current/apidocs/org/apache/shiro/subject/Subject.html#logout()
            subject.logout();
        }
        request.getSession().invalidate();
        return "redirect:showLogin";
    }

    @SuppressWarnings("all")
    @RequestMapping(value = "/main", method = RequestMethod.GET)
    public String main(Model model) {
        User user = PlatformUtils.getCurrentUser();
        if (null == user) {
            return "redirect:showLogin";
        } else {
            model.addAttribute(user);
            model.addAttribute("pageSize", ConfigUtils.getConfig().getInt("pageSize"));
            model.addAttribute("waitMsg", ConfigUtils.getConfig().getString("waitMsg"));
            return "main";
        }
    }

    //跳转到登录页面
    @SuppressWarnings("all")
    @RequestMapping(value = "/showLogin", method = RequestMethod.GET)
    public String showLogin(HttpSession session) {
        return "login"; //返回登录页
    }

    public UserService getUserService() {
        return userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

}
