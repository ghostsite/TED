package com.ted.common.adapter.cometd;

import java.rmi.ServerException;
import java.util.Arrays;
import java.util.List;
import java.util.Vector;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.cometd.bayeux.Message;
import org.cometd.bayeux.client.ClientSession;
import org.cometd.bayeux.client.ClientSessionChannel;
import org.cometd.client.BayeuxClient;
import org.cometd.client.transport.ClientTransport;
import org.cometd.client.transport.LongPollingTransport;
import org.cometd.websocket.client.WebSocketTransport;
import org.eclipse.jetty.client.HttpClient;
import org.eclipse.jetty.util.component.AggregateLifeCycle;
import org.eclipse.jetty.websocket.WebSocketClientFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.base.Joiner;
import com.ted.common.adapter.Sender;
import com.ted.common.util.ConfigUtils;
import com.ted.common.util.JsonUtils;

/**
 * from mesplus cometdSender
 * @author ghostzhang
 */
public class CometdSender implements Sender, InitializingBean, BeanNameAware {
    private static final Logger            logger                 = LoggerFactory.getLogger(CometdSender.class);
    private boolean                        enabled;
    private String                         location;
    private String                         prefix;
    private ClientSession                  session;
    private final List<AggregateLifeCycle> aggregateLifeCycleList = new Vector<AggregateLifeCycle>();
    private final List<ClientTransport>    transportList          = new Vector<ClientTransport>();
    private boolean                        connected;
    private boolean                        loaded                 = false;
    private String                         name;

    public void afterPropertiesSet() throws Exception {
        if (!this.enabled)
            return;
        if (StringUtils.isEmpty(this.location))
            throw new IllegalArgumentException("Property 'location' is required.");
    }

    public void start() {
        if (this.loaded)
            return;
        this.loaded = true;

        if (!this.enabled) {
            return;
        }
        CometdSenderHelper.disconnect(this.session, this.aggregateLifeCycleList, this.transportList);

        new Thread(new Runnable() {
            public void run() {
                try {
                    Thread.sleep(5000L);

                    WebSocketClientFactory wsClientFactory = new WebSocketClientFactory();
                    aggregateLifeCycleList.add(wsClientFactory);
                    try {
                        wsClientFactory.start();
                    } catch (Exception e) {
                        logger.warn(e.getMessage(), e);
                    }
                    ClientTransport wsTransport = new WebSocketTransport(null, wsClientFactory, null);
                    transportList.add(wsTransport);

                    HttpClient httpClient = new HttpClient();
                    aggregateLifeCycleList.add(httpClient);
                    try {
                        httpClient.start();
                    } catch (Exception e) {
                        logger.warn(e.getMessage(), e);
                    }
                    
                    //2种方式：
                    ClientTransport httpTransport = LongPollingTransport.create(null, httpClient);
                    //ClientTransport httpTransport = WebSocketTransport.create(null,  wsClientFactory);
                    
                    transportList.add(httpTransport);

                    session = new BayeuxClient(CometdSender.this.location, wsTransport, new ClientTransport[] { httpTransport });

                    session.getChannel("/meta/handshake").addListener(new ClientSessionChannel.MessageListener() {
                        public void onMessage(ClientSessionChannel channel, Message message) {
                            logger.info(CometdSender.this.name + " handshook: " + CometdSender.this.session.isHandshook());
                        }
                    });
                    session.getChannel("/meta/connect").addListener(new ClientSessionChannel.MessageListener() {
                        public void onMessage(ClientSessionChannel channel, Message message) {
                            boolean oldConnected = CometdSender.this.connected;
                            if (oldConnected != CometdSender.this.connected)
                                logger.info(CometdSender.this.name + " connected: " + CometdSender.this.connected);
                        }
                    });
                    session.getChannel("/meta/disconnect").addListener(new ClientSessionChannel.MessageListener() {
                        public void onMessage(ClientSessionChannel channel, Message message) {
                            boolean oldConnected = CometdSender.this.connected;
                            if (oldConnected != CometdSender.this.connected)
                                logger.info(CometdSender.this.name + " disconnected: " + (!CometdSender.this.connected));
                        }
                    });
                    session.handshake();
                } catch (Exception e) {
                    logger.error(e.getMessage(), e);
                }
            }
        }).start();
    }

    public void stop() {
        CometdSenderHelper.disconnect(this.session, this.aggregateLifeCycleList, this.transportList);
        session = null;
        loaded = false;
    }

    public <T> void send(String channel, T data) throws Exception {
        if ((!enabled) || (StringUtils.isEmpty(channel)))
            return;
        send(Arrays.asList(new String[] { channel }), data);
    }

    public <T> void send(List<String> channelList, T data) throws Exception {
        if (!enabled)
            return;
        if (!connected)
            throw new ServerException("Not connected to push server, yet.");
        if (CollectionUtils.isEmpty(channelList)) {
            return;
        }

        String message = JsonUtils.toJson(data);

        if (ConfigUtils.getBoolean(this.name + ".messageLogger.enabled")) {
            StringBuffer buf = new StringBuffer(this.name + " is sending message");
            buf.append("\r\nchannels: ").append(join(channelList));
            int maxSize = ConfigUtils.getInteger(this.name + ".messageLogger.maxSize", Integer.valueOf(3000)).intValue();//
            buf.append("\r\nmessage: \r\n").append((message != null) && (message.length() > maxSize) ? message.substring(0, maxSize) : message);
            logger.info(buf.toString());
        }

        for (String channel : channelList)
            session.getChannel(prefix + channel).publish(message);
    }

    private String join(List<String> channelList) {
        Joiner joiner = Joiner.on(",").skipNulls();
        return joiner.join(channelList.iterator());
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPrefix() {
        return this.prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public void setBeanName(String name) {
        this.name = name;
    }
}
