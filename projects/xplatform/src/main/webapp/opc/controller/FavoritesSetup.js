Ext.define('Opc.controller.FavoritesSetup', {
	extend : 'Opc.controller.BaseController',

	views : [ 'FavoritesSetup' ],

	refs : [ {
		selector : 'favsetup',
		ref : 'favSetup'
	}, {
		selector : 'favsetup #grdFuncList',
		ref : 'gridFuncList'
	}, {
		selector : 'favsetup #grdFavList',
		ref : 'gridFavList'
	}, {
		selector : 'favsetup #txtAlias',
		ref : 'textAlias'
	} ],

	init : function() {
		this.control({
			'favsetup' : {
				keychange : this.onKeyChange,
				btnClose : this.onBtnClose
			},
			'favsetup #grdFuncList' : {
				containerclick : this.onFuncListContainerClick
			},
			'favsetup #grdFavList' : {
				containerclick : this.onFavListContainerClick,
				itemclick : this.onFavListItemClick
			},
			'favsetup button[name=attach]' : {
				click : this.onBtnAttachClick
			},
			'favsetup button[name=detach]' : {
				click : this.onBtnDetachClick
			},
			'favsetup button[name=up]' : {
				click : this.onBtnUpClick
			},
			'favsetup button[name=down]' : {
				click : this.onBtnDownClick
			},
			'favsetup button[name=alias]' : {
				click : this.onBtnAliasClick
			}
		});
	},
	
	onKeyChange : function(view, keys) {
		this.viewFavoritesList();
		this.viewFunctionList();
	},

	onBtnAttachClick : function() {
		var sendGrid = this.getGridFuncList();
		var receiveGrid = this.getGridFavList();

		this.attachItems(sendGrid, receiveGrid, this.checkCondition, this.updateFavorites, this.viewFavoritesList, 'funcName', this);
	},
	
	onBtnDetachClick : function() {
		var sendGrid = this.getGridFavList();
		var receiveGrid = this.getGridFuncList();

		this.detachItems(sendGrid, receiveGrid, this.checkCondition, this.updateFavorites, this.viewFavoritesList, this);
	},
	
	onBtnUpClick : function() {
		var grid = this.getGridFavList();

		this.upItems(grid, this.checkCondition, this.updateFavorites, this.viewFavoritesList, this);
	},
	
	onBtnDownClick : function() {
		var grid = this.getGridFavList();

		this.downItems(grid, this.checkCondition, this.updateFavorites, this.viewFavoritesList, this);
	},

	onBtnAliasClick : function() {
		var grid = this.getGridFavList();

		this.changeItems(grid, this.checkCondition, this.updateFavorites, this.viewFavoritesList, this);
	},
	
	onFuncListContainerClick : function(grid) {
		grid.getSelectionModel().deselectAll();
	},
	
	onFavListContainerClick : function(grid) {
		grid.getSelectionModel().deselectAll();
		this.getTextAlias().setValue('');
	},
	
	onFavListItemClick : function(grid, record) {
		this.getTextAlias().setValue(record.get('userFuncDesc'));
	},
	
	viewFavoritesList : function(select) {
		var grdFavList = this.getGridFavList();
		var store = Ext.getStore('SEC.store.SecViewFavoritesListOut.list');

		store.load({
			params : {
				procstep : '1',
				programId : SF.login.programId
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
				}
			}
		});
	},

	viewFunctionList : function() {
		var store = Ext.getStore('SEC.store.SecViewFunctionListOut.list');
		if(store.count() <= 0) {
			store.load({
				params : {
					procstep : '1',
					programId : SF.login.programId,
					secGrpId : SF.login.group,
					funcGroup : ''
				}
			});
		}
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
		var txtAlias = this.getTextAlias().getValue();
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
			programId : SF.login.programId,
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
		
		if(procstep == SF_STEP_CONFIRM){
			var txtAlias = this.getTextAlias();
			if (Ext.isEmpty(txtAlias.getValue())) {
				Ext.Msg.alert('Error', T('Message.109'), function() {
					txtAlias.focus();
				});
				return false;
			}
		}
	}
});