Ext.define('SEC.view.setup.PrivilegeSetup.PrivilegeType', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Privilege Type'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();

		var self = this;

		var createSelected = [];
		this.sub('grdAllGrpList').on('select', function(rowModel, record, index, opts) {
			createSelected = rowModel.getSelection();
		});
		this.sub('btnCreatePrv').on('click', function(button, event, opts) {
			if (!createSelected || !self.sub('grdAllGrpList').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < createSelected.length; i++) {
				var params = {
					procstep : 'I',
					prvType : createSelected[i].data.prvType,
					prvGrpId : createSelected[i].data.prvGrpId,
					prvItem1 : self.sub('hidPrvItem1').getValue()
				};
				self.itemAction(self, params);
			}
		});

		var deleteSelected = [];
		this.sub('grdGroupList').on('select', function(rowModel, record, index, opts) {
			deleteSelected = rowModel.getSelection();
		});
		this.sub('btnDeletePrv').on('click', function(button, event, opts) {
			if (!deleteSelected || !self.sub('grdGroupList').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < deleteSelected.length; i++) {
				var params = {
					procstep : 'D',
					prvGrpId : deleteSelected[i].data.prvGrpId
				};
				self.itemAction(self, params);
			}
		});

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			self.refreshAllGrpListGrd();

			var cmbPrvType = supplement.sub('cmbPrvType');
			if (cmbPrvType.getValue() === null)
				self.refreshSupplementGrd(supplement, null);

			cmbPrvType.on('select', function(combo, records, opts) {
				self.refreshSupplementGrd(supplement, combo.getValue());
			});

			supplement.on('supplementSelected', function(record) {
				var prvType = record.data.prvType;
				var prvItem1 = record.data.prvItem1;

				self.sub('hidPrvItem1').setValue(prvItem1);
				self.sub('txtPrvType').setValue(prvType);
				self.refreshGrpListGrd(prvType, prvItem1);
			});

			// self.sub('btnLeftRefresh').on('click', function(button, event,
			// opts) {
			// self.refreshGrpListGrd(self.getForm().getFieldValues()['prvType'],
			// self.getForm().getFieldValues()['prvItem1']);
			// });
			//
			// self.sub('btnRightRefresh').on('click', function(button, event,
			// opts) {
			// self.refreshAllGrpListGrd();
			// });
		});
	},

	itemAction : function(self, params) {
		self.getForm().submit({
			params : params,
			url : 'service/secUpdatePrivilege.json',
			success : function(form, action) {
				self.refreshGrpListGrd(form.getFieldValues()['prvType'], form.getFieldValues()['prvItem1']);
			},
			failure : function(form, action) {
				self.refreshGrpListGrd(form.getFieldValues()['prvType'], form.getFieldValues()['prvItem1']);
			}
		});
	},

	refreshSupplementGrd : function(supplement, prvType) {
		var grid = supplement.sub('grdPrvType');
		var params = {};

		if (prvType) {
			params.procstep = '2';
			params.nextPrvType = prvType;

			switch (prvType) {
			case 'FACTORY' : 
				grid.reconfigure(null, [ {
					text : T('Caption.Other.Factory'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					text : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
				} ]);
				break;
			case 'RESOURCE':
				grid.reconfigure(null, [ {
					text : T('Caption.Menu.Resource'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					text : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
				} ]);
				break;
			case 'OPERATION':
				grid.reconfigure(null, [ {
					text : T('Caption.Menu.Operation'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					text : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
				} ]);
				break;
			case 'GCMTABLE':
				grid.reconfigure(null, [ {
					text : T('Caption.Other.Table Name'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					text : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
				} ]);
				break;
			case 'SERVICE':
				grid.reconfigure(null, [ {
					text : T('Caption.Other.Service Name'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					text : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
				} ]);
				break;
			case 'ATTRIBUTE':
				grid.reconfigure(null, [ {
					text : T('Caption.Other.Attribute Name'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					text : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
				} ]);
				break;
			case '　':
				params.procstep = '1';
				params.nextPrvType = '';

				grid.reconfigure(null, [ {
					text : T('Caption.Other.Item'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					text : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
				} ]);
				break;
			}
		} else {
			params.procstep = '1';
		}

		grid.store.load({
			params : params
		});
	},

	refreshGrpListGrd : function(prvType, prvItem) {
		var params = {
			procstep : '1',
			nextPrvType : prvType,
			nextPrvItem1 : prvItem
		};
		var store = this.sub('grdGroupList').store;

		store.load({
			params : params
		});
	},

	refreshAllGrpListGrd : function() {
		this.sub('grdAllGrpList').store.load({
			params : {
				procstep : '1'
			}
		});
	},

	buildHiddenForm : function() {
		return {
			xtype : 'hidden',
			name : 'prvItem1',
			itemId : 'hidPrvItem1'
		};
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			fields : {
				xtype : 'combobox',
				itemId : 'cmbPrvType',
				name : 'nextPrvType',
				editable : false,
				fieldLabel : T('Caption.Other.Type'),
				store : [ '　', 'RESOURCE', 'OPERATION', 'GCMTABLE', 'SERVICE', 'ATTRIBUTE' ,'FACTORY']
			},
			grid : {
				itemId : 'grdPrvType',
				searchField : 'prvItem1',
				store : Ext.create('SEC.store.SecViewPrivilegeListOut.List'),
				columns : [ {
					header : T('Caption.Other.Item'),
					flex : 1,
					dataIndex : 'prvItem1'
				}, {
					header : T('Caption.Other.Description'),
					flex : 1,
					dataIndex : 'prvItemDesc'
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
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Privilege Type'),
			name : 'prvType',
			labelWidth : 130,
			itemId : 'txtPrvType',
			editable : false,
			readOnly : true
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
				title : T('Caption.Other.Assigned Items'),
				// tools : [ {
				// xtype : 'button',
				// cls : 'btnRefresh',
				// itemId : 'btnLeftRefresh',
				// width : 24
				// } ],
				flex : 1,
				items : [ {
					xtype : 'grid',
					itemId : 'grdGroupList',
					columnLines : true,
					multiSelect : true,
					selModel : deleteSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewGroupByTypePrivilegeListOut.list'),
					columns : [ {
						header : T('Caption.Other.Group'),
						dataIndex : 'prvGrpId',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'prvGrpDesc',
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
					itemId : 'btnCreatePrv',
					cls : 'btnArrowLeft marginB5',
					width : 24
				}, {
					xtype : 'button',
					itemId : 'btnDeletePrv',
					cls : 'btnArrowRight',
					width : 24
				} ]
			}, {
				xtype : 'panel',
				title : T('Caption.Other.Availlable Items'),
				layout : 'fit',
				// tools : [ {
				// xtype : 'button',
				// cls : 'btnRefresh',
				// itemId : 'btnRightRefresh',
				// width : 24
				// } ],
				flex : 1,
				items : [ {
					xtype : 'grid',
					itemId : 'grdAllGrpList',
					columnLines : true,
					multiSelect : true,
					selModel : createSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewPrivilegeGroupListOut.list'),
					columns : [ {
						header : T('Caption.Other.Group'),
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