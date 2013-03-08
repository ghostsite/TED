Ext.define('SYS.controller.role.RoleManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_role form',
		ref : 'grid'
	}, {
		selector : 'admin_role #btnUpdate',
		ref : 'btnDelete'
	}, {
		selector : 'admin_role',
		ref : 'baseForm'
	}],

	init : function() {
		this.control({
			'admin_role' : {
				btnClose : this.onBtnClose,
				afterrender : this.onViewportRendered
			},
			'admin_role basebuttons' : {
				beforeUpdate : this.onBeforeUpdate,
				afterUpdate : this.onAfterUpdate
			}
		});
	},

	// 在BaseForm的afterrender调用Supplement的tree store load 方法，有点牵强。
	onViewportRendered : function() {
		var sup = this.getBaseForm().getSupplement();
		sup.sub('btnRefresh').on('click', this.onBtnRefresh, this);
		sup.sub('roleTreeId').on('itemcontextmenu', this.onTreeContextMenu, sup.sub('roleTreeId'));
		sup.sub('roleTreeId').on('itemclick', this.onTreeItemClick, this);
		// sup.down('#orgTreeId').on('itemclick', this.onTreeItemClick, this);
		sup.sub('roleTreeId').contextMenu.down('menuitem[action=showCreate]').on('click', this.onBtnShowCreate, this);
		sup.sub('roleTreeId').contextMenu.down('menuitem[action=showUpdate]').on('click', this.onBtnShowUpdate, this);
		sup.sub('roleTreeId').contextMenu.down('menuitem[action=doDelete]').on('click', this.onBtnDelete, this);
	},

	onBtnShowCreate : function(button) {
		var menu = button.up('menu');
		var roleFormPanel = this.getBaseForm();
		var nodes = this.getSupStuff().selNodes;
		SF.clearForm(roleFormPanel);
		roleFormPanel.load({
			url : 'role/getRoleAsSuperInfoById',
			params : {
				roleId : nodes[0].raw.id
			}
		});
		menu.setVisible(false);
		return false;
	},

	onBtnShowUpdate : function(button) {
		var menu = button.up('menu');
		var roleFormPanel = this.getBaseForm();
		var nodes = this.getSupStuff().selNodes;
		roleFormPanel.load({
			url : 'role/getRoleById',
			params : {
				roleId : nodes[0].raw.id
			}
		});
		menu.setVisible(false);
		return true;
	},

	onBtnDelete : function(button) {
		var roleFormPanel = this.getBaseForm();
		var supStuff = this.getSupStuff();
		var nodes = supStuff.selNodes;
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'role/delete',
					params : {
						roleId : nodes[0].raw.id
					},
					success : function(response, opts) {
						Ext.Msg.alert("信息", "删除成功!");
						SF.refreshTreeNode(nodes[0], supStuff.store, true);
						SF.clearForm(roleFormPanel);
					},
					failure : function(response, opts) {
						var rs = Ext.decode(response.responseText);
						Ext.Msg.alert("错误", rs.msg);
					}
				});
			}
		});
	},

	onTreeItemClick : function(view, record) {
		var roleFormPanel = this.getBaseForm();
		roleFormPanel.form.load({
			url : 'role/getRoleById',
			params : {
				roleId : record.raw.id
			}
		});
	},

	onTreeContextMenu : function(view, record, node, index, e) {
		e.stopEvent();
		this.contextMenu.showAt(e.getXY());// careful : this reference
											// TreePanel
		return false;
	},

	onBtnRefresh : function(btn) {// 注意，这里的this 不是指controller，指的是scope, 36line
									// this.getBaseForm()
		var sup = this.getBaseForm().getSupplement();
		sup.sub('roleTreeId').store.load({
			params : {
				roleId : 1
			}
		});
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
			nodes[0].set("leaf", false);
			SF.refreshTreeNode(nodes[0], supStuff.store, false);
		} else {
			SF.refreshTreeNode(nodes[0], supStuff.store, true);
		}
		// Ext.Msg.alert('信息', '保存成功');
		SF.clearForm(form);
	},

	onBtnClose : function(view) {
		view.close();
	},
	
	getSupStuff: function(){ //获得supplement的一些对象
		var sup = this.getBaseForm().getSupplement();
		var roleTreePanel = sup.sub('roleTreeId');
		var store = roleTreePanel.getStore();
		var sm = roleTreePanel.getSelectionModel();
		
		return {
			sup: sup,
			tree : roleTreePanel,
			store : store,
			selModel : sm,
			selNodes : sm.getSelection()
		}
	}
});