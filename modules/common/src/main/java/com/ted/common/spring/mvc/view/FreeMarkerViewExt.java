package com.ted.common.spring.mvc.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

import com.ted.common.util.NetworkUtils;

public class FreeMarkerViewExt extends FreeMarkerView {
    public static final String BASE_PATH = "basePath";
    
    @Override
    protected void exposeHelpers(Map<String, Object> model, HttpServletRequest request) throws Exception {
        String contextPath = NetworkUtils.getBasePath(request); //request.getContextPath();
        if (this.logger.isDebugEnabled()) {
            logger.debug("contextPath=" + contextPath);
        }
        model.put(BASE_PATH, contextPath);
    }
}
