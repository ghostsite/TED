Ext.define('SEC.view.setup.PrvUserSetup.PrivilegeGroup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Privilege Group'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {

		this.callParent();

		var self = this;

		this.sub('grdAllUserList').store.load({
			params : {
				procstep : '1'
			}
		});

		var createSelected = [];
		this.sub('grdAllUserList').on('select', function(rowModel, record, index, opts) {
			createSelected = rowModel.getSelection();
		});
		this.sub('btnCreateUser').on('click', function(button, event, opts) {
			if (!createSelected || !self.sub('grdAllUserList').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < createSelected.length; i++) {
				var params = {
					procstep : 'I',
					userId : createSelected[i].get('userId')
				};
				self.itemAction(self, params);
			}
		});

		var deleteSelected = [];
		this.sub('grdGrpUserList').on('select', function(rowModel, record, index, opts) {
			deleteSelected = rowModel.getSelection();
		});
		this.sub('btnDeleteUser').on('click', function(button, event, opts) {
			if (!deleteSelected || !self.sub('grdGrpUserList').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < deleteSelected.length; i++) {
				var params = {
					procstep : 'D',
					userId : deleteSelected[i].get('userId')
				};
				self.itemAction(self, params);
			}
		});

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.sub('grdGrpUserList').store.load({
					params : {
						procstep : '1',
						nextPrvGrpId : record.get('prvGrpId')
					}
				});
				self.loadRecord(record);
			});

			/*
			 * View가 화면에 표시된 후에 Tools의 버튼을 찾을 수 있음.
			 */
			// self.sub('btnGrpUserRefresh').on('click', function(button, event,
			// opts) {
			// self.refreshGrid(true, 'grdGrpUserList');
			// });
			//
			// self.sub('btnUserListRefresh').on('click', function(button,
			// event, opts) {
			// self.refreshGrid(true, 'grdAllUserList');
			// });
		});
	},

	itemAction : function(self, params) {
		self.getForm().submit({
			params : params,
			url : 'service/secUpdatePrivilegeGroupUser.json',
			success : function(form, action) {
				self.refreshGrid(true, 'grdGrpUserList');
				self.getSupplement().refreshGrid(true);
			},
			failure : function(form, action) {
				self.refreshGrid(true, 'grdGrpUserList');
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
		if (gridId === 'grdGrpUserList')
			params.nextPrvGrpId = this.sub('txtPrvGrpId').getValue();

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
				store : Ext.create('SEC.store.SecViewPrivilegeGroupListOut.List'),
				columns : [ {
					header : T('Caption.Other.Privilege Group'),
					dataIndex : 'prvGrpId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'prvGrpDesc',
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
				fieldLabel : T('Caption.Other.Privilege Group'),
				name : 'prvGrpId',
				labelStyle : 'font-weight:bold',
				itemId : 'txtPrvGrpId',
				labelWidth : 140,
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Description'),
				name : 'prvGrpDesc',
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
				layout : 'fit',
				title : T('Caption.Other.Privilege Group - User Relation'),
				// tools : [ {
				// xtype : 'button',
				// cls : 'btnRefresh',
				// itemId : 'btnGrpUserRefresh',
				// width : 24
				// } ],
				flex : 1,
				items : [ {
					xtype : 'grid',
					itemId : 'grdGrpUserList',
					multiSelect : true,
					selModel : deleteSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewPrivilegeGroupUserListOut.List'),
					columns : [ {
						header : T('Caption.Other.User ID'),
						dataIndex : 'userId',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'userDesc',
						flex : 2
					} ]
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
					itemId : 'btnCreateUser',
					cls : 'btnArrowLeft marginT5 marginB5',
					width : 24
				}, {
					xtype : 'button',
					itemId : 'btnDeleteUser',
					cls : 'btnArrowRight',
					width : 24
				} ]
			}, {
				xtype : 'panel',
				title : T('Caption.Other.All User List'),
				// tools : [ {
				// xtype : 'button',
				// cls : 'btnRefresh',
				// itemId : 'btnUserListRefresh',
				// width : 24
				// } ],
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : [ {
					xtype : 'grid',
					itemId : 'grdAllUserList',
					multiSelect : true,
					selModel : createSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewUserListOut.List', {
						params : {
							procstep : '1'
						}
					}),
					columns : [ {
						header : T('Caption.Other.User ID'),
						dataIndex : 'userId',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'userDesc',
						flex : 2
					} ],
					flex : 1
				} ]
			} ]
		} ];
	}
});
