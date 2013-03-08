/**
 * @class Opc.mixin.Agent
 * 
 */

Ext.define('Opc.mixin.Agent', {
	mixins : {
		observable : 'Ext.util.Observable'
	},

	state : 'close',
	requestQueue : {},
	ws : null,
	lastRequestId : 0,

	newRequestId : function() {
		return (++this.lastRequestId).toString();
	},

	doSend : function(message) {
		if (message instanceof Object) {
			return this.ws.send(Ext.JSON.encode(message));
		} else {
			return this.ws.send(message);
		}
	},

	doRequest : function(message, handler, self) {
		/* message should be a Message object. */
		message.requestId = this.newRequestId();
		var request = {
			message : message,
			handler : handler,
			self : self
		};

		this.requestQueue[message.requestId] = request;
		this.ws.send(Ext.JSON.encode(message));
		return request;
	},

	initSocket : function() {
		var self = this;

		if (this.ws && this.state === 'open') {
			this.ws.close();
		}

		var url = SF.setting.get('opc-agent-url');
		if (!url)
			return;

		var onOpen = function(evt) {
			self.state = 'open';
			SF.debug('WebSocket Opened : ', url);
			self.fireEvent('open', url);
		};

		var onClose = function(evt) {
			self.state = 'close';
			SF.debug('WebSocket Closed : ', url, '(code:', evt.code, ', reason:', evt.reason, ')');
			self.fireEvent('close', url, evt.code, evt.reason);

			setTimeout(function() {
				self.initSocket();
			}, 5000);
		};

		var onMessage = function(evt) {
			try {
				var response = Ext.JSON.decode(evt.data);
				if (response.requestId === undefined) {
					SF.error('Received Message is not a Response(It doesnt hava reqeust Id) : ', {
						data : evt.data
					});
					return;
				}
				var request = self.requestQueue[response.requestId];
				if (request === undefined) {
					SF.error('Correlated Request Not Found : ', {
						data : evt.data
					});
					return;
				}
				delete self.requestQueue[response.requestId];
				request.handler.call(request.self, response);
				self.fireEvent('message');
			} catch (e) {
				SF.error('Message Received but Error : ', {
					data : evt.data
				}, e);
			}
		};

		var onError = function(evt) {
			var error = evt.data;
			SF.error('WebSocket Error : ', {
				error : error
			});
			self.fireEvent('error');
		};

		if ("WebSocket" in window) {
			this.ws = new WebSocket(url);
			this.ws.onopen = onOpen;
			this.ws.onmessage = onMessage;
			this.ws.onclose = onClose;
			this.ws.onError = onError;
		} else {

		}
	},

	closeSocket : function() {
		if (this.ws && this.state === 'open') {
			/*
			 * closeSocket을 명시적으로 할 경우는, 자동 Reconnect를 시도하지 않도록 한다.
			 */
			this.ws.onclose = function(evt) {
				self.state = 'close';
				SF.debug('WebSocket Closed : ', url, '(code:', evt.code, ', reason:', evt.reason, ')');
				self.fireEvent('close', url, evt.code, evt.reason);
			};

			this.ws.disconnect();
		}
	},

	constructor : function(config) {
		var self = this;

		this.mixins.observable.constructor.call(this, config);
		this.addEvents('open', 'close', 'message', 'error');

		if (window.MozWebSocket) {
			window.WebSocket = MozWebSocket;
		}

		/*
		 * 이 전역변수를 여기서 설정해도 동작하지 않는다. 메인페이지의 javascript 부분에서 처리해야 함.
		 * 
		 * WEB_SOCKET_SWF_LOCATION = 'js/web-socket/WebSocketMain.swf';
		 * WEB_SOCKET_DEBUG = true;
		 */
		
		Modernizr.load({
			test : Modernizr.websockets,
			nope : 'js/web-socket/web_socket.js'
		});

		try {
			this.initSocket();
		} catch(e) {
			SF.error('WebSocket Connection Error', {}, e);
		}

		return {
			agent : {
				connect : function() {
					self.initSocket();
				},
				disconnect : function() {
					self.closeSocket();
				},
				test : function() {

				},
				send : function(message) {
					self.doSend(message);
				},
				subscribe : function(id, handler) {

				},
				request : function(message, handler, scope) {
					self.doRequest(message, handler, scope);
				},
				on : function() {
					self.on.apply(self, arguments);
				},
				state : function() {
					return self.state;
				}
			}
		};
	}
});
