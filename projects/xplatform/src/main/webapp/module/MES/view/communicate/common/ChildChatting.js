Ext.define('MES.view.communicate.common.ChildChatting', {
	extend : 'Ext.panel.Panel',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	tpl : ['<tpl for=".">', '<div class="{[values.itsme ? "chatItemMe" : "chatItemOther"]}">', '<div class="chatInfo">{userName}<div class="chatTime">{chatTime}</div></div>', '<div class="chatContent"><div></div>{msg}</div>', '</div>', '</tpl>'],

	initComponent : function() {

		var self = this;

		this.items = this.buildItems(this);

		this.callParent();

		this.sub('btn_send').on('click', function() {
			var value = self.sub('chat_textarea').getValue();
			if (value) {
				SmartFactory.communicator.send(self.title, SmartFactory.login.id, value);

				self.store.add({
					userId : SmartFactory.login.id,
					userName : SmartFactory.login.username,
					chatTime : Ext.Date.format(new Date(),'Y-m-d H:i:s'),
					msg : value,
					itsme : true
				});

				self.sub('chat_textarea').reset();
			}
		});
	},

	buildItems : function(self) {
		return [{
			layout : 'hbox',
			html : '<div class="chattingHeader paddingT7 paddingRL7 paddingB5"><span class="chattingIcon"></span>shnam 님과 채팅 중입니다.</div>'
		}, {
			xtype : 'dataview',
			flex : 1,
			cls : 'chattingWindow',
			store : self.store,
			tpl : self.tpl,
			itemSelector : 'div.item',
			itemId : 'chat_dataview'
		}, {
			xtype : 'panel',
			height : 45,
			cls : 'paddingAll5 chatMessage',
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'textarea',
				itemId : 'chat_textarea',
				flex : 1,
				height : 35,
				cls : 'marginR5'
			}, {
				xtype : 'button',
				text : T('sample.chat.button'),
				itemId : 'btn_send',
				height : 35
			}]
		}];
	},

	listeners : {
		beforeClose : function(panel, opt) {
			var cmp = Ext.getCmp('mes.tray_chatnotice');
			if (cmp)
				cmp.destroy();
		}
	}
});