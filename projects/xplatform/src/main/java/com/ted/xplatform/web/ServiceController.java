package com.ted.xplatform.web;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletContext;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

/**
 * 这个是mock用的，主要是代替原来的POST .json请求  for mesplus
 *  这个应该删除的，目前是做demo用的。读取resource/data/service下的file
 */
@Controller
@RequestMapping(value = "/service/*")
@SuppressWarnings("all")
public class ServiceController implements ServletContextAware {
    private ServletContext servletContext; // always null

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    };

    public static final String prefix = "resources/data/service/";

    //获得webapp/resources/data/service下的资源
    public Resource getWebAppResource(String path) {
        return new ServletContextResource(servletContext, prefix + path);
    }

    @RequestMapping(value = "/BasViewTaskRequestMenuList.json", method = {RequestMethod.POST, RequestMethod.GET})
    public @ResponseBody
    String BasViewTaskRequestMenuList() throws IOException {
        InputStream is = getWebAppResource("BasViewTaskRequestMenuList.json").getInputStream();
        String s = IOUtils.toString(is);
        IOUtils.closeQuietly(is);
        return s;
    }
    
    @RequestMapping(value = "/BasViewDataList.json", method = {RequestMethod.POST, RequestMethod.GET})
    public @ResponseBody
    String BasViewDataList() throws IOException {
        InputStream is = getWebAppResource("BasViewDataList.json").getInputStream();
        String s = IOUtils.toString(is);
        IOUtils.closeQuietly(is);
        return s;
    }
    
    ///service/BasViewTableList.json?_dc=1352980231609
    @RequestMapping(value = "/BasViewTableList.json", method = {RequestMethod.POST, RequestMethod.GET})
    public @ResponseBody
    String BasViewTableList() throws IOException {
        InputStream is = getWebAppResource("BasViewTableList.json").getInputStream();
        String s = IOUtils.toString(is);
        IOUtils.closeQuietly(is);
        return s;
    }
    
    //8081/xp/service/basViewCodeList.json?_dc=1352980347807
    @RequestMapping(value = "/basViewCodeList.json", method = {RequestMethod.POST, RequestMethod.GET})
    public @ResponseBody
    String basViewCodeList() throws IOException {
        InputStream is = getWebAppResource("basViewCodeList.json").getInputStream();
        String s = IOUtils.toString(is);
        IOUtils.closeQuietly(is);
        return s;
    }
    
    //SecViewFavoritesList.json
    @RequestMapping(value = "/SecViewFavoritesList.json", method = {RequestMethod.POST,RequestMethod.GET})
    public @ResponseBody
    String SecViewFavoritesList() throws IOException {
        InputStream is = getWebAppResource("SecViewFavoritesList.json").getInputStream();
        String s = IOUtils.toString(is);
        IOUtils.closeQuietly(is);
        return s;
    }
    
    //SecViewFunctionList.json? 目前只有opc的初始化页面再用，home已经不用了。opc啥意思，还没搞明白。原来是右上角的menulist按钮再用
    @RequestMapping(value = "/SecViewFunctionList.json", method = {RequestMethod.POST})
    public @ResponseBody
    String SecViewFunctionList() throws IOException {
        InputStream is = getWebAppResource("SecViewFunctionList.json").getInputStream();
        String s = IOUtils.toString(is);
        IOUtils.closeQuietly(is);
        return s;
    }
}
