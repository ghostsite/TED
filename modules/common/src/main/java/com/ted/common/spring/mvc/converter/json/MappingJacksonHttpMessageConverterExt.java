package com.ted.common.spring.mvc.converter.json;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

import com.fasterxml.jackson.core.JsonGenerator;
import com.ted.common.util.JsonUtils;

public class MappingJacksonHttpMessageConverterExt extends MappingJackson2HttpMessageConverter implements InitializingBean {
    public static final Logger logger = LoggerFactory.getLogger(MappingJacksonHttpMessageConverterExt.class);
    private String             dateFormat;

    public MappingJacksonHttpMessageConverterExt() {
        super();
    }

    //----------------------------------------------
    //这个方法是关键。
    public void afterPropertiesSet() {
        JsonUtils.setDefaultConfig(this.getObjectMapper(), dateFormat);
    };

    //输出，增加了日志，如果没有日志输出，则可以删除这个方法。
    @Override
    protected void writeInternal(Object object, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        super.writeInternal(object, outputMessage);
        printJson(object);
    }

    public void printJson(Object object) throws IOException, HttpMessageNotWritableException {
        //.. if (logger.isDebugEnabled()) {
        OutputStream os = new ByteArrayOutputStream();
        Writer writer = new OutputStreamWriter(os);
        JsonGenerator jsonGenerator = getObjectMapper().getFactory().createJsonGenerator(writer);
        getObjectMapper().writeValue(jsonGenerator, object);
        logger.debug(os.toString());
        // }
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }
}
