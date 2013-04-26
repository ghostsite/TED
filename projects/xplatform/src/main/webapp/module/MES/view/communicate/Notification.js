Ext.define('MES.view.communicate.Notification', {
	extend : 'Ext.panel.Panel',
	plugins : [ Ext.create('CMN.plugin.Supplement') ],
	
	alias : 'widget.mes_notification',
	
	title : T('Caption.Other.Notification'),

	supplement : {
		xtype : 'form',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [{
			xtype : 'textfield',
			fieldLabel : 'Sender',
			name : 'sender'
		}] 
	},
	
	items : [{
		xtype : 'dataview', 
		store: 'MES.store.NoticeInfo',
		
		listeners: {
			render: function(view) {
			}
		},
		
		autoScroll: true,
		
		cls: 'notification-list',
		itemSelector: '.notification-list-item',
		overItemCls: 'notification-list-item-hover',
		tpl:'<tpl for="."><div class="notification-list-item">{title} - {message}</div></tpl>'
	}]
});