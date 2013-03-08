Ext.define('Opc.view.BaseForm', {
	extend : 'Ext.form.Panel',

	xtype : 'baseform',
	
	bodyPadding : 20,
	
	autoScroll : true,
	
	requires : [ 'mixin.DeepLink' ],

	mixins : {
		deeplink : 'mixin.DeepLink'
	},
	
	dockedItems : {
		xtype : 'base_buttons',
		items : [ '->', 'Close' ]
	}
});