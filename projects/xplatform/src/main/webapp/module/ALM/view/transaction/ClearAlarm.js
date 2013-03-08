Ext.define('ALM.view.transaction.ClearAlarm', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Menu.Clear Alarm'),

	payload : {
		submit : true
	},

	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	buttonsOpt : [ {
		itemId : 'btnExport',
		targetGrid : 'grdAlmHis',
		url : 'service/AlmViewAlarmHistoryList.xls'
	}, {
		itemId : 'tbfill'
	}, {
		itemId : 'btnProcess',
		url : 'service/AlmClearAlarm.json',
		params : {
			procstep : '1'
		}
	} ],

	initComponent : function() {
		this.callParent();
		var self = this;

		this.on('afterrender', function() {

			var btnClear = self.getButtons().sub('btnProcess');
			btnClear.setText(T('Caption.Button.Clear'));

			var supplement = self.getSupplement();
			supplement.on('supplementSelected', function(data) {
				self.reloadForm(self, data);
			});
		});

	},

	reloadForm : function(self, data) {
		delete data.fromTime_date;
		delete data.toTime_date;

		if (data.toTime) {
			toTime = Number(data.toTime) + 1;
			data.toTime = toTime.toString();
		}
		if (data.sourceId1 == '') {
			data['procstep'] = '2'; // source Id가 없을때
		} else {
			data['procstep'] = '1'; // source Id가 있을때
		}

		self.sub('grdAlmHis').store.proxy.extraParams = Ext.clone(data);
		self.sub('grdAlmHis').store.load({
			params : data,
			callback : function(records, operation, success) {
				if (!success || !records)
					return;
				self.sub('grdAlmHis').lastParams = data;
			}
		});
	},

	onBeforeExport : function(form, addParams, url) {
		var grid = form.sub('grdAlmHis');
		if (!grid || !grid.lastParams) {
			return false;
		}

		Ext.apply(addParams, grid.lastParams);
		if (!addParams)
			return false;

		return true;
	},

	checkCondition : function(step) {
		var selectedList = this.sub('grdAlmHis').getSelectionModel().getSelection();
		if (step == 'Process') {
			if (selectedList.length <= 0) {
				return false;
			}
		}
		return true;
	},

	onBeforeProcess : function(form, addParams, url) {
		var self = this;
		var selectedList = self.sub('grdAlmHis').getSelectionModel().getSelection();
		var almList = [];
		if (this.checkCondition('Process') == false)
			return false;

		Ext.Array.each(selectedList, function(record, index) {
			var rd = {};
			rd['sourceId1'] = record.data.sourceId1;
			rd['alarmId'] = record.data.alarmId;
			// 날짜 Format 변경
			rd['tranTime'] = Ext.Date.format(record.data.tranTime, 'YmdHis');
			rd['resId'] = record.data.resId;
			rd['clearComment'] = self.sub('txtClearComment').getValue();
			almList.push(rd);
		});
		addParams['almList'] = almList;
	},

	onAfterProcess : function(form, action, success) {
		var self = this;
		if (success) {
			var supplement = self.getSupplement();
			self.reloadForm(self, supplement.getForm().getValues());
		}
	},

	buildForm : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel');
		var store = Ext.create('WIP.store.AlmViewAlarmHistoryListOut.alarmList', {
			buffered : true
		});
		return [ {
			xtype : 'grid',
			itemId : 'grdAlmHis',
			flex : 1,
			autoScroll : true,
			columnLines : true,
			selModel : selModel,
			cls : 'navyGrid',
			store : store,
			loadMask : true,
			viewConfig : {
				trackOver : false,
				getRowClass : function(record, rowIndex, rowParams, store) {
					if (record.get('clearFlag') == 'Y') {
						return 'textColorRed';
					}
				}
			},
			columns : [ {
				xtype : 'rownumberer',
				align : 'center',
				locked : true,
				width : 50
			}, {
				header : T('Caption.Other.Alarm ID'),
				dataIndex : 'alarmId',
				locked : true,
				width : 100
			}, {
				header : T('Caption.Other.Tran Time'),
				dataIndex : 'tranTime',
				width : 140
			}, {
				header : T('Caption.Other.Alarm Type'),
				dataIndex : 'alarmType',
				align : 'center',
				width : 100
			}, {
				header : T('Caption.Other.Resource'),
				dataIndex : 'resId',
				width : 100
			}, {
				header : T('Caption.Other.Res Hist Seq'),
				dataIndex : 'resHistSeq',
				width : 100
			}, {
				header : T('Caption.Other.Lot ID'),
				dataIndex : 'lotId',
				width : 100
			}, {
				header : T('Caption.Other.Lot Hist Seq'),
				dataIndex : 'lotHistSeq',
				width : 100
			}, {
				header : T('Caption.Other.Alarm Subject'),
				dataIndex : 'alarmSubject',
				width : 100
			}, {
				header : T('Caption.Other.Alarm Message'),
				dataIndex : 'alarmMsg',
				width : 200
			}, {
				header : T('Caption.Other.Area'),
				dataIndex : 'areaId',
				width : 100
			}, {
				header : T('Caption.Other.Sub Area'),
				dataIndex : 'subAreaId',
				width : 100
			}, {
				header : T('Caption.Other.Ack Flag'),
				dataIndex : 'ackFlag',
				width : 100
			}, {
				header : T('Caption.Other.Ack Time'),
				dataIndex : 'ackTime',
				width : 140
			}, {
				header : T('Caption.Other.Ack User'),
				dataIndex : 'ackUserId',
				width : 100
			}, {
				header : T('Caption.Other.Clear Flag'),
				dataIndex : 'clearFlag',
				width : 100
			}, {
				header : T('Caption.Other.Clear Time'),
				dataIndex : 'clearTime',
				width : 140
			}, {
				header : T('Caption.Other.Clear User'),
				dataIndex : 'clearUserId',
				width : 100
			}, {
				header : T('Caption.Other.Clear Comment'),
				dataIndex : 'clearComment',
				width : 100
			}, {
				header : T('Caption.Other.Source ID 1'),
				dataIndex : 'sourceId1',
				width : 100
			}, {
				header : T('Caption.Other.Source Desc 1'),
				dataIndex : 'sourceDesc1',
				width : 100
			}, {
				header : T('Caption.Other.Source ID 2'),
				dataIndex : 'sourceId2',
				width : 100
			}, {
				header : T('Caption.Other.Source Desc 2'),
				dataIndex : 'sourceDesc2',
				width : 100
			}, {
				header : T('Caption.Other.Source ID 3'),
				dataIndex : 'sourceId3',
				width : 100
			}, {
				header : T('Caption.Other.Source Desc 3'),
				dataIndex : 'sourceDesc3',
				width : 100
			} ]
		}, {
			xtype : 'textfield',
			name : 'clearComment',
			itemId : 'txtClearComment',
			cls : 'marginT7',
			fieldLabel : T('Caption.Other.Comment')
		} ];
	},

	buildSupplement : function() {
		return {
			xtype : 'formsup',
			defaults : {
				labelAlign : 'top',
				vtype : 'nospace'
			},
			fields : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Source ID 1'),
				name : 'sourceId1',
				itemId : 'txtSourceId',
				maxLength : 30,
				enforceMaxLength : true
			}, {
				xtype : 'dateperiod',
				fieldLabel : T('Caption.Other.Period'),
				labelStyle : 'font-weight:bold',
				defaultValue : new Date(),
				//TODO : 기간 설정 확인
				period : '1d',
				fromName : 'fromTime',
				toName : 'toTime',
				vertical : true
			}, {
				xtype : 'checkbox',
				cls : 'marginT5',
				boxLabel : T('Caption.Other.Include Cleared Alarm'),
				name : 'clearFlag',
				inputValue : ' ',
				uncheckedValue : 'N'
			} ]
		};
	}

});
