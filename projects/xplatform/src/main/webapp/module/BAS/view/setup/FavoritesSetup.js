Ext.define('BAS.view.setup.FavoritesSetup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Menu.Favorites Setup'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();

		var self = this;

		this.sub('cdvPgmId').on('select', function(record) {
			self.setKeys({
				programId : record.get('key1') || ''
			});
		});

		this.sub('cdvFGroup').on('select', function(record) {
			var cdvPgmId = self.sub('cdvPgmId');
			var programId = cdvPgmId.getValue();
			if (Ext.isEmpty(programId)) {
				Ext.Msg.alert('ERROR', T('Message.108'), function() {
					cdvPgmId.getField(0).focus();
				});
				return;
			}
			var funcGroup = record.get('key1') || '';
			self.viewFunctionList(programId, funcGroup);
		});

		this.sub('btnAttach').on('click', function() {
			var sendGrid = self.sub('grdFuncList');
			var receiveGrid = self.sub('grdFavList');

			self.attachItems(sendGrid, receiveGrid, self.checkCondition, self.updateFavorites, self.viewFavoritesList, 'funcName', self);

		});
		this.sub('btnDetach').on('click', function() {
			var sendGrid = self.sub('grdFavList');
			var receiveGrid = self.sub('grdFuncList');

			self.detachItems(sendGrid, receiveGrid, self.checkCondition, self.updateFavorites, self.viewFavoritesList, self);
		});

		this.sub('btnUp').on('click', function() {
			var grid = self.sub('grdFavList');

			self.upItems(grid, self.checkCondition, self.updateFavorites, self.viewFavoritesList, self);
		});
		this.sub('btnDown').on('click', function() {
			var grid = self.sub('grdFavList');

			self.downItems(grid, self.checkCondition, self.updateFavorites, self.viewFavoritesList, self);
		});

		this.sub('btnAlias').on('click', function() {
			var grid = self.sub('grdFavList');

			self.changeItems(grid, self.checkCondition, self.updateFavorites, self.viewFavoritesList, self);
		});

		this.on('keychange', function(view, keys) {
			if (keys) {
				var programId = keys.programId || SF.login.programId;
				var cdvPgmId = self.sub('cdvPgmId');
				if (programId != cdvPgmId.getValue()) {
					cdvPgmId.setValue(programId);
				}

				if (Ext.isEmpty(programId) == false) {
					self.viewFavoritesList();
					self.viewFunctionList(programId, '');
				}
			}
		});

		// 그리드 클릭시 getSelectionModel 해제한다.
		this.sub('grdFavList').on('containerclick', function() {
			this.getSelectionModel().deselectAll();
		});

		this.sub('grdFuncList').on('containerclick', function() {
			this.getSelectionModel().deselectAll();
		});
	},

	viewFavoritesList : function(select) {
		var grdFavList = this.sub('grdFavList');
		var store = grdFavList.store;
		var programId = this.sub('cdvPgmId').getValue();

		store.load({
			params : {
				procstep : '1',
				programId : programId
			},
			callback : function(records, operation, success) {
				if (success) {
					if (Ext.typeOf(select) == 'array') {
						var selectRecords = [];
						Ext.Array.each(select, function(record) {
							var findRecord = store.findRecord('funcName', record.get('funcName'));
							if (findRecord) {
								selectRecords.push(findRecord);
							}
						});

						if (selectRecords.length > 0) {
							grdFavList.getSelectionModel().select(selectRecords);
						}
					}
					if(programId == SF.login.programId){
						Ext.getStore('CMN.store.FavoriteStore').load();
					}
				}
			}
		});
	},

	viewFunctionList : function(programId, funcGroup) {
		var grdFuncList = this.sub('grdFuncList');
		var store = grdFuncList.store;

		store.load({
			params : {
				procstep : '3',
				programId : programId,
				secGrpId : SF.login.group,
				funcGroup : funcGroup||''
			}
		});
	},

	attachItems : function(sendGrid, receiveGrid, checkFn, procFn, reloadFn, prockey, scope) {
		var self = scope;
		var sendSelModel = sendGrid.getSelectionModel();
		var receiveStore = receiveGrid.store;
		var receiveModel = receiveGrid.getSelectionModel();
		var sendSelectRecords = sendSelModel.getSelection();
		var receiveSelectRecords = receiveModel.getSelection();
		var procstep = SF_STEP_CREATE;

		// validations 체크
		if (checkFn.call(self, procstep, sendSelectRecords) == false) {
			return;
		}

		// send grid Select Records 내림차순 정렬
		sendSelectRecords.sort(function(record1, record2) {
			return record2.index - record1.index;
		});

		// receive grid Select Records 오름차순 정렬
		receiveSelectRecords.sort(function(record1, record2) {
			return record1.index - record2.index;
		});

		var seqNum = 0;
		if (receiveSelectRecords.length > 0) {
			seqNum = receiveStore.indexOf(receiveSelectRecords[0]) + 1;
		} else {
			seqNum = receiveStore.getCount() + 1;
		}

		Ext.Array.each(sendSelectRecords, function(record) {
			var key = record.get(prockey);
			var findRecord = receiveStore.findRecord(prockey, key, 0, false, false, true);
			if (findRecord) {
				// 중복데이타 처리
			} else {
				// index를 내림차순해서 같은 seqNum으로 추가하면 오름차순 seqNum 상태로 추가된다.
				var result = procFn.call(self, procstep, record, seqNum);
				if (result.success === false) {
					return false;
				}
			}
		});

		reloadFn.call(self, receiveSelectRecords);
	},

	detachItems : function(sendGrid, receiveGrid, checkFn, procFn, reloadFn, scope) {
		var self = scope;
		var sendStore = sendGrid.store;
		var sendSelModel = sendGrid.getSelectionModel();
		var sendSelectRecords = sendSelModel.getSelection();
		var procstep = SF_STEP_DELETE;

		if (checkFn.call(self, procstep, sendSelectRecords) == false) {
			return;
		}

		// send grid Select Records 오름차순 정렬
		sendSelectRecords.sort(function(record1, record2) {
			return record1.index - record2.index;
		});

		Ext.Array.each(sendSelectRecords, function(record) {
			var seqNum = sendStore.indexOf(record) + 1;
			var result = procFn.call(self, procstep, record, seqNum);
			if (result.success) {
				sendStore.remove(record);
			} else {
				return false;
			}
		});

		reloadFn.call(self);
	},

	upItems : function(grid, checkFn, procFn, reloadFn, scope) {
		var self = scope;
		var store = grid.store;
		var selModel = grid.getSelectionModel();
		var selectRecords = selModel.getSelection();
		var procstep = SF_STEP_UPDATE;

		if (checkFn.call(self, procstep, selectRecords) == false) {
			return;
		}

		// grid Select Records 오름차순 정렬
		selectRecords.sort(function(record1, record2) {
			return record1.index - record2.index;
		});

		Ext.Array.each(selectRecords, function(record) {
			var seqNum = store.indexOf(record);
			if (seqNum > 0) {
				var result = procFn.call(self, procstep, record, seqNum);
				if (result.success === false) {
					return false;
				}
			} else {
				return false;
			}
		});

		reloadFn.call(self, selectRecords);
	},

	downItems : function(grid, checkFn, procFn, reloadFn, scope) {
		var self = scope;
		var store = grid.store;
		var selModel = grid.getSelectionModel();
		var selectRecords = selModel.getSelection();
		var procstep = SF_STEP_UPDATE;

		if (checkFn.call(self, procstep, selectRecords) == false) {
			return;
		}

		// grid Select Records 내림차순 정렬
		selectRecords.sort(function(record1, record2) {
			return record2.index - record1.index;
		});

		Ext.Array.each(selectRecords, function(record) {
			var seqNum = store.indexOf(record) + 2;
			if (seqNum <= store.getCount()) {
				var result = procFn.call(self, procstep, record, seqNum);
				if (result.success === false) {
					return false;
				}
			} else {
				return false;
			}
		});

		reloadFn.call(self, selectRecords);
	},

	changeItems : function(grid, checkFn, procFn, reloadFn, scope) {
		var self = scope;
		var store = grid.store;
		var selModel = grid.getSelectionModel();
		var selectRecords = selModel.getSelection();
		var selectRecord = selectRecords[selectRecords.length - 1];
		// update 이지만 데이타 처리를위해 confirm으로 호출하고 서비스 호출전에 update로 변경한다.
		var procstep = SF_STEP_CONFIRM;

		if (checkFn.call(self, procstep, selectRecords) == false) {
			return;
		}

		var seqNum = store.indexOf(selectRecord) + 1;
		var result = procFn.call(self, procstep, selectRecord, seqNum);
		if (result.success === false) {
			return false;
		}

		reloadFn.call(self, selectRecords);
	},

	updateFavorites : function(procstep, selectRecord, seqNum) {
		var programId = this.sub('cdvPgmId').getValue();
		var txtAlias = this.sub('txtAlias').getValue();
		var funcName = selectRecord.get('funcName');
		var funcDesc = '';

		if (procstep == SF_STEP_CREATE) {
			funcDesc = selectRecord.get('funcDesc');
		} else if (procstep == SF_STEP_DELETE) {
			funcDesc = selectRecord.get('userFuncDesc');
		} else if (procstep == SF_STEP_UPDATE) {
			funcDesc = selectRecord.get('userFuncDesc');
		} else if (procstep == SF_STEP_CONFIRM) {
			funcDesc = txtAlias;
			procstep = SF_STEP_UPDATE;
		}

		var params = {
			procstep : procstep,
			programId : programId,
			funcName : funcName,
			userFuncDesc : funcDesc,
			seqNum : seqNum
		};

		var response = Ext.Ajax.request({
			async : false,
			url : 'service/SecUpdateFavorites.json',
			params : params
		});

		return Ext.JSON.decode(response.responseText);
	},

	checkCondition : function(procstep, selectRecords) {
		var cdvPgmId = this.sub('cdvPgmId');
		if (Ext.isEmpty(cdvPgmId.getValue())) {
			Ext.Msg.alert('Error', T('Message.109'), function() {
				cdvPgmId.focus();
			});
			return false;
		}

		if (selectRecords.length <= 0) {
			if (procstep == SF_STEP_CREATE) {
				Ext.Msg.alert('Error', T('Message.ValidSelect', {
					field1 : T('Caption.Other.Available Function List')
				}));
			} else {
				Ext.Msg.alert('Error', T('Message.ValidSelect', {
					field1 : T('Caption.Other.Favorites Function List')
				}));
			}
			return false;
		}

		if (procstep == SF_STEP_CONFIRM) {
			var txtAlias = this.sub('txtAlias');
			if (Ext.isEmpty(txtAlias.getValue())) {
				Ext.Msg.alert('Error', T('Message.109'), function() {
					txtAlias.focus();
				});
				return false;
			}
		}
	},

	buildForm : function() {
		return [ {
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
					xtype : 'codeview',
					codeviewName : 'ProgramList',
					itemId : 'cdvPgmId',
					name : 'programId',
					fieldLabel : T('Caption.Other.Program ID')
				}, {
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
					store : Ext.create('WIP.store.SecViewFavoritesListOut.list', {
						pageSize : 25
					}),
					columns : [ {
						xtype : 'rownumberer',
						width : 50,
						align : 'center'
					}, {
						header : T('Caption.Other.Function'),
						dataIndex : 'funcName',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'userFuncDesc',
						flex : 2
					} ]
				}, {
					xtype : 'container',
					cls : 'marginT5',
					layout : 'hbox',
					items : [ {
						xtype : 'textfield',
						cls : 'marginR3',
						itemId : 'txtAlias',
						fieldLabel : T('Caption.Other.Alias'),
						flex : 1
					}, {
						xtype : 'button',
						itemId : 'btnAlias',
						width : 40,
						text : T('Caption.Button.OK')

					} ]
				} ]
			}, {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				width : 40,
				items : [  {
					xtype : 'container',
					flex : 1
				},{
					xtype : 'container',
					flex : 1,
					layout : {
						type : 'vbox',
						align : 'center'
					},
					items : [ {
						xtype : 'button',
						itemId : 'btnAttach',
						cls : 'btnArrowLeft marginT7 marginB3',
						width : 24
					}, {
						xtype : 'button',
						itemId : 'btnDetach',
						cls : 'btnArrowRight',
						width : 24
					} ]
				}, {
					xtype : 'container',
					flex : 1,
					layout : {
						type : 'vbox',
						align : 'center'
					},
					items : [ {
						xtype : 'button',
						itemId : 'btnUp',
						cls : 'btnArrowUp marginB5',
						width : 24
					}, {
						xtype : 'button',
						itemId : 'btnDown',
						cls : 'btnArrowDown marginB7',
						width : 24
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
					xtype : 'codeview',
					codeviewName : 'FunctionGroup',
					itemId : 'cdvFGroup',
					name : 'facType',
					fieldLabel : T('Caption.Other.Function Group')
				}, {
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
					store : Ext.create('WIP.store.SecViewFunctionListOut.list'),
					columns : [ {
						header : T('Caption.Other.Function'),
						dataIndex : 'funcName',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'funcDesc',
						flex : 2
					} ]
				} ]
			} ]
		} ];
	}

});