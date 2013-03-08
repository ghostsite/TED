/**
 * @class BAS.view.setup.GlobalOptionSetup 시스템 변수에 대한 옵션을 정의하고, 수정, 삭제하는 역활을 한다.
 * @extends WIP.view.common.AbstractEntitySetup
 * @author MyeungKyu You
 * 
 */

/*
 * 2012-07-16 수정 - 김진호 buildSupplement refreshGrid에 select 추가하여 이벤트
 * 발생(reloadForm 삭제) checkbox readOnly -> disabled, label 변경 cell 색상 처리추가 prompt
 * bold 처리추가 Option Setup CUD 수정 buildFieldSet 수정, buildOption 추가 optionName
 * (textfield -> codeview 변경)
 */

Ext.define('BAS.view.setup.GlobalOptionSetup.OptionSetup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Option Setup'),

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateGlobalOption.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/basUpdateGlobalOption.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/basUpdateGlobalOption.json',
		confirm : {
			fields : {
				field1 : 'optionName'
			}
		}
	} ],

	initComponent : function() {

		this.callParent();

		var self = this;

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.loadRecord(record);
				self.bufRecord = record;
				self.sub('fieldsetOptions').removeAll(true);

				var store = Ext.create('BAS.store.BasViewGlobalOptionPromptOut.promptList');

				store.proxy.on('exception', function(proxy, response, operation, eOpts) {
					var record = Ext.decode(response.responseText);
					if (record && record.msgcode == 'BAS-0007') {
						var optionName = operation.params.optionName;
						self.buildOption(optionName);
					}

				});

				store.load({
					params : {
						procstep : '1',
						optionName : record.get('optionName')
					},
					callback : function(records, operation, success) {
						if (success) {
							self.buildFieldSet(record, records);
						}
					}
				});

				self.sub('fieldsetOptions').on('beforeadd', function(container, component, index, opts) {
					var tableName = record.get('valueTbl' + (index + 1));
					if (component.store && tableName) {
						component.store.load({
							params : {
								procstep : '1',
								tableName : tableName
							}
						});
					}
				});
			});

			self.sub('cdvOptionName').on('select', function(record) {
				var optionName = record.get('optionName');
				if (optionName) {
					var select = {
						column : 'optionName',
						value : optionName
					};
					supplement.refreshGrid(true, select);
				}
			});

		});
	},

	onBeforeCreate : function(form, addParams) {
	},

	onBeforeUpdate : function(form, addParams) {
	},

	onBeforeDelete : function(form, addParams) {
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

			fields : [],

			grid : {
				procstep : '1',
				store : Ext.create('BAS.store.BasViewGlobalOptionListOut.optionList'),
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

	buildOption : function(optionName) {
		var self = this;
		var store = Ext.create('BAS.store.BasViewGlobalOptionOut');
		var fieldSet = [];

		store.load({
			params : {
				procstep : '1',
				optionName : optionName
			},
			callback : function(records, operation, success) {
				if (success) {
					var record = records[0];
					for ( var i = 1; i <= 5; i++) {
						fieldSet.push({
							xtype : 'textfield',
							name : 'value' + i,
							fieldLabel : 'Value' + i,
							value : record.get('value' + i) || ''
						});
					}

					self.sub('fieldsetOptions').add(fieldSet);
				}
			}
		});
	},

	buildFieldSet : function(value, records) {
		var fieldSet = [];
		for ( var i = 1; i <= 5; i++) {
			var prompt = records[i - 1].get('valuePmt');
			var format = records[i - 1].get('valueFmt');
			var table = records[i - 1].get('valueTbl');

			if (prompt)
				prompt = Ext.String.trim(prompt);
			if (format)
				format = Ext.String.trim(format);
			if (table)
				table = Ext.String.trim(table);

			if (!prompt)
				continue;

			if (table) {
				fieldSet.push({
					xtype : 'codeview',
					fieldLabel : prompt,
					name : 'value' + i,
					cls : 'fontWeightBold',
					codeviewName : 'GCM',
					table : table,
					value : value.get('value' + i),
					readOnly : true
				});
			} else {
				fieldSet.push({
					xtype : 'textfield',
					name : 'value' + i,
					cls : 'fontWeightBold',
					fieldLabel : prompt,
					value : value.get('value' + i),
					maxLength : 30,
					enforceMaxLength : true
				});
			}
		}

		this.sub('fieldsetOptions').add(fieldSet);
	},

	// BAS_View_Global_Option_Prompt_List
	buildForm : function() {
		return [ {
			xtype : 'codeview',
			type : 'service',
			store : 'WIP.store.BasViewGlobalOptionPromptListOut.promptList',
			itemId : 'cdvOptionName',
			name : 'optionName',
			fieldLabel : T('Caption.Other.Option Name'),
			allowBlank : false,
			labelWidth : 120,
			labelStyle : 'font-weight:bold',
			params : {
				procstep : '1'
			},
			popupConfig : {
				columns : [ {
					header : T('Caption.Other.Option Name'),
					dataIndex : 'optionName',
					flex : 2
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'optionDesc',
					flex : 1
				} ]
			},
			fields : [ {
				column : 'optionName',
				maxLength : 30,
				enforceMaxLength : true,
				flex : 1
			} ]
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			name : 'optionDesc',
			labelWidth : 120
		}, {
			xtype : 'checkbox',
			boxLabel : T('Caption.Other.MESplus Option'),
			name : 'mesplusFlag',
			inputValue : 'Y',
			uncheckedValue : 'N',
			disabled : true,
			margin : '0 0 3 125'
		}, {
			xtype : 'separator'
		}, {
			xtype : 'userstamp'
		}, {
			xtype : 'separator'
		}, {
			xtype : 'fieldset',
			title : T('Caption.Other.Option'),
			itemId : 'fieldsetOptions',
			minHeight : '50',
			defaults : {
				anchor : '50%',
				labelWidth : 110
			}
		} ];
	}
});