package com.ted.xplatform.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;

import org.cometd.annotation.Configure;
import org.cometd.annotation.Listener;
import org.cometd.annotation.Service;
import org.cometd.annotation.Session;
import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ConfigurableServerChannel;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;
import org.cometd.server.authorizer.GrantAuthorizer;
import org.cometd.server.filter.DataFilterMessageListener;
import org.cometd.server.filter.NoMarkupFilter;

/**
 * 这是一个聊天的CometD实现的。
 * 底层用Flash通讯，基于Http/1.1
 * @author ghostzhang
 * @TODO Server-side Authentication,还没考虑，任何人都可以调用。http://docs.cometd.org/reference/ and mesplus
 * @created 20130425
 */
//@Named
@Singleton
@Service("chatService")
public class CommunicatorService {
    @Inject
    private BayeuxServer  bayeux;

    @Session
    private ServerSession serverSession;

    @PostConstruct
    public void init() {
    }

    @Configure ({"/service/chat"})
    protected void configureChatStarStar(ConfigurableServerChannel channel){
        DataFilterMessageListener noMarkup = new DataFilterMessageListener(new NoMarkupFilter());
        channel.addListener(noMarkup);
        channel.addAuthorizer(GrantAuthorizer.GRANT_ALL);
    }
    
    @Listener("/service/chat")
    public void processHello(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String name = (String) input.get("name");

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("greeting", "Hello, " + name);
        remote.deliver(serverSession, "/service/chat", output, null);
    }
    
    //Configure是可以用作权限管理，暂时都允许。
    @Configure ({"/communicator/join/in"})
    protected void configureJoinIn(ConfigurableServerChannel channel){
        DataFilterMessageListener noMarkup = new DataFilterMessageListener(new NoMarkupFilter());
        channel.addListener(noMarkup);
        channel.addAuthorizer(GrantAuthorizer.GRANT_ALL);
    }
    
    @Listener("/communicator/join/in")
    public void joinIn(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String name = (String) input.get("name");

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("greeting", "Hello, " + name);
        remote.deliver(serverSession, "/chat", output, null);
    }
    
    @Configure ({"/communicator/join/out"})
    protected void configureJoinOut(ConfigurableServerChannel channel){
        DataFilterMessageListener noMarkup = new DataFilterMessageListener(new NoMarkupFilter());
        channel.addListener(noMarkup);
        channel.addAuthorizer(GrantAuthorizer.GRANT_ALL);
    }
    
    @Listener("/communicator/join/out")
    public void processJoinOut(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String name = (String) input.get("name");

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("greeting", "Hello, " + name);
        remote.deliver(serverSession, "/chat", output, null);
    }
    
}
