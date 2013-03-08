Ext.define('Opc.view.wip.LabelPrint', {
	extend : 'Opc.view.BaseForm',

	xtype : 'labelprint',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	title : 'Label Print',

	id : 'opc_labelprint',

	dockedItems : {
		xtype : 'base_buttons',
		items : [ '->', 'Print', 'Reset', 'Close' ]
	},
    
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [ {
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : [
						{
							xtype : 'container',
							flex : 3,
							layout : {
								type : 'vbox',
								align : 'stretch'
							},
							items : [ {
								xtype : 'textfield',
								itemId : 'txtLotId',
								fieldLabel : 'Lot ID',
								labelAlign : 'top',
								name : 'lotId'
							}, {
								xtype : 'displayfield',
								fieldLabel : 'Label Preview'
							}, {
								xtype : 'fieldset',
								flex : 1,
								items : [ {
									xtype : 'flash',
									itemId : 'flaViewer',
									flashAttributes : {
										wmode : 'transparent'
									},
									url : 'opc/swf/LabelViewer.swf',
									minHeight : 400
								} ]
							} ]
						},
						{
							xtype : 'dataview',
							itemId : 'viewLot',
							flex  : 1,
							itemSelector : '.aa',
							store : Ext.create('MES.store.ConvertWipViewLotStore'),
							cls : 'lotInfo',
							tpl : ['<div class="wrap">',
							       '<div class="title">Lot <span>Information</span></div>',
							       '<tpl for=".">',
							       '<div class="itemSet">Material<b>{matInfo}</b></div>',
							       '<div class="itemSet">Flow<b>{flowInfo}</b></div>',
							       '<div class="itemSet">Operation<b>{operInfo}</b></div>',
							       '<div class="itemSet"><span>QTY 1/2/3</span>{qtyInfo}</div>',
							       '<div class="itemSet"><span>Lot Status</span>{lotStatus}</div>',
							       '<div class="itemSet"><span>Last Tran Code</span>{lastTranCode}</div>',
							       '<div class="itemSet"><span>Lot Type</span>{lotType}</div>',
							       '</tpl>',
							       '</div>']
						} ]
			} ]
		});

		me.callParent(arguments);
	}

});