Ext.define('BAS.view.common.BaseSupplement', {
	extend : 'Ext.form.Panel',

	xtype : 'bas_base_sup',
	
	cls : 'nav supplement',

	bodyCls : 'paddingAll7',

	layout : 'anchor',
	
	autoScroll : true,

	defaults : {
		labelAlign : 'top',
		anchor : '100%'
	},
	
	dockedItems : [ {
		xtype : 'bas_base_buttons',
		items : [ 'View', 'Reset' ]
	} ],
	
	listeners : {
		supready : function(client, sup) {
			var buttons = this.down('bas_base_buttons');
			if(buttons) {
				client.relayEvents(sup, Ext.Array.map(buttons.query('button'), function(item) {
					return item.itemId;
				}), 'sup_');
			}
		}
	}
});