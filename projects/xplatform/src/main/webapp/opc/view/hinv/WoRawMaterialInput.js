Ext.define('Opc.view.hinv.WoRawMaterialInput', {
	extend : 'Opc.view.BaseForm',

	xtype : 'hinv_wo_raw_material_input',

	title : T('Caption.Menu.WO Material Input'),

	dockedItems : {
		xtype : 'base_buttons',
		items : [ '->', 'View', 'Process', 'Close' ]
	},

	initComponent : function() {
		this.items = this.buildForm();
		this.callParent();
	},

	buildForm : function() {
		return [ {
			xtype : 'fieldset',
			title : 'WO Info',
			layout : {
				type : 'anchor'
			},
			cls : 'paddingALL5',
			items : [ {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					xtype : 'textfield',
					anchor : '100%',
					padding : '0 0 0 10',
					labelWidth : 140,
					readOnly : true
				},
				items : [ {
					xtype : 'textfield',
					name : 'matModel',
					itemId : 'matModel',
					fieldLabel : 'Product Model',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'matId',
					itemId : 'matId',
					fieldLabel : 'Product Code',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'orderQty',
					itemId : 'orderQty',
					fieldLabel : 'WO Qty',
					flex : 1
				} ]
			} ]
		}, {
			xtype : 'fieldset',
			title : '',
			layout : {
				type : 'anchor'
			},
			cls : 'paddingALL5 marginT10',
			defaults : {
				xtype : 'textfield',
				anchor : '100%',
				padding : '0 0 0 10',
				labelWidth : 140
			},
			items : [ {
				cls : 'marginT5',
				fieldLabel : T('Material Lot NO'),
				name : 'lotId',
				itemId : 'lotId',
				enableKeyEvents : true
			} ]
		}, {
			layout : 'column',
	        cls : 'infoTable3Column marginB10',
	        defaultType: 'textfield',
			xtype : 'panel',
			title : 'Lot Info',
			items : [ {
					xtype : 'textfield',
					name : 'rawMatId',
					itemId : 'rawMatId',
					fieldLabel : 'Material Code',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'oper',
					itemId : 'oper',
					fieldLabel : 'Inv Operation',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'location',
					itemId : 'location',
					fieldLabel : 'Location',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'storeFlag',
					itemId : 'storeFlag',
					fieldLabel : 'Inv Classify',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'supplierId',
					itemId : 'supplierId',
					fieldLabel : 'Vendor',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'rawmatCreateTime',
					itemId : 'rawmatCreateTime',
					fieldLabel : 'Produce Date',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'needQty',
					itemId : 'needQty',
					fieldLabel : 'Need Qty',
					flex : 1
				}, {
					xtype : 'textfield',
					name : 'inputQty',
					itemId : 'inputQty',
					fieldLabel : 'Input Qty',
					flex : 1,
					readOnly : false
				}, {
					xtype : 'textfield',
					name : 'remainQty',
					itemId : 'remainQty',
					fieldLabel : 'Inv Qty',
					flex : 1
				} ]
		} ];
	}

});
