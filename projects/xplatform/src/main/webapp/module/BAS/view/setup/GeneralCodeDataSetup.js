/*
 * 2012-07-17 수정 - 김진호
 * reloadForm - reconfigure 수정
 * buildGridColumns - 컬럼크기, 컬럼 색상
 * grid에 beforeedit 이벤트 추가
 * grid key1값 체크추가(checkCondition)
 * add 버튼시 마지막 row 추가로 변경
 */

Ext.define('BAS.view.setup.GeneralCodeDataSetup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Menu.General Code Data Setup'),

	payload : {
		submit : true
	},

	buttonsOpt : [ {
		itemId : 'btnExport',
		targetGrid : 'grdData',
		url : 'service/basViewDataList.xls'
	}, {
		itemId : 'tbfill'
	}, {
		itemId : 'btnUpdate',
		disabled : true,
		url : 'service/basUpdateDataList.json'
	}, {
		itemId : 'btnDelete',
		disabled : true,
		url : 'service/basUpdateDataList.json',
		confirm : {
			msg : T('Message.54')
		}
	} ],

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.items = [ {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			cls : 'marginB5',
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Table Name'),
				name : 'tableName',
				labelWidth : 140,
				itemId : 'txtTableName',
				readOnly : true,
				flex : 1
			}, {
				xtype : 'textfield',
				cls : 'marginL10',
				labelWidth : 140,
				fieldLabel : T('Caption.Other.Password'),
				name : 'tablePassword',
				itemId : 'txtPassword',
				inputType : 'password',
				// vtype : 'nospace',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1,
				hidden : true
			} ]
		}, {
			xtype : 'container',
			itemId : 'cardContainer',
			flex : 1,
			layout : 'card',
			deferredRender : true,
			items : [ this.buildDataSetupPage(this), this.buildSQLQueryPage(this) ]
		} ],

		this.callParent();

		var self = this;

		this.sub('grdData').store.on('load', function(store, records) {
			Ext.each(records, function(record) {
				record.commit();
			});
		});
		var chkHeader = this.sub('grdData').down('headercontainer');
		if(chkHeader){
			chkHeader.on('headerclick', function(ct, header, e, t){
				if(header.isCheckerHd){
					var isChecked = header.el.hasCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
					self.selectedRecords =[];
					 if (!isChecked) {
			                self.selectedRecords = self.sub('grdData').store.getRange();
			            }
				}
			});
		}
		
		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.setKeys({
					tableName : record.get('tableName')
				});
			});

			supplement.sub('cdvTableGroup').on('change', function() {
				supplement.refreshGrid(true);
			});
		});

		this.on('keychange', function(view, keys) {
			if (!keys)
				return;

			self.reloadForm(keys);
		});

		this.down('[itemId=txtQuery]').on('change', function(textarea, value) {
			var sql = value.replace(/\$FACTORY/gi, '\'' + SF.login.factory + '\'');
			var source = {};
			var regexp = /[^\w+](\$\w+)/g;
			while (true) {
				var $var = regexp.exec(sql);
				if (!$var)
					break;
				source[$var[1]] = '';
			}
			if (sql.indexOf('\$') < 0) {
				self.sub('grdSqlParams').hide();
				return self.onBtnSqlTestOk(sql);
			}

			self.sub('grdSqlParams').show();
			self.sub('grdSqlParams').setSource(source);
		});

		this.sub('grdData').store.on('beforeload', function(store, operation, opts) {
			operation.params = operation.params || {};
			operation.params['procstep'] = '1';
			operation.params['tableName'] = self.sub('txtTableName').getSubmitValue();
		});

		this.sub('btnSqlTestOk').on('click', function(me, e) {
			var sql = self.sub('txtQuery').getValue();
			var store = self.sub('grdSqlParams').getStore();

			if (sql.indexOf('\$FACTORY') > 0)
				sql = sql.replace(/\$FACTORY/gi, '\'' + SF.login.factory + '\'');

			for ( var i = 0; i < store.getCount(); i++) {
				var name = new RegExp('\\' + store.getAt(i).data.name, 'g');
				var value = store.getAt(i).data.value;
				sql = sql.replace(name, '\'' + value + '\'');
			}

			self.onBtnSqlTestOk(sql);
		});

		// type이 key이고 기존에 불러온 컬럼은 edit 할 수 없다.
		// type이 value이고 새로 추가된 row는 edit 하 수 있다.
		this.sub('grdData').plugins[0].on('beforeedit', function(editor, e) {
			if (e.column.codeType == 'key' && e.record.phantom == false) {
				return false;
			}
		});
	},

	onBeforeExport : function(form, addParams, url) {
		var grid = this.sub('grdData');
		if (!grid || !grid.lastParams)
			return false;
		var btnExport = this.sub('basebuttons').getItem('btnExport');
		var tableName = this.sub('txtTableName').getValue();
		btnExport.title = this.title+'-'+tableName;
		Ext.apply(addParams, grid.lastParams);
	},

	onBeforeUpdate : function(form, addParams, url) {
		var grid = this.sub('grdData');
		grid.completeEdit();

		var data = [];
	
		//TODO 수정중....체크박스 선택한것만 수정적용여부 재확인
		//변경된 데이터 체크여부와 관계없이 수정적용
//		var store = grid.store;
//		Ext.each(store.getNewRecords(), function(record) {
//			var rd = record.data;
//
//			delete rd.createUserId;
//			delete rd.createTime;
//			delete rd.updateUserId;
//			delete rd.updateTime;
//
//			data.push(rd);
//		});
//		Ext.each(store.getUpdatedRecords(), function(record) {
//			var rd = record.data;
//
//			delete rd.createUserId;
//			delete rd.createTime;
//			delete rd.updateUserId;
//			delete rd.updateTime;
//
//			data.push(rd);
//		});

		// 체크 된 레코드만 수정적용
		var selectedRecs = grid.getSelectionModel().getSelection();		
		Ext.each(selectedRecs, function(record){
			var rd = record.data;
			delete rd.createUserId;
			delete rd.createTime;
			delete rd.updateUserId;
			delete rd.updateTime;
			data.push(rd);
		});
		
		addParams['dataList'] = data;
	},

	onAfterUpdate : function(form, action, success) {
		if (!success)
			return;
		this.sub('grdData').store.load();
		this.sub('basebuttons').disabledItem('btnUpdate', true);
		this.selectedRecords = [];
	},

	onBeforeDelete : function(form, addParams, url) {
		var grid = this.sub('grdData');
		var checkedRows = grid.getSelectionModel().getSelection();
		var removes = [];
		Ext.each(checkedRows, function(row) {
			var rd = row.data;

			delete rd.createUserId;
			delete rd.createTime;
			delete rd.updateUserId;
			delete rd.updateTime;

			removes.push(rd);
		});

		addParams['dataList'] = removes;
	},

	onAfterDelete : function(form, action, success) {
		if (!success)
			return;
		this.sub('grdData').store.load();
		this.sub('basebuttons').disabledItem('btnUpdate', true);
		this.selectedRecords = [];
	},

	reloadForm : function(record) {
		this.getForm().setValues(record);

		var tableName = record.tableName;

		var params = {
			procstep : 1,
			tableName : tableName
		};
		/*
		 * GCM Table의 명세를 가져와서, 그리드를 새로 정의한다.
		 */
		Ext.Ajax.request({
			url : 'service/basViewTable.json',
			method : 'GET',
			params : params,
			success : function(response, opts) {
				var tableSpec = Ext.JSON.decode(response.responseText);
				var grid = this.sub('grdData');

				if (tableSpec.tablePassword) {
					this.sub('txtPassword').setVisible(true);
				} else {
					this.sub('txtPassword').setVisible(false);
				}
				this.sub('basebuttons').disabledItem('btnUpdate', true);
				this.selectedRecords = [];
				if (tableSpec.useSqlFlag === 'Y') {
					this.sub('cardContainer').getLayout().setActiveItem('zsqlTestPage');
					this.sub('txtQuery').setValue([ tableSpec.sql1, tableSpec.sql2, tableSpec.sql3, tableSpec.sql4, tableSpec.sql5 ].join(' '));
				} else {
					this.sub('cardContainer').getLayout().setActiveItem('zdataSetupPage');
					var columns = this.buildGridColumns(tableSpec);
					// reconfigure 하기전에 store 데이타를 초기화 한다.
					grid.store.removeAll();
					grid.reconfigure(grid.store, columns);
					grid.store.load();
				}

				// Export시 필요한 params값 저장
				grid.lastParams = params;
			},
			scope : this
		});
	},

	onBtnSqlTestOk : function(sql) {
		var self = this;
		sql = sql || this.sub('txtQuery').getValue();
		if (!Ext.String.trim(sql))
			return '';
		var grid = this.sub('grdSql');
		grid.reconfigure(null, []);

		var store = Ext.create('BAS.store.BasSqlQueryOut', {
			//TODO : 
			pageSize : 1000
		});
		store.load({
			params : {
				procstep : '1',
				sql : sql
			},
			scope : self,
			callback : function(records, operation, success) {
				var result = records[0];
				if (success && result.get('columns').length > 0) {
					self.sqlGridLoadData(result.get('columns'), result.get('rows'));
				} else {
					grid.reconfigure(null, []);
				}
			}
		});
	},

	sqlGridLoadData : function(colList, rows) {
		if (!colList)
			return;

		var grid = this.sub('grdSql');
		var data = [];
		var columns = [];
		var grdFields = grid.store.model.prototype.fields;

		for ( var i in colList) {
			columns.push({
				header : colList[i].name,
				dataIndex : colList[i].name,
				flex : 1
			});
			grdFields.add({
				name : colList[i].name,
				type : 'string'
			});
		}

		grid.reconfigure(null, columns);
		for ( var i in rows) {
			var record = {};
			for ( var j in colList) {
				if (rows[i].cols[j] && rows[i].cols[j].data)
					record[colList[j].name] = rows[i].cols[j].data;
			}
			data.push(record);
		}
		grid.store.loadData(data);
	},

	checkCondition : function(step, form, addParams) {
		var bCheck = true;
		if (step == 'btnUpdate') {
			// 체크 된 레코드만 수정적용
			var selectedRecs = this.sub('grdData').getSelectionModel().getSelection();	
			Ext.Array.each(selectedRecs, function(record) {
				if (Ext.isEmpty(record.get('key1'))) {
					Ext.Msg.alert('Error', T('Message.108'));
					bCheck = false;
					return false;
				}
			});
			// 수정된 내용만 적용할 경우
//			var store = this.sub('grdData').store;
//			Ext.Array.each(store.data.items, function(record) {
//				if (Ext.isEmpty(record.get('key1'))) {
//					Ext.Msg.alert('Error', T('Message.108'));
//					bCheck = false;
//					return false;
//				}
//			});
		}

		return bCheck;
	},

	buildGridColumns : function(tableSpec) {
		function buildColumn(type, idx) {
			/*
			 * type : 'key' or 'data', idx : 1..10
			 */
			var dataIndex = type + idx;
			var columnText = tableSpec[dataIndex + 'Prt'];
			if (!columnText)
				return;
			var size = tableSpec[dataIndex + 'Size'];
			var fmt = tableSpec[dataIndex + 'Fmt'];
			// var columnWidth = parseInt(size);
			var columnFlex = 1;
			var columnEditor = {};
			var rendererFn = Ext.emptyFn;

			columnEditor.maxLength = size;
			switch (fmt) {
			case 'A':
				columnEditor.xtype = 'textfield';
				// columnEditor.vtype = 'nospace';
				columnEditor.maxLength = size;
				break;
			case 'N':
				columnEditor.xtype = 'numberfield';
				columnEditor.vtype = 'numbers';
				columnEditor.maxValue = SF_MAX_INT;
				break;
			case 'F':
				columnEditor.xtype = 'numberfield';
				columnEditor.vtype = 'floats';
				columnEditor.maxValue = SF_MAX_INT;
				break;
			}
			columnEditor.flex = 1;
			if (type == 'key') {
				// key type : flex 1
				columnFlex = 1;

				// columnEditor.allowBlank = false;
				// columnEditor.readOnly = true;

				rendererFn = function renderer(value, metaData, record) {
					// 새로 추가된 row의 색상변경
					if (record.phantom) {
						metaData.tdCls = 'cellGray';
					} else {
						metaData.tdCls = 'cellBlue';
					}

					return value;
				};
			} else {
				// data type : flex 2
				columnFlex = 2;
				// Ext.util.Format.htmlEncode
				rendererFn = 'htmlEncode';
			}

			var retColumn = {
				xtype : 'gridcolumn',
				dataIndex : dataIndex,
				text : columnText,
				flex : columnFlex || 1,
				codeType : type, /* key, data 구분용 값 추가 */
				editor : columnEditor
			};

			if (rendererFn != Ext.emptyFn) {
				retColumn.renderer = rendererFn;
			}

			return retColumn;
		}

		var columns = [ {
			xtype : 'rownumberer',
			/*
			 * FIXME export시 이상한 문자가 들어가 space 2칸으로 설정
			 */
			header : '  ',
			width : 40
		} ];

		for ( var i = 1; i <= 10; i++) {
			var column = buildColumn('key', i);
			if (!column)
				break;
			columns.push(column);
		}
		for (i = 1; i <= 10; i++) {
			var column = buildColumn('data', i);
			if (!column)
				break;
			columns.push(column);
		}

		return columns;
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',

			autoFormLoad : false,

			fields : [ {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Table Group'),
				itemId : 'cdvTableGroup',
				codeviewName : 'GcmTableGroup',
				name : 'tableGroup'
			} ],
			hiddenFields : {
				xtype : 'hidden',
				itemId : 'hidSecChkFlag',
				name : 'secChkFlag',
				value : ''
			},
			grid : {
				store : Ext.create('BAS.store.BasViewTableListOut.TableList'),
				columns : [ {
					header : T('Caption.Other.Table Name'),
					dataIndex : 'tableName',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'tableDesc',
					flex : 1
				} ]
			}
		};
	},

	buildDataSetupPage : function(main) {
		main.selectedRecords =[];
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			listeners : {
				selectionchange : function(sm, selections) {
					var flag = selections.length > 0 ? false : true;
					main.sub('basebuttons').disabledItem('btnUpdate', flag);
					main.sub('basebuttons').disabledItem('btnDelete', flag);
				}
			}
		});
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners : {
				edit : function(editor,e){
					var selRecs = main.selectedRecords;
					if(e.originalValue != e.value)
						selRecs.push(e.record);
					selModel.select(selRecs);
				}
			}
		});

		return {
			xtype : 'container',
			itemId : 'zdataSetupPage',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'grid',
				listeners : {
					cellclick : function(table, td, cellIndex, rec, tr, rowIndex, e ){
						if(cellIndex == 0){
							var findIndex = -1;
							main.selectedRecords = Ext.Array.filter(main.selectedRecords, function(e,i,a){
								if(e == rec)
									findIndex = i;
								return !(e == rec);
							}, this);
							if(findIndex < 0){
								main.selectedRecords.push(rec);
							}
						}
						else{
							selModel.select(main.selectedRecords);
						}
					}
				},
				itemId : 'grdData',
				flex : 1,
				columnLines : true,
				selModel : selModel,
				cls : 'navyGrid',
				store : Ext.create('BAS.store.BasViewDataListOut.DataList', {
					//TODO
					pageSize : 1000
				}),
				columns : [ {
					xtype : 'rownumberer',
					width : 40
				} ],
				tbar : [ {
					text : T('Caption.Button.Add'),
					handler : function() {
						var store = main.sub('grdData').store;
						var cnt = store.getCount();
						store.insert(cnt, {});
						cellEditing.startEditByPosition({
							row : cnt,
							column : 2
						});
					}
				} ],
				completeEdit : function() {
					cellEditing.completeEdit();
				},
				plugins : [ cellEditing ]
			} ]
		};
	},

	buildSQLQueryPage : function(main) {
		return {
			xtype : 'container',
			itemId : 'zsqlTestPage',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'textarea',
				fieldLabel : T('Caption.Other.SQL Query'),
				itemId : 'txtQuery',
				disabled : true,
				labelWidth : 140,
				name : 'sql1',
				height : 100
			}, {
				xtype : 'propertygrid',
				itemId : 'grdSqlParams',
				titleCollapse : true,
				cls : 'navyGrid',
				title : T('Caption.Other.SQL Parameter'),
				source : {},
				dockedItems : {
					xtype : 'toolbar',
					dock : 'bottom',
					ui : 'footer',
					items : [ {
						xtype : 'button',
						width : 80,
						text : T('Caption.Button.OK'),
						itemId : 'btnSqlTestOk'
					} ]
				}
			}, {
				xtype : 'grid',
				itemId : 'grdSql',
				columnLines : true,
				cls : 'navyGrid',
				title : T('Caption.Other.Result'),
				titleCollapse : true,
				flex : 1,
				store : Ext.create('Ext.data.Store', {
					fields : []
				}),
				columns : []
			} ]
		};
	}
});