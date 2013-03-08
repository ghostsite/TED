Ext.define('CMN.view.viewport.South', {
	extend : 'Ext.ux.statusbar.StatusBar',
	
	id : 'status',

	cls:'appStatusBar noBoardPanel x-statusbar',

	alias : 'widget.viewport.south',

	// defaults to use when the status is cleared:
	defaultText : T('Caption.Other.Ready'),
	defaultIconCls: 'x-status-valid',

	// values to set initially:
	//text : T('Caption.Other.Ready'),
	//iconCls : 'x-status-valid',

	// any standard Toolbar items:
	items : []
});
