Ext.define('SYS.controller.user.UserManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_user grid',
		ref : 'grid'
	}, {
		selector : 'admin_user',
		ref : 'baseForm'
	}, {
		selector : 'admin_user basebuttons',
		ref : 'toolbar'
	}],

	init : function() {
		this.control({
			'admin_user' : {
				btnClose : this.onBtnClose,
				afterrender : this.onViewportRendered,
				selectionchange : this.changeButtonsStatus,
				doSearch : this.doSearch,
				btnShowCreate : this.onBtnShowCreate,
				btnShowUpdate : this.onBtnShowUpdate,
				btnResetPwd : this.onBtnResetPwd
			},
			'admin_user basebuttons' : {
				beforeUpdate : this.onBeforeUpdate,
				afterUpdate : this.onAfterUpdate,
				beforeDelete : this.onBeforeDelete,
				afterDelete : this.onAfterDelete,
				beforeExport : this.onBeforeExport
			},
			'admin_user grid' : {
				itemdblclick : this.showInfo
			}
		});
	},

	// 在BaseForm的afterrender调用Supplement的tree store load 方法，有点牵强。
	onViewportRendered : function() {
		var sup = this.getBaseForm().getSupplement();
		sup.sub('btnRefresh').on('click', this.onBtnRefresh, this);
		sup.sub('orgTreeId').on('itemclick', this.showUserList, this);
	},

	showInfo : function(view, record) {
		SF.popup('SYS.view.user.UserPopup', {
			targetControl : this,
			targetForm : this.getBaseForm(),
			status : 'show',
			formData : {
				record : record
			}
		});
	},

	onBtnResetPwd : function(t, e) {
		var self = this;
		Ext.Msg.confirm('信息', '确认重置密码？', function(btn) {
			if (btn == 'yes') {
				var gridPanel = self.getGrid();
				var userIds = SF.getSelectedIdArrayFromGrid(gridPanel);
				var params = {
					userIds : userIds
				};

				SF.cf.callServiceForm({
					form : self.getBaseForm(),
					params : params,
					url : 'user/resetPassword',
					showErrorMsg : true,
					showSuccessMsg : true,
					callback : function(action, success) {
						if (success) {
							Ext.Msg.alert("消息", "重置成功!");
						}else{
							Ext.Msg.alert('Fail', Ext.decode(action.response.responseText).msg);
						}
					},
					scope : this
				});
			}
		});
	},
	doSearch : function(t, e) {// 执行查询，根据enter
		var self = this;
		if (e.getKey() == e.ENTER) {
			if (!t.getValue()) {
				Ext.Msg.alert('Alarm', '请输入值.');
				return;
			}

			var searchType = this.getBaseForm().sub('searchType').getValue();
			var searchValue = this.getBaseForm().sub('valueId').getValue();
			if (!searchType) {
				Ext.Msg.alert('Alarm', '请选择类型.');
				return;
			}

			var params = {
				start : 0,
				limit : SF.page.maxSize
			};

			var store = this.getGrid().getStore();
			store.proxy.url = 'user/getUserByTypeAndValue';
			store.proxy.extraParams = {
				searchType : searchType,
				searchValue : searchValue
			}

			store.load({
				params : params,
				callback : function(records, operation, success) {
					if (success) {
						self.changeCreateBtnStatus(false);
						var sup = self.getBaseForm().getSupplement();
						var orgTreePanel = sup.sub('orgTreeId');
						var sm = orgTreePanel.getSelectionModel();
						sm.deselectAll();
					}
				}
			});
		}
	},

	changeButtonsStatus : function(model, selected, eOpts) {
		var me = this;
		var flag = selected.length > 0 ? true : false;
		var btnUpdate = this.getToolbar().sub('btnShowUpdate');
		var btnDelete = this.getToolbar().sub('btnDelete');
		var btnResetpwd = this.getToolbar().sub('btnResetpwd');

		if (flag) {
			btnUpdate.enable();
			btnDelete.enable();
			btnResetpwd.enable();
		} else {
			btnUpdate.disable();
			btnDelete.disable();
			btnResetpwd.disable();
		}
	},

	changeCreateBtnStatus : function(visible) {// 创建人员需要在部门下，故选择右边的部门才能创建人员，值查询时，需要set
		// createBtn disabled = true
		var btnCreate = this.getToolbar().sub('btnShowCreate');
		if (visible) {
			btnCreate.enable();
		} else {
			btnCreate.disable();
		}
	},

	onBtnShowCreate : function(t, e) {
		var supStuff = this.getSupStuff();
		var nodes = supStuff.selNodes;
		var orgId = nodes[0].raw.id;
		var orgName = nodes[0].raw.text;

		SF.popup('SYS.view.user.UserPopup', {
			targetControl : this,
			targetForm : this.getBaseForm(),
			status : 'create',
			formData : {
				'organization.id' : orgId,
				'organization.name' : orgName
			}
		});
	},

	onBtnShowUpdate : function(t, e) {
		var sm = this.getGrid().getSelectionModel();
		if (sm.getSelection().length == 0) {
			Ext.Msg.alert('INFO', '请选择一条记录!');
			return;
		}
		if (sm.getSelection().length > 1) {
			Ext.Msg.alert('INFO', '只能选择一条记录!');
			return;
		}

		SF.popup('SYS.view.user.UserPopup', {
			targetControl : this,
			targetForm : this.getBaseForm(),
			status : 'update',
			formData : {
				record : sm.getSelection()[0]
			}
		});
	},

	onBeforeDelete : function(form, addParams, url) {
		var gridPanel = this.getGrid();
		var params = SF.getSelectedIdArrayFromGrid(gridPanel);
		addParams['userIds'] = params;
	},

	onAfterDelete : function(form, action, success, scope) {
		if (success)
			this.refreshGrid();
	},

	refreshGrid : function() {
		this.getGrid().store.reload();
	},

	showUserList : function(view, record) {
		var self = this;
		var store = this.getGrid().getStore();
		store.proxy.url = 'user/getUserListByOrgId';
		store.proxy.extraParams = {
			orgId : record.raw.id
		}
		store.load({
			params : {
				start : 0,
				limit : SF.page.pageSize
			},
			callback : function(records, operation, success) {
				if (success) {
					self.changeCreateBtnStatus(true);
				}
			}
		});
	},

	onBtnRefresh : function(btn) {// 注意，这里的this
		// 不是指controller，指的是scope, 36line
		// this.getBaseForm()
		var sup = this.getBaseForm().getSupplement();
		sup.sub('orgTreeId').store.load();
	},

	onBeforeUpdate : function(form, addParams, url) {
	},

	onAfterUpdate : function(form, action, success, scope) {
		if (!success)
			return;

		var supStuff = this.getSupStuff();
		var nodes = supStuff.selNodes;

		var id = form.findField('id').getValue();
		if (!id || id == -1 || id == 1) {
			SF.refreshTreeNode(nodes[0], supStuff.store, false);
		} else {
			SF.refreshTreeNode(nodes[0], supStuff.store, true);
		}
		// Ext.Msg.alert('信息', '保存成功');
		SF.clearForm(form);
	},
	
	onBeforeExport : function(form, addParams, url) {
		var store = this.getGrid().getStore();
		var params = {
			orgId: store.proxy.extraParams.orgId
		};
		
		Ext.apply(addParams, params);
		return true;
	},
	

	onBtnClose : function(view) {
		view.close();
	},

	getSupStuff : function() { // 获得supplement的一些对象
		var sup = this.getBaseForm().getSupplement();
		var orgTreePanel = sup.sub('orgTreeId');
		var store = orgTreePanel.getStore();
		var sm = orgTreePanel.getSelectionModel();

		return {
			sup : sup,
			tree : orgTreePanel,
			store : store,
			selModel : sm,
			selNodes : sm.getSelection()
		}
	}
});