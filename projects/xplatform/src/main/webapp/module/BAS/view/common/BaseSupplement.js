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
				Ext.Array.each( buttons.query('button'), function(b){//zhang usage:sup_btnViewclick : this.onSupBtnView,注意格式，下面是原来的版本，有问题， 会调用2次，而且意思也不对。
					client.relayEvents(b, ['click'],'sup_'+b.itemId);
				});
				/**client.relayEvents(sup, Ext.Array.map(buttons.query('button'), function(item) {
					return item.itemId;
				}), 'sup_');*/
			}
		}
	}
});