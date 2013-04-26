Ext.require(['MES.mixin.CodeView', 'MES.mixin.CommonFunction', 'MES.data.CodeViewRegister']);

Ext.define('MES.controller.MESController', {
	extend : 'Ext.app.Controller',
	requires : ['MES.view.form.BaseForm', 'MES.view.form.BaseFormTabs', 'MES.view.form.BaseFormComposite'],
	stores : ['MES.store.NoticeInfo'],
	models : [],
	views : ['MES.view.form.field.CodeViewField', 'MES.view.form.field.MultiCodeViewField',
	'MES.view.form.field.CodeViewColumn', 'MES.view.form.SupplementForm', 
	'MES.view.form.SupplementGridForm', 'MES.view.form.SupplementTabs',
	'MES.view.form.field.BaseButtons', 'MES.view.form.field.LineSeparator', 
	'MES.view.form.field.Decimalfield', 'MES.view.form.field.ColorField', 
	'MES.view.form.field.FixedColumn', 'MES.view.form.field.TextActionColumn',
	'MES.view.communicate.NavCommunicator', 'MES.view.communicate.Notification'
	],

	
	controlSets : [],

	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			},
			'basebuttons' : {
				// before event
				beforeCreate : this.onBeforeCreate,
				beforeUpdate : this.onBeforeUpdate,
				beforeDelete : this.onBeforeDelete,
				beforeUndelete : this.onBeforeUndelete,
				beforeVersionUp : this.onBeforeVersionUp,
				beforeProcess : this.onBeforeProcess,
				beforeRelease : this.onBeforeRelease,
				beforeExport : this.onBeforeExport,
				beforeClose : this.onBeforeClose,

				// after event
				afterCreate : this.onAfterCreate,
				afterUpdate : this.onAfterUpdate,
				afterDelete : this.onAfterDelete,
				afterUndelete : this.onAfterUndelete,
				afterVersionUp : this.onAfterVersionUp,
				afterProcess : this.onAfterProcess,
				afterRelease : this.onAfterRelease,
				afterView : this.onAfterView,
				afterRefresh : this.onAfterRefresh,
				afterClose : this.onAfterClose
			}
		});

		var self = this;

		Ext.each(this.controlSets, function(set) {
			var controller = self.getController('MES.controller.' + set);
			controller.init();
		});

		// mixin 설정
		this.setMixin();

		this.setShiftInfo();
	},

	// before event handler
	onBeforeCreate : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnCreate', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeCreate(form, addParams, url);
	},

	onBeforeUpdate : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnUpdate', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeUpdate(form, addParams, url);
	},

	onBeforeDelete : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnDelete', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeDelete(form, addParams, url);
	},

	onBeforeUndelete : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnUndelete', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeUndelete(form, addParams, url);
	},

	onBeforeVersionUp : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnVersionUp', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeVersionUp(form, addParams, url);
	},

	onBeforeProcess : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnProcess', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeProcess(form, addParams, url);
	},

	onBeforeRelease : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnRelease', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeRelease(form, addParams, url);
	},

	onBeforeExport : function(form, addParams, url, scope) {
		return scope.onBeforeExport(scope, addParams, url);
	},

	onBeforeClose : function(scope) {
		return scope.onBeforeClose();
	},

	// after event handler
	onAfterCreate : function(form, action, success, scope) {
		scope.onAfterCreate(form, action, success);
	},

	onAfterUpdate : function(form, action, success, scope) {
		scope.onAfterUpdate(form, action, success);
	},

	onAfterDelete : function(form, action, success, scope) {
		scope.onAfterDelete(form, action, success);
	},

	onAfterUndelete : function(form, action, success, scope) {
		scope.onAfterUndelete(form, action, success);
	},

	onAfterVersionUp : function(form, action, success, scope) {
		scope.onAfterVersionUp(form, action, success);
	},

	onAfterProcess : function(form, action, success, scope) {
		scope.onAfterProcess(form, action, success);
	},

	onAfterRelease : function(form, action, success, scope) {
		scope.onAfterRelease(form, action, success);
	},

	onAfterView : function(form, scope) {
		scope.onAfterView(form);
	},

	onAfterRefresh : function(form, scope) {
		scope.onAfterRefresh(form);
	},

	onAfterClose : function(scope) {
		scope.onClose();
	},

	onViewportRendered : function() {
		// status bar 설정(alarm, Communicator, agent)
		this.setStatusBar();

		//copy from WMGController
		SF.status.tray({
			xtype : 'button',
			id : 'mes_tray_notice',
			cls : 'trayNotice',
			iconCls : 'trayNoticeIcon',
			handler : function() {
				SF.communicator.notice(SF.login.id, 'notice message...');
				SF.addContentView({
					xtype : 'mes_notification',
					itemId : 'mes_notification'
				});
			}
		});

		SF.addNav({
			xtype : 'mes_nav_communicator',
			iconCls : 'iconsetDockCommunicator',
			itemId : 'navCommunicator',
			title : T('Caption.Other.Communicator')
		});

		if(SF.search) {
			SF.search.register({
				kind : 'msg',
				key : 'notification',
				name : T('Caption.Other.Notification'),
				handler : function(searchRecord) {
					SF.addContentView({
						xtype : 'mes_notification',
						itemId : 'mes_notification'
					});
				}
			});

			SF.search.register({
				kind : 'msg',
				key : 'chatting',
				name : T('Caption.Other.Chatting'),
				handler : function(searchRecord) {
					SF.doMenu({
						viewModel : 'MES.view.communicate.common.ChatContainer'
					});
				}
			});
		}
	
		
		/*
		 * Communcator Join Server Setting
		 * 
		 * jsonCometdSender.enabled = true -> messagingLocation 정보가 옴
		 * jsonCometdSender.enabled = false -> messagingLocation 정보가 안옴
		 * jsonCometdSender.enabled = false 설정이면 join 하지 않는다.
		 * zhang 暂时先注释掉。
		if (SF.communicator) {
			if (SF.session.get('messagingLocation')) {
				SF.communicator.join(SF.session.get('messagingLocation'));
			} else {
				SF.session.on('messagingLocation', function(id, val, old) {
					if (val) {
						SF.communicator.join(val);
					}
				});
			}
		} */
	},

	setMixin : function() {
		SF.mixin('MES.mixin.CodeView');
		SF.mixin('MES.mixin.CommonFunction');
		Ext.create('MES.data.CodeViewRegister');


		//copy from WMG
		SF.mixin('MES.mixin.Communicator', {
			//host : 'localhost:8000',
			messageNoticed : function(message) {
				var noticeStore = Ext.getStore('MES.store.NoticeInfo');
				noticeStore.add(message.data);
				Ext.getCmp('mes.tray_notice').setText(noticeStore.count());

				SF.msg(SF.login.id, message.data.message);
			},
			memberJoinedIn : function(message) {
				self.joinIn(message.data.username);
				SF.msg('Joined in.', message.data.username);
			},
			memberJoinedOut : function(message) {
				self.joinOut(message.data.username);
				SF.msg('Joined out.', message.data.username);
			},
			messageReceived : function(message) {
				var chatStore = SF.communicator.chatStore(message.data.sender);
				chatStore.add({
					userName : message.data.sender,
					chatTime : Ext.Date.format(new Date(),'Y-m-d H:i:s'),
					msg : message.data.text
				});
				SF.msg(message.data.sender, message.data.text);
				
				// 말 풍선 클릭 시
				var cmp = Ext.getCmp('mes_tray_chat');
				if (!cmp) {
					SF.status.tray({
						xtype : 'button',
						id : 'mes_tray_chat',
						cls : 'bakcgroundClear',
						iconCls : 'trayChat',

						handler : function() {
							SF.doMenu({
								viewModel : 'MES.view.communicate.common.ChatContainer'
							});

							var chatview = Ext.getCmp('mes_chatview').getComponent(message.data.sender);
							if (!chatview) {
								chatview = Ext.getCmp('mes_chatview').add(Ext.create('MES.view.communicate.common.ChildChatting', {
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

	setStatusBar : function() {
		// tray icon 추가
		SF.status.tray([{
			xtype : 'button',
			itemId : 'btnServer',
			cls : 'trayServer'
		}]);
	},

	setShiftInfo : function() {
	},
	
	//copy from WMGController
	joinIn : function(user) {
		var store = Ext.getStore('MES.store.ChatUser');

		var idx = store.findExact('userId', user);
		if (idx !== -1) {
			//TODO store.add(new Record); zhang
			store.getAt(idx).set('status', 'on');
		} else {
			store.add({
				id : user,
				name : user,
				status : 'on'
			});
		}
	},

	//copy from WMGController
	joinOut : function(user) {
		var store = Ext.getStore('MES.store.ChatUser');

		var idx = store.findExact('userId', user);
		if (idx !== -1) {
			//store.getAt(idx).set('status', 'off');
			//TODO remove from store
		} else {//TODO do nothing...?
			store.add({
				userId : user,
				loginName : user,
				userName : 'off'
			});
		}
	}
});