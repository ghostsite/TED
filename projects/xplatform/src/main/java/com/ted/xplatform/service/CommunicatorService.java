package com.ted.xplatform.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;

import org.apache.commons.collections.keyvalue.DefaultKeyValue;
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

import com.google.common.collect.Lists;

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
    private BayeuxServer                       bayeux;

    @Session
    private ServerSession                      serverSession;

    private static final List<DefaultKeyValue> onLineUsers = Lists.newArrayList();

    public static final List<DefaultKeyValue> getOnLineUsers() {
        List<DefaultKeyValue> temp = Lists.newArrayList();
        for (DefaultKeyValue user : onLineUsers) {
            temp.add(new DefaultKeyValue(user.getKey(), user.getValue())); //need to clone to safety
        }
        return temp;
    }

    @PostConstruct
    public void init() {
    }

    @Configure({ "/service/notice" })
    protected void configureChatStarStar(ConfigurableServerChannel channel) {
        DataFilterMessageListener noMarkup = new DataFilterMessageListener(new NoMarkupFilter());
        channel.addListener(noMarkup);
        channel.addAuthorizer(GrantAuthorizer.GRANT_ALL);
    }

    /**
     * 广播
     */
    @Listener("/service/notice")
    public void processNotice(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String msg = (String) input.get("message"); //loginName, for the key
        Map<String, Object> output = new HashMap<String, Object>();
        output.put("message", msg);
        remote.deliver(serverSession, "/service/notice", output, null);
    }

    /**
     * 加入,这个为入口，必须订阅，否则找不到人
     */
    @Listener("/communicator/join/in")
    public void joinIn(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String username = (String) input.get("username");//userName,可能重复。
        String loginname = (String) input.get("loginname"); //loginName, for the key

        boolean exist = false;
        for (DefaultKeyValue user : onLineUsers) {
            if (user.getKey().toString().equals(loginname)) {
                exist = true;
                break;
            }
        }
        
        if(!exist){
            onLineUsers.add(new DefaultKeyValue(loginname, username));
        }
        //Map<String, Object> output = new HashMap<String, Object>();
        //remote.deliver(serverSession, "/communicator/join/in", output, null);
    }

    /**
     * 退出
     */
    @Listener("/communicator/join/out")
    public void processJoinOut(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String loginname = (String) input.get("loginname"); //loginName, for the key
        String username = (String) input.get("username"); //userName, for the key
        Iterator<DefaultKeyValue> iterator = onLineUsers.iterator();
        while (iterator.hasNext()) {
            DefaultKeyValue user = (DefaultKeyValue) iterator.next();
            if (user.getKey().toString().equals(loginname)) {
                iterator.remove();//.remove(user);
            }
        }
//        for (DefaultKeyValue user : onLineUsers) {
//            if (user.getKey().toString().equals(loginname)) {
//                onLineUsers.remove(user);
//                //break;
//            }
//        }

        //Map<String, Object> output = new HashMap<String, Object>();
        //output.put("greeting", "Hello, " + name);
        //remote.deliver(serverSession, "/communicator/join/out", output, null);
    }

    /**
     * 1:1私聊
     */
    @Listener("/communicator/private")
    public void processPrivate(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String loginname = (String) input.get("loginname"); //loginName, for the key
        String msg = (String) input.get("message"); //loginName, for the key

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("message", msg);
        remote.deliver(serverSession, "/communicator/private" + "/" + loginname, output, null);
    }

    /**
     * 群组,TODO:to finish it
     */
    @Listener("/communicator/members")
    public void processMembers(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> input = message.getDataAsMap();
        String name = (String) input.get("name");

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("greeting", "Hello, " + name);
        remote.deliver(serverSession, "/communicator/members", output, null);
    }

}
