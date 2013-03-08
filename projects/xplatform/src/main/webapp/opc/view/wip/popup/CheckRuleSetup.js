Ext.define('Opc.view.wip.popup.CheckRuleSetup', {
	extend : 'Opc.view.BasePopup',
	
	title : 'Sample Popup',
	
	xtype : 'wip_popup_checkrule_setup',
	
//	width : 600,
//	height : 350,
	
	modal : true,
	
	layout : 'anchor',
	bodyCls : 'paddingAll10',
	
	initComponent : function() {
		this.callParent();
	},
	
	dockedItems : [{
		xtype : 'base_buttons',
		items : [ '->', 'Confirm', 'Reset', 'Close' ]
	}],
	
	items : [{
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [{
			xtype : 'textfield',
			fieldLabel : 'Prefix',
			flex : 1
		}, {
			xtype : 'textfield',
			fieldLabel : 'Postfix',
			flex : 1,
			cls : 'marginL10'
		}]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [{
			xtype : 'combobox',
			store : [['character', 'A-Za-z'], ['digit', '0-9']],
			fieldLabel : 'Data Format',
			flex : 1
		}, {
			xtype : 'combobox',
			store : [['1', 'Character Only'], ['2', 'Digit Only'], ['3', 'Numeric']],
			fieldLabel : 'Checking Rule',
			flex : 1,
			cls : 'marginL10'
		}]
	}]
});