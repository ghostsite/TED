Ext.define('SYS.controller.namerule.NameRuleManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_namerule #nameRuleGridId',
		ref : 'nameRuleGrid'
	}, {
		selector : 'admin_namerule #nameRuleDefineGridId',
		ref : 'nameRuleDefineGrid'
	}, {
		selector : 'admin_namerule #nameRuleFormId',
		ref : 'nameRuleForm'
	}, {
		selector : 'admin_namerule #nameRuleDefineFormId',
		ref : 'nameRuleDefineForm'
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
		selector : 'admin_namerule #btnNameRuleDefineDelete',
		ref : 'btnNameRuleDefineDelete'
	}, {
		selector : 'admin_namerule #btnNameRuleDefineUpdate',
		ref : 'btnNameRuleDefineUpdate'
	}, {
		selector : 'admin_namerule #btnNameRuleDefineCreate',
		ref : 'btnNameRuleDefineCreate'
	}, {
		selector : 'admin_namerule #btnNameRuleDefineClear',
		ref : 'btnNameRuleDefineClear'
	}],

	init : function() {
		this.control({
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

			'admin_namerule #nameRuleDefineGridId' : {
				itemclick : this.showNameRuleDefineResourceInfo
			},
			'admin_namerule #btnNameRuleDefineClear' : {
				click : this.onNameRuleDefineClear
			},
			'admin_namerule #btnNameRuleDefineCreate' : {
				click : this.onNameRuleDefineCreate
			},
			'admin_namerule #btnNameRuleDefineUpdate' : {
				click : this.onNameRuleDefineUpdate
			},
			'admin_namerule #btnNameRuleDefineDelete' : {
				click : this.onNameRuleDefineDelete
			}
		});
	},

	showNameRuleInfo : function(grid, record) {
		this.getBtnNameRuleDelete().enable();
		this.getBtnNameRuleUpdate().enable();
		this.getBtnNameRuleCreate().disable();

		this.getBtnNameRuleDefineClear().enable();
		this.getBtnNameRuleDefineCreate().enable();
		this.getBtnNameRuleDefineDelete().disable();
		this.getBtnNameRuleDefineUpdate().disable();

		var nameRuleForm = this.getNameRuleForm();
		nameRuleForm.form.load({
			url : 'namerule/getNameRuleById',
			params : {
				ruleId : record.raw.id
			}
		});

		this.getNameRuleDefineGrid().getStore().load({
			params : {
				ruleId : record.get('id')
			}
		});

		this.clearNameRuleDefineForm();
		this.getNameRuleDefineForm().getForm().findField('rule.id').setValue(record.get('id'));
	},

	onNameRuleClear : function(button, event, eOpts) {
		this.getBtnNameRuleDelete().disable();
		this.getBtnNameRuleUpdate().disable();
		this.getBtnNameRuleCreate().enable();

		SF.clearForm(this.getNameRuleForm());
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

	showNameRuleDefineInfo : function(grid, record) {
		this.getBtnNameRuleDefineDelete().enable();
		this.getBtnNameRuleDefineUpdate().enable();
		this.getBtnNameRuleDefineCreate().disable();

		var nameRuleDefineForm = this.getNameRuleDefineForm();
		nameRuleDefineForm.form.load({
			url : 'namerule/getNameRuleDefineByRuleId',
			params : {
				ruleId : record.raw.id
			}
		});
	},

	onNameRuleDefineClear : function(button, event, eOpts) {
		this.getBtnNameRuleDefineDelete().disable();
		this.getBtnNameRuleDefineUpdate().disable();
		this.getBtnNameRuleDefineCreate().enable();

		this.clearNameRuleDefineForm();
	},

	onNameRuleDefineCreate : function(button, event, eOpts) {
		var self = this;
		var config = {
			checkFormValid : true,
			form : this.getNameRuleDefineForm(),
			url : 'namerule/saveNameRuleDefine',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息', '创建成功!');
					self.refreshNameRuleDefineGrid();
					self.clearNameRuleDefineForm();
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};

		SF.cf.callServiceForm(config);
	},

	onNameRuleDefineUpdate : function(button, event, eOpts) {
		var self = this;
		var config = {
			checkFormValid : true,
			form : this.getNameRuleDefineForm(),
			url : 'namerule/saveNameRuleDefine',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息', '变更成功!');
					self.refreshNameRuleDefineGrid();
					self.clearNameRuleDefineForm();
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};

		SF.cf.callServiceForm(config);

	},

	onNameRuleDefineDelete : function(button, event, eOpts) {
		var nameRuleDefineFormPanel = this.getNameRuleDefineForm();
		var self = this;
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'namerule/deleteNameRuleDefine',
					params : {
						defineId : nameRuleDefineFormPanel.getForm().findField('id').getValue()
					},
					success : function(response, opts) {
						SF.alertInfo('信息', '删除成功!');
						self.refreshNameRuleDefineGrid();
						self.clearNameRuleDefineForm();
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

	refreshNameRuleDefineGrid : function() {
		var ruleId = SF.getSelectedIdFromGrid(this.getNameRuleGrid());
		var params = {
			ruleId : ruleId
		};
		this.getNameRuleDefineGrid().getStore().load({
			params : params
		});
	},

	clearNameRuleDefineForm : function() {
		SF.cf.clearFormFields(this.getNameRuleDefineForm(), {
			'rule.id' : 'rule.id'
		});
	}

});