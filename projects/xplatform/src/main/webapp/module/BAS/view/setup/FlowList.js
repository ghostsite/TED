Ext.define('BAS.view.setup.FlowList', {
	extend : 'BAS.view.common.TaskList',

	requires : [ 'WIP.store.WipViewFlowListOut.flowList', 'BAS.store.BasViewTaskRequestListOut.list'],
	
	xtype : 'bas_flow_list',

	title : T('Caption.Other.Flow List'),

	initComponent : function() {
		var me = this;
		this.flowStore = Ext.create('WIP.store.WipViewFlowListOut.flowList', {
			buffered : true
		});

		me.callParent(arguments);
	},

	dockedItems : [ {
		xtype : 'mes_task_buttons',
		items : [ 'Export', 'Refresh', '->', 'AddNew', 'Close' ]
	}],
	
	buildList : function(me){
		return {
			xtype : 'gridpanel',
			itemId : 'grdFlow',
			flex : 2,
			cls : 'navyGrid',
			columnLines : true,
			store : this.flowStore,
			columns : [ {
				xtype : 'rownumberer',
				width : 25,
				text : ''
			}, {
				xtype : 'actioncolumn',
				text : 'Edit',
				width : 25,
				items : [{
					iconCls: 'iconEdit',
					handler : function(grid, rowIndex, colIndex) {
						me.fireEvent('edit',grid, rowIndex, colIndex, 'update');
					}
				}]
			}, {
				xtype : 'actioncolumn',
				width : 25,
				text : 'Del',
				items : [{
					iconCls: 'iconDelete',
					handler : function(grid, rowIndex, colIndex) {
						me.fireEvent('edit',grid, rowIndex, colIndex, 'delete');
					}
				}]
			}, {
				xtype : 'textactioncolumn',
				dataIndex : 'flow',
				minWidth : 150,
				text : T('Caption.Other.Flow'),
				handler : function(grid, rowIndex, colIndex) {
					me.fireEvent('view',grid, rowIndex, colIndex);
				}
			}, {
				dataIndex : 'flowDesc',
				minWidth : 100,
				text : T('Caption.Other.Description'),
				flex : 1
			} ],
			viewConfig : {
				getRowClass : function(record, rowIndex, rowParams, store) {
				}
			}
		};
	}
});