Ext.define('SEC.view.setup.PrvUserSetup.User', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.User'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {

		this.callParent();

		var self = this;

		this.sub('grdAllPrvGrpList').store.load({
			params : {
				procstep : '1'
			}
		});

		var createSelected = [];
		this.sub('grdAllPrvGrpList').on('select', function(rowModel, record, index, opts) {
			createSelected = rowModel.getSelection();
		});
		this.sub('btnCreatePrvGrp').on('click', function(button, event, opts) {
			if (!createSelected || !self.sub('grdAllPrvGrpList').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < createSelected.length; i++) {
				var params = {
					procstep : 'I',
					prvGrpId : createSelected[i].get('prvGrpId')
				};
				self.itemAction(self, params);
			}
		});

		var deleteSelected = [];
		this.sub('grdPrvGrpList').on('select', function(rowModel, record, index, opts) {
			deleteSelected = rowModel.getSelection();
		});
		this.sub('btnDeletePrvGrp').on('click', function(button, event, opts) {
			if (!deleteSelected || !self.sub('grdPrvGrpList').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < deleteSelected.length; i++) {
				var params = {
					procstep : 'D',
					prvGrpId : deleteSelected[i].get('prvGrpId')
				};
				self.itemAction(self, params);
			}
		});

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.sub('grdPrvGrpList').store.load({
					params : {
						procstep : '2',
						nextUserId : record.get('userId')
					}
				});
				self.loadRecord(record);
			});

			/*
			 * View가 화면에 표시된 후에 Tools의 버튼을 찾을 수 있음.
			 */
//			this.sub('userRelationRefresh').on('click', function(button, event, opts) {
//				self.refreshGrid(true, 'grdPrvGrpList');
//			});
//			this.sub('btnPrvGrpListRefresh').on('click', function(button, event, opts) {
//				self.refreshGrid(true, 'grdAllPrvGrpList');
//			});

		});
	},

	itemAction : function(self, params) {
		self.getForm().submit({
			params : params,
			url : 'service/secUpdatePrivilegeGroupUser.json',
			success : function(form, action) {
				self.refreshGrid(true, 'grdPrvGrpList');
				self.getSupplement().refreshGrid(true);
			},
			failure : function(form, action) {
				self.refreshGrid(true, 'grdPrvGrpList');
				self.getSupplement().refreshGrid(true);
			}
		});
	},

	refreshGrid : function(reload, gridId) {
		var grid = this.sub(gridId);
		var store = grid.store;

		var params = {
			procstep : '1'
		};
		
		if (gridId === 'grdPrvGrpList') {
			params.procstep = '2';
			params.nextUserId = this.sub('txtUserId').getValue();
		}

		if (reload) {
			store.load({
				params : params
			});
		}
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',

			fields : [],

			grid : {
				procstep : '1',
				store : Ext.create('SEC.store.SecViewUserListOut.List'),
				columns : [ {
					header : T('Caption.Other.User ID'),
					dataIndex : 'userId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'userDesc',
					flex : 1
				} ]
			}
		};
	},

	buildForm : function(main) {
		var createSelModel = Ext.create('Ext.selection.RowModel', {
			mode : 'MULTI'
		});
		var deleteSelModel = Ext.create('Ext.selection.RowModel', {
			mode : 'MULTI'
		});

		return [ {
			xtype : 'container',
			layout : 'anchor',
			defaults : {
				labelSeparator : '',
				anchor : '100%'
			},
			items : [ {
				xtype : 'textfield',
				itemId : 'txtUserId',
				fieldLabel : T('Caption.Other.User ID'),
				name : 'userId',
				labelStyle : 'font-weight:bold',
				labelWidth : 140,
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Description'),
				name : 'userDesc',
				labelWidth : 140,
				readOnly : true
			} ]
		}, {
			xtype : 'container',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			flex : 1,
			items : [ {
				xtype : 'panel',
				title : T('Caption.Other.Privilege Group - User Relation'),
//				tools : [ {
//					xtype : 'button',
//					cls : 'btnRefresh',
//					itemId : 'userRelationRefresh',
//					width : 24
//				} ],
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : [ {
					xtype : 'grid',
					itemId : 'grdPrvGrpList',
					multiSelect : true,
					selModel : deleteSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewPrivilegeGroupUserListOut.List'),
					columns : [ {
						header : T('Caption.Other.Privilege Group'),
						dataIndex : 'prvGrpId',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'prvGrpDesc',
						flex : 2
					} ],
					flex : 1
				} ]
			}, {
				xtype : 'container',
				layout : {
					type : 'vbox',
					pack : 'center',
					align : 'center'
				},
				width : 40,
				items : [ {
					xtype : 'button',
					itemId : 'btnCreatePrvGrp',
					cls : 'btnArrowLeft marginT5 marginB5',
					width : 24
				}, {
					xtype : 'button',
					itemId : 'btnDeletePrvGrp',
					cls : 'btnArrowRight',
					width : 24
				} ]
			}, {
				xtype : 'panel',
				title : T('Caption.Other.All Privilege Group List'),
//				tools : [ {
//					xtype : 'button',
//					cls : 'btnRefresh',
//					itemId : 'btnPrvGrpListRefresh',
//					width : 24
//				} ],
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : [ {
					xtype : 'grid',
					itemId : 'grdAllPrvGrpList',
					multiSelect : true,
					selModel : createSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewPrivilegeGroupListOut.List', {
						params : {
							procstep : '1'
						}
					}),
					columns : [ {
						header : T('Caption.Other.Privilege Group'),
						dataIndex : 'prvGrpId',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'prvGrpDesc',
						flex : 2
					} ],
					flex : 1
				} ]
			} ]
		} ];
	}
});