/*
 * 2012-07-17 수정 - 김진호
 * checkCondition size 체크변경
 * copy Table Tab 코드뷰 이벤트 처리추가
 */

Ext.define('BAS.view.setup.GeneralCodeTableSetup', {
	extend : 'MES.view.form.BaseFormTabs',

	title : T('Caption.Menu.General Code Table Setup'),

	/** 모델 정보는 설정을 위해 선행되어야 함. */
	requires : [ 'BAS.model.BasViewTableOut' ],

	/** 폼 조회 서비스의 proxy속성 설정 */
	formReader : {
		url : 'service/basViewTable.json',
		// type : 'json', // 기본 default값임
		model : 'BAS.model.BasViewTableOut'
	// record : 'data' // root 명이 있을경우 설정(서버에서 결정되어 내려옴-subtype)
	// successProperty : 'success' //기본 default 값임.
	},

	/**
	 * payload적용시 설정 : 기본값은 모두 false이며(formload 사용시 선언하지 않아도됨) true 설정시
	 * payload방식으로 실행한다.
	 */
	payload : {
		load : false,
		submit : false
	},

	/**
	 * 하단부 버튼 설정 각 버튼의 서비스명과 param을 설정한다. (추가 동적인 파라메터는 이벤트실행시 onBeforeXXXXXX
	 * 함수에 파람을 추가 설정한다.) 선언한 순서대로 화면에 오른쪽 정렬되어 표시됨다. itemId는 이미 정해져있는 이름을 사용해야하며
	 * 다른이름을 사용시 무시된다. 필수 선언 항목 : itemId, url, params - 필수 선언자이며 값은 string을 가진다.
	 * itemId : btnCreate, btnUpdate, btnDelete, btnVersionup, btnView,
	 * btnProcess, btnClose
	 */
	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateTable.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/basUpdateTable.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/basUpdateTable.json',
		confirm : {
			fields : {
				field1 : 'tableName'
			}
		}
	} ],

	/**
	 * 컨포넌트의 실행시 초기 설정 유의 사항 : callParent의 호출시점을 확인한다. callParent 이전 : 실행 초기에
	 * 가장먼저 선행되어야 하는 작업을 정의 및 설정. ex) this.items = {xtype : 'xxx'} callParent 이후 :
	 * 이벤트 및 화면 호출 이후에 동적으로 변경되거나 추가 실행되어야 하는 작업을 정의 및 설정. ex) this.add({xtype
	 * :'xxx'});
	 */
	initComponent : function() {
		/* callParent 호출 전에 선언할 항목을 선언 한다. */
		this.callParent();
		var self = this;
		var basebuttons = this.sub('basebuttons');
		/* 기본 tab추가 */
		var tabpnl = this.getTabPanel();
		tabpnl.add(this.zgeneraltab); // general tab 추가
		tabpnl.add(this.zcopytabletab());// copy table tab 추가
		tabpnl.setActiveTab(0);

		/* supplement에서 사용하는 선언 및 이벤트는 현재의 폼이 모두 그려지고 난 후 설정 한다. */
		this.on('afterrender', function() {
			// supplement의 정볼 가져온다.
			var supplement = self.getSupplement();

			// supplement 의 grid에서 레코드를 선택시 현재 폼을 조회하는 함수를 설정한다.
			supplement.on('supplementSelected', function(record) {
				self.setKeys({
					tableName : record.data.tableName
				});
			});

			/* supplement내 이벤트 함수 등록 */
			supplement.sub('cdvTableGroup').on('change', function(field, value) {
				supplement.refreshGrid(true); // grid 갱신
			});
		});

		this.on('keychange', function(view, keys) {
			if (!keys)
				return;

			// 사용자 정의 함수 reloadForm를 호출한다.
			self.reloadForm(keys);
		});

		this.sub('grdFieldPrompt').on('afterrender', function() {
			self.sub('grdFieldPrompt').store.loadData(self.initGirdData());
		});

		this.sub('btnCopy').on('click', function(me, e) {
			self.onBtnCopy(self.sub('zcopyTableTab'));
		});

		this.sub('chkUserSqlFlag').on('change', function(me, value) {
			// setDisabled(!value);
			if (value) {
				self.sub('txtQuery').enable();
				self.sub('btnSqlTest').enable();
			} else {
				self.sub('txtQuery').disable();
				self.sub('btnSqlTest').disable();
			}
			var grid = self.sub('grdSql');
			grid.reconfigure(null, []);
		});

		this.sub('cmbTableType').on('change', function(me, val) {
			var refData = [];
			var keyCnt = 2;
			var dataCnt = 10;

			switch (val) {
			case 'E':
			case 'L':
				keyCnt = 10;
				dataCnt = 10;
				break;
			}

			for ( var i = 0; i < keyCnt; i++) {
				if (self.gridDataKey[i] && self.gridDataKey[i].name == 'key' + (i + 1)) {
					refData.push({
						name : 'key' + (i + 1),
						prt : self.gridDataKey[i].prt,
						fmt : self.gridDataKey[i].fmt,
						size : self.gridDataKey[i].size
					});
				} else {
					refData.push({
						name : 'key' + (i + 1),
						prt : '',
						fmt : '',
						size : 0
					});
				}
			}

			for ( var i = 0; i < dataCnt; i++) {
				if (self.gridDataData[i] && self.gridDataData[i].name == 'data' + (i + 1)) {
					refData.push({
						name : 'data' + (i + 1),
						prt : self.gridDataData[i].prt,
						fmt : self.gridDataData[i].fmt,
						size : self.gridDataData[i].size
					});
				} else {
					refData.push({
						name : 'data' + (i + 1),
						prt : '',
						fmt : '',
						size : 0
					});
				}
			}

			self.sub('grdFieldPrompt').store.loadData(refData);
		});

		this.sub('btnSqlTest').on('click', function(me, e) {
			var sql = self.sub('txtQuery').getValue();
			if (!Ext.String.trim(sql))
				return;
			sql = sql.replace(/\$FACTORY/gi, '\'' + SmartFactory.login.factory + '\'');
			self.onBtnSqlTest(sql);
		});
		this.sub('btnSqlTestOk').on('click', function(me, e) {
			var sql = self.sub('txtQuery').getValue();
			var store = self.sub('grdSqlParams').getStore();

			if (sql.indexOf('\$FACTORY') > 0)
				sql = sql.replace(/\$FACTORY/gi, '\'' + SmartFactory.login.factory + '\'');

			for ( var i = 0; i < store.getCount(); i++) {
				var name = new RegExp('\\' + store.getAt(i).data.name, 'g');
				var value = store.getAt(i).data.value;
				sql = sql.replace(name, '\'' + value + '\'');
			}

			self.onBtnSqlTestOk(sql);
		});

		this.sub('cdvFromFactory').on('change', function(me, newValue, oldValue) {
			self.sub('cdvFromTableName').setValue('');
			self.sub('txtToTable').setValue('');
		});

		this.sub('cdvFromTableName').on('change', function(me, newValue, oldValue) {
			self.sub('txtToTable').setValue(newValue);
		});
	},

	initGirdData : function() {
		this.gridDataKey = [];
		this.gridDataData = [];
		for ( var i = 1; i <= 2; i++) {
			this.gridDataKey.push({
				name : 'key' + i,
				prt : '',
				fmt : '',
				size : 0
			});
		}
		for ( var i = 1; i <= 10; i++) {
			this.gridDataData.push({
				name : 'data' + i,
				prt : '',
				fmt : '',
				size : 0
			});
		}
		return Ext.Array.merge(this.gridDataKey, this.gridDataData);
	},

	/** 화면의 조회함수를 구현한다. */
	// supplement 에서 조회 이벤트 발생시 호출 또는 view 버튼 클릭시 동작함.
	reloadForm : function(data, showMsg) {
		if (!showMsg)
			showMsg = false;

		data = data || {};
		if (!data.tableName)
			data.tableName = this.sub('txtTableName').getValue();

		if (this.checkCondition('view', this, data) === false)
			return false;

		this.formLoad({
			tableName : data.tableName,
			procstep : '1'
		}, showMsg);

		this.sub('grdSqlParams').hide();
		this.sub('btnSqlTest').show();
		this.sub('grdSql').reconfigure(null, []);
	},

	checkCondition : function(step, form, addParams) {
		formValues = form.getValues();
		switch (step) {
		case 'view':
			if (!addParams.tableName) {
				Ext.Msg.alert('Error', T('Message.ValidInput', {
					field1 : T('Caption.Other.Table Name')
				}));
				return false;
			}
			break;
		case 'copy':
			if (addParams.fromTableName == '') {
				Ext.Msg.alert('Error', T('Message.ValidInput', {
					field1 : T('Caption.Other.From Table')
				}));
				return false;
			}
			if (!this.sub('txtToTable').validate())
				// Ext.Msg.alert('Error',T('Message.ValidFomat',{field1 :
				// T('Caption.Other.From Table')}));
				return false;
			break;
		case 'btnUpdate':
		case 'btnCreate':
			var store = this.sub('grdFieldPrompt').store;
			var rtn = true;
			if (store.getAt(0).data.prt == '') {
				Ext.Msg.alert('Error', T('Message.ValidInput', {
					field1 : 'key1'
				}));
				return false;
			}
			var msg = '';
			var cnt = 0;

			var plusKeyCnt = 20 - store.getCount();
			for ( var i = 0; i < store.getCount(); i++) {
				var data = store.getAt(i).data;
				if (data.prt != '') {
					cnt++;
					if (data.fmt == '' || data.size < 1) {
						rtn = false;
					} else {
						// store count는 고정 20개가 아니고 key값 row 갯수 + data row 갯수
						// 이므로 sizeCount를 만들어서 체크
						if (formValues.useSqlFlag != 'Y') {
							var sizeCount = i + plusKeyCnt;
							if (formValues.tableType[0] == 'L') {
								if (sizeCount < 10 && data.size > 100) {
									msg = T('Message.310');
									rtn = false;
								} else if (sizeCount >= 10 && data.size > 1000) {
									msg = T('Message.311');
									rtn = false;
								}
							} else {
								if (sizeCount < 10 && data.size > 30) {
									msg = T('Message.130');
									rtn = false;
								} else if (i >= 10 && data.size > 50) {
									msg = T('Message.131');
									rtn = false;
								}
							}
						}
					}
				}
			}
			if (rtn === false) {
				if (msg != '')
					Ext.Msg.alert('Error', msg);
				else
					Ext.Msg.alert('Error', T('Message.ValidInput', {
						field1 : 'Format/Size'
					}));
				return false;
			}
			if (formValues.sql) {
				var index = formValues.sql.toUpperCase().search(/^ FROM /);
				var arr = formValues.sql.substring(index).split(',');
				if (arr.length != cnt) {
					Ext.Msg.alert('Error', T('Message.277'));
					return false;
				}
			}
			break;
		case 'btnDelete':
			break;
		}
		return true;
	},
	addParamsData : function(form, addParmas, url) {
		var gridStore = this.sub('grdFieldPrompt').getStore();
		var nextNo = 0;
		for ( var i = 0; i < 10; i++) {
			var colName = gridStore.getAt(i).data.name;
			if (colName == 'key' + (i + 1)) {
				addParmas[colName + 'Prt'] = gridStore.getAt(i).data.prt;
				addParmas[colName + 'Fmt'] = gridStore.getAt(i).data.fmt;
				addParmas[colName + 'Size'] = gridStore.getAt(i).data.size;
				nextNo++;
			} else {
				addParmas['key' + (i + 1) + 'Prt'] = '';
				addParmas['key' + (i + 1) + 'Fmt'] = '';
				addParmas['key' + (i + 1) + 'Size'] = 0;
			}
		}

		for ( var i = nextNo; i < gridStore.getCount(); i++) {
			var colName = gridStore.getAt(i).data.name;
			addParmas[colName + 'Prt'] = gridStore.getAt(i).data.prt;
			addParmas[colName + 'Fmt'] = gridStore.getAt(i).data.fmt;
			addParmas[colName + 'Size'] = gridStore.getAt(i).data.size;
		}
		addParmas.sql = this.sub('chkUserSqlFlag').getValue() ? this.sub('txtQuery').getValue() : '';
	},

	// 테이블 복사 tab의 복사 버튼 기능
	onBtnCopy : function(form) {
		var self = this;
		var params = {
			procstep : 'C',
			tableName : form.sub('txtToTable').getValue(),
			fromFactory : form.sub('cdvFromFactory').getValue() || SF.login.factory,
			fromTableName : form.sub('cdvFromTableName').getValue()
		};
		if (this.checkCondition('copy', form, params) === false)
			return false;
		var copyValue = form.sub('txtToTable').getValue();
		Ext.MessageBox.confirm(T('Caption.Button.Copy'), T('Message.Copy', {
			field1 : copyValue
		}), function showResult(result) {
			if (result == 'yes') {
				form.submit({
					params : params,
					url : 'service/basCopyTable.json',
					showSuccessMsg : true,
					success : function(form, action) {
						self.setKeys({
							tableName : params.tableName
						});
						self.getSupplement().refreshGrid(true);
						form.getFields().each(function(f) {
							f.setValue(null);
						});
					},
					scop : this
				});
			}
		});
	},

	onBtnSqlTest : function(sql) {
		sql = sql || this.sub('txtQuery').getValue();
		if (!sql)
			return;
		var source = {};
		var regexp = /[^\w+](\$\w+)/g;
		while (true) {
			var $var = regexp.exec(sql);
			if (!$var)
				break;
			source[$var[1]] = '';
		}
		if (sql.indexOf('\$') < 0) {
			return this.onBtnSqlTestOk(sql);
		}

		var argGrid = this.sub('grdSqlParams');
		this.sub('btnSqlTest').hide();
		argGrid.setSource(source);
		argGrid.show();
	},

	onBtnSqlTestOk : function(sql) {
		var self = this;
		this.sub('btnSqlTest').show();
		sql = sql || this.sub('txtQuery').getValue() || ' ';
		if (!Ext.String.trim(sql))
			return '';
		var grid = this.sub('grdSql');
		grid.reconfigure(null, []);

		var store = Ext.create('BAS.store.BasSqlQueryOut');
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
		this.sub('grdSqlParams').hide();
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

	onAfterFormLoad : function(form, response) {
		if (response.result.success == true) {
			var rtnData = response.result.data;
			this.gridDataKey = [];
			this.gridDataData = [];
			var keyCnt = 2;
			var dataCnt = 10;

			switch (rtnData.tableType) {
			case 'E':
			case 'L':
				keyCnt = 10;
				dataCnt = 10;
				break;
			}

			for ( var i = 1; i <= keyCnt; i++) {
				this.gridDataKey.push({
					name : 'key' + i,
					prt : rtnData['key' + i + 'Prt'],
					fmt : rtnData['key' + i + 'Fmt'],
					size : rtnData['key' + i + 'Size']
				});
			}

			for ( var i = 1; i <= dataCnt; i++) {
				this.gridDataData.push({
					name : 'data' + i,
					prt : rtnData['data' + i + 'Prt'],
					fmt : rtnData['data' + i + 'Fmt'],
					size : rtnData['data' + i + 'Size']
				});
			}
			this.sub('grdFieldPrompt').store.loadData(this.gridDataKey.concat(this.gridDataData));
			this.sub('txtQuery').setValue([ rtnData.sql1, rtnData.sql2, rtnData.sql3, rtnData.sql4, rtnData.sql5 ].join(' '));
		}
	},

	onBeforeCreate : function(form, addParmas, url) {
		var tableName = this.sub('txtTableName').getValue();
		if (tableName) {
			this.addParamsData(form, addParmas, url);
			return true;
		} else {
			Ext.Msg.alert(T('Caption.Other.Error'), T('Caption.Other.Table Name') + ' : ' + T('Message.107'));
			return false;
		}
		return false;
	},
	/* 생성 후 행하는 작업을 구현한다. */
	// 생성된 데이터를 조회하여 화면에 표시하고 supplement 의 grid를 갱신한다.
	onAfterCreate : function(form, action, success) {
		if (!success)
			return;

		var tableName = this.sub('txtTableName').getValue();

		this.getSupplement().refreshGrid(true, {
			column : 'tableName',
			value : tableName
		});

		this.setKeys({
			tableName : tableName
		});
	},

	onBeforeUpdate : function(form, addParmas, url) {
		this.addParamsData(form, addParmas, url);
		return true;
	},
	/* 수정 후 행하는 작업을 구현한다. */
	// 수정된 데이터를 조회하여 화면에 표시하고 supplement 의 grid를 갱신한다.
	onAfterUpdate : function(form, action, success) {
		if (!success)
			return;
		var select = {
			column : 'tableName',
			value : this.sub('txtTableName').getValue()
		};
		this.getSupplement().refreshGrid(true, select);
	},

	onBeforeDelete : function(form, addParmas, url) {
		this.addParamsData(form, addParmas, url);
		return true;
	},
	/* 삭제 후 행하는 작업을 구현한다. */
	// 기존에 표시한 데이터를 삭제하고 supplement 의 grid를 갱신한다.
	onAfterDelete : function(form, action, success) {
		if (!success)
			return;
		this.getSupplement().refreshGrid(true);
		this.sub('grdFieldPrompt').store.loadData(this.initGirdData());
		form.getFields().each(function(f) {
			f.setValue(null);
		});
	},

	/* supplement에 표시하는 컨트롤러들을 설정하는 함수이다. */
	// supplement에 만들어진 js를 선언하여 사용하여도 된다.
	// 사용자 구성으로 선언시 아래 함수에 설정하며
	// xtype : mes_view_supplementgridform를 사용하여도 된다.
	buildSupplement : function() {
		return {
			// 이미 선언된 xtype을 사용시 아래처럼 설정한다.
			xtype : 'gridsup',

			autoFormLoad : false,

			// fields 선언은 조회조건을 입력받는 필드들의 설정이다.
			// 미선언시 화면상에 표시되지 않는다.
			fields : {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Table Group'),
				labelSeparator : '',
				anchor : '100%',
				itemId : 'cdvTableGroup',
				codeviewName : 'GcmTableGroup',
				name : 'tableGroup'
			// localFilter : false, //default : false (grid의 local filter설정 여)
			// submitValue : true, // default : true (grid의 조회시 필요한 params에 포함
			// 여부)
			},
			// params 또는 내부 사용 값을 지정할 경우 hidden field로 설정한다.
			hiddenFields : {
				xtype : 'hidden',
				// localFilter : false,
				// submitValue : true,
				value : '',
				name : 'secChkFlag',
				itemId : 'txtSecChkFlag'
			},
			// grid 구성에 필요한 설정 값을 정의한다.
			grid : {
				// procstep : '1', //default 값 '1'
				// searchField : 'tableName', //default columns 1번
				store : Ext.create('BAS.store.BasViewTableListOut.tableList'),
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

	buildTopPart : function() {
		return {
			xtype : 'container',
			itemId : 'zbasic',
			layout : 'anchor',
			defaults : {
				xtype : 'textfield',
				anchor : '100%',
				labelWidth : 140
			},
			items : [ {
				fieldLabel : T('Caption.Other.Table Name'),
				labelStyle : 'font-weight:bold',
				itemId : 'txtTableName',
				allowBlank : false,
				name : 'tableName',
				vtype : 'nospace',
				enforceMaxLength : true,
				maxLength : 20
			}, {
				fieldLabel : T('Caption.Other.Description'),
				itemId : 'txtTableDesc',
				name : 'tableDesc',
				enforceMaxLength : true,
				maxLength : 50
			} ]
		};

	},

	zgeneraltab : {
		xtype : 'container',
		itemId : 'zgeneralTab',
		title : T('Caption.Other.General'),
		// layout : 'anchor', // 텝 내부 스크롤
		layout : {// 그리드만 스크롤
			type : 'vbox',
			align : 'stretch'
		},
		// autoScroll : true,
		// bodyCls : 'scrollXHidden',//scroll 중 가로 스크롤 감춤
		// anchor : '100%',
		cls : 'paddingAll7',
		items : [ {
			xtype : 'container',
			layout : {
				type : 'hbox',
				align : 'top'
			},
			items : [ {
				xtype : 'container',
				flex : 1,
				layout : 'anchor',
				defaults : {
					anchor : '100%',
					labelSeparator : '',
					labelWidth : 130
				},
				cls : 'marginR10',
				items : [ {
					xtype : 'codeview',
					fieldLabel : T('Caption.Other.Table Group'),
					codeviewName : 'GcmTableGroup',
					itemId : 'cdvTableGroup',
					name : 'tableGroup',
					readOnly : true
				}, {
					xtype : 'combobox',
					fieldLabel : T('Caption.Other.Table Type'),
					store : Ext.create('Ext.data.Store', {
						fields : [ 'type', 'value' ],
						data : [ {
							'type' : 'General Table',
							'value' : ''
						}, {
							'type' : 'Extended Table',
							'value' : 'E'
						}, {
							'type' : 'Large Data Table',
							'value' : 'L'
						} ]
					}),
					displayField : 'type',
					valueField : 'value',
					itemId : 'cmbTableType',
					value : '',
					name : 'tableType',
					editable : false
				}, {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Password'),
					name : 'tablePassword',
					inputType : 'password',
					vtype : 'nospace',
					enforceMaxLength : true,
					maxLength : 20
				} ]
			}, {
				xtype : 'container',
				flex : 1,
				layout : 'anchor',
				defaults : {
					inputValue : 'Y'
				},
				items : [ {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Central Flag'),
					name : 'centralFlag',
					itemId : 'chkCentralFlag',
					disabled : true
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.System Table Flag'),
					name : 'sysTblFlag',
					itemId : 'chkSysTblFlag',
					disabled : true,
					cls : 'marginT5'
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Security Check Flag'),
					name : 'secChkFlag',
					cls : 'marginT5'
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Use SQL Query Data'),
					itemId : 'chkUserSqlFlag',
					name : 'useSqlFlag',
					cls : 'marginT5'
				} ]
			} ]
		}, {
			xtype : 'userstamp',
			cls : 'marginT5',
			fieldDefaults : {
				labelWidth : 130
			}
		}, {
			xtype : 'tabpanel',
			flex : 1,
			items : [ {
				xtype : 'grid',
				selType : 'cellmodel',
				autoScroll : true,
				cls : 'navyGrid',
				store : Ext.create('Ext.data.Store', {
					fields : [ 'name', 'prt', 'fmt', 'size' ]
				}),
				title : T('Caption.Other.Field Prompt'),
				itemId : 'grdFieldPrompt',
				sortableColumns : false,
				columnLines : true,
				plugins : Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				}),
				viewConfig : {
					getRowClass : function(record, rowIndex, rowParams, store) {
						var name = record.get('name');
						if (name.indexOf('key') >= 0) {
							return 'cellOrange cellBorderOrange';
						}
					}
				},
				columns : [ {
					xtype : 'rowstatic',
					dataIndex : 'name'
				}, {
					header : T('Caption.Other.Prompt'),
					dataIndex : 'prt',
					editor : {
						xtype : 'textfield',
						// TODO : vtype 재정의 space허용 여부 확인 2012.09.12 KimGJ
						// vtype : 'nospace',
						enforceMaxLength : true,
						maxLength : 20
					},
					flex : 2
				}, {
					header : T('Caption.Other.Format'),
					dataIndex : 'fmt',
					editor : {
						xtype : 'combobox',
						store : [ [ 'A', 'A : Ascii' ], [ 'N', 'N : Number' ], [ 'F', 'F : Float' ] ],
						displayField : 'type',
						valueField : 'value',
						editable : false
					},
					renderer : function(value, metaData, record) {
						if (record.get('prt')) {
							return value;
						} else {
							// if(value != '')
							// record.set('fmt','');
							return '';
						}
					},
					flex : 1
				}, {
					header : T('Caption.Other.Size'),
					dataIndex : 'size',
					editor : {
						xtype : 'numberfield',
						minValue : 0,
						maxValue : 1000
					},
					renderer : function(value, metaData, record) {
						if (record.get('prt')) {
							return value;
						} else {
							// if(Number(value) > 0)
							// record.set('size',0);
							return '';
						}
					},
					flex : 1
				} ]
			}, {
				xtype : 'container',
				title : T('Caption.Other.SQL Query'),
				cls : 'paddingAll5',
				autoScroll : true,
				layout : 'anchor',
				flex : 1,
				items : [ {
					xtype : 'textareafield',
					itemId : 'txtQuery',
					disabled : true,
					grow : true,
					name : 'sql',
					anchor : '100%',
					enforceMaxLength : true,
					maxLength : SF_MAX_INT
				}, {
					xtype : 'button',
					width : 80,
					text : T('Caption.Button.SQL Test'),
					itemId : 'btnSqlTest',
					disabled : true
				}, {
					xtype : 'propertygrid',
					itemId : 'grdSqlParams',
					height : 150,
					// autoScroll : true,
					titleCollapse : true,
					cls : 'navyGrid',
					title : T('Caption.Other.SQL Parameter'),
					hidden : true,
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
					cls : 'navyGrid marginB5',
					minHeight : 150,
					title : T('Caption.Other.Result'),
					titleCollapse : true,
					columnLines : true,
					store : Ext.create('Ext.data.Store', {
						fields : []
					}),
					columns : []
				} ]
			} ]
		} ]
	},
	
	zcopytabletab : function() {
		return {
			xtype : 'form',
			itemId : 'zcopyTableTab',
			title : T('Caption.Other.Copy Table'),
			layout : 'anchor',
			defaults : {
				anchor : '50%',
				labelWidth : 130
			},
			cls : 'paddingAll7',
			items : [ {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.From Factory'),
				codeviewName : 'TbFactory',
				name : 'fromFactory',
				itemId : 'cdvFromFactory',
				submitValue : false
			// copy 버튼 클릭시 사용.
			}, {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.From Table'),
				codeviewName : 'TbGcmTable',
				submitValue : false,
				factoryConditionEnabled : false,
				condition : [ {
					column : 'factory',
					value : function(me) {
						var factory = me.sub('cdvFromFactory').getValue() || SF.login.factory;
						return factory;
					},
					scope : this
				} ],
				name : 'fromTableName',
				itemId : 'cdvFromTableName'
			// copy 버튼 클릭시 사용.
			}, {
				xtype : 'fieldcontainer',
				layout : 'hbox',
				items : [ {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.To Table'),
					cls : 'marginR10',
					name : 'toTable',
					labelWidth : 130,
					itemId : 'txtToTable',
					vtype : 'nospace',
					enforceMaxLength : true,
					maxLength : 20,
					submitValue : false, // copy 버튼 클릭시 사용.
					flex : 1
				}, {
					xtype : 'button',
					itemId : 'btnCopy',
					text : T('Caption.Button.Copy'),
					width : 50
				} ]
			} ]
		};
	}
});