package com.ted.common.dao.mybatis.spring;

import static org.springframework.util.ObjectUtils.isEmpty;

import java.io.IOException;
import java.util.List;

import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.core.io.Resource;
import org.springside.modules.utils.Reflections;

import com.google.common.collect.Lists;
import com.ted.common.dao.mybatis.session.ReloadableSqlSessionFactory;

public class ReloadableSqlSessionFactoryBean extends SqlSessionFactoryBean {
    private static final List<ResourceHolder> resourceHolderList = Lists.newCopyOnWriteArrayList(); //string 是文件的名字，由于不能得不到namedQL到file的映射，故全文件扫描
    private long                              delay              = 10;                             //准备配置在xml中用的,秒

    @Override
    protected SqlSessionFactory buildSqlSessionFactory() throws IOException {
        SqlSessionFactory buildSqlSessionFactory = super.buildSqlSessionFactory();
        if (buildSqlSessionFactory instanceof ReloadableSqlSessionFactory) {
            ReloadableSqlSessionFactory sf = (ReloadableSqlSessionFactory) buildSqlSessionFactory;
            sf.setReloadableSqlSessionFactoryBean(this);
        }

        loadAll2ResourceHolderList();
        return buildSqlSessionFactory;
    };

    /**
     * 加载所有Resources到fileUri2ResourceMap
     */
    protected void loadAll2ResourceHolderList() {
        Resource[] mapperLocations = (Resource[]) Reflections.getFieldValue(this, "mapperLocations");
        if (!isEmpty(mapperLocations)) {
            for (Resource mapperLocation : mapperLocations) {
                if (mapperLocation == null) {
                    continue;
                }
                load2ResourceHolder(mapperLocation);
            }
        }
    };

    /**
     * 加载一个resource,是强制加载
     */
    protected void load2ResourceHolder(Resource resource) {
        try {
            resourceHolderList.add(new ResourceHolder(resource, resource.getFile().lastModified()));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //参照 TemplateDaoSupport.java
    public void refresh() {//全文件扫描,因为找不到匹配的方法
        final long delayTime = this.getDelay();

        if (delayTime > 0) {//如果delayTime <= 0, 则不reload
            for (ResourceHolder resourceHolder : resourceHolderList) {
                if (resourceChanged(resourceHolder)) {
                    refreshMapping(resourceHolder);
                }
            }
        }
    };

    //刷新load变化的Resource到Configuration
    private void refreshMapping(ResourceHolder resourceHolder) {
        try {
            SqlSessionFactory sessionFactory = (SqlSessionFactory) Reflections.getFieldValue(this, "sqlSessionFactory");//木办法，只能强制获取
            Configuration configuration = sessionFactory.getConfiguration();
            XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(resourceHolder.getResource().getInputStream(), configuration, configuration.toString(), configuration.getSqlFragments());
            xmlMapperBuilder.parse();
        } catch (Exception e) {
            e.printStackTrace();
        }
    };

    //变化了then return true
    private boolean resourceChanged(ResourceHolder resourceHolder) {
        try {
            if (resourceHolder.lastModified < resourceHolder.getResource().getFile().lastModified()) {
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    };

    public class ResourceHolder {
        private Resource resource;         //查询的映射
        private long     lastModified = -1;

        public ResourceHolder(Resource resource, long lastModified) {
            this.resource = resource;
            this.lastModified = lastModified;
        }

        public ResourceHolder() {
        }

        public Resource getResource() {
            return resource;
        }

        public long getLastModified() {
            return lastModified;
        }

        public long getResourceLastModified() {
            try {
                return getResource().getFile().lastModified();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return getLastModified();//todo 不合适吧?
        }
    }

    public long getDelay() {
        return delay;
    }

    public void setDelay(long delay) {
        this.delay = delay;
    }

}
