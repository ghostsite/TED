Ext.define('SYS.controller.menuresource.MenuResourceManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_menuresource form',
		ref : 'grid'
	}, {
		selector : 'admin_menuresource #btnUpdate',
		ref : 'btnDelete'
	}, {
		selector : 'admin_menuresource',
		ref : 'baseForm'
	}],

	init : function() {
		this.control({
			'admin_menuresource' : {
				btnClose : this.onBtnClose,
				afterrender : this.onViewportRendered
			},
			'admin_menuresource basebuttons' : {
				beforeUpdate : this.onBeforeUpdate,
				afterUpdate : this.onAfterUpdate
			}
		});
	},

	// 在BaseForm的afterrender调用Supplement的tree store load 方法，有点牵强。
	onViewportRendered : function() {
		var sup = this.getBaseForm().getSupplement();
		sup.sub('btnRefresh').on('click', this.onBtnRefresh, this);
		sup.sub('menuResourceTreeId').on('itemcontextmenu', this.onTreeContextMenu, sup.sub('menuResourceTreeId'));
		sup.sub('menuResourceTreeId').on('itemclick', this.onTreeItemClick, this);
		// sup.down('#orgTreeId').on('itemclick', this.onTreeItemClick, this);
		sup.sub('menuResourceTreeId').contextMenu.down('menuitem[action=showCreate]').on('click', this.onBtnShowCreate, this);
		sup.sub('menuResourceTreeId').contextMenu.down('menuitem[action=showUpdate]').on('click', this.onBtnShowUpdate, this);
		sup.sub('menuResourceTreeId').contextMenu.down('menuitem[action=doDelete]').on('click', this.onBtnDelete, this);
	},

	onBtnShowCreate : function(button) {
		var menu = button.up('menu');
		var resourceFormPanel = this.getBaseForm();
		var nodes = this.getSupStuff().selNodes;
		
		SF.clearForm(resourceFormPanel);
		resourceFormPanel.load({
			url : 'menuresource/getMenuResourceAsSuperInfoById',
			params : {
				resourceId : nodes[0].raw.id
			}
		});
		menu.setVisible(false);
		return false;
	},

	onBtnShowUpdate : function(button) {
		var menu = button.up('menu');
		var resourceFormPanel = this.getBaseForm();
		var nodes = this.getSupStuff().selNodes;

		resourceFormPanel.load({
			url : 'menuresource/getMenuResourceById',
			params : {
				resourceId : nodes[0].raw.id
			}
		});
		menu.setVisible(false);
		return true;
	},

	onBtnDelete : function(button) {
		var resourceFormPanel = this.getBaseForm();
		var supStuff = this.getSupStuff();
		var nodes = supStuff.selNodes;
		
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'menuresource/delete',
					params : {
						resourceId : nodes[0].raw.id
					},
					success : function(response, opts) {
						Ext.Msg.alert("信息", "删除成功!");
						SF.refreshTreeNode(nodes[0], supStuff.store, true);
						SF.clearForm(resourceFormPanel);
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
		var resourceFormPanel = this.getBaseForm();
		resourceFormPanel.form.load({
			url : 'menuresource/getMenuResourceById',
			params : {
				resourceId : record.raw.id
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
		sup.sub('menuResourceTreeId').store.load({
			params : {
				resourceId : 1
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
		var resourceTreePanel = sup.sub('menuResourceTreeId');
		var store = resourceTreePanel.getStore();
		var sm = resourceTreePanel.getSelectionModel();
		
		return {
			sup: sup,
			tree : resourceTreePanel,
			store : store,
			selModel : sm,
			selNodes : sm.getSelection()
		}
	}
});