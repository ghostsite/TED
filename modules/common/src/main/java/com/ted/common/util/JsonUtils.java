package com.ted.common.util;

import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.introspect.BeanPropertyDefinition;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.ted.common.Constants;
import com.ted.common.support.datetime.deser.DefaultDateTimeDeserializer;
import com.ted.common.support.datetime.deser.DefaultLocalDateTimeDeserializer;
import com.ted.common.support.datetime.ser.DefaultDateTimeSerializer;
import com.ted.common.support.datetime.ser.DefaultLocalDateTimeSerializer;
import com.ted.common.support.page.JsonPage;

/**
 * JSON工具里，主要使用Jackson来进行jon化。
 * <p>
 * 对于pojo有一点要求，主要是因为hibernate在生成对象的时候，如果不想序列化，需要增加@JsonIgnore的生命在get方法上
 * <p>
 * @date : 20101116
 */
public class JsonUtils {
    public static final Logger  logger       = LoggerFactory.getLogger(JsonUtils.class);

    private static ObjectMapper objectMapper = new ObjectMapper();
    private static JsonFactory  jsonFactory  = new JsonFactory();
    static {
        setDefaultConfig(objectMapper, "yyyy-MM-dd HH:mm:ss");
    }

    public static final void setDefaultConfig(ObjectMapper objectMapper, String dateFormat) {
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        DateFormat df = new SimpleDateFormat(dateFormat);
        objectMapper.setDateFormat(df);
        //objectMapper.registerModule(new Hibernate4Module());
        SerializationConfig cfg = objectMapper.getSerializationConfig();
        JodaModule jodaModule = new JodaModule();
        jodaModule.addDeserializer(DateTime.class, DefaultDateTimeDeserializer.forType(DateTime.class));
        jodaModule.addDeserializer(LocalDateTime.class, new DefaultLocalDateTimeDeserializer());
        jodaModule.addSerializer(DateTime.class, new DefaultDateTimeSerializer());
        jodaModule.addSerializer(LocalDateTime.class, new DefaultLocalDateTimeSerializer());
        objectMapper.registerModule(jodaModule);//for joda time format
        /**
         * // First, defaults:
         * assertTrue(cfg.isEnabled(SerializationConfig.Feature
         * .USE_ANNOTATIONS));
         * assertTrue(cfg.isEnabled(SerializationConfig.Feature
         * .AUTO_DETECT_GETTERS));
         * assertTrue(cfg.isEnabled(SerializationConfig.Feature
         * .CAN_OVERRIDE_ACCESS_MODIFIERS));
         * 
         * assertTrue(cfg.isEnabled(SerializationConfig.Feature.
         * WRITE_NULL_PROPERTIES));
         * assertTrue(cfg.isEnabled(SerializationConfig.
         * Feature.WRITE_DATES_AS_TIMESTAMPS));
         * 
         * assertFalse(cfg.isEnabled(SerializationConfig.Feature.INDENT_OUTPUT))
         * ; assertFalse(cfg.isEnabled(SerializationConfig.Feature.
         * USE_STATIC_TYPING));
         * 
         * // since 1.3: assertTrue(cfg.isEnabled(SerializationConfig.Feature.
         * AUTO_DETECT_IS_GETTERS)); // since 1.4
         * 
         * assertTrue(cfg.isEnabled(SerializationConfig.Feature.
         * FAIL_ON_EMPTY_BEANS)); // since 1.5
         * assertTrue(cfg.isEnabled(SerializationConfig
         * .Feature.DEFAULT_VIEW_INCLUSION));
         */
        // cfg.setDateFormat(dateFormat);

        df.setTimeZone(TimeZone.getTimeZone("GMT+08:00"));
        cfg.with(df); //2.0 
        cfg.without(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public static <T> Object fromJson(String jsonAsString, Class<T> pojoClass) throws JsonMappingException, JsonParseException, IOException {
        return objectMapper.readValue(jsonAsString, pojoClass);
    }

    public static <T> Object fromJson(String jsonAsString, TypeReference<T> tr) throws JsonMappingException, JsonParseException, IOException {
        return objectMapper.readValue(jsonAsString, tr);
    }

    public static String toJson(Object pojo) {
        return toJson(pojo, false);
    };

    //
    public static void write(Object pojo, OutputStream os) throws JsonMappingException, JsonGenerationException, IOException {
        objectMapper.writeValue(os, pojo);
    }

    //
    protected static final JsonEncoding getJsonEncoding(MediaType contentType) {
        if (contentType != null && contentType.getCharSet() != null) {
            Charset charset = contentType.getCharSet();
            for (JsonEncoding encoding : JsonEncoding.values()) {
                if (charset.name().equals(encoding.getJavaName())) {
                    return encoding;
                }
            }
        }
        return JsonEncoding.UTF8;
    }

    /**
     * 
     */
    public static String toJson(Object pojo, boolean prettyPrint) {
        StringWriter sw = new StringWriter();
        try {
            JsonGenerator jg = jsonFactory.createJsonGenerator(sw);
            if (prettyPrint) {
                jg.useDefaultPrettyPrinter();
            }
            objectMapper.writeValue(jg, pojo);
            String s = sw.toString();
            logger.debug(s);
            return s;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 
     */
    public static String getJsonFromList(List<Object> list) {
        StringBuilder sb = new StringBuilder("{success:true,");
        sb.append(Constants.TOTALCOUNT);
        sb.append(":");
        sb.append(list.size());
        sb.append(",");
        sb.append(Constants.CONTENT);
        sb.append(":");
        sb.append(toJson(list, false));
        sb.append("}");
        return sb.toString();
    };

    //
    public static String toString(JsonNode node) {
        try {
            JsonFactory jsonFactory = new JsonFactory();
            StringWriter sw = new StringWriter();
            JsonGenerator generator = jsonFactory.createJsonGenerator(sw);
            generator.writeTree(node);
            return sw.toString();
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    };

    //
    public static void write(JsonNode node, OutputStream out) {
        try {
            JsonFactory jsonFactory = new JsonFactory();
            JsonGenerator generator = jsonFactory.createJsonGenerator(out, JsonEncoding.UTF8);
            generator.writeTree(node);
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    };

    //
    public static final ObjectMapper getMapper() {
        return objectMapper;
    }

    /**
     * ghostzhang added 20130224
     * 反射，来源于ExtController的需求
     * 获得一个Class的所有属性，包括方法和Field
     */
    public static final List<BeanPropertyDefinition> getClassPropertyDefinitions(Class<?> clazz) {
        SerializationConfig config = objectMapper.getSerializationConfig();
        JavaType javaType = config.constructType(clazz);
        BeanDescription beanDesc = config.introspect(javaType);
        List<BeanPropertyDefinition> findProperties = beanDesc.findProperties();
        return findProperties;
        //        for (BeanPropertyDefinition bpDef : findProperties) {//to study @Annotation
        //            System.out.println(bpDef.getName() + ":" + bpDef.getGetter().getRawType());
        //            AnnotatedMethod getter = bpDef.getGetter();
        //            Method annotated = bpDef.getGetter().getAnnotated();
        //            Annotation anno = annotated.getAnnotation(JsonProperty.class);
        //            Class z = anno.annotationType();
        //            System.out.println(z);
        //        }
    }

    /**
     * 把单独的对象转为extjs要求的格式。
     * 这块有个多余，一个是给原来用的，一个是给extjs4用的。data
     * form load的数据格式：{data:{XXX:xxx},success:true},两个属性必须都同时存在。
     * 这个跟GridPanel load不一样，grid store 可以设置root, form load 不行。
     * this is for extjs3 and extjs4
    */
    public static final Map<String, Object> getJsonMap(Object o) {
        return CollectionUtils.newMap("success", true, "data", o);
    };

    /**
     * 作用跟getJsonMap(Object o)一样，只不过getJsonFromObject更进一步，转为String了
     */
    public static String getJsonFromObject(Object o) {
        Map<String, Object> jsonMap = CollectionUtils.newMap("success", true, "data", o); //extjs4 默认是data
        return toJson(jsonMap);
    };

    /**
     * 把List转为Page对象，for Extjs,这样做是因为ExtjsController.js 的store格式是写死为page的。
     * @date 20130220
     */
    public static final <T> JsonPage<T> listToPage(List<T> list) {
        if (null == list || list.size() == 0) {
            return new JsonPage<T>();
        } else {
            JsonPage<T> jsonPage = new JsonPage<T>(list, null, list.size());
            return jsonPage;
        }
    };
    
    public static final <T> JsonPage<T> listToPage(List<T> list, long totalCount) {
        if (null == list || list.size() == 0) {
            return new JsonPage<T>();
        } else {
            JsonPage<T> jsonPage = new JsonPage<T>(list, null, totalCount);
            return jsonPage;
        }
    };

    /**
     * 为了反射输出bean到excel，需要跟页面的数据格式一样，也保证属性可以从getF方法获得，故采用了这种形式。
     * 这个方法类似于BeanUtils,不过需要读get方法，需要走bean的jackson annotation信息。注意：返回的都是String值.
     */
    public static final Map<String, Object> getBeanValueMap(Object o) {
        String str = JsonUtils.toJson(o);
        try {
            Map<String, Object> map = (Map<String, Object>) JsonUtils.fromJson(str, Map.class);
            return map;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new HashMap<String,Object>();
    };
}
