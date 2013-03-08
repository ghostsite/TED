Ext.define('BAS.view.setup.FieldList', {
	extend : 'BAS.view.common.TaskList',

	requires : [ 'BAS.store.BasViewDataListOut.DataList', 'BAS.store.BasViewTaskRequestListOut.list'],
	
	xtype : 'bas_field_list',

	title : T('Caption.Other.Field List'),

	initComponent : function() {
		var me = this;
		this.gcmStore = Ext.create('BAS.store.BasViewDataListOut.DataList', {
			buffered : true
		});

		me.callParent(arguments);
	},

	buildList : function(me){
		return {
			xtype : 'gridpanel',
			itemId : 'grdGcm',
			columnLines : true,
			flex : 2,
			cls : 'navyGrid',
			store : this.gcmStore,
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
				dataIndex : 'key1',
				minWidth : 100,
				text : T('Caption.Other.Field Name'),
				handler : function(grid, rowIndex, colIndex) {
					me.fireEvent('view',grid, rowIndex, colIndex);
				}
			}, {
				dataIndex : 'data1',
				minWidth : 100,
				text : T('Caption.Other.Description'),
				flex : 1
			}, {
				dataIndex : 'data2',
				minWidth : 100,
				text : T('Caption.Other.Field Type')
			}, {
				width : 70,
				dataIndex : 'createUserId',
				text : T('Caption.Other.Create User')
			}, {
				dataIndex : 'createTime',
				width : 140,
				align : 'center',
				text : T('Caption.Other.Create Time')
			}, {
				width : 70,
				dataIndex : 'updateUserId',
				text : T('Caption.Other.Update User')
			}, {
				dataIndex : 'updateTime',
				width : 140,
				align : 'center',
				text : T('Caption.Other.Update Time')
			} ],
			viewConfig : {
				getRowClass : function(record, rowIndex, rowParams, store) {
				}
			}
		};
	},
	
	buildSupplement : function() {
		return {
			xtype : 'formsup',

			title : 'Filter Conditions',
			defaults : {
				labelAlign : 'top'
			},
			fields : [ {
				xtype : 'codeview',
				itemId : 'cdvFactory',
				name : 'factory',
				fieldLabel : T('Caption.Other.Factory'),
				codeviewName : 'TbFactory'
//			}, {
//				xtype : 'checkboxfield',
//				fieldLabel : T('Caption.BseOther.submitted'),
//				hideLabel : true,
//				boxLabel : T('Caption.BasOther.submitted')
			} ]
		};
	}
});