Ext.define('ALM.view.inquiry.ViewAlarmHistory',
		{
			extend : 'MES.view.form.BaseForm',

			requires : [ 'Ext.ux.grid.RowExpander' ],

			title : T('Caption.Menu.View Alarm History'),

			layout : {
				type : 'vbox',
				align : 'stretch'

			},

			buttonsOpt : [ {
				itemId : 'btnExport',
				targetGrid : 'grdData',
				url : 'service/AlmViewAlarmHistoryList.xls'
			}, {
				itemId : 'tbfill'
			} ],

			initComponent : function() {
				this.callParent();

				var self = this;

				this.on('afterrender', function() {
					var supplement = self.getSupplement();

					supplement.on('supplementSelected', function(data) {
						self.refreshDataGrid(self, data);
					});
				});
			},

			refreshDataGrid : function(self, data) {
				if (!data || data.fromTime == '' || data.toTime == '')
					return;

				var params = Ext.clone(data);

				// ShiftDate 계산 및 적용(fromTime~toTime)
				var fromTime = Ext.Date.parse(params.fromTime, "Ymd");
				var toTime = Ext.Date.parse(params.toTime, "Ymd");
				params.fromTime = SF.cf.fromShiftDate(fromTime);
				params.toTime = SF.cf.toShiftDate(toTime);
				if (params.sourceId1 != '') {
					params.procstep = '1';
				} else {
					params.procstep = '2';
				}

				this.sub('grdData').store.proxy.extraParams = params;
				this.sub('grdData').store.load({
					callback : function(records, operation, success) {
						if (!success || !records)
							return;

						self.sub('grdData').lastParams = params;
					}
				});
			},

			onBeforeExport : function(form, addParams, url) {
				var grid = form.sub('grdData');
				if (!grid || !grid.lastParams) {
					return false;
				}

				Ext.apply(addParams, grid.lastParams);
				if (!addParams)
					return false;

				return true;
			},
			buildForm : function() {
				var store = Ext.create('WIP.store.AlmViewAlarmHistoryListOut.alarmList', {
					buffered : true,
					pageSize : 100,
					leadingBufferZone : 300
				});
				return [ {
					xtype : 'grid',
					itemId : 'grdData',
					store : store,
					cls : 'navyGrid',
					columnLines : true,
					minHeight : 150,
					flex : 1,
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
						header : T('Caption.Other.Seq'),
						align : 'center',
						locked : true,
						width : 50
					}, {
						header : T('Caption.Other.Alarm'),
						dataIndex : 'alarmId',
						locked : true
					}, {
						header : T('Caption.Other.Tran Time'),
						dataIndex : 'tranTime',
						locked : true,
						width : 140
					}, {
						header : T('Caption.Other.Alarm Type'),
						dataIndex : 'alarmType',
						renderer : function(v) {
							if (v == 'N')
								return 'Normal';
							else if (v == 'R')
								return 'Resource';
							return v;
						}
					}, {
						header : T('Caption.Other.Resource'),
						dataIndex : 'resId'
					}, {
						header : T('Caption.Other.Res Hist Seq'),
						align : 'center',
						dataIndex : 'resHistSeq'
					}, {
						header : T('Caption.Other.Lot ID'),
						dataIndex : 'lotId'
					}, {
						header : T('Caption.Other.Lot Hist Seq'),
						align : 'center',
						dataIndex : 'lotHistSeq'
					}, {
						header : T('Caption.Other.Alarm Level'),
						align : 'center',
						dataIndex : 'alarmLevelFlag',
						renderer : function(v) {
							if (v == 'E')
								return 'Error';
							else if (v == 'W')
								return 'Warning';
							else if (v == 'I')
								return 'Info';
							return v;
						}
					}, {
						header : T('Caption.Other.Alarm Subject'),
						dataIndex : 'alarmSubject',
						width : 150
					}, {
						header : T('Caption.Other.Alarm Message'),
						dataIndex : 'alarmMsg',
						width : 300
					}, {
						header : T('Caption.Other.Comment'),
						width : 150,
						renderer : function(v, p, rec) {
							var data = rec.data;
							var v = data.alarmComment1;
							for ( var i = 2; i <= 5; i++) {
								if (v != '')
									v = v + '</br>';
								v = v + data['alarmComment' + i];
							}
							return v;
						}
					}, {
						header : T('Caption.Other.PDF File Name'),
						dataIndex : 'pdfFileName'
					}, {
						header : T('Caption.Other.Image File Name'),
						dataIndex : 'imageFileName'
					}, {
						header : T('Caption.Other.Area ID'),
						dataIndex : 'areaId'
					}, {
						header : T('Caption.Other.Ack Flag'),
						dataIndex : 'ackFlag'
					}, {
						header : T('Caption.Other.Ack Time'),
						dataIndex : 'ackTime',
						width : 140
					}, {
						header : T('Caption.Other.Ack User'),
						dataIndex : 'ackUserId'
					}, {
						header : T('Caption.Other.Clear Flag'),
						dataIndex : 'clearFlag'
					}, {
						header : T('Caption.Other.Clear Time'),
						dataIndex : 'clearTime',
						width : 140
					}, {
						header : T('Caption.Other.Clear User'),
						dataIndex : 'clearUserId'
					}, {
						header : T('Caption.Other.Clear Comment'),
						dataIndex : 'clearComment',
						width : 140
					}, {
						header : T('Caption.Other.Source ID 1'),
						dataIndex : 'sourceId1'
					}, {
						header : T('Caption.Other.Source Desc 1'),
						dataIndex : 'sourceDesc1'
					}, {
						header : T('Caption.Other.Source ID 2'),
						dataIndex : 'sourceId2'
					}, {
						header : T('Caption.Other.Source Desc 2'),
						dataIndex : 'sourceDesc2'
					}, {
						header : T('Caption.Other.Source ID 3'),
						dataIndex : 'sourceId3'
					}, {
						header : T('Caption.Other.Source Desc 3'),
						dataIndex : 'sourceDesc3'
					} ]
				} ];
			},

			buildSupplement : function() {
				return {
					xtype : 'formsup',

					fields : [
							{
								xtype : 'dateperiod',
								fieldLabel : T('Caption.Other.Period'),
								labelStyle : 'font-weight:bold',
								defaultValue : Ext.Date.add(new Date(), Ext.Date.DAY, 0),
								period : 7, // 일단위
								allowBlank : false,
								labelAlign : 'top',
								fromName : 'fromTime',
								toName : 'toTime',
								vertical : true
							},
							{
								xtype : 'textfield',
								fieldLabel : T('Caption.Other.Source ID 1'),
								maxLength : 30,
								enforceMaxLength : true,
								labelAlign : 'top',
								vtype : 'nospace',
								itemId : 'txtSource',
								name : 'sourceId1'
							},
							{
								xtype : 'textfield',
								fieldLabel : T('Caption.Other.Lot ID'),
								maxLength : 25,
								enforceMaxLength : true,
								labelAlign : 'top',
								vtype : 'nospace',
								itemId : 'txtLotId',
								name : 'lotId'
							},
							{
								xtype : 'textfield',
								fieldLabel : T('Caption.Other.Resource ID'),
								maxLength : 20,
								enforceMaxLength : true,
								labelAlign : 'top',
								vtype : 'nospace',
								itemId : 'txtResId',
								name : 'resId'
							},
							{
								xtype : 'textfield',
								fieldLabel : T('Caption.Other.Alarm'),
								maxLength : 20,
								enforceMaxLength : true,
								labelAlign : 'top',
								vtype : 'nospace',
								itemId : 'txtAlarmId',
								name : 'alarmId'
							},
							{
								xtype : 'combobox',
								fieldLabel : T('Caption.Other.Alarm Clear Type'),
								editable : false,
								labelAlign : 'top',
								store : [ [ "  ", "&#160;" ], [ "Y", "Y : Only for cleared alarm history" ],
										[ "N", "N : Only for no clear alarm history" ] ],
								displayField : 'type',
								valueField : 'value',
								itemId : 'cmbClearFlag',
								name : 'clearFlag'
							},
							{
								xtype : 'combobox',
								fieldLabel : T('Caption.Other.Alarm Type'),
								editable : false,
								labelAlign : 'top',
								store : [ [ ' ', '&#160;' ], [ 'N', 'N : Normal alarm' ], [ 'R', 'R : Resource alarm' ],
										[ 'A', 'A : Auto gathered alarm by resource' ] ],
								displayField : 'type',
								valueField : 'value',
								itemId : 'cmbAlarmType',
								name : 'alarmType'
							} ]

				};
			}
		});