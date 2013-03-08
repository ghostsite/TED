Ext.define('ALM.view.setup.AlarmTemplateSetup', {
	extend : 'MES.view.form.BaseFormTabs',

	title : T('Caption.Menu.Alarm Template Setup'),

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/AlmUpdateTemplate.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/AlmUpdateTemplate.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/AlmUpdateTemplate.json',
		confirm : {
			fields : {
				field1 : 'templateId'
			}
		}
	} ],

	initComponent : function() {
		this.callParent();

		var self = this;

		var baseTabs = this.getTabPanel();
		baseTabs.add(this.buildTabDefault());
		baseTabs.add(this.buildTabDisplay());
		baseTabs.add(this.buildTabMail());
		baseTabs.add(this.buildTabOther());
		baseTabs.setActiveTab(0);

		this.on('afterrender', function() {
			var supplement = self.getSupplement();
			// supplement grid select
			supplement.on('supplementSelected', function(record) {
				var templateId = record.get('templateId') || '';
				self.setKeys({
					templateId : templateId
				});
			});
		});

		this.on('keychange', function(view, keys) {
			if (!keys) {
				return;
			}

			self.sub('txtTemplateId').setValue(keys.templateId);
			if (keys.templateId) {
				self.viewTemplate();
			}
		});
	},

	viewTemplate : function() {
		Ext.Ajax.request({
			url : 'service/AlmViewTemplate.json',
			params : {
				procstep : '1',
				templateId : this.sub('txtTemplateId').getValue()
			},
			success : function(response) {
				var data = Ext.JSON.decode(response.responseText);
				if (data.success) {
					// 결과값을 모델로 변환
					var record = Ext.create('ALM.model.AlmViewTemplateOut', data);
					this.getForm().setValues(record.data);
				}
			},
			scope : this
		});
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var templateId = form.getValues().templateId;
			var select = {
				column : 'templateId',
				value : templateId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var templateId = form.getValues().templateId;
			var select = {
				column : 'templateId',
				value : templateId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterDelete : function(form, action, success) {
		if (success) {
			this.getSupplement().refreshGrid(true);
			// form clear
			SF.cf.clearFormFields(this);
		}
	},

	// TODO ALM store로 변경하세요~
	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			grid : {
				searchField : 'templateId',
				autoFormLoad : false,
				autoRefresh : true,
				columnLines : true,
				// store :
				store : Ext.create('ALM.store.AlmViewTemplateListOut.list'),
				columns : [ {
					header : T('Caption.Other.Template ID'),
					dataIndex : 'templateId'
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'templateDesc',
					flex : 1
				} ]
			}
		};
	},

	buildTopPart : function() {
		return [ {
			xtype : 'textfield',
			itemId : 'txtTemplateId',
			name : 'templateId',
			fieldLabel : T('Caption.Other.Template ID')
		}, {
			xtype : 'textfield',
			name : 'templateDesc',
			fieldLabel : T('Caption.Other.Description')
		} ];
	},

	buildTabDefault : function() {
		return {
			xtype : 'container',
			title : T('Caption.Other.Default'),
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'textfield',
				name : 'subject',
				fieldLabel : T('Caption.Other.Subject')
			}, {
				xtype : 'textareafield',
				name : 'msg',
				flex : 1,
				fieldLabel : T('Caption.Other.Message')
			} ]
		};
	},

	buildTabDisplay : function() {
		return {
			xtype : 'container',
			title : T('Caption.Other.Display'),
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'textfield',
				name : 'displaySubject',
				fieldLabel : T('Caption.Other.Subject')
			}, {
				xtype : 'textareafield',
				name : 'displayMsg',
				flex : 1,
				fieldLabel : T('Caption.Other.Message')
			} ]
		};
	},

	buildTabMail : function() {
		return {
			xtype : 'container',
			title : T('Caption.Other.Mail'),
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'textfield',
				name : 'mailSubject',
				fieldLabel : T('Caption.Other.Subject')
			}, {
				xtype : 'textareafield',
				name : 'mailMsg',
				flex : 1,
				fieldLabel : T('Caption.Other.Message')
			} ]
		};
	},

	buildTabOther : function() {
		return {
			xtype : 'container',
			title : T('Caption.Other.Other'),
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'textfield',
				name : 'msgSubject',
				fieldLabel : T('Caption.Other.Subject')
			}, {
				xtype : 'textareafield',
				name : 'msgMsg',
				flex : 1,
				fieldLabel : T('Caption.Other.Message')
			} ]
		};
	}
});
