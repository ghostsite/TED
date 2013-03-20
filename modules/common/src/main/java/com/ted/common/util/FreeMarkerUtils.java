package com.ted.common.util;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springside.modules.utils.Exceptions;

import freemarker.template.Configuration;
import freemarker.template.Template;

/**
 * 模板方法
 */
public class FreeMarkerUtils {
    static final Configuration cfg = new Configuration();

    static {
        cfg.setDefaultEncoding("UTF-8");
    }

    public static void main(String[] args) throws Exception {
        FreeMarkerUtils.buildConfiguration("com");
        String f = FreeMarkerUtils.rendereString("a${b}c", CollectionUtils.newMap("b", "faint"));
        System.out.println(f);
    }

    /**
     * 渲染模板字符串。
     */
    public static String rendereString(String templateString, Map<String, ?> model) {
        try {
            StringWriter result = new StringWriter();
            Template t = new Template("name", new StringReader(templateString), cfg);
            t.process(model, result);
            return result.toString();
        } catch (Exception e) {
            throw Exceptions.unchecked(e);
        }
    }

    public static String renderTemplate(String path, String templateId, Map<String, ?> paramMap) {
        StringWriter writer = new StringWriter();
        try {
            Template template = getTemplate(path, templateId);
            template.process(paramMap, writer);
            return writer.toString();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                writer.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "free marker template exception occured!";
    };

    /**
     * 渲染Template文件.
     */
    public static String renderTemplate(Template template, Object model) {
        try {
            StringWriter result = new StringWriter();
            template.process(model, result);
            return result.toString();
        } catch (Exception e) {
            throw Exceptions.unchecked(e);
        }
    }

    public static Template getTemplate(String path, String templateId) {
        try {
            //cfg.setDirectoryForTemplateLoading(new File(FreeMarkerUtils.class.getClassLoader().getResource(path).getPath()));
            cfg.setDirectoryForTemplateLoading(new DefaultResourceLoader().getResource(path).getFile());
            return cfg.getTemplate(templateId + ".ftl");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    /**
     * 创建默认配置，设定模板目录.
     */
    public static Configuration buildConfiguration(String directory) throws IOException {
        Resource path = new DefaultResourceLoader().getResource(directory);
        cfg.setDirectoryForTemplateLoading(path.getFile());
        return cfg;
    }

}
