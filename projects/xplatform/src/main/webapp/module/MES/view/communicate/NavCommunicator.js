Ext.define('MES.view.communicate.NavCommunicator', {
	extend : 'Ext.panel.Panel',
	
	alias : 'widget.mes_nav_communicator',

	tbar : [ {
		cls : 'navRefreshBtn',
		listeners : {
			click : function(button) {
				var store = Ext.getStore('MES.store.ChatInfo');
				store.load();
			}
		}
	}, {
		cls : 'navClearBtn',
		listeners : {
			click : function() {
				var store = Ext.getStore('MES.store.ChatInfo');
				store.removeAll(false);
			}
		}
	} ],

	items : [ {
		xtype : 'dataview',
		store : Ext.getStore('MES.store.ChatInfo'),
		autoScroll : true,

		cls : 'communicator-list',
		itemSelector : '.communicator-list-item',
		overItemCls : 'operation-list-item-hover',
		tpl : '<tpl for="."><div class="communicator-list-item {status}">{name} - {id}</div></tpl>',

		listeners : {
			itemclick : function(view, record, item, index, e, opt) {
				SmartFactory.doMenu({
					viewModel : 'MES.view.communicate.common.ChatContainer'
				});

				var cmp = Ext.getCmp('mes_chatview').getComponent(record.get('id'));
				if (!cmp) {
					cmp = Ext.getCmp('mes_chatview').add(Ext.create('MES.view.communicate.common.ChildChatting', {
						itemId : record.get('id'),
						title : record.get('id'),
						closable : true,
						store : SmartFactory.communicator.chatStore(record.get('id'))
					}));
				}
				cmp.show();
			}
		}
	} ]

});