package com.ted.common.adapter.mail;

import java.util.List;

import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.ted.common.adapter.Sender;

/**
 * TODO ....
 * @author ghostzhang
 */
public class MailSender extends JavaMailSenderImpl implements InitializingBean, Sender, JavaMailSender, BeanNameAware {

    @Override
    public void setBeanName(String name) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public <T> void send(String paramString, T paramT) throws Exception {
        // TODO Auto-generated method stub
        
    }

    @Override
    public <T> void send(List<String> paramList, T paramT) throws Exception {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        // TODO Auto-generated method stub
        
    }

}
