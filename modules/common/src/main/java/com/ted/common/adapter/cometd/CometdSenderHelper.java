package com.ted.common.adapter.cometd;

import java.util.List;
import java.util.Vector;

import org.cometd.bayeux.Message;
import org.cometd.bayeux.client.ClientSession;
import org.cometd.bayeux.client.ClientSessionChannel;
import org.cometd.client.transport.ClientTransport;
import org.eclipse.jetty.util.component.AggregateLifeCycle;

public class CometdSenderHelper {
    public static void disconnect(final ClientSession session, final List<AggregateLifeCycle> aggregateLifeCycleList, final List<ClientTransport> transportList) {
        if (session == null) {
            clear(aggregateLifeCycleList, transportList);
            return;
        }

        removeListeners(session.getChannel("/meta/subscribe"));
        removeListeners(session.getChannel("/meta/unsubscribe"));
        removeListeners(session.getChannel("/meta/handshake"));
        removeListeners(session.getChannel("/meta/connect"));
        removeListeners(session.getChannel("/meta/disconnect"));

        final List<String> cleard = new Vector<String>();
        session.getChannel("/meta/disconnect").addListener(new ClientSessionChannel.MessageListener() {
            public void onMessage(ClientSessionChannel channel, Message message) {
                try {
                    session.getChannel("/meta/disconnect").removeListener(this);
                } catch (Exception e) {
                }
                //Senders.access$100(aggregateLifeCycleList, transportList); //synchronized?? zhang
                cleard.add("true");
            }
        });
        try {
            session.disconnect();
        } catch (Exception e) {
        }
        int i = 0;
        while (cleard.isEmpty()) {
            if (i++ < 3) {
                try {
                    session.wait(1000L);
                } catch (Exception e) {
                }
                continue;
            }
            clear(aggregateLifeCycleList, transportList);
        }
    }

    private static void removeListeners(ClientSessionChannel channel) {
        List<ClientSessionChannel.ClientSessionChannelListener> listeners = channel.getListeners();
        if ((listeners == null) || (listeners.isEmpty()))
            return;
        for (ClientSessionChannel.ClientSessionChannelListener listener : listeners)
            try {
                channel.removeListener(listener);
            } catch (Exception e) {
            }
    }

    private static void clear(List<AggregateLifeCycle> aggregateLifeCycleList, List<ClientTransport> transportList) {
        synchronized (transportList) {
            if ((transportList != null) && (!transportList.isEmpty())) {
                for (ClientTransport transport : transportList)
                    try {
                        transport.terminate();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                transportList.clear();
            }
        }

        synchronized (aggregateLifeCycleList) {
            if ((aggregateLifeCycleList != null) && (!aggregateLifeCycleList.isEmpty())) {
                for (AggregateLifeCycle lifeCycle : aggregateLifeCycleList) {
                    try {
                        lifeCycle.stop();
                    } catch (Exception e) {
                    }
                    try {
                        lifeCycle.destroy();
                    } catch (Exception e) {
                    }
                }
                aggregateLifeCycleList.clear();
            }
        }
    }
}