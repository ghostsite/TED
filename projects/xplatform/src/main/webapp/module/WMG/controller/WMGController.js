Ext.require(['WMG.mixin.Communicator', 'WMG.view.NavCommunicator']);

Ext.define('WMG.controller.WMGController', {
	extend : 'Ext.app.Controller',

	stores : ['WMG.store.CommunicatorStore', 'WMG.store.ChattingStore'],
	models : ['WMG.model.Communicator'],
	views : ['WMG.view.NavCommunicator', 'WMG.view.Notification'],

	requires : ['Ext.ux.window.Notification', 'Ext.ux.SecondTitle'],

	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});

		var self = this;

		SF.mixin('WMG.mixin.Communicator', {
			messageNoticed : function(message) {
				// console.log(message);//this message is strange a little.
				Ext.create('widget.uxNotification', {
					title : message.data.title.title,
					position : 'br',
					manager : 'demo1',
					iconCls : 'ux-notification-icon-information',
					autoCloseDelay : 3000,
					spacing : 20,
					html : message.data.title.message
				}).show();
			},
			memberJoinedIn : function(message) {
				self.joinIn(message.data.loginname);
				SF.msg('Joined in.', message.data.loginname);
			},
			memberJoinedOut : function(message) {
				self.joinOut(message.data.username);
				SF.msg('Joined out.', message.data.username);
			},
			messageReceived : function(message) {
				var chatStore = SF.communicator.chatStore(message.data.sender);
				chatStore.add({
					name : message.data.sender,
					time : new Date(),
					content : message.data.text
				});
				SF.msg(message.data.sender, message.data.text);

				// 말 풍선 클릭 시
				var cmp = Ext.getCmp('wmg_tray_chat');
				if (!cmp) {
					SF.status.tray({
						xtype : 'button',
						id : 'wmg_tray_chat',
						cls : 'bakcgroundClear',
						iconCls : 'trayChat',

						handler : function() {
							SF.doMenu({
								viewModel : 'WMG.view.common.ChatContainer'
							});

							var chatview = Ext.getCmp('wmg_chatview').getComponent(message.data.sender);
							if (!chatview) {
								chatview = Ext.getCmp('wmg_chatview').add(Ext.create('WMG.view.common.ChildChatting', {
									itemId : message.data.sender,
									title : message.data.sender,
									closable : true,
									store : chatStore
								}));
							}
							chatview.show();
						}
					});
				}
				cmp.setText(chatStore.count());
			}
		});

		SF.communicator.join();
	},

	onViewportRendered : function() {
		SF.status.tray({
			xtype : 'button',
			id : 'wmg_tray_notice',
			cls : 'trayNotice',
			iconCls : 'trayNoticeIcon',
			handler : function() {
				SF.communicator.notice(SF.login.loginname, 'notice message...');

				SF.addContentView({
					xtype : 'wmg_notification',
					itemId : 'wmg_notification'
				});
			}
		});

		SF.addNav({
			xtype : 'wmg_nav_communicator',
			iconCls : 'iconsetDockCommunicator',
			itemId : 'navCommunicator',
			title : T('Caption.Other.Communicator')
		});

		if (SF.search) {
			SF.search.register({
				kind : 'msg',
				key : 'notification',
				name : T('Caption.Other.Notification'),
				handler : function(searchRecord) {
					SF.addContentView({
						xtype : 'wmg_notification',
						itemId : 'wmg_notification'
					});
				}
			});

			SF.search.register({
				kind : 'msg',
				key : 'chatting',
				name : T('Caption.Other.Chatting'),
				handler : function(searchRecord) {
					SF.doMenu({
						viewModel : 'WMG.view.common.ChatContainer'
					});
				}
			});
		}
	},

	joinIn : function(loginname) {//user = loginname
		alert('loginname=='+loginname);
		var store = Ext.getStore('WMG.store.CommunicatorStore');

		var idx = store.findExact('loginname', loginname);
		if (idx !== -1) {
			store.getAt(idx).set('status', 'on');
		} else {
			store.add({
				loginname : loginname,
				username : loginname,
				status : 'on'
			});
		}
	},

	joinOut : function(user) {
		alert('user=='+user);
		var store = Ext.getStore('WMG.store.CommunicatorStore');

		var idx = store.findExact('loginName', user);
		if (idx !== -1) {
			store.getAt(idx).set('status', 'off');
		} else {
			store.add({
				loginname : user,
				username : user,
				status : 'off'
			});
		}
	}

});