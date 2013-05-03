Ext.define('WMG.view.common.ChildChatting', {
	extend : 'Ext.panel.Panel',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	tpl : ['<tpl for=".">',
	         '<div class="{[values.itsme ? "chatItemMe" : "chatItemOther"]}">',
	          '<div class="chatInfo">{name}<div class="chatTime">{time}</div></div>',
	          '<div class="chatContent"><div></div>{content}</div>',
	         '</div>',
	       '</tpl>' ],
	initComponent : function() {

		var self = this;

		this.items = this.buildItems(this);

		this.callParent();

		this.sub('btn_send').on('click', function() {
			self.sendMsg();
		});
	},

	sendMsg : function() {
		var self = this;
		var value = self.sub('chat_textarea').getValue();
		if (value) {
			SmartFactory.communicator.send(self.title, SmartFactory.login.loginname, value);

			self.store.add({
				name : SmartFactory.login.loginname,
				time : new Date(),
				content : value,
				itsme : true
			});

			self.sub('chat_textarea').reset();
		}
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
				cls : 'marginR5',
				listeners : {
					scope : this,
					specialkey : function(f, e) {
						if (e.ctrlKey && Ext.EventObject.ENTER == e.getKey()) {
							self.sendMsg();
						}
					}
				}
			}, {
				xtype : 'button',
				text : '发送',
				itemId : 'btn_send',
				height : 35
			}]
		}];
	},

	listeners : {
		beforeClose : function(panel, opt) {
			var cmp = Ext.getCmp('wmg.tray_chatnotice');
			if (cmp)
				cmp.destroy();
		}
	}
});