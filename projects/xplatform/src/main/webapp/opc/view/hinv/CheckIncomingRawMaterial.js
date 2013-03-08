Ext.define('Opc.view.hinv.CheckIncomingRawMaterial', {
	extend : 'Opc.view.BaseForm',

	xtype : 'hinv_check_incoming_raw_mat',

	title : 'Check Incoming Raw Material',
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	dockedItems : {
		xtype : 'base_buttons',
		items : [ '->', 'View', 'Process', 'Close' ]
	},

	initComponent : function() {
		this.items = this.buildForm();
		this.callParent();
	},

	buildForm : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel');

		return [ {
			xtype : 'grid',
			title : T('Caption.Other.Center Order List'),
			margin : '0 0 20 0', // TODO CSS
			cls : 'navyGrid',
			selModel : selModel,
			columnLines : true,
			flex : 1,
			columns : [ {
				header : T('Caption.Other.Center Order'),
				dataIndex : 'orderId',
				flex : 1
			}, {
				header : T('Caption.Other.Center Order Description'),
				dataIndex : 'orderDesc',
				flex : 1
			}, {
				header : T('Caption.Other.Product Model'),
				dataIndex : 'matModel',
				flex : 1
			}, {
				header : T('Caption.Other.Product Code'),
				dataIndex : 'matId',
				flex : 1
			}, {
				header : T('Caption.Other.Quantity'),
				dataIndex : 'qty',
				flex : 1
			}, {
				header : T('Caption.Other.Operation'),
				dataIndex : 'oper',
				flex : 1
			}, {
				header : T('Caption.Other.Start Time'),
				dataIndex : 'planStartTime',
				flex : 1
			}, {
				header : T('Caption.Other.End Time'),
				dataIndex : 'planEndTime',
				flex : 1
			} ]
		}, {
			xtype : 'fieldset',
			title : T('Caption.Other.Quantity Check'),
			layout : 'hbox',
			flex : 1,
			items : [ {
				xtype : 'container',
				layout : 'anchor',
				defaults : {
					anchor : '50%',
					labelWidth : 140
				},
				flex : 1,
				items : [ {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Material Code'),
					itemId : 'txtRawMatId',
					name : 'rawMatId'
				}, {
					xtype : 'fieldcontainer',
					layout : {
						type : 'hbox',
						align : 'top'
					},
					items : [ {
						xtype : 'numberfield',
						fieldLabel : T('Caption.Other.Real Quantity'),
						itemId : 'numRealQty',
						labelWidth : 140,
						name : 'realQty',
						flex : 1
					}, {
						xtype : 'button',
						text : T('Caption.Button.Check'),
						cls : 'marginL5',
						itemId : 'btnCheck'
					} ]
				}, {
					xtype : 'numberfield',
					fieldLabel : T('Caption.Other.WO Quantity'),
					readOnly : true,
					itemId : 'numWoQty'
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Differ Quantity'),
					readOnly : true,
					itemId : 'txtDifferQty',
					name : 'differQty'
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Check Result'),
					readOnly : true,
					itemId : 'txtCheckFlag',
					name : 'checkFlag'
				} ]
			} ]
		} ];
	}
});