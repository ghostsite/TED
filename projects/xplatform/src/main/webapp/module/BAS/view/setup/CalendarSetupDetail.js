/**
 * @class BAS.view.setup.CalendarSetupDetail 공장에 적용할 달력의 상세설정.
 * @extends MES.view.form.BaseForm
 * @author Kyunghyang
 */

/*
 * 2012-07-19 수정 - 김진호 supplement treepanel 아이콘 변경 gird edit 변경(이벤트 추가 : col8,
 * col9, col10) checkCondition 추가 onBeforeUpdate 수정 refresh 버튼추가
 */
Ext.require([ 'Ext.ux.grid.CheckColumnMES', 'Ext.ux.grid.CheckColumn' ]);
Ext.define('BAS.view.setup.CalendarSetupDetail', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Calendar Setup (Detail)'),

	// requires : [ 'BAS.model.BasViewCalendarListOut' ],

	payload : {
		submit : true
	},

	buttonsOpt : [ {
		itemId : 'btnUpdate',
		url : 'service/basUpdateCalendarList.json',
		params : {
			procstep : '1'
		}
	} ],

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();

			var tplCalendar = sup.sub('tplCalendar');
			self.setTreeNode(tplCalendar.store);

			tplCalendar.on('itemclick', function(view, record) {
				//if (record.isLeaf()) {
					self.reloadForm();
				//}
			});

			sup.sub('btnRefresh').on('click', function() {
				self.reloadForm();
			});
		});

		// holiday Desc 변경시 holiday = Y, Work Hours = 0 변경
		this.sub('grdGrid').plugins[0].on('edit', function(editor, e) {
			if (e.colIdx == 10) {
				if (Ext.isEmpty(e.value) == false) {
					e.record.set('workHours', '');
					e.record.set('holydayFlag', 'Y');
				}
			}
		});
	},

	reloadForm : function() {
		var data = this.getTreeData();
		if (!data || this.getObjItemLength(data) <= 3) {
			if(this.store.getCount() > 0){
				this.store.removeAll();
			}
			return false;
		}
		
		var params = {
			procstep : '2',
			calendarType : 'F',
			calendarId : data.calendarId,
			year : data.Y,
			month : data.M
		};

		this.store.load({
			params : params,
			callback : function(records, operation, success) {
				if (success) {
					Ext.each(records, function(record) {
						// workHours가 0이면 holydayFlag을 true로 설정한다.(서버에서 안내려조서
						// 클라이언트에서 처리)
						if (record.get('workHours') == 0) {
							record.set('holydayFlag', 'Y');
						}
						record.commit();
					});
				}
			}
		});
	},

	setTreeNode : function(store) {
		var currYear = new Date().getFullYear();
		var yearNodes = [];

		for ( var y = currYear - 5; y <= currYear + 5; y++) {
			var mNode = [];
			for ( var m = 1; m <= 12; m++) {
				mNode.push({
					text : m,
					leaf : true,
					iconCls : 'iconCalendarM',
					nodeType : 'M'
				});
			}
			yearNodes.push({
				text : y,
				nodeType : 'Y',
				iconCls : 'iconCalendarY',
				children : mNode
			});
		}
		
		var caleListStore = Ext.create('BAS.store.BasViewCalendarListOut.calendarList');
		// var caleListStore = Ext.create('BAS.store.BasViewCalendarListOut');
		caleListStore.load({
			params : {
				procstep : '1',
				calendarType : 'W'
			},

			callback : function(records, operation, success) {
				if (!success)
					return false;

				var rootNode = store.getRootNode();
				var fNode = rootNode.getChildAt(0);
				var fNodeInfo = {
					text : SF.login.factory,
					nodeType : 'calendarId'
				};
				var nodef = fNode.appendChild(fNodeInfo);
				nodef.raw = fNodeInfo;

				//yearNodes에 children이 변경되므로 원본을 복사하여 appenChild
				var yNodes = Ext.clone(yearNodes);
				fNode.eachChild(function(child) {
					Ext.Array.each(yNodes, function(y){
						var nodec = child.appendChild(y);
						nodec.raw = y;
					});
				});

				//Work Base Node
				var wNode = rootNode.getChildAt(1);
				Ext.Array.each(records, function(record){
					var wNodeInfo = {
						text : record.get('calendarId'),
						nodeType : 'calendarId'
					};
					
					var nodew = wNode.appendChild(wNodeInfo);
					nodew.raw = wNodeInfo;
				});
				
				var yNodes = Ext.clone(yearNodes);
				wNode.eachChild(function(child) {
					Ext.Array.each(yNodes, function(y){
						var nodec = child.appendChild(Ext.clone(y));
						nodec.raw = y;
					});
				});
			},
			scope : this
		});
	},

	getTreeData : function() {
		var sup = this.getSupplement();
		var tplCalendar = sup.sub('tplCalendar');
		var selectNode = tplCalendar.getSelectionModel().getLastSelected();
		var data = {};

		if (selectNode) {
			var parentNode = selectNode;
			// 자식노드부터 최상위 노드까지 raw값을 apply한다.
			while (!parentNode.isRoot()) {
				if (parentNode.raw) {
					data[parentNode.raw.nodeType] = parentNode.raw.text;
				}
				parentNode = parentNode.parentNode;
			}
		}
		return data;
	},

	getObjItemLength : function(obj) {
		var cnt = 0;
		for ( var i in obj) {
			if (obj.hasOwnProperty(i)) {
				cnt++;
			}
		}

		return cnt;
	},

	checkCondition : function(step, form, addParams) {
		var store = this.sub('grdGrid').store;
		if (store.getUpdatedRecords() == 0) {
			Ext.Msg.alert('Error', T('Message.NotChanged', {
				field1 : T('Caption.Other.Calendar Setup (Detail)')
			}));
			return false;
		}

		return true;
	},

	onBeforeUpdate : function(form, addParams, url) {
		var grid = this.sub('grdGrid');
		grid.completeEdit();

		var data = this.getTreeData();
		if (!data || this.getObjItemLength(data) == 0) {
			return false;
		}

		addParams.procstep = '1';
		addParams.calendarId = data.calendarId;
		if (data.F)
			addParams.calendarType = 'F';
		else if (data.W)
			addParams.calendarType = 'W';
		else
			return false;

		var dayList = [];
		var updateRecs = this.store.getUpdatedRecords();
		for ( var i in updateRecs) {
			var recData = Ext.clone(updateRecs[i].data);
			delete recData.calendarId;
			delete recData.sysDate;
			delete recData.startTime;
			delete recData.julianDay;
			delete recData.day;

			dayList.push(recData);
		}

		addParams.dayList = dayList;

	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			this.reloadForm();
		}
	},

	buildForm : function() {
		// this.store =
		// Ext.create('BAS.store.BasViewCalendarListOut.calendarList');
		this.store = Ext.create('BAS.store.BasViewCalendarListOut.calendarList');
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});

		return {
			xtype : 'grid',
			itemId : 'grdGrid',
			flex : 1,
			sortableColumns : false,
			columnLines : true,
			cls : 'navyGrid noPanelTitle',
			store : this.store,
			layout : 'fit',
			completeEdit : function() {
				cellEditing.completeEdit();
			},
			plugins : [ cellEditing ],
			columns : [ {
				xtype : 'rownumberer'
			}, {
				header : T('Caption.Other.Sys Date'),
				dataIndex : "sysDate",
				tdCls : 'cellGray',
				xtype : 'datecolumn',
				format : 'Y-m-d'
			}, {
				header : T('Caption.Other.Julian Day'),
				dataIndex : "julianDay",
				tdCls : 'cellGray'
			}, {
				header : T('Caption.Other.Year'),
				dataIndex : 'planYear',
				align : 'center',
				editor : {
					xtype : 'textfield',
					readOnly : true
				}
			}, {
				header : T('Caption.Other.Quarter'),
				dataIndex : 'planQuarter',
				align : 'center',
				editor : {
					xtype : 'textfield',
					readOnly : true
				}
			}, {
				header : T('Caption.Other.Month'),
				dataIndex : 'planMonth',
				align : 'center',
				editor : {
					xtype : 'textfield',
					readOnly : true
				}
			}, {
				header : T('Caption.Other.Week'),
				dataIndex : 'planWeek',
				align : 'center',
				editor : {
					xtype : 'textfield',
					readOnly : true
				}
			}, {
				header : T('Caption.Other.Day'),
				dataIndex : 'day',
				align : 'center',
				tdCls : 'cellGray',
				renderer : function(value) {
					var day = '';
					switch (value) {
					case 1:
						day = T('Caption.Other.Monday');
						break;
					case 2:
						day = T('Caption.Other.Tuesday');
						break;
					case 3:
						day = T('Caption.Other.Wednesday');
						break;
					case 4:
						day = T('Caption.Other.Thursday');
						break;
					case 5:
						day = T('Caption.Other.Friday');
						break;
					case 6:
						day = T('Caption.Other.Saturday');
						break;
					case 0:
						day = T('Caption.Other.Sunday');
						break;
					}

					return day;
				}
			}, {
				header : T('Caption.Other.Work Hours'),
				dataIndex : 'workHours',
				align : 'right',
				renderer : function(value) {
					return Ext.Number.toFixed(value, 2);
				},
				editor : {
					xtype : 'numberfield',
					decimalPrecision : 2,
					minValue : 0,
					maxValue : 24,
					step : 0.01
				}
			}, {
				xtype : 'checkcolumnmes',
				header : T('Caption.Other.Holiday'),
				dataIndex : 'holydayFlag',
				inputValue : 'Y',
				uncheckedValue : '',
				width : 60,
				listeners : {
					// checkcolumn 클릭시 workHours 값 0으로 변경
					checkchange : function(me, rowIndex, checked) {
						var store = me.up('grid').store;
						var record = store.getAt(rowIndex);
						if (checked) {
							record.set('workHours', 0);
						}
					}
				}
			}, {
				header : T('Caption.Other.Holiday Desc'),
				dataIndex : 'holydayDesc',
				flex : 1,
				editor : {
					xtype : 'textfield'

				}
			}, {
				header : T('Caption.Other.Shift') + ' 1',
				dataIndex : 'shift1',
				hidden : true,
				editor : {
					xtype : 'textfield'
				}
			}, {
				header : T('Caption.Other.Shift') + ' 2',
				dataIndex : 'shift2',
				hidden : true,
				editor : {
					xtype : 'textfield'
				}
			}, {
				header : T('Caption.Other.Shift') + ' 3',
				dataIndex : 'shift3',
				hidden : true,
				editor : {
					xtype : 'textfield'
				}
			} ]
		};
	},

	buildSupplement : function() {
		return {
			xtype : 'panel',
			flex : 1,
			title : T('Caption.Other.Select Calendar'),
			cls : 'nav supplement',
			bodyStyle : 'padding:5px',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			bbar : [ {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				cls : 'supplementRefresh',
				itemId : 'btnRefresh',
				width : 24
			} ],
			items : [ {
				xtype : 'treepanel',
				itemId : 'tplCalendar',
				flex : 1,
				rootVisible : false,
				store : Ext.create('Ext.data.TreeStore', {
					root : {
						expanded : true,
						children : [ {
							text : 'Factory Base',
							nodeType : 'F'
						}, {
							text : 'Work Base',
							nodeType : 'W'
						} ]
					}
				})
			} ]
		};
	}
});
