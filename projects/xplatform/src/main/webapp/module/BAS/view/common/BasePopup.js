Ext.define('BAS.view.common.BasePopup', {
	extend : 'Ext.window.Window',

	xtype : 'bas_base_popup',
	
	bodyPadding : 0,
	
	autoScroll : false,
	
	layout : 'fit',
	
	width : 786,
	
	height : 512,
	
	dockedItems : {
		xtype : 'bas_base_buttons',
		items : [ '->', 'Close' ]
	},
	
	getKeys : function() {
		return this._keys;
	},

	setKeys : function(keys) {
		this._keys = keys;
		
		this.fireEvent('keychange', this, keys);
	}
});