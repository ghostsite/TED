Ext.define('Opc.view.FavoritesSetup', {
	extend : 'Opc.view.BaseForm',

	xtype : 'favsetup',

	title : 'Favorite Setup',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	items : [ {
		xtype : 'container',
		flex : 1,
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'grid',
				itemId : 'grdFavList',
				title : T('Caption.Other.Favorites Function List'),
				flex : 1,
				cls : 'navyGrid',
				multiSelect : true,
				sortableColumns : false,
				enableColumnHide : false,
				enableColumnMove: false,
				selModel : Ext.create('Ext.selection.RowModel', {
					mode : 'MULTI'
				}),
				store : 'SEC.store.SecViewFavoritesListOut.list',
				columns : [ {
					xtype : 'rownumberer',
					width : 50,
					align : 'center'
				}, {
					header : T('Caption.Other.Function'),
					dataIndex : 'funcName',
					width : 150
				}, {
					header : T('Caption.Other.Alias'),
					dataIndex : 'userFuncDesc',
					flex : 1
				} ]
			}, {
				xtype : 'container',
				cls : 'marginT5',
				layout : 'hbox',
				items : [ {
					xtype : 'textfield',
					itemId : 'txtAlias',
					fieldLabel : T('Caption.Other.Alias'),
					flex : 1
				}, {
					xtype : 'button',
					name : 'alias',
					cls : 'marginL5',
					width : 100,
					text : T('Caption.Button.OK')

				} ]
			} ]
		}, {
			xtype : 'container',
			layout : {
				type : 'vbox'
			},
			width : 60,
			items : [ {
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'vbox',
					pack : 'end',
					align : 'center'
				},
				items : [ {
					xtype : 'button',
					name : 'attach',
					cls : 'btnArrowLeft'
				}, {
					xtype : 'button',
					name : 'detach',
					cls : 'btnArrowRight',
					margin : '10 0 0 0'
				} ]
			}, {
				xtype : 'container',
				flex : 1,
				cls: 'arrowUpDownSet',
				layout : {
					type : 'vbox',
					pack : 'end',
					align : 'center'
				},
				items : [ {
					xtype : 'button',
					name : 'up',
					cls : 'btnArrowUp'
				}, {
					xtype : 'button',
					name : 'down',
					cls : 'btnArrowDown',
					margin : '10 0 40 0'
				} ]
			} ]
		}, {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'grid',
				itemId : 'grdFuncList',
				title : T('Caption.Other.Available Function List'),
				flex : 1,
				cls : 'navyGrid',
				multiSelect : true,
				sortableColumns : false,
				enableColumnHide : false,
				enableColumnMove: false,
				selModel : Ext.create('Ext.selection.RowModel', {
					mode : 'MULTI'
				}),
				store : 'SEC.store.SecViewFunctionListOut.list',
				columns : [ {
					header : T('Caption.Other.Function'),
					dataIndex : 'funcName',
					width : 150
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'funcDesc',
					flex : 1
				} ]
			} ]
		} ]
	} ]
});