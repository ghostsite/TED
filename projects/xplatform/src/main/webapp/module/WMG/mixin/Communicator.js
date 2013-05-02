/*
 * Communicator ..
 */

Ext.define('WMG.mixin.Communicator', {
	constructor : function(config) {
		/* 
		 * TODO remove contextPath
		 */
		var options = {
			protocol : location.protocol,
			host : location.host,
			contextPath : '/xp',//TODO need to fix it hard code
			cometdPath : '/cometd',
			noticeChannel : '/communicator/notice',
			joinInChannel : '/communicator/join/in',
			joinOutChannel : '/communicator/join/out',
			privateChannel : '/communicator/private',
			membersChannel : '/communicator/members',
			loginname : SmartFactory.login.loginname,
			username : SmartFactory.login.username,
			logLevel : 1,
			connectionClosed : function() {},
			connectionEstablished : function() {},
			messageNoticed : function() {},
			memberJoinedIn : function() {},
			memberJoinedOut : function() {},
			messageReceived : function() {},
			membersReceived : function() {}
		};

		var state = 'disconnected';
		var self = this;
		var stores = {};

		Ext.apply(options, config);

		dojox.cometd.websocketEnabled = true;

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
			notice_subscription = dojox.cometd.subscribe(options.noticeChannel, options.messageNoticed);
			presence_join_in_subscription = dojox.cometd.subscribe(options.joinInChannel, options.memberJoinedIn);
			presence_join_out_subscription = dojox.cometd.subscribe(options.joinOutChannel, options.memberJoinedOut);
			members_subscription = dojox.cometd.subscribe(options.membersChannel, options.membersReceived);
			private_message_subscription = dojox.cometd.subscribe(options.privateChannel + '/' + options.loginname, options.messageReceived);
		}

		function unsubscribeAll() {
			if (notice_subscription) {
				dojox.cometd.unsubscribe(notice_subscription);
				notice_subscription = null;
			}
			if (presence_join_in_subscription) {
				dojox.cometd.unsubscribe(presence_join_in_subscription);
				presence_join_in_subscription = null;
			}
			if (presence_join_out_subscription) {
				dojox.cometd.unsubscribe(presence_join_out_subscription);
				presence_join_out_subscription = null;
			}
			if (members_subscription) {
				dojox.cometd.unsubscribe(members_subscription);
				members_subscription = null;
			}
			if (private_message_subscription) {
				dojox.cometd.unsubscribe(private_message_subscription);
				private_message_subscription = null;
			}
			for(var subscription in extra_subscriptions) {
				if(extra_subscriptions[subscription]) {
					dojox.cometd.unsubscribe(extra_subscriptions[subscription]);
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
				dojox.cometd.batch(function() {
					subscribeAll();
					dojox.cometd.publish(options.joinInChannel, {
						username : options.username,
						loginname : options.loginname
					});
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

		dojox.cometd.addListener('/meta/connect', function(message) {
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

		dojox.cometd.addListener('/meta/handshake', function(message) {
			if (message.successful) {
				connectionInitialized.apply(self, []);
			}
		});

		// Disconnect when the page unloads
		dojo.addOnUnload(function() {
			leave();
			cometd.disconnect(true);
		});

		// TODO confirm log levels, please. please. please.
		var logLevels = [ undefined, 'debug', 'info', 'warning', 'error', 'fatal' ];

		function join() {
			var url = options.protocol + "//" + options.host + options.contextPath + options.cometdPath;

			dojox.cometd.configure({
				url : url,
				logLevel : logLevels[options.logLevel + 2]
				// TODO change logLevel to following line. 
				// logLevel : logLevels[options.logLevel]
			});
			dojox.cometd.handshake();
		}

		function leave() {
			dojox.cometd.batch(function() {
				dojox.cometd.publish(options.joinOutChannel, {
					username : options.username,
					loginname : options.loginname
				});
				unsubscribeAll();
			});
			dojox.cometd.disconnect();

			state = 'disconnecting';
		}

		function send(receiver, sender, text) {
			if (!text || !text.length)
				return;

			dojox.cometd.publish(options.privateChannel + '/' + receiver, {
				sender : sender,
				text : text
			});
		}

		function notice(title, message) {
			dojox.cometd.publish(options.noticeChannel, {
				title : title,
				message : message
			});
		}
		
		function publish(channel, message) {
			dojox.cometd.publish(channel, message);
		}
		
		function chatStore(key) {
			if (!stores[key])
				stores[key] = Ext.create('WMG.store.ChattingStore');				
			return stores[key];
		}
		
		function subscribe(channel, callback) {
			if(extra_subscriptions.hasOwnProperty(channel)) {
				Ext.log('channel : ['+ channel + '] already subscribed.');
				return;
			}
			extra_subscriptions[channel] = dojox.cometd.subscribe(channel, callback);
		}
		
		function unsubscribe(channel) {
			if(extra_subscriptions[channel]) {
				dojox.cometd.unsubscribe(extra_subscriptions[channel]);
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