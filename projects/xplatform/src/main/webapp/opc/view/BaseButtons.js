Ext.define('Opc.view.BaseButtons', {
	extend : 'Ext.toolbar.Toolbar',

	xtype : 'base_buttons',

	dock : 'bottom',

	defaults : {
		minWidth : 75
	},

	ui : 'footer',

	items : [ '->', 'Close' ],

	initComponent : function() {
		this.items = Ext.Array.map(this.items, function(b) {
			if (typeof(b) === 'string' && b !== '-' && b !== '->' && b !== ' ') {
				/*
				 * tbtext 용 텍스트를 button 형으로 수정한다.
				 */
				return {
					text : T('Caption.Button.' + b),
					name : 'btn' + b
				};
			}
			return b;
		});

		this.callParent();
	},

	getOwner : function() {
		return this.up();
	}
});