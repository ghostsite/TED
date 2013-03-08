/*
 * 2012-07-16 수정 - 김진호
 * supplement 수정
 * RAS Group 화면에 Update 안되는 이유는 설정한 GCM Table 없어서 발생한다.
 * refresh Grid에 select 달고 reloadForm 삭제
 */

Ext.define('BAS.view.setup.FlexibleInquirySetup', {
	extend : 'MES.view.form.BaseFormTabs',

	title : T('Caption.Menu.Flexible Inquiry Setup'),

	requires : [ 'BAS.model.BasUpdateFlexibleConditionIn.list' ],

	payload : {
		submit : true
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateFlexibleCondition.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/basUpdateFlexibleCondition.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/basUpdateFlexibleCondition.json',
		confirm : {
			fields : {
				field1 : 'inquiryId'
			}
		}
	} ],

	initComponent : function() {
		this.store = Ext.create('BAS.store.BasViewFlexibleConditionListOut.inquiryConditionList'), this.callParent();

		var self = this;

		/* 기본 tab추가 */
		var tabpnl = this.getTabPanel();
		tabpnl.add(this.zargumenttab());
		tabpnl.add(this.zsqltab);
		tabpnl.setActiveTab(0);

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.reloadForm(record.data);
			});

			supplement.sub('cdvInquiryGroup').on('change', function(field, value) {
				supplement.refreshGrid(true); // grid 갱신
			});
		});
	},

	checkCondition : function(step, from, addParams) {
		switch (step) {
		case 'btnCreate':
		case 'btnUpdate':
			var store = this.sub('grdArgument').store;
			var rtn = true;
			for ( var i = 0; i < store.getCount(); i++) {
				var data = store.getAt(i).data;
				if (data.prt != '') {
					if (data.fmt == '' || data.size < 1) {
						rtn = false;
					}
				}
			}
			if (rtn === false) {
				Ext.Msg.alert('Error', T('Message.ValidInput', {
					field1 : 'Format/Size'
				}));
				return false;
			}
			break;
		case 'btnDelete':
			break;
		}
		return true;
	},

	reloadForm : function(data, showMsg) {
		if (!showMsg)
			showMsg = false;

		var inquiryId = data.inquiryId || data || '';

		// store load를 사용했을경우
		var form = this.getForm();
		var grdArgument = this.sub('grdArgument');
		var txtSql = this.sub('txtSql');
		function setFormData(record) {
			var rtnData = record.data;
			var gridData = [];
			for ( var i = 1; i <= 10; i++) {
				gridData.push({
					prt : rtnData['prt' + i],
					req : rtnData['req' + i],
					fmt : rtnData['fmt' + i],
					size : rtnData['size' + i],
					tbl : rtnData['tbl' + i]
				});
			}

			form.loadRecord(record);
			grdArgument.store.loadRawData(gridData);
			grdArgument.store.each(function(record) {
				record.commit();
			});
			txtSql.setValue([ rtnData.sql1, rtnData.sql2, rtnData.sql3, rtnData.sql4, rtnData.sql5 ].join(' '));
		}
		this.store.load({
			params : {
				procstep : '1',
				inquiryId : inquiryId
			},
			callback : function(records, operation, success) {
				if (success) {
					if (records.length != 0) {
						setFormData(records[0]);
					}
				}
			},
			scope : this
		});
	},

	onBeforeCreate : function(form, addParams, url) {
		var grid = this.sub('grdArgument');

		var store = grid.store;

		var data = [];
		for ( var i = 0; i < store.getCount(); i++) {
			var record = store.getAt(i);
			if (record.get('prt') != '') {
				data.push({
					prt : record.get('prt'),
					req : record.get('req'),
					fmt : record.get('fmt'),
					size : record.get('size'),
					tbl : record.get('tbl')
				});
			}
		}
		addParams['list'] = data;
	},

	onBeforeUpdate : function(form, addParams, url) {
		var grid = this.sub('grdArgument');
		grid.completeEdit();

		var data = [];

		grid.store.each(function(record) {
			if (record.data.prt != '') {
				data.push(record.data);
			}
		});
		addParams['list'] = data;
	},

	onAfterCreate : function(form, action, success) {
		if (!success)
			return;

		var select = {
			column : 'inquiryId',
			value : this.sub('txtInquiryId').getValue()
		};

		this.getSupplement().refreshGrid(true, select);
		// this.reloadForm(inquiryId);
	},

	onAfterUpdate : function(form, action, success) {
		if (!success)
			return;

		var select = {
			column : 'inquiryId',
			value : this.sub('txtInquiryId').getValue()
		};

		this.getSupplement().refreshGrid(true, select);
		// this.reloadForm(inquiryId);
	},

	onAfterDelete : function(form, action, success) {
		this.getSupplement().refreshGrid(true);
		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});

		var gridData = [];
		for ( var i = 1; i <= 10; i++) {
			gridData.push({
				prt : '',
				req : '',
				fmt : '',
				size : '',
				tbl : ''
			});
		}
		this.sub('grdArgument').store.loadRawData(gridData);
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			fields : {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Inquiry Group'),
				itemId : 'cdvInquiryGroup',
				codeviewName : 'GCM',
				table : 'INQUIRY_GROUP',
				popupConfig : {
					title : T('Caption.Other.Program ID'),
					columns : [ {
						header : T('Caption.Other.Inquiry ID'),
						dataIndex : 'key1',
						flex : 1
					} ]
				},
				fields : [ {
					column : 'key1',
					name : 'inquiryGroup',
					maxLength : 20,
					enforceMaxLength : true,
					flex : 1
				} ]
			},

			grid : {
				procstep : '3',
				store : Ext.create('BAS.store.BasViewFlexibleConditionListOut.inquiryConditionList'),
				columns : [ {
					header : T('Caption.Other.Inquiry ID'),
					dataIndex : 'inquiryId',
					width : 200
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'inquiryDesc1',
					width : 200
				}, {
					header : T('Caption.Other.SQL ID'),
					dataIndex : 'sqlId1',
					width : 200
				} ]
			}
		};
	},

	buildTopPart : function(main) {
		return {
			xtype : 'container',
			itemId : 'zbasic',
			layout : 'anchor',
			defaults : {
				xtype : 'textfield',
				labelSeparator : '',
				labelWidth : 140,
				anchor : '100%'
			},
			items : [ {
				fieldLabel : T('Caption.Other.Inquiry ID'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				maxLength : 30,
				enforceMaxLength : true,
				vtype : 'nospace',
				itemId : 'txtInquiryId',
				name : 'inquiryId'
			}, {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Inquiry Group'),
				allowBlank : false,
				readOnly : true,
				vtype : 'nospace',
				labelStyle : 'font-weight:bold',
				itemId : 'cdvInquiryGroup',
				codeviewName : 'GCM',
				table : 'INQUIRY_GROUP',
				popupConfig : {
					title : T('Caption.Other.Inquiry Group'),
					hearders : [ T('Caption.Other.Inquiry ID'), T('Caption.Other.Description') ]
				},
				name : 'inquiryGroup'
			}, {
				fieldLabel : T('Caption.Other.Inquiry Title'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				maxLength : 50,
				enforceMaxLength : true,
				itemId : 'txtInquiryTitle',
				name : 'inquiryTitle'
			}, {
				fieldLabel : T('Caption.Other.Description'),
				itemId : 'txtDesc',
				maxLength : 1000,
				enforceMaxLength : true,
				name : 'inquiryDesc1'
			} ]
		};
	},

	zargumenttab : function() {
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners : {
				edit : function(editor, e, eOpts) {
					e.grid.getView().refresh();
				}
			}
		});

		return {
			xtype : 'grid',
			title : T('Caption.Other.Arguments'),
			itemId : 'grdArgument',
			columnLines : true,
			cls : 'navyGrid',
			store : Ext.create('Ext.data.Store', {
				model : 'BAS.model.BasUpdateFlexibleConditionIn.list'
			}),
			sortableColumns : false,
			completeEdit : function() {
				cellEditing.completeEdit();
			},
			plugins : [ cellEditing ],
			columns : [ {
				xtype : 'rownumberer',
				align : 'center',
				width : 40
			}, {
				header : T('Caption.Other.Prompt'),
				dataIndex : 'prt',
				editor : {
					xtype : 'textfield',
					vtype : 'nospace'
				},
				flex : 1
			}, {
				header : T('Caption.Other.Require'),
				dataIndex : 'req',
				// tpl : '{req}',
				editor : {
					xtype : 'combobox',
					store : [ [ 'Y', 'Y' ], [ '', 'N' ] ],
					editable : false,
					displayField : 'type',
					valueField : 'value'
				},
				flex : 1
			}, {
				header : T('Caption.Other.Format'),
				dataIndex : 'fmt',
				editor : {
					xtype : 'combobox',
					store : [ [ 'A', 'A : Ascii' ], [ 'N', 'N : Number' ], [ 'F', 'F : Float' ] ],
					editable : false,
					displayField : 'type',
					valueField : 'value'
				},
				renderer : function(value, metaData, record) {
					if (record.get('prt')) {
						return value;
					} else {
						// if(Ext.isEmpty(value))
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
					maxValue : 99,
					maxLength : 2,
					enforceMaxLength : true
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
			}, {
				header : T('Caption.Other.Table'),
				dataIndex : 'tbl',
				editor : {
					xtype : 'textfield',
					vtype : 'nospace'
				},
				flex : 1
			}, {
				// 2012-08-30 김진호 : afterLoad 추가 및 codeview 데이타 추가
				xtype : 'codeviewcolumn',
				itemId : 'cdvTest',
				codeviewName : 'TbGcmTable',
				targetColumn : 'tbl',
				disabledIcon : function(record) {
					if (record.get('prt'))
						return false;
					return true;
				},
				afterLoad : function(store) {
					store.insert(0, [ {
						tableName : '$MATERIAL',
						tableDesc : 'MATERIAL LIST'
					}, {
						tableName : '$FLOW',
						tableDesc : 'FLOW LIST'
					}, {
						tableName : '$OPERATION',
						tableDesc : 'OPERATION LIST'
					}, {
						tableName : '$RESOURCE',
						tableDesc : 'RESOURCE LIST'
					} ]);
				}
			} ]
		};
	},

	zsqltab : {
		xtype : 'textareafield',
		title : 'SQL',
		itemId : 'txtSql',
		name : 'sql1',// sql1~5
		maxLength : 10000,
		enforceMaxLength : true,
		allowBlank : false,
		anchor : '100%'
	}
});