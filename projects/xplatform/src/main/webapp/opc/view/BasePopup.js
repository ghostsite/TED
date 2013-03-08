Ext.define('Opc.view.BasePopup', {
	extend : 'Ext.window.Window',

	xtype : 'basepopup',
	
	bodyPadding : 20,
	
	autoScroll : false,
	
	layout : 'fit',
	
	width : 786,
	
	height : 512,
	
	dockedItems : {
		xtype : 'base_buttons',
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