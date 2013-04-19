Ext.define('SYS.controller.namerule.NameRuleManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_namerule #nameRuleGridId',
		ref : 'nameRuleGrid'
	}, {
		selector : 'admin_namerule #nameRuleItemGridId',
		ref : 'nameRuleItemGrid'
	}, {
		selector : 'admin_namerule #nameRuleFormId',
		ref : 'nameRuleForm'
	}, {
		selector : 'admin_namerule #nameRuleItemFormId',
		ref : 'nameRuleItemForm'
	}, {
		selector : 'admin_namerule #btnNameRuleGenerate',
		ref : 'btnNameRuleGenerate'
	}, {
		selector : 'admin_namerule #btnNameRuleDelete',
		ref : 'btnNameRuleDelete'
	}, {
		selector : 'admin_namerule #btnNameRuleUpdate',
		ref : 'btnNameRuleUpdate'
	}, {
		selector : 'admin_namerule #btnNameRuleCreate',
		ref : 'btnNameRuleCreate'
	}, {
		selector : 'admin_namerule #btnNameRuleItemDelete',
		ref : 'btnNameRuleItemDelete'
	}, {
		selector : 'admin_namerule #btnNameRuleItemUpdate',
		ref : 'btnNameRuleItemUpdate'
	}, {
		selector : 'admin_namerule #btnNameRuleItemCreate',
		ref : 'btnNameRuleItemCreate'
	}, {
		selector : 'admin_namerule #btnNameRuleItemClear',
		ref : 'btnNameRuleItemClear'
	}, {
		selector : 'admin_namerule #itemDetail',
		ref : 'itemDetail'
	}, {
		selector : 'admin_namerule #category',
		ref : 'category'
	}, {
		selector : 'admin_namerule #idx',
		ref : 'idx'
	}, {
		selector : 'admin_namerule #code',
		ref : 'code'
	}, {
		selector : 'admin_namerule #name',
		ref : 'name'
	}],

	init : function() {
		this.control({
			'admin_namerule' : {
				categoryChanged : this.onCategoryChanged
				// 当类型选择变化时
			},
			'admin_namerule #nameRuleGridId' : {
				itemclick : this.showNameRuleInfo
			},
			'admin_namerule #btnNameRuleClear' : {
				click : this.onNameRuleClear
			},
			'admin_namerule #btnNameRuleCreate' : {
				click : this.onNameRuleCreate
			},
			'admin_namerule #btnNameRuleUpdate' : {
				click : this.onNameRuleUpdate
			},
			'admin_namerule #btnNameRuleDelete' : {
				click : this.onNameRuleDelete
			},
			'admin_namerule #btnNameRuleGenerate' : {
				click : this.onNameRuleGenerate
			},

			'admin_namerule #nameRuleItemGridId' : {
				itemclick : this.showNameRuleItemInfo
			},
			'admin_namerule #btnNameRuleItemClear' : {
				click : this.onNameRuleItemClear
			},
			'admin_namerule #btnNameRuleItemCreate' : {
				click : this.onNameRuleItemCreate
			},
			'admin_namerule #btnNameRuleItemUpdate' : {
				click : this.onNameRuleItemUpdate
			},
			'admin_namerule #btnNameRuleItemDelete' : {
				click : this.onNameRuleItemDelete
			}
		});
	},

	//onCategoryChanged : function(combo, records) {
	onCategoryChanged : function(combo, newValue, oldValue) {
		//var categoryCode = records[0].get('code');
		//alert("newValue=="+newValue)
		this.changeItemDetailStatus(newValue);
	},
	
	changeItemDetailStatus : function(categoryCode){
		this.getItemDetail().setVisible(true);
		if (categoryCode === 'prefix') {
			this.getItemDetail().getLayout().setActiveItem(0);
		} else if (categoryCode === 'datetime') {
			this.getItemDetail().getLayout().setActiveItem(1);
		} else if (categoryCode === 'sequence') {
			this.getItemDetail().getLayout().setActiveItem(2);
		} else {
			this.getItemDetail().setVisible(false);
		}
	},

	showNameRuleInfo : function(grid, record) {
		this.getBtnNameRuleDelete().enable();
		this.getBtnNameRuleGenerate().enable();
		this.getBtnNameRuleUpdate().enable();
		this.getBtnNameRuleCreate().disable();

		this.getBtnNameRuleItemClear().enable();
		this.getBtnNameRuleItemCreate().enable();
		this.getBtnNameRuleItemDelete().disable();
		this.getBtnNameRuleItemUpdate().disable();

		var nameRuleForm = this.getNameRuleForm();
		nameRuleForm.form.load({
			url : 'namerule/getNameRuleById',
			params : {
				ruleId : record.raw.id
			}
		});

		this.getNameRuleItemGrid().getStore().load({
			params : {
				ruleId : record.get('id')
			}
		});

		this.clearNameRuleItemForm();
		this.getNameRuleItemForm().getForm().findField('rule.id').setValue(record.get('id'));
	},

	onNameRuleClear : function(button, event, eOpts) {
		this.getBtnNameRuleDelete().disable();
		this.getBtnNameRuleUpdate().disable();
		this.getBtnNameRuleCreate().enable();

		SF.clearForm(this.getNameRuleForm());
	},

	// 根据category的变化，改变提交，update的url，默认是userdef
	getSaveUrlByCategory : function() {
		var category = this.getCategory().getValue();
		if (category === 'prefix') {
			return 'namerule/saveNameRulePrefix';
		} else if (category === 'datetime') {
			return 'namerule/saveNameRuleDateTime';
		} else if (category === 'sequence') {
			return 'namerule/saveNameRuleSequence';
		} else {
			return 'namerule/saveNameRuleUserDef';
		}
	},

	onNameRuleCreate : function(button, event, eOpts) {
		var self = this;
		var config = {
			checkFormValid : true,
			form : this.getNameRuleForm(),
			url : 'namerule/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息', '创建成功!');
					self.refreshNameRuleGrid();
					SF.clearForm(self.getNameRuleForm());
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};

		SF.cf.callServiceForm(config);
	},

	onNameRuleUpdate : function(button, event, eOpts) {
		var self = this;
		var config = {
			checkFormValid : true,
			form : this.getNameRuleForm(),
			url : 'namerule/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息', '变更成功!');
					self.refreshNameRuleGrid();
					SF.clearForm(self.getNameRuleForm());
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};

		SF.cf.callServiceForm(config);
	},

	onNameRuleDelete : function(button, event, eOpts) {
		var nameRuleFormPanel = this.getNameRuleForm();
		var self = this;
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'namerule/delete',
					params : {
						ruleId : nameRuleFormPanel.getForm().findField('id').getValue()
					},
					success : function(response, opts) {
						SF.alertInfo('信息', '删除成功!');
						self.refreshNameRuleGrid();
						SF.clearForm(self.getNameRuleForm());
					},
					failure : function(response, opts) {
						var rs = Ext.decode(response.responseText);
						SF.alertError('错误', rs.msg);
					}
				});
			}
		});
	},

	onNameRuleGenerate : function(button, event, eOpts) {
		var params = {
			ruleCode : this.getCode().getValue(),
			userDefs : this.getName().getValue()
		};

		Ext.Ajax.request({
			url : 'namerule/generate',
			params : params,
			success : function(response, opts) {
				SF.alertInfo('信息', response.responseText);
			},
			failure : function(response, opts) {
				SF.alertError('错误', "自己看");
			}
		});
	},

	showNameRuleItemInfo : function(grid, record) {
		this.getBtnNameRuleItemDelete().enable();
		this.getBtnNameRuleItemUpdate().enable();
		this.getBtnNameRuleItemCreate().disable();

		var nameRuleItemForm = this.getNameRuleItemForm();
		nameRuleItemForm.form.load({
			url : 'namerule/getNameRuleItemById',
			params : {
				ruleItemId : record.raw.id
			}
		});
		
		//set idx and category component to ReadOnly
		this.getIdx().setReadOnly(true);
		this.getCategory().setReadOnly(true);
	},

	onNameRuleItemClear : function(button, event, eOpts) {
		this.getBtnNameRuleItemDelete().disable();
		this.getBtnNameRuleItemUpdate().disable();
		this.getBtnNameRuleItemCreate().enable();

		this.clearNameRuleItemForm();
	},

	onNameRuleItemCreate : function(button, event, eOpts) {
		var self = this;
		var config = {
			checkFormValid : true,
			form : this.getNameRuleItemForm(),
			url : this.getSaveUrlByCategory(),
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息', '创建成功!');
					self.refreshNameRuleItemGrid();
					self.clearNameRuleItemForm();
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};

		SF.cf.callServiceForm(config);
	},

	onNameRuleItemUpdate : function(button, event, eOpts) {
		var self = this;
		var config = {
			checkFormValid : true,
			form : this.getNameRuleItemForm(),
			url : this.getSaveUrlByCategory(),
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息', '变更成功!');
					self.refreshNameRuleItemGrid();
					self.clearNameRuleItemForm();
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};

		SF.cf.callServiceForm(config);

	},

	onNameRuleItemDelete : function(button, event, eOpts) {
		var nameRuleItemFormPanel = this.getNameRuleItemForm();
		var self = this;
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'namerule/deleteNameRuleItem',
					params : {
						itemId : nameRuleItemFormPanel.getForm().findField('id').getValue()
					},
					success : function(response, opts) {
						SF.alertInfo('信息', '删除成功!');
						self.refreshNameRuleItemGrid();
						self.clearNameRuleItemForm();
					},
					failure : function(response, opts) {
						var rs = Ext.decode(response.responseText);
						SF.alertError('错误', rs.msg);
					}
				});
			}
		});
	},

	refreshNameRuleGrid : function() {
		this.getNameRuleGrid().getStore().loadPage(1);
	},

	refreshNameRuleItemGrid : function() {
		var ruleId = SF.getSelectedIdFromGrid(this.getNameRuleGrid());
		var params = {
			ruleId : ruleId
		};
		this.getNameRuleItemGrid().getStore().load({
			params : params
		});
	},

	clearNameRuleItemForm : function() {
		SF.cf.clearFormFields(this.getNameRuleItemForm(), {
			'rule.id' : 'rule.id'
		});
		
		this.getIdx().setReadOnly(false);
		this.getCategory().setReadOnly(false);
		
	}

});