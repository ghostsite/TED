/*
 * Communicator ..
 */

Ext.define('MES.mixin.FayeCommunicator', {
	constructor : function(config) {
		/* 
		 * TODO remove contextPath
		 */
		var options = {
			protocol : location.protocol,
			host : location.host,
			contextPath : '/xp',
			cometdPath : '/cometd',
			noticeChannel : '/communicator/notice',
			joinInChannel : '/communicator/join/in',
			joinOutChannel : '/communicator/join/out',
			privateChannel : '/communicator/private',
			membersChannel : '/communicator/members',
			username : SmartFactory.login.id,
			logLevel : 1,
			connectionClosed : function() {},
			connectionEstablished : function() {},
			messageNoticed : function() {},
			memberJoinedIn : function() {},
			memberJoinedOut : function() {},
			messageReceived : function() {},
			membersReceived : function() {}
		};
		
		var client;
		var state = 'disconnected';
		var self = this;
		var stores = {};

		Ext.apply(options, config);

		/*
		 * subscribe When connection initialized for the first time, following
		 * subscriptions will be requested to the server.
		 * 
		 * unsubscribe When you logout (or just try to move other pages), all
		 * your subscriptions are unsubscribed.
		 * 
		 */

		var notice_subscription;
		var presence_join_in_subscription;
		var presence_join_out_subscription;
		var members_subscription;
		var private_message_subscription;
		
		var extra_subscriptions = {};

		function subscribeAll() {
			notice_subscription = client.subscribe(options.noticeChannel, options.messageNoticed);
			presence_join_in_subscription = client.subscribe(options.joinInChannel, options.memberJoinedIn);
			presence_join_out_subscription = client.subscribe(options.joinOutChannel, options.memberJoinedOut);
			members_subscription = client.subscribe(options.membersChannel, options.membersReceived);
			private_message_subscription = client.subscribe(options.privateChannel + '/' + options.username, options.messageReceived);
		}

		function unsubscribeAll() {
			client.unsubscribe(options.noticeChannel, options.messageNoticed);
			client.unsubscribe(options.joinInChannel, options.memberJoinedIn);
			client.unsubscribe(options.joinOutChannel, options.memberJoinedOut);
			client.unsubscribe(options.membersChannel, options.membersReceived);
			client.unsubscribe(options.privateChannel + '/' + options.username, options.messageReceived);

			for(var subscription in extra_subscriptions) {
				if(extra_subscriptions[subscription]) {
					client.unsubscribe(subscription, extra_subscriptions[subscription]);
					Ext.destroyMembers(extra_subscriptions, subscription);
				}
			}
		}

		/*
		 * Callback functions for connection open/close.
		 */
		function connectionClosed() {
			if (options.logLevel <= 1)
				Ext.log('connection closed.');
			if (typeof (options.connectionClosed) === 'function')
				options.connectionClosed();
		}

		function connectionEstablished() {
			if (options.logLevel <= 1)
				Ext.log("connection established.");

			if (typeof (options.connectionEstablished) === 'function')
				options.connectionEstablished();
		}

		function connectionBroken() {
			if (options.logLevel <= 1)
				Ext.log("connection broken.");

			if (typeof (options.connectionBroken) === 'function')
				options.connectionBroken();
		}

		function connectionInitialized() {
			// first time connection for this client, so subscribe tell
			// everybody.
			try {
				subscribeAll();
				client.publish(options.joinInChannel, {
					username : options.username,
					userid : options.username
				});
			} catch (e) {
				if (options.logLevel <= 4)
					Ext.log("connection initialization error : " + e);
				return;
			}

			if (options.logLevel <= 1)
				Ext.log("connection initialized.");

			if (typeof (options.connectionInitialized) === 'function')
				options.connectionInitialized();
		}

		// TODO confirm log levels, please. please. please.
		var logLevels = [ undefined, 'debug', 'info', 'warning', 'error', 'fatal' ];

		function join() {
			var url = options.protocol + "//" + options.host + options.contextPath + options.cometdPath;

			/*
			 * Now, we gonna construct this communicator.
			 * 
			 */
			client = new Faye.Client(url, {
				timeout : 120
			});
//			client.disable('websocket');
			client.subscribe('/meta/connect', function(message) {
				if (state === 'disconnecting') {
					state = 'disconnected';
					connectionClosed.apply(self, []);
				} else {
					var prestate = state;
					state = message.successful ? 'connected' : 'disconnected';

					if (prestate === 'disconnected' && state === 'connected') {
						connectionEstablished.apply(self, []);
					} else if (prestate === 'connected' && state === 'disconnected') {
						connectionBroken.apply(self, []);
					}
				}
			});

			client.subscribe('/meta/handshake', function(message) {
				if (message.successful) {
					connectionInitialized.apply(self, []);
				}
			});

			$(window).unload(function() {
				leave();
				client.disconnect();
			});

			client.connect();
		}

		function leave() {
			client.publish(options.joinOutChannel, {
				username : options.username,
				userid : options.username
			});
			unsubscribeAll();

			client.disconnect();

			state = 'disconnecting';
		}

		function send(receiver, sender, text) {
			if (!text || !text.length)
				return;

			client.publish(options.privateChannel + '/' + receiver, {
				sender : sender,
				text : text
			});
		}

		function notice(title, message) {
			client.publish(options.noticeChannel, {
				title : title,
				message : message
			});
		}
		
		function publish(channel, message) {
			client.publish(channel, message);
		}
		
		function chatStore(key) {
			if (!stores[key])
				stores[key] = Ext.create('MES.store.ChattingStore');				
			return stores[key];
		}
		
		function subscribe(channel, callback) {
			if(extra_subscriptions.hasOwnProperty(channel)) {
				Ext.log('channel : ['+ channel + '] already subscribed.');
				return;
			}
			extra_subscriptions[channel] = client.subscribe(channel, callback);
		}
		
		function unsubscribe(channel) {
			if(extra_subscriptions[channel]) {
				client.unsubscribe(channel, extra_subscriptions[channel]);
				Ext.destroyMembers(extra_subscriptions, channel);
			}
		}
 
		return {
			communicator : {
				join : join,
				leave : leave,
				send : send,
				notice : notice,
				publish : publish,
				chatStore : chatStore,
				subscribe : subscribe,
				unsubscribe : unsubscribe,
				extra_subscriptions : extra_subscriptions
			}
		};
	}
});