Ext.define('Opc.view.hinv.StockInRawMaterial', {
	extend : 'Opc.view.BaseForm',

	xtype : 'hinv_stock_in_raw_material',

	title : T('Caption.Menu.Stock In Raw Material'),

	dockedItems : {
		xtype : 'base_buttons',
		items : [ '->', 'Process', 'Close' ]
	},

	initComponent : function() {
		this.items = this.buildForm();
		this.callParent();
	},

	buildForm : function() {
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});

		return [ {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			defaults : {
				labelWidth : 140
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Material Code'),
				readOnly : true,
				margin : '0 0 0 10', // TODO CSS
				itemId : 'txtMatId',
				name : 'matId',
				flex : 1
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Warehouse Classify'),
				readOnly : true,
				margin : '0 0 0 10', // TODO CSS
				itemId : 'txtStoreFlag',
				name : 'storeFlag',
				flex : 1
			} ]
		}, {
			xtype : 'panel',
			title: 'Information',
	        layout : 'column',
	        cls : 'infoTable3Column marginB10',
	        defaultType: 'textfield',
			items : [ {
					fieldLabel : T('Caption.Other.Inspection Qty'),
					itemId : 'numInspectQty',
					name : 'inspectQty',
					labelWidth: 150
				}, {
					fieldLabel : T('Caption.Other.Good Qty'),
					itemId : 'numGoodQty',
					name : 'goodQty'
				}, {
					fieldLabel : T('Caption.Other.Bad Qty'),
					itemId : 'numBadQty',
					name : 'badQty'
				}, {
					fieldLabel : T('Caption.Other.Sample Qty'),
					itemId : 'numSampleQty',
					name : 'sampleQty'
				}, {
					fieldLabel : T('Caption.Other.Operation'),
					itemId : 'txtOper',
					name : 'oper'
				}, {
					fieldLabel : T('Caption.Other.Comment'), // TODO NO
					// COMMENT
					// FIELD
					itemId : 'txtComment',
					name : 'comment'
				}, {
					fieldLabel : T('Caption.Other.Inspect Result'),
					itemId : 'txtInspectResult',
					name : 'inspectResult'
				} ]
		}, {
			xtype : 'fieldset',
			title : T('Caption.Other.Input Data'),
			cls : 'marginT10',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			flex : 2,
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Lot ID'),
				labelWidth : 130,
				itemId : 'txtLotId'
			}, {
				xtype : 'grid',
				title : T('Caption.Other.Raw Material List'),
				cls : 'navyGrid',
				minHeight : 250,
				columnLines : true,
				plugins : cellEditing,
				completeEdit : function() {
					cellEditing.completeEdit();
				},
				store : Ext.create('Ext.data.Store', {
					fields : [ 'lotId', 'rawMatId', 'inQty', 'location', 'rawmatCreateTime', 'periodTime' ]
				}),
				flex : 1,
				columns : [ {
					header : T('Caption.Other.Lot ID'),
					dataIndex : 'lotId',
					flex : 1
				}, {
					header : T('Caption.Other.Raw Material'),
					dataIndex : 'rawMatId',
					flex : 1
				}, {
					header : T('Caption.Other.Qty'),
					dataIndex : 'inQty',
					flex : 1
				}, {
					header : T('Caption.Other.Location'),
					dataIndex : 'location',
					flex : 1
				}, {
					header : T('Caption.Other.Raw Material Create Time'),
					dataIndex : 'rawmatCreateTime',
					flex : 1,
					editor : {
						xtype : 'datefield',
						format : 'YmdHis'
					},
					renderer : function(v) {
						return Ext.Date.format(v, 'YmdHis');
					}
				}, {
					header : T('Caption.Other.Period Time'),
					dataIndex : 'periodTime',
					flex : 1,
					editor : {
						xtype : 'datefield',
						format : 'YmdHis'
					},
					renderer : function(v) {
						return Ext.Date.format(v, 'YmdHis');
					}
				} ]
			} ]
		}, {
			xtype : 'numberfield',
			fieldLabel : T('Caption.Other.Summary'),
			labelWidth : 140,
			readOnly : true,
			itemId : 'numSum'
		} ];
	}
});