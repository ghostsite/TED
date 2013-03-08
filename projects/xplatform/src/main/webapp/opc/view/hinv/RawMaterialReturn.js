Ext.define('Opc.view.hinv.RawMaterialReturn', {
	extend : 'Opc.view.BaseForm',

	xtype : 'hinv_raw_material_return',

	title : T('Caption.Menu.Material Return'),

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
		return [ {
			xtype : 'fieldset',
			title : '',
			layout : {
				type : 'anchor'
			},
			cls : 'paddingALL5',
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
	        cls : 'infoTable2Column marginB10',
	        defaultType: 'textfield',
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
					name : 'returnQty',
					itemId : 'returnQty',
					fieldLabel : 'Return Qty',
					flex : 1
				}, {
					flex : 1,
					xtype : 'displayfield'
				}, {
					flex : 1,
					xtype : 'displayfield'
				} ]
		} ];
	}

});
