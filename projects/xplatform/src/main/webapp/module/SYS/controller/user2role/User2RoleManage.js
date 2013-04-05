Ext.define('SYS.controller.user2role.User2RoleManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_user2role grid',
		ref : 'grid'
	}, {
		selector : 'admin_user2role',
		ref : 'baseForm'
	}],
	
	init : function() {
		this.control({
			'admin_user2role' : {
				btnClose : this.onBtnClose,
				afterrender : this.onViewportRendered,
				doSearch : this.doSearch
			},
			'admin_user2role grid' : {
				itemdblclick : this.showUserDetail
			},
			'admin_user2role #orgTreeId' : {
				itemclick : this.showUserList
			}
		});
	},

	// 在BaseForm的afterrender调用Supplement的tree store load 方法，有点牵强。
	onViewportRendered : function() {
		var sup = this.getBaseForm().getSupplement();
		this.initDragDrop(sup);
		sup.sub('btnRefresh').on('click', this.onBtnRefresh, this);
		sup.sub('btnSave').on('click', this.saveRole2User, this);
		sup.sub('btnShowRoleUsers').on('click', this.showRoleContainUsers, this);
	},

	showRoleContainUsers : function(button) {
		var selectedRole = SF.getSelectedRecordFromGrid(this.getSupStuff().tree);
		if (selectedRole && selectedRole.id) {
			SF.popup('SYS.view.user2role.RoleContainUsersPopup', {
				targetControl : this,
				targetForm : this.getBaseForm(),
				formData : {
					roleId : selectedRole.id,
					roleName: selectedRole.text
				}
			});
		}else{
			SF.alertWarn('警告','请选择一个角色.');
		}
	},

	saveRole2User : function(button) {//这个只能选择一个用户，并选择多个角色。
		var sup = this.getBaseForm().getSupplement();
		var roleTreePanel = sup.sub('roleTreeId');
		var userSelected = SF.getSelectedRecordFromGrid(this.getGrid());
		if(userSelected === false){
			SF.alertWarn('警告','请选择一个人.');
			return;
		}
		var params = ["userId=" + userSelected.id];
		var selectedRoles = roleTreePanel.getChecked();
		Ext.each(selectedRoles, function(roleNode) {
			params.push("roleIds=" + roleNode.raw.id);
		});
		Ext.Ajax.request({
			url : 'role/saveUserHasRoles',
			params : params.join('&'),
			success : function(response, options) {
				SF.alertInfo('信息','保存成功!');
			},
			failure : function() {
				SF.alertError('错误',"网络出现错误!");
			}
		});
	},

	initDragDrop : function(sup) {
		var roleTreePanel = sup.sub('roleTreeId');
		var dropTarget = new Ext.dd.DropTarget(roleTreePanel.el, {
			ddGroup : 'firstGridDDGroup',
			notifyDrop : function(dragSource, event, data) {
				// 看看menuId这个用户在data中否，如果在，则认为是check，否则uncheck
				var isCheck = function(roleId, data) {
					for (var i = 0; i < data.length; i++) {
						var d = data[i];
						if (roleId == d.id) {
							return true;
						}
					}
					return false;
				}

				var setUnCheck = function(node) {
					node.set('checked', false);
					if (node.childNodes) {
						Ext.each(node.childNodes, function(node) {
							setUnCheck(node);
						});
					}
				}

				var setCheck = function(node, data) {
					if (isCheck(node.raw.id, data)) {
						node.set('checked', true);
					}
					if (node.childNodes) {
						Ext.each(node.childNodes, function(node) {
							setCheck(node, data);
						});
					}
				}

				if (data.records) {
					var d = data.records[0].data;
					Ext.Ajax.request({
						url : 'role/getUserRolesCheckedData',
						params : {
							userId : d.id
						},
						method : 'GET',
						success : function(response, options) {
							var message = response.responseText;
							var data = Ext.decode(message);
							setUnCheck(roleTreePanel.getRootNode());
							setCheck(roleTreePanel.getRootNode(), data);
							roleTreePanel.userId = d.id;
							var btnSave = sup.sub('btnSave');
							btnSave.setTooltip('保存' + d.loginName + '用户的角色');
						}
					});
					return true;
				}
				return false;
			}
		});
	},

	showUserDetail : function(view, record) {
		SF.popup('SYS.view.user.UserPopup', {
			targetControl : this,
			targetForm : this.getBaseForm(),
			status : 'show',
			formData : {
				record : record
			}
		});
	},

	doSearch : function(t, e) {// 执行查询，根据enter
		var self = this;
		if (e.getKey() == e.ENTER) {
			if (!t.getValue()) {
				SF.alertWarn('警告','请输入值.');
				return;
			}

			var searchType = this.getBaseForm().sub('searchType').getValue();
			var searchValue = this.getBaseForm().sub('valueId').getValue();
			if (!searchType) {
				SF.alertWarn('警告','请选择类型.');
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

	refreshGrid : function() {
		this.getGrid().store.reload();
	},

	onBtnRefresh : function(btn) {
		var sup = this.getSupStuff().store.load();
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
			}
		});
	},

	onBtnClose : function(view) {
		view.close();
	},

	getSupStuff : function() { // 获得supplement的一些对象
		var sup = this.getBaseForm().getSupplement();
		var roleTreePanel = sup.sub('roleTreeId');
		var store = roleTreePanel.getStore();
		var sm = roleTreePanel.getSelectionModel();

		return {
			sup : sup,
			tree : roleTreePanel,
			store : store,
			selModel : sm,
			selNodes : sm.getSelection()
		}
	}
});