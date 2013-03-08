package com.ted.common.spring.orm.hibernate4;

import java.io.IOException;
import java.util.Collection;
import java.util.Map;

import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;

public class LocalSessionFactoryBeanExt extends LocalSessionFactoryBean{
    private Map<String, Object> eventListeners;
    
    @Override
    public void afterPropertiesSet() throws IOException {
       super.afterPropertiesSet();
       registerListeners();
    }
    
    @SuppressWarnings("all")
    public void registerListeners() {
        EventListenerRegistry registry = ((SessionFactoryImpl) super.getObject()).getServiceRegistry().getService(EventListenerRegistry.class);
        if (this.eventListeners != null) {
            for (Map.Entry<String, Object> entry : this.eventListeners.entrySet()) {
                String listenerType = entry.getKey();
                Object listenerObject = entry.getValue();
                if (listenerObject instanceof Collection) {
                    Collection<Object> listeners = (Collection<Object>) listenerObject;
                    for(Object listener:listeners){
                        registry.getEventListenerGroup(EventType.resolveEventTypeByName(listenerType)).appendListener(listener);
                    }
                }
                else {
                    //registry.getEventListenerGroup(EventType.POST_COMMIT_INSERT).appendListener(listener);
                    registry.getEventListenerGroup(EventType.resolveEventTypeByName(listenerType)).appendListener(listenerObject);
                }
            }
        }
    }

    public Map<String, Object> getEventListeners() {
        return eventListeners;
    }

    public void setEventListeners(Map<String, Object> eventListeners) {
        this.eventListeners = eventListeners;
    }
    
    
    
}
