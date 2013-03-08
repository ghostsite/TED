Ext.define('Opc.view.Viewport', {
	extend : 'Ext.container.Viewport',
	
	layout : 'fit',
	
	cls : 'opcLayout',
	
	itemCls : 'layoutWrap',
	
	minWidth : 950,
	
	items : [ {
		xtype : 'navigator'
	} ]
});