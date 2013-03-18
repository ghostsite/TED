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
	},
	isControlDisabled : function(name){
		//권한 여부  ture(사용), false(사용금지), null(무시) 
		var disabled = false;
		if(name && this.secChecked === true){
			if(this.secControlList[name] == ''){
				disabled = true;
			}
			else if(this.useBlackList === 'Y' && this.secControlList[name] !== 'Y'){
				disabled = true;
			}
		}
		
		return disabled;
	}
});