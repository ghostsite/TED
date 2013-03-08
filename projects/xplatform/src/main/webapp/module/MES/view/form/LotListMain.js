Ext.define('MES.view.form.LotListMain', {
	extend : 'BaseForm',

	title : T('Caption.Other.Lot List Main'),
	itemId : 'LOTLISTMAIN',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	closable : true,

	buttonsOpt : [ {
		itemId : 'btnExport',
		targetGrid : 'grdLotList',
		url : 'service/WipViewLotListByOperation.xls'
	}, {
		itemId : 'tbfill'
	}, {
		itemId : 'btnView'
	} ],

	buildSupplement : function() {
		return {
			xtype : 'container',
			items : Ext.create('MES.view.form.TranWorkstation', {
				itemId : 'viewWorkStation'
			})
		};
	},

	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},

	initComponent : function() {
		this.store = Ext.create('WIP.store.WipViewLotListByOperationOut.list', {
			pageSize :50,
			buffered : true,
			leadingBufferZone : 0
		});
		this.callParent();
		var self = this;

		this.sub('grdLotList').on('afterrender', function() {
			self.sub('cdvFlow').setDisabled(true, 1);
			if (SF.setting.get('currentOper')) {
				// 화면이 다 그려지고 난 다음 이벤트 실행
				// TODO : 설정 타임 locked일경우 화면 표시 오류임
				// 재확인
				Ext.defer(function() {
					self.refreshGrid();
				}, 100);
			}
		});

		this.store.on('load', function(store, records, success) {
			if (!success){
				return;
			}

			var rawData = store.proxy.reader.rawData;
			var qty1 = rawData.totQty1 || 0;
			var qty2 = rawData.totQty2 || 0;
			var qty3 = rawData.totQty3 || 0;
			var totQty = qty1 + '/' + qty2 + '/' + qty3;
			self.sub('txtTotLot').setValue(rawData.totLotQty);
			self.sub('txtTotQty').setValue(totQty);
		});

		this.sub('grdLotList').on('select', function(rowModel, record, index, opts) {
			SF.gv.gaSelectLotId = rowModel.getSelection();
		});

		this.sub('grdLotList').on('itemclick', function(grid, record) {
			var lotId = record.get('lotId');
			if (lotId) {
				SF.setting.set('currentLotId', lotId);
				var supplement = self.getSupplement();
				var workStation = supplement.sub('viewWorkStation');
				if (workStation){}
					workStation.setWorkStation(record);
				self.loadLotInfo(lotId);
			}
		});

		this.sub('cdvMatId').on('changetext', function(field, newValue, oldValue, index) {
			self.sub('cdvFlow').setValues('');
			if (index == 0) {
				self.sub('cdvFlow').setDisabled(!newValue, 1);
			}
		});

		this.on('destroy', function(me) {
			SF.setting.set('currentOper', '');
			SF.setting.set('currentLotId', '');
			SF.gv.gaSelectLotId = [];
		});
	},

	onAfterView : function() {
		this.refreshGrid();
	},

	refreshGrid : function(params) {
		var grid = this.sub('grdLotList');
		var store = this.store;
		params = params || this.getForm().getValues();
		params.oper = params.oper || SF.setting.get('currentOper') || '';
//		if(!params.oper){
//			store.removeAll();
//			return;
//		}
//			
		var extraParams = {
			procstep : '1',
			matId : params.matId,
			matVer : params.matVer,
			flow : params.flow,
			oper : params.oper
		};

		store.proxy.extraParams = extraParams;
		store.load({
			callback : function(records, operation, success) {
				if (success) {
					grid.lastParams = extraParams;
				}
			}
		});

		var title = SF.setting.get('currentOper') || '[NULL]';
		title = title + ' : ' + T('Caption.Other.Lot List Main By Operation');
		grid.setTitle(title);
	},

	loadLotInfo : function(lotId) {
		if (lotId) {
			this.selectedLotId = lotId;
			this.sub('viewLotInfo').loadLotInfo(lotId);
		}
	},

	setLotInfo : function(data) {
		if (data) {
			this.sub('viewLotInfo').setLotInfo(data);
		}
	},
	getLotInfo : function() {
		return this.sub('viewLotInfo').getLotInfo();
	},

	onBeforeExport : function(form, addParams, url) {
		var grid = form.sub('grdLotList');
		if (!grid || !grid.lastParams) {
			return false;
		}

		Ext.apply(addParams, grid.lastParams);
		if (!addParams)
			return false;

		return true;
	},

	buildForm : function() {
		return [ this.buildConditon(), {
			xtype : 'separator'
		}, {
			xtype : 'container',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			flex : 1,
			items : [ this.buildLotList(), this.buildLotInfo() ]
		} ];
	},

	buildLotList : function() {
		var cols = [ {
			xtype : 'rownumberer',
			header : T('Caption.Other.Seq'),
			align : 'center',
			locked : true,
			width : 50
		}, {
			width : 50,
			locked : true,
			align : 'center',
			renderer : function(value, metaData, record, rowIdx) {
				//TODO image를 class로 바꾸는게 좋을까요? 필요하다면 변경 바랍니다.
				var imgIndex = '0371_16';
				if (record.get("holdFlag") == 'Y') {
					imgIndex = '0019_16'; 
				} else if (record.get("startFlag") == 'Y') {
					imgIndex = '0009_16';
				} else if (record.get("rwkFlag") == 'Y') {
					imgIndex = '0014_16';
				} else if (record.get("nstdFlag") == 'Y') {
					imgIndex = '0013_16';
				} else if (record.get("lastTranCode") == SF_TRAN_CODE_RELEASE) {
					imgIndex = '0020_16'; 
				} else if (record.get("repFlag") == 'Y') {
					imgIndex = '0069_16'; 
				} else if (record.get("endFlag") == 'Y') {
					imgIndex = '0011_16';
				}
				return "<img src = 'image/menuIcon/" + imgIndex + ".png'  width='14' height='14' ></img>";
			}
		}, {
			header : T('Caption.Other.Lot ID'),
			dataIndex : 'lotId',
			locked : true,
			width : 100
		}, {
			header : T('Caption.Other.Material'),
			xtype : 'templatecolumn',
			tpl : '{matId}({matVer})'
		}, {
			header : T('Caption.Other.Flow'),
			xtype : 'templatecolumn',
			tpl : '{flow}({flowSeqNum})',
			width : 80
		}, {
			header : T('Caption.Other.Operation'),
			dataIndex : 'oper',
			width : 60
		}, {
			header : T('Caption.Other.Qty'),
			xtype : 'templatecolumn',
			tpl : '{qty1} / {qty2} / {qty3}'
		}, {
			header : T('Caption.Other.Lot Type'),
			dataIndex : 'lotType',
			width : 50
		}, {
			header : T('Caption.Other.Owner Code'),
			dataIndex : 'ownerCode',
			width : 80
		}, {
			header : T('Caption.Other.Create Code'),
			dataIndex : 'createCode',
			width : 80
		}, {
			header : T('Caption.Other.Priority'),
			dataIndex : 'lotPriority',
			align : 'center',
			width : 60
		}, {
			header : T('Caption.Other.Lot Status'),
			dataIndex : 'lotStatus',
			width : 80
		}, {
			header : T('Caption.Other.Last Tran Code'),
			dataIndex : 'lastTranCode',
			width : 120
		}, {
			header : T('Caption.Other.Last Tran Time'),
			dataIndex : 'lastTranTime',
			width : 120
		} ];

		var title = SF.setting.get('currentOper') || '[NULL]';
		title = title + ' : ' + T('Caption.Other.Lot List Main By Operation');


		var contextMenu = Ext.create('Ext.menu.Menu', {
			items : [ Ext.create('Ext.Action', {
				text : T('Caption.Menu.View Lot History'),
				handler : function(widget, event) {
					SF.doMenu({
						viewModel : 'WIP.view.inquiry.ViewLotHistory'
					});
				}
			}), Ext.create('Ext.Action', {
				text : T('Caption.Menu.Create Lot'),
				handler : function(widget, event) {
					SF.doMenu({
						viewModel : 'WIP.view.transaction.CreateLot'
					});
				}
			}), Ext.create('Ext.Action', {
				text : T('Caption.Menu.Hold Lot'),
				handler : function(widget, event) {
					SF.doMenu({
						viewModel : 'WIP.view.transaction.HoldLot'
					});
				}
			}), Ext.create('Ext.Action', {
				text : T('Caption.Menu.Release Lot'),
				handler : function(widget, event) {
					SF.doMenu({
						viewModel : 'WIP.view.transaction.ReleaseLot'
					});
				}
			}) ]
		});

		return {
			xtype : 'grid',
			flex : 5,
			title : title,
			itemId : 'grdLotList',
			store : this.store,
			columnLines : true,
			columns : cols,
			cls : 'navyGrid',
			multiSelect : true,
			selModel : Ext.create('Ext.selection.RowModel', {
				mode : 'MULTI'
			}),
			viewConfig : {
				listeners : {
					itemcontextmenu : function(view, rec, node, index, e) {
						e.stopEvent();
						contextMenu.showAt(e.getXY());
						return false;
					}
				}
			}
		};
	},
	buildLotInfo : function() {
		var lotInfo = {
			itemId : 'viewLotInfo',
			flex : 3,
			// TODO : 화면 구성 확인
			// hidden : true,
			cls : 'subColumn paddingAll5'
		};

		return Ext.create('MES.view.form.TranLotInfo', lotInfo);
	},
	buildConditon : function() {
		return {
			xtype : 'container',
			cls : 'marginT10',
			layout : {
				type : 'table',
				columns : 3
			},
			defaults : {
				width : 300
			},
			items : [ {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Material'),
				codeviewName : 'TbMaterial',
				itemId : 'cdvMatId',
				name : [ 'matId', 'matVer' ]
			}, {
				xtype : 'displayfield',
				fieldLabel : T('Caption.Other.Total Lot'),
				cls : 'marginL10',
				labelWidth : 150,
				value : 'Total Lot',
				itemId : 'txtTotLot',
				name : 'totLot'
			}, {
				xtype : 'checkbox',
				cls : 'marginL10',
				boxLabel : T('Caption.Other.Auto Refresh'),
				itemId : 'chkAutoRefresh',
				disabled : true,
				name : 'autoRefresh'
			}, {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Flow'),
				codeviewName : 'SvFlowAndSeq',
				params : function(me) {
					var values = me.sub('cdvMatId').getValues();
					var params = {
						procstep : '2',
						matId : values[0] || '',
						matVer : values[1] || ''
					};
					if (values[0] == '') {
						params.procstep = '1';
					}
					return params;
				},
				paramsScope : this,
				itemId : 'cdvFlow',
				name : [ 'flow', 'flowSeqNum' ]
			}, {
				xtype : 'displayfield',
				cls : 'marginL10',
				labelWidth : 150,
				fieldLabel : T('Caption.Other.Total Qty') + ' 1/2/3',
				value : 'Total Qty 1/2/3',
				itemId : 'txtTotQty',
				name : 'totLot'
			} ]
		};
	}
});