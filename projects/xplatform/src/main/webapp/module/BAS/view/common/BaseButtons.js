Ext.define('BAS.view.common.BaseButtons', {
	extend : 'Ext.toolbar.Toolbar',

	xtype : 'bas_base_buttons',

	dock : 'bottom',

	ui : 'footer',

	items : [ 'Close' ],

	initComponent : function() {
		this.items = Ext.Array.map(this.items, function(b) {
			if (typeof(b) === 'string' && b !== '-' && b !== '->' && b !== ' ') {
				/*
				 * tbtext 용 텍스트를 button 형으로 수정한다.
				 */
				return {
					text : T('Caption.Button.' + b),
					minWidth : 75,
					itemId : 'btn' + b
				};
			}
			return b;
		});
		this.callParent();
	},
	
	getSecControlList : function(){
		return this.up().secControlList;
	},
	getOwner : function() {
		return this.up();
	},
	isControlDisabled : function(itemId){
		//권한 여부  ture(사용), false(사용금지), null(무시) 
		var disabled = false;
		if(itemId && this.secChecked === true){
			if(this.secControlList[itemId] == ''){
				disabled = true;
			}
			else if(this.useBlackList === 'Y' && this.secControlList[itemId] !== 'Y'){
				disabled = true;
			}
		}
		
		return disabled;
	}
});