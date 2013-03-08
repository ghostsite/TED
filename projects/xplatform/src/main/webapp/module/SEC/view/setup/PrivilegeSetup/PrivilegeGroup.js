Ext.define('SEC.view.setup.PrivilegeSetup.PrivilegeGroup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Privilege Group'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {

		this.callParent();

		var self = this;
		
		this.on('afterrender', function() {
			var supplement = self.getSupplement();
			
			supplement.on('supplementSelected', function(record) {
				self.loadRecord(record);

				self.refreshGrid(true, record, null);
			});

			this.sub('rdoViewMode').on('change', function(check, value) {
				if (!Ext.isArray(value.viewMode)){
					var record = supplement.getSelectedRec();
					if(record){
						self.refreshGrid(true, record, value.viewMode);
					}
				}
			});

			this.sub('cmbPrvType').on('select', function(combo, records, opts) {
				if (combo.getValue()){
					self.refreshAvaillableGrid(combo.getValue());
				}
			});

			this.sub('chkSecChkFlag').on('change', function(field, newValue, oldValue, opts) {
				if (self.sub('cmbPrvType').getValue() === 'SERVICE')
					self.refreshAvaillableGrid('SERVICE');
			});
		});

		var createSelected = [];
		this.sub('grdAvaillableItems').on('select', function(rowModel, record, index, opts) {
			createSelected = rowModel.getSelection();
		});
		this.sub('btnCreateItems').on('click', function(button, event, opts) {
			if (!createSelected || !self.sub('grdAvaillableItems').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < createSelected.length; i++) {
				var params = self.convertField('I', createSelected[i]);
				self.itemAction(self, params);
			}
		});

		var deleteSelected = [];
		this.sub('grdAssignedItems').on('select', function(rowModel, record, index, opts) {
			deleteSelected = rowModel.getSelection();
		});
		this.sub('btnDeleteItems').on('click', function(button, event, opts) {
			if (!deleteSelected || !self.sub('grdAssignedItems').getSelectionModel().lastFocused)
				return;
			for ( var i = 0; i < deleteSelected.length; i++) {
				var params = {
					procstep : 'D',
					prvItem1 : deleteSelected[i].data.prvItem1
				};
				self.itemAction(self, params);
			}
		});
	},

	convertField : function(procstep, field) {
		var params = {
			procstep : procstep
		};
		var prvType = this.sub('cmbPrvType').getValue();

		switch (prvType) {
		case 'FACTORY' :
			params.prvItem1 = field.data.key1;
			break;
		case 'RESOURCE':
			params.prvItem1 = field.data.resId;
			break;
		case 'OPERATION':
			params.prvItem1 = field.data.oper;
			break;
		case 'GCMTABLE':
			params.prvItem1 = field.data.tableName;
			break;
		case 'SERVICE':
			params.prvItem1 = field.data.serviceName;
			break;
		case 'ATTRIBUTE':
			params.prvItem1 = field.data.attrName;
			break;
		}

		return params;
	},

	itemAction : function(self, params) {
		self.getForm().submit({
			params : params,
			url : 'service/secUpdatePrivilege.json',
			success : function(form, action) {
				self.refreshGrid(true, form.getFieldValues()['prvGrpId'], null);
			},
			failure : function(form, action) {
				self.refreshGrid(true, form.getFieldValues()['prvGrpId'], null);
			}
		});
	},

	refreshGrid : function(reload, record, mode) {
		var store = this.sub('grdAssignedItems').store;
		var prvType = this.sub('cmbPrvType').getValue();
		var viewMode = mode === null ? this.sub('rdoViewMode').getValue().viewMode : mode;

		var params = {
			nextPrvGrpId : Ext.isString(record) ? record : record.get('prvGrpId')
		};
		if (viewMode) {
			params.procstep = '5';
		} else if (!viewMode) {
			params.procstep = '4';
			params.nextPrvType = prvType;
		}
		if (reload) {
			store.load({
				params : params,
				callback : function(records){
				}
			});
		}
	},

	refreshAvaillableGrid : function(prvType) {
		var grid = this.sub('grdAvaillableItems');
		var params = {
			secChkFlag : 'Y'
		};
		var checkBox = this.sub('chkSecChkFlag');
		if (checkBox.getValue() !== 'Y' && prvType !== 'SERVICE') {
			checkBox.setValue('Y');
			checkBox.setDisabled(true);
		}
		var store = {};

		switch (prvType) {
		case 'FACTORY' :
			params= {
				procstep : '1',
				select : ['key1', 'data1'],
				table : 'PRV_FACTORY',
				type : 'gcm'
			};
			store = Ext.create('BAS.store.BasViewCodeListOut.list', {
				model : '',
				fields : [{name : 'key1'}, {name : 'data1'}]
			});
			var columns = [ {
				text : T('Caption.Other.Factory'),
				flex : 1,
				dataIndex : 'key1'
			}, {
				text : T('Caption.Other.Description'),
				flex : 1,
				dataIndex : 'data1'
			} ];
			grid.reconfigure(store, columns);
			break;
		case 'RESOURCE':
			params.procstep = '1';

			grid.reconfigure(Ext.create('RAS.store.RasViewResourceListOut.ResList'), [ {
				text : T('Caption.Menu.Resource'),
				flex : 1,
				dataIndex : 'resId'
			}, {
				text : T('Caption.Other.Description'),
				flex : 1,
				dataIndex : 'resDesc'
			} ]);
			store = grid.getStore();
			break;
		case 'OPERATION':
			params.procstep = '1';

			grid.reconfigure(Ext.create('WIP.store.WipViewOperationListOut.List'), [ {
				text : T('Caption.Menu.Operation'),
				flex : 1,
				dataIndex : 'oper'
			}, {
				text : T('Caption.Other.Description'),
				flex : 1,
				dataIndex : 'operDesc'
			} ]);
			store = grid.getStore();
			break;
		case 'GCMTABLE':
			params.procstep = '1';

			grid.reconfigure(Ext.create('BAS.store.BasViewTableListOut.TableList'), [ {
				text : T('Caption.Other.Table Name'),
				flex : 1,
				dataIndex : 'tableName'
			}, {
				text : T('Caption.Other.Description'),
				flex : 1,
				dataIndex : 'tableDesc'
			} ]);
			store = grid.getStore();
			break;
		case 'SERVICE':
			checkBox.setDisabled(false);
			params.procstep = '2';
			params.secChkFlag = checkBox.getValue() ? 'Y' : '';

			grid.reconfigure(Ext.create('MES.store.SvmViewServiceListOut.serviceList'), [ {
				text : T('Caption.Other.Service Name'),
				flex : 1,
				dataIndex : 'serviceName'
			}, {
				text : T('Caption.Other.Description'),
				flex : 1,
				dataIndex : 'serviceDesc1'
			} ]);
			store = grid.getStore();
			break;
		case 'ATTRIBUTE':
			params.procstep = '1';

			grid.reconfigure(Ext.create('BAS.store.BasViewAttributeNameListOut.nameList'), [ {
				text : T('Caption.Other.Attribute Name'),
				flex : 1,
				dataIndex : 'attrName'
			}, {
				text : T('Caption.Other.Description'),
				flex : 1,
				dataIndex : 'attrDesc'
			} ]);
			store = grid.getStore();
			break;
		}

		if (store && params) {
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
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Privilege Group'),
			name : 'prvGrpId',
			labelStyle : 'font-weight:bold',
			labelWidth : 130,
			readOnly : true
		}, {
			xtype : 'combobox',
			itemId : 'cmbPrvType',
			name : 'prvType',
			labelStyle : 'font-weight:bold',
			labelWidth : 130,
			editable : false,
			fieldLabel : T('Caption.Other.Privilege Type'),
			store : [ 'RESOURCE', 'OPERATION', 'GCMTABLE', 'SERVICE', 'ATTRIBUTE' , 'FACTORY']
		}, {
			xtype : 'container',
			layout :  'hbox',
			items : [ {
				xtype : 'label',
				width : 125
			}, {
				xtype : 'radiogroup',
				flex : 1,
				itemId : 'rdoViewMode',
				items : [ {
					boxLabel : T('Caption.Other.All Item'),
					inputValue : true,
					name : 'viewMode',
					checked : true
				}, {
					boxLabel : T('Caption.Other.Each Item'),
					name : 'viewMode',
					inputValue : false
				} ]
			}, {
				xtype : 'checkbox',
				flex : 1,
				cls : 'marginL10',
				itemId : 'chkSecChkFlag',
				boxLabel : T('Caption.Other.Display Security Checked Items'),
				name : 'chkSecChkFlag',
				inputValue : 'Y'
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
				title : T('Caption.Other.Assigned Items'),
				flex : 1,
				items : [ {
					xtype : 'grid',
					itemId : 'grdAssignedItems',
					columnLines : true,
					multiSelect : true,
					selModel : deleteSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewPrivilegeListOut.List'),
					columns : [ {
						header : T('Caption.Other.Privilege Type'),
						dataIndex : 'prvType',
						felx : 1
					}, {
						header : T('Caption.Other.Item'),
						dataIndex : 'prvItem1',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'prvItemDesc',
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
					itemId : 'btnCreateItems',
					cls : 'btnArrowLeft marginB5',
					width : 24
				}, {
					xtype : 'button',
					itemId : 'btnDeleteItems',
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
					itemId : 'grdAvaillableItems',
					columnLines : true,
					multiSelect : true,
					selModel : createSelModel,
					cls : 'navyGrid',
					store : Ext.create('SEC.store.SecViewPrivilegeGroupUserListOut.List'),
					columns : [ {
						header : T('Caption.Other.Item'),
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