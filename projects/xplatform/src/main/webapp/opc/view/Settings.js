Ext.define('Opc.view.Settings', {
	extend : 'Opc.view.BaseForm',

	xtype : 'settings',

	title : T('Caption.Other.Setting'),

	dockedItems : {
		xtype : 'base_buttons',
		items : [ '->', 'Save', 'Reset', 'Close' ]
	},

	items : [ {
		xtype : 'container',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		items : [ {
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'combobox',
				fieldLabel : T('Caption.Setting.Default Menu'),
				labelWidth : 150,
				store : 'SEC.store.SecViewFunctionListOut.list',
				displayField : 'funcDesc',
				valueField : 'assemblyName',
				queryMode : 'local',
				name : 'opc-default-menu',
				editable : false,
				itemId : 'cmbMenu',
				width : 550
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				itemId : 'chkScreen',
				boxLabel : T('Caption.Setting.Keep Last Menu'),
				name : 'opc-keep-menu',
				inputValue : 'Y',
				unCheckedValue : ' ',
				cls : 'keepChkbox'
			} ]
		}, {
			xtype : 'menuseparator',
			cls : 'marginTB5'
		}, {
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Setting.Agent URL'),
				labelWidth : 150,
				name : 'opc-agent-url',
				itemId : 'txtAgent',
				width : 470
			}, {
				xtype : 'button',
				text : 'Test',
				itemId : 'btnAgent'
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				inputValue : 'Y',
				unCheckedValue : ' ',
				boxLabel : T('Caption.Setting.Keep Last URL'),
				name : 'opc-keep-agent-url',
				inputValue : 'Y',
				unCheckedValue : ' ',
				itemId : 'chkAgent',
				cls : 'keepChkbox'
			} ]
		}, {
			xtype : 'menuseparator',
			cls : 'marginTB5'
		} ]
	} ],

	initComponent : function() {
		this.callParent();
		
		Ext.Array.each(SF.custom.setting(), function(component) {
			try {
				this.add(component);
				this.add({
					xtype: 'menuseparator',
					cls : 'marginTB5'
				});
			} catch (e) {
				SF.error('SYS-E004', {
					view : component
				}, e);
			}
		}, this);
	}
});