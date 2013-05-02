Ext.define('WMG.view.NavCommunicator', {
	extend : 'Ext.panel.Panel',
	
	alias : 'widget.wmg_nav_communicator',

	tbar : [ {
		cls : 'navRefreshBtn',
		listeners : {
			click : function(button) {
				var store = Ext.getStore('WMG.store.CommunicatorStore');
				store.load();
			}
		}
	}, {
		cls : 'navClearBtn',
		listeners : {
			click : function() {
				var store = Ext.getStore('WMG.store.CommunicatorStore');
				store.removeAll(false);
			}
		}
	} ],

	items : [ {
		xtype : 'dataview',
		store : 'WMG.store.CommunicatorStore',
		autoScroll : true,

		cls : 'communicator-list',
		itemSelector : '.communicator-list-item',
		overItemCls : 'operation-list-item-hover',
		tpl : '<tpl for="."><div class="communicator-list-item {status}">{username} - {loginname}</div></tpl>',

		listeners : {
			itemclick : function(view, record, item, index, e, opt) {
				SmartFactory.doMenu({
					viewModel : 'WMG.view.common.ChatContainer'
				});

				var cmp = Ext.getCmp('wmg_chatview').getComponent(record.get('loginname'));
				if (!cmp) {
					cmp = Ext.getCmp('wmg_chatview').add(Ext.create('WMG.view.common.ChildChatting', {
						itemId : record.get('loginname'),
						title : record.get('loginname'),
						closable : true,
						store : SmartFactory.communicator.chatStore(record.get('loginname'))
					}));
				}
				cmp.show();
			}
		}
	} ]

});