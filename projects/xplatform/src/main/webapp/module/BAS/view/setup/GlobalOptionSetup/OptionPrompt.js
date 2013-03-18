/*
 * 2012-07-16 수정 - 김진호
 * buildSupplement refreshGrid에 select 추가하여 이벤트 발생(reloadForm 삭제)
 * cehckBox readOnly - disabled로 변경
 * onBeforeCreate promptList인 List로 수정
 * cell 색상처리
 */

Ext.define('BAS.view.setup.GlobalOptionSetup.OptionPrompt', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Option Prompt'),

	payload : {
		submit : true
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateGlobalOptionPrompt.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/basUpdateGlobalOptionPrompt.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/basUpdateGlobalOptionPrompt.json',
		confirm : {
			fields : {
				field1 : 'optionName'
			}
		}
	} ],

	initComponent : function() {

		this.callParent();
		this.add(this.zmain);

		var self = this;
		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.loadRecord(record);
				self.bufRecord = record;

				var gridData = [];
				for ( var i = 1; i <= 5; i++) {
					gridData.push({
						valuePmt : record.get('valuePmt' + i),
						valueFmt : record.get('valueFmt' + i),
						valueTbl : record.get('valueTbl' + i)
					});
				}
				self.sub('grdPrompt').store.loadData(gridData);
			});
		});
	},

	onBeforeCreate : function(form, addParams, url) {
		// var gridData;
		// for ( var i = 0; i <= 4; i++) {
		// gridData = this.sub('grdPrompt').store.getAt(i);
		// addParams['valuePmt' + (i + 1)] = gridData.get('valuePmt');
		// addParams['valueFmt' + (i + 1)] = gridData.get('valueFmt');
		// addParams['valueTbl' + (i + 1)] = gridData.get('valueTbl');
		// }

		var grid = this.sub('grdPrompt');

		var store = grid.store;

		var data = [];

		Ext.each(store.getNewRecords(), function(record) {
			if (record.data.valueFmt !== '')
				data.push(record.data);
		});

		Ext.each(store.getUpdatedRecords(), function(record) {
			if (record.data.valueFmt !== '')
				data.push(record.data);
		});

		addParams['promptList'] = data;
	},

	onBeforeUpdate : function(form, addParams, url) {
		var grid = this.sub('grdPrompt');

		var store = grid.store;

		var data = [];

		// var gridData;
		// for ( var i = 0; i <= 4; i++) {
		// var prompt = {};
		// gridData = store.getAt(i);
		// prompt['valuePmt' + (i + 1)] = gridData.get('valuePmt');
		// prompt['valueFmt' + (i + 1)] = gridData.get('valueFmt');
		// prompt['valueTbl' + (i + 1)] = gridData.get('valueTbl');
		// data.push(prompt);
		// }

		Ext.each(store.getNewRecords(), function(record) {
			if (record.data.valueFmt !== '')
				data.push(record.data);
		});
		Ext.each(store.getUpdatedRecords(), function(record) {
			if (record.data.valueFmt !== '')
				data.push(record.data);
		});

		addParams['promptList'] = data;
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'optionName',
				value : form.getValues().optionName
			};

			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'optionName',
				value : form.getValues().optionName
			};

			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterDelete : function(form, action, success) {
		this.getSupplement().refreshGrid(true);
		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});
	},

	onAfterClose : function() {
		this.up().close();
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			grid : {
				procstep : '1',
				store : Ext.create('BAS.store.BasViewGlobalOptionPromptListOut.promptList'),
				columns : [ {
					header : T('Caption.Other.Option Name'),
					dataIndex : 'optionName',
					width : 230,
					renderer : function(value, metaData, record) {
						if (record.get('mesplusFlag') == 'Y') {
							metaData.tdCls = 'textColorBlue';
						}
						return value;
					}
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'optionDesc',
					width : 230,
					renderer : function(value, metaData, record) {
						if (record.get('mesplusFlag') == 'Y') {
							metaData.tdCls = 'textColorBlue';
						}
						return value;
					}
				} ]
			}
		};
	},

	zmain : [ {
		xtype : 'textfield',
		fieldLabel : T('Caption.Other.Option Name'),
		allowBlank : false,
		maxLength : 30,
		enforceMaxLength : true,
		labelWidth : 120,
		labelStyle : 'font-weight:bold',
		name : 'optionName'
	}, {
		xtype : 'textfield',
		fieldLabel : T('Caption.Other.Description'),
		maxLength : 100,
		enforceMaxLength : true,
		labelWidth : 120,
		name : 'optionDesc'
	}, {
		xtype : 'checkbox',
		boxLabel : T('Caption.Other.MESplus Predefined Prompt'),
		name : 'mesplusFlag',
		inputValue : 'Y',
		uncheckedValue : 'N',
		submitValue : false,
		disabled : true,
		margin : '0 0 3 125'
	}, {
		xtype : 'separator'
	}, {
		xtype : 'userstamp'
	}, {
		xtype : 'separator'
	}, {
		xtype : 'grid',
		cls : 'navyGrid borderRL',
		plugins : Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners : {
				edit : function(editor, e, eOpts) {
					e.grid.getView().refresh();
				}
			}
		}),
		itemId : 'grdPrompt',
		columnLines : true,
		sortableColumns : false,
		enableColumnHide : false,
		enableColumnMove : false,
		store : Ext.create('Ext.data.Store', {
			fields : [ {
				name : 'valuePmt',
				type : 'string'
			}, {
				name : 'valueFmt',
				type : 'string'
			}, {
				name : 'valueTbl',
				type : 'string'
			} ],
			data : [ {}, {}, {}, {}, {} ]
		}),
		columns : [ {
			xtype : 'rownumberer',
			align : 'center',
			width : 40
		}, {
			text : T('Caption.Other.Prompt'),
			dataIndex : 'valuePmt',
			flex : 4,
			editor : {
				xtype : 'textfield',
				maxLength : 20,
				enforceMaxLength : true
			}
		}, {
			text : T('Caption.Other.Format'),
			dataIndex : 'valueFmt',
			flex : 1,
			editor : {
				xtype : 'combobox',
				store : [ 'A', 'N' ],
				editable : false
			}
		}, {
			text : T('Caption.Other.Table'),
			dataIndex : 'valueTbl',
			flex : 2
		}, {
			xtype : 'codeviewcolumn',
			codeviewName : 'TbGcmTable',
			targetColumn : 'valueTbl',
			disabledIcon : function(record) {
				if (record.get('valuePmt'))
					return false;
				return true;
			}
		} ]
	} ]
});