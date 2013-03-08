Ext.define('Opc.view.wip.LotList', {
	extend : 'Opc.view.BaseForm',

	title : 'lot list',
	
	xtype : 'lotlist',
	
	layout : {
		align : 'stretch',
		type : 'vbox'
	},
	
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [ {
				xtype : 'gridpanel',
				itemId : 'grdLotList',
				cls : 'navyGrid',
				title : '',
				flex : 1,
				columns : [ {
					xtype : 'rownumberer',
					width : 30
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'lotId',
					flex : 1,
					text : 'Lot ID'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'matId',
					text : 'Material'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'matVer',
					text : 'Mat. Ver.'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'flow',
					text : 'Flow'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'flowSeqNum',
					text : 'Flow Seq.'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'qty1',
					width : 50,
					text : 'Qty'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'ownerCode',
					text : 'Owner Code'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'lotPriority',
					text : 'Priority'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'createCode',
					text : 'Create Code'
				} ],
				viewConfig : {

				},
				selModel : Ext.create('Ext.selection.CheckboxModel', {

				})
			} ]
		});

		me.callParent(arguments);
	}

});