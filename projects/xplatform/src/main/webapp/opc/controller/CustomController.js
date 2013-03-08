Ext.define('Opc.controller.CustomController', {
	extend : 'Ext.app.Controller',
	
	init : function () {
		this.control({
			'viewport' : {
				afterrender : this.onAfterRender
			},
			
			'navigator #topBar field' : {
				change : this.onSettingChange
			}
		});
		
		this.addCustomComponents();
	},
	
	onSettingChange : function(field, newval, oldval) {
		switch(field.getName()) {
		case 'opc-default-resource' :
			if(SF.setting.get('opc-keep-resource'))
				SF.setting.set('opc-default-resource', newval);
			break;
		case 'opc-default-operation' :
			if(SF.setting.get('opc-keep-operation'))
				SF.setting.set('opc-default-operation', newval);
			break;
		case 'opc-default-workorder' :
		case 'opc-default-line' :
		}
	},
	
	onAfterRender : function() {
	},
	
	addCustomComponents : function() {
		SF.custom.top({
			xtype : 'codeview',
			codeviewName : 'SvResource',
			cls : 'searchBar',
			width : 160,
			fieldLabel : T('Caption.Other.Resource'),
			itemId : 'settingResource',
			value : SF.setting.get('opc-default-resource'),
			name : 'opc-default-resource',
			params : {
				procstep : '1'
			},
			labelWidth : 50
		});
		
		SF.custom.top({
			xtype : 'codeview',
			codeviewName : 'SvOperation',
			cls : 'searchBar',
			width : 160,
			fieldLabel : T('Caption.Other.Operation'),
			itemId : 'settingOperation',
			value : SF.setting.get('opc-default-operation'),
			name : 'opc-default-operation',
			labelWidth : 60
		});
		
		SF.custom.top({
			xtype : 'codeview',
			codeviewName : 'Area',
			cls : 'searchBar',
			width : 160,
			fieldLabel : T('Caption.Other.Line'),
			itemId : 'settingLine',
			name : 'opc-default-line',
			labelWidth : 60,
			popupConfig : {
				title : T('Caption.Other.Line'),
				columns : [ {
					header : T('Caption.Other.Line'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			}
		});

		SF.custom.top({
			xtype : 'codeview',
			codeviewName : 'SvOperation',
			cls : 'searchBar',
			width : 160,
			fieldLabel : T('Caption.Other.Work Order Short'),
			itemId : 'settingWorkOrder',
			name : 'opc-default-workorder',
			labelWidth : 60
		});
		
		var library = ['', 'Library01','Library02','Library03'];
		var scalePort = ['', 'COM1','COM2','COM3'];
		var printerPort = ['', 'P001','P002','P003'];
		
		SF.custom.setting({
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Setting.Default Operator'),
				labelWidth : 150,
				name : 'opc-default-operator',
				itemId : 'txtOperator',
				width : 550
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				boxLabel : T('Caption.Setting.Keep Last Operator'),
				inputValue : 'Y',
				unCheckedValue : ' ',
				name : 'opc-keep-operator',
				itemId : 'chkOperator',
				cls : 'keepChkbox'
			} ]
		});
		
		SF.custom.setting({
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'codeview',
				codeviewName : 'TbOperation',
				fieldLabel : T('Caption.Setting.Default Operation'),
				labelWidth : 150,
				name : 'opc-default-operation',
				itemId : 'cdvOperation',
				width : 550
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				boxLabel : T('Caption.Setting.Keep Last Operation'),
				name : 'opc-keep-operation',
				inputValue : 'Y',
				unCheckedValue : ' ',
				itemId : 'chkOperation',
				cls : 'keepChkbox'
			} ]
		});
		
		SF.custom.setting({
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'codeview',
				codeviewName : 'SvResource',
				params : {
					procstep : '1'
				},
				fieldLabel : T('Caption.Setting.Default Resource'),
				labelWidth : 150,
				itemId : 'cdvResId',
				name : 'opc-default-resource',
				width : 550
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				boxLabel : T('Caption.Setting.Keep Last Resource'),
				name : 'opc-keep-resource',
				inputValue : 'Y',
				unCheckedValue : ' ',
				itemId : 'chkResId',
				cls : 'keepChkbox'
			} ]
		});
		
		SF.custom.setting({
			xtype : 'radiogroup',
			fieldLabel : T('Caption.Setting.Lot Selection Pattern'),
			labelWidth : 150,
			itemId : 'rdgPat',
			vertical : true,
			items : [ {
				xtype : 'radiofield',
				boxLabel : T('Caption.Setting.on Lotlist'),
				name : 'opc-lot-selection-pattern',
				inputValue : 'lotList',
				checked : true
			}, {
				xtype : 'radiofield',
				boxLabel : T('Caption.Setting.using BCR'),
				inputValue : 'bcr',
				cls : 'marginL300',
				name : 'opc-lot-selection-pattern'
			} ]
		});
		
		SF.custom.setting({
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'combobox',
				fieldLabel : T('Caption.Setting.Default Library'),
				labelWidth : 150,
				name : 'opc-default-library',
				store : library,
				itemId : 'cmbLib',
				width : 550,
				tpl : '<tpl for="."><div class="x-boundlist-item">{field1}&nbsp;</div></tpl>'
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				boxLabel : T('Caption.Setting.Keep Last Library'),
				inputValue : 'Y',
				unCheckedValue : ' ',
				name : 'opc-keep-library',
				unCheckedValue : ' ',
				cls : 'keepChkbox'
			}]
		});
		
		SF.custom.setting({
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'combobox',
				store : scalePort,
				fieldLabel : T('Caption.Setting.Default Scale Port'),
				labelWidth : 150,
				name : 'opc-default-scale-port',
				itemId : 'cmbScalePort',
				width : 550,
				tpl : '<tpl for="."><div class="x-boundlist-item">{field1}&nbsp;</div></tpl>'
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				inputValue : 'Y',
				unCheckedValue : ' ',
				boxLabel : T('Caption.Setting.Keep Last Scale Port'),
				name : 'opc-keep-scale-port',
				itemId : 'chkScalePort',
				cls : 'keepChkbox'
			} ]
		});
		
		SF.custom.setting({
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'combobox',
				store : printerPort,
				fieldLabel : T('Caption.Setting.Default Printer Port'),
				labelWidth : 150,
				name : 'opc-default-print-port',
				itemId : 'cmbPrintPort',
				width : 550,
				tpl : '<tpl for="."><div class="x-boundlist-item">{field1}&nbsp;</div></tpl>'
			}, {
				xtype : 'checkboxfield',
				fieldLabel : '',
				inputValue : 'Y',
				unCheckedValue : ' ',
				boxLabel : T('Caption.Setting.Keep Last Printer Port'),
				name : 'opc-keep-print-port',
				itemId : 'chkPrintPort',
				cls : 'keepChkbox'
			} ]
		});
	}
});