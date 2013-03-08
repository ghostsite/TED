package com.ted.common.dao;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.xml.DefaultDocumentLoader;
import org.springframework.beans.factory.xml.DocumentLoader;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.util.xml.DomUtils;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.collect.Maps;
import com.ted.common.util.FreeMarkerUtils;

public class TemplateDaoSupport implements TemplateDao, InitializingBean, ResourceLoaderAware {

    Log                                         LOGGER               = LogFactory.getLog(TemplateDaoSupport.class);

    private long                                delay                = 10;                                         //seconds

    protected List<String>                      fileNames;

    protected ResourceLoader                    resourceLoader       = null;

    private static DocumentLoader               documentLoader       = new DefaultDocumentLoader();

    private static LoadingCache<String, String> cachedQL             = null;

    private static CacheBuilder<Object, Object> cacheBuilder         = null;

    private static final Map<String, String>    queryKey2FileNameMap = Maps.newConcurrentMap();                    //query name 到文件名的映射，来记住query对应哪个文件，用来刷新文件用
    private static final Map<String, XmlHolder> xmlHolderMap         = Maps.newConcurrentMap();                    //ConcurrentMap没有用同步，感觉不用，因为runmode下，不会reload，如果是reload都是调试

    //强制刷新，用在afterProperties
    private void loadFiles2CacheXmls() throws Exception {
        for (int i = 0; i < fileNames.size(); i++) {
            String fileName = ((String) fileNames.get(i)).trim();
            if (resourceLoader instanceof ResourcePatternResolver) {
                try {
                    Resource[] resources = ((ResourcePatternResolver) resourceLoader).getResources(fileName);
                    for (Resource resource : resources) {
                        loadFile2CacheXmls(resource);
                    }
                } catch (IOException ex) {
                    throw new RuntimeException("Could not resolve sql definition resource pattern [" + fileName + "]", ex);
                }
            } else {
                Resource resource = resourceLoader.getResource(fileName);
                loadFile2CacheXmls(resource);
            }
        }
    }

    //如果时间变化了，才load,注意根路径是写死的，并且不能有子目录
    private void loadFile2CacheXmlsByCheck(String fileURI) throws Exception {
        Resource resource = resourceLoader.getResource(fileURI);
        XmlHolder xmlHolder = xmlHolderMap.get(fileURI);
        if (resource.lastModified() > xmlHolder.getLastModified()) {
            loadFile2CacheXmls(resource);
        }
    }

    protected void loadFile2CacheXmls(Resource resource) throws Exception {
        String fileURI = resource.getURI().toString();
        XmlHolder xmlHolder = buildFileResource2XmlHolder(resource);
        xmlHolderMap.put(fileURI, xmlHolder);
    };

    public void afterPropertiesSet() throws Exception {
        cacheBuilder = CacheBuilder.newBuilder().maximumSize(10000);
        if (this.getDelay() > 0) {
            cacheBuilder.expireAfterWrite(this.getDelay(), TimeUnit.SECONDS);
        }
        final long delayTime = this.getDelay();
        cachedQL = cacheBuilder.build(new CacheLoader<String, String>() {
            @Override
            public String load(String queryName) throws Exception {
                String fileURI = queryKey2FileNameMap.get(queryName);
                if (delayTime > 0) {
                    loadFile2CacheXmlsByCheck(fileURI);
                }
                XmlHolder xmlHolder = xmlHolderMap.get(fileURI);
                String qlString = xmlHolder.getQl(queryName);
                if (qlString != null) {
                    return qlString;
                }
                return "";

            }
        });

        loadFiles2CacheXmls();
    }

    protected XmlHolder buildFileResource2XmlHolder(Resource resource) throws Exception {
        Map<String, String> qlMap = new HashMap<String, String>();
        try {
            String fileURI = resource.getURI().toString();
            InputSource inputSource = new InputSource(resource.getInputStream());
            org.w3c.dom.Document doc = documentLoader.loadDocument(inputSource, null, null, org.springframework.util.xml.XmlValidationModeDetector.VALIDATION_NONE, false);
            Element root = doc.getDocumentElement();
            List<Element> querys = DomUtils.getChildElements(root);
            for (Element query : querys) {
                String queryName = query.getAttribute("name");
                if (StringUtils.isEmpty(queryName)) {
                    throw new Exception("DynamicHibernate Service : name is essential attribute in a <query>.");
                }
                if (qlMap.containsKey(queryName)) {
                    throw new Exception("DynamicHibernate Service : duplicated query in a <query>.");
                }
                String queryText = DomUtils.getTextValue(query);
                qlMap.put(queryName, queryText);
                queryKey2FileNameMap.put(queryName, fileURI);
            }
        } catch (Exception ioe) {
            throw ioe;
        }
        XmlHolder xmlHolder = new XmlHolder(qlMap, resource.lastModified());
        return xmlHolder;
    };

    public String getTemplatedQLString(String namedQL, Map<String, Object> params) {
        try {
            String templateString = cachedQL.get(namedQL);
            return FreeMarkerUtils.rendereString(templateString, params);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return "";
    }

    protected class XmlHolder {
        private Map<String, String> qlMap;            //查询的映射
        private long                lastModified = -1;

        public String getQl(String key) {
            if (null != qlMap) {
                return qlMap.get(key);
            } else {
                if (LOGGER.isErrorEnabled()) {
                    LOGGER.debug("error is occured in getQl.......");
                }
                return "";
            }
        }

        public XmlHolder(Map<String, String> qlMap, long lastModified) {
            this.qlMap = qlMap;
            this.lastModified = lastModified;
        }

        public XmlHolder() {
        }

        public Map<String, String> getQlMap() {
            return qlMap;
        }

        public long getLastModified() {
            return lastModified;
        }
    }

    public long getDelay() {
        return delay;
    }

    public void setDelay(long delay) {
        this.delay = delay;
    }

    public void setFileNames(List<String> fileNames) {
        this.fileNames = fileNames;
    }

    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

}
