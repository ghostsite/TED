Ext.define('mixin.Communicator', {
	constructor : function(config) {
		
		var options = {
				username : SmartFactory.login.id,
				logLevel : 1,
				joinInChannel : '/communicator/join/in',
				joinOutChannel : '/communicator/join/out',
				connectionClosed : function() {},
				connectionEstablished : function() {},
				messageNoticed : function() {},
				memberJoinedIn : function() {},
				memberJoinedOut : function() {},
				messageReceived : function() {},
				membersReceived : function() {}
			};
		
		var cometd = dojox.cometd;
		var self = this;
		
		Ext.apply(options, config);
		
		var extra_subscriptions = {};
		var presence_join_in_subscription;
		var presence_join_out_subscription;

		
		function subscribeAll() {
			presence_join_in_subscription = cometd.subscribe(options.joinInChannel, options.memberJoinedIn);
			presence_join_out_subscription = cometd.subscribe(options.joinOutChannel, options.memberJoinedOut);
		}

		function unsubscribeAll() {
			if (presence_join_in_subscription) {
				cometd.unsubscribe(presence_join_in_subscription);
				presence_join_in_subscription = null;
			}
			if (presence_join_out_subscription) {
				cometd.unsubscribe(presence_join_out_subscription);
				presence_join_out_subscription = null;
			}
			for(var subscription in extra_subscriptions) {
				if(extra_subscriptions[subscription]) {
					cometd.unsubscribe(extra_subscriptions[subscription]);
					Ext.destroyMembers(extra_subscriptions, subscription);
				}
			}
		}
		
		function connectionClosed() {
			if (options.logLevel <= 1)
				SF.debug('connection closed.');
			if (typeof (options.connectionClosed) === 'function')
				options.connectionClosed();
		}

		function connectionEstablished() {
			if (options.logLevel <= 1)
				SF.debug("connection established.");

			if (typeof (options.connectionEstablished) === 'function')
				options.connectionEstablished();
		}

		function connectionBroken() {
			if (options.logLevel <= 1)
				SF.debug("connection broken.");

			if (typeof (options.connectionBroken) === 'function')
				options.connectionBroken();
		}
		
		function connectionInitialized() {
			// first time connection for this client, so subscribe tell
			// everybody.
			try {
				subscribeAll();
				cometd.batch(function() {
					cometd.publish(options.joinInChannel, {
						username : options.username,
						userid : options.username
					});
				});
			} catch (e) {
				if (options.logLevel <= 4)
					SF.error('SYS-E007', {}, e);
				return;
			}

			if (options.logLevel <= 1)
				SF.debug("connection initialized.");

			if (typeof (options.connectionInitialized) === 'function')
				options.connectionInitialized();
		}
		
		var logLevels = [ undefined, 'debug', 'info', 'warning', 'error', 'fatal' ];
		
		// Function that manages the connection status with the Bayeux server
		var connected = false;
		
		cometd.addListener('/meta/connect', function(message) {
			if (cometd.isDisconnected()) {
				connected = false;
				connectionClosed.apply(self, []);
				return;
			}

			var wasConnected = connected;
			connected = message.successful === true;
			if (!wasConnected && connected) {
				connectionEstablished.apply(self, []);
			} else if (wasConnected && !connected) {
				connectionBroken.apply(self, []);
			}
		});
		
		// Function invoked when first contacting the server and
		// when the server has lost the state of this client
		cometd.addListener('/meta/handshake', function (handshake) {
			if (handshake.successful === true) {
				connectionInitialized.apply(self, []);
			}
		});
		
		// Disconnect when the page unloads
		dojo.addOnUnload(function() {
			leave();
			cometd.disconnect(true);
		});
		
		function join(url){
			var cometURL = url;
			cometd.configure({
				url : cometURL
			});
				
			cometd.handshake();
		}			

		function leave() {
			cometd.batch(function() {
				cometd.publish(options.joinOutChannel, {
					username : options.username,
					userid : options.username
				});
			});
			unsubscribeAll();
			cometd.disconnect(true);
			connected = false;
		}

		function subscribe(channel, callback) {
			if(extra_subscriptions.hasOwnProperty(channel)) {
				SF.debug('channel : ['+ channel + '] already subscribed.');
				return;
			}
			extra_subscriptions[channel] = cometd.subscribe(channel, callback);
		}
		
		function unsubscribe(channel) {
			if(extra_subscriptions[channel]) {
				cometd.unsubscribe(extra_subscriptions[channel]);
				Ext.destroyMembers(extra_subscriptions, channel);
			}
		}
		
		return {
			communicator : {
				join : join,
				subscribe : subscribe,
				unsubscribe : unsubscribe,
				leave : leave,
				extra_subscriptions : extra_subscriptions
			}
		};
	}
});
