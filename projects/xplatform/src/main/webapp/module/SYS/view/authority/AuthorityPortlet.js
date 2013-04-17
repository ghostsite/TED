Ext.define('SYS.view.authority.AuthorityPortlet', {
	extend : 'Ext.ux.portal.Portlet',
	alias : 'widget.authorityPortlet',
	height : 250,
	forceFit : true,
	tools : [{
		type : 'gear',
		qtip : '查看此角色拥有的资源',
		handler : function(event, toolEl, panel) {
			var supTabPanel = Ext.getCmp('authoritySupId');
			var menuTree = supTabPanel.getTabPanel().items.getAt(0); 
			var fileTree = supTabPanel.getTabPanel().items.getAt(1); 
			//var pageTree = supTabPanel.getTabPanel().items.getAt(2); 
			
			//var tree = Ext.getCmp('treAuthorityMenuId');
			var gridPanel = panel.up('panel').items.get(0);
			menuTree.getRootNode().cascadeBy(function(n) {
				if (SYS.view.authority.AuthorityPortlet.isNodeInGrid(n, gridPanel)) {
					n.set('checked', true);
				} else {
					n.set('checked', false);
				}
			});
			
			fileTree.getRootNode().cascadeBy(function(n) {
				if (SYS.view.authority.AuthorityPortlet.isNodeInGrid(n, gridPanel)) {
					n.set('checked', true);
				} else {
					n.set('checked', false);
				}
			});
			
		}
	}, {
		type : 'refresh',
		qtip : '刷新',
		handler : function(event, toolEl, panel) {
			panel.up('panel').items.get(0).getStore().reload();
		}
	}],
	initComponent : function() {
		var self = this;
		Ext.apply(this, {
			items : [self.getGrid(this.roleId)]
		});
		this.callParent(arguments);
	},

	getGrid : function(roleId) {
		var store = Ext.create('Ext.data.Store', {
			model : 'SYS.model.ACL',
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : 'role/getRoleHasACLList?roleId=' + roleId,
				reader : {
					type : 'json'
				}
			}
		});
		return {
			xtype : 'grid',
			height : 250,
			forceFit : true,
			border : false,
			store : store,
			tbar : [{
				xtype : 'textfield',
				width: 100,
				name : 'begin'
			}, {
				xtype : 'button',
				text : '过滤',
				iconCls : 'btn-query',
				handler : function(button) {
					var textValue = button.ownerCt.query('textfield')[0].getValue();
					if (textValue === '') {
						button.ownerCt.ownerCt.getStore().clearFilter();
					} else {
						button.ownerCt.ownerCt.getStore().filter([{
							property : "resourceName",
							value : textValue
						}]);
					}
				}
			}, '->', {
				text : '删除',
				tooltip : '删除',
				iconCls : 'icon-remove',
				itemId : 'removeButton',
				disabled : true,
				handler : function(button, e) {
					var grid = button.ownerCt.ownerCt;
					var records = grid.getSelectionModel().getSelection();
					grid.getStore().remove(records);
					grid.getView().refresh();
				}
			}, '-', {
				xtype : 'button',
				text : '保存',
				iconCls : 'btn-save',
				handler : function(button, e) {
					var grid = button.ownerCt.ownerCt;
					var portlet = grid.ownerCt;
					var roleId = portlet.roleId;
					var params = ['roleId=' + roleId];
					var count = grid.getStore().getCount();
					var data = grid.getStore().data;
					for (var i = 0; i < count; i++) {
						var id = data.items[i].get('id');
						params.push('aclIds=' + id);
					}
					Ext.Ajax.request({
						url : 'role/saveRoleToAcls',
						method : 'POST',
						success : function(response, options) {
							SF.alertInfo('信息','保存成功!');
						},
						params : params.join('&')
					});
				}
			}],
			columns : [{
				xtype : 'rownumberer'
			}, {
				header : '类别', //意思是：菜单,文件,页面 对应resource table category
				dataIndex : 'type',
				width: 40,
				renderer : function(val) {
					if (val === 'menu') {
						return '<span style="color:green;">' + '菜单' + '</span>';
					}else if(val === 'file'){
						return '<span style="color:blue;">' + '文件' + '</span>';
					}else if(val === 'page'){
						return '<span style="color:red;">' + '页面' + '</span>';
					}else if(val === 'widget'){
						return '<span style="color:maroon;">' + '控件' + '</span>';
					}else if(val === 'url'){
						return '<span style="color:purple;">' + 'URL' + '</span>';
					}else{
						return val;
					}
				}
			}, {
				header : '资源',
				dataIndex : 'resourceName'
			}, {
				header : '动作',
				width: 40,
				dataIndex : 'operationName',
				renderer : function(val) {
					if (val === '查看') {
						return '<span style="color:green;">' + val + '</span>';
					}else if(val === '只读'){
						return '<span style="color:blue;">' + val + '</span>';
					}else if(val === '新增'){
						return '<span style="color:black;">' + val + '</span>';
					}else if(val === '删除'){
						return '<span style="color:red;">' + val + '</span>';
					}else if(val === '修改'){
						return '<span style="color:gray;">' + val + '</span>';
					}else if(val === '只见'){
						return '<span style="color:brown;">' + val + '</span>';
					}else if(val === '下载'){
						return '<span style="color:purple;">' + val + '</span>';
					}else{
						return val;
					}
				}
			}],

			viewConfig : {
				listeners : {
					render : function(panel) {
						var menuDropTarget = new Ext.dd.DropTarget(panel.el, {
							ddGroup : 'menuTree2GridGroup',
							notifyDrop : function(dragSource, event, data) {
								return SYS.view.authority.AuthorityManage.addACL2Grid(data.records[0], panel);
								//return SYS.view.authority.AuthorityManage.addACL2Grid(data.node, panel);
							}
						});
						
						
						var fileDropTarget = new Ext.dd.DropTarget(panel.el, {
							ddGroup : 'fileTree2GridGroup',
							notifyDrop : function(dragSource, event, data) {
								return SYS.view.authority.AuthorityManage.addACL2Grid(data.records[0], panel);
								//return SYS.view.authority.AuthorityManage.addACL2Grid(data.node, panel);
							}
						});
						
						var pageDropTarget = new Ext.dd.DropTarget(panel.el, {
							ddGroup : 'pageTree2GridGroup',
							notifyDrop : function(dragSource, event, data) {
								return SYS.view.authority.AuthorityManage.addACL2Grid(data.records[0], panel);
								//return SYS.view.authority.AuthorityManage.addACL2Grid(data.node, panel);
							}
						});
						
						var urlDropTarget = new Ext.dd.DropTarget(panel.el, {
							ddGroup : 'urlTree2GridGroup',
							notifyDrop : function(dragSource, event, data) {
								return SYS.view.authority.AuthorityManage.addACL2Grid(data.records[0], panel);
								//return SYS.view.authority.AuthorityManage.addACL2Grid(data.node, panel);
							}
						});
					}
				}
			},
			listeners : {
				selectionchange : function(model, selected, eOpts) {
					var flag = selected.length > 0 ? true : false;
					var removeButton = this.getDockedItems('toolbar')[0].items.get('removeButton');
					if (flag) {
						removeButton.enable();
					} else {
						removeButton.disable();
					}
				}
			}
		}
	},

	statics : {
		// 内部function,判断一个node是否在gridPanel中
		isNodeInGrid : function(node, gridPanel) {
			if (!node.isLeaf()) {
				return false
			}

			var data = gridPanel.getStore().data;
			var count = data.items.length;
			for (var i = 0; i < count; i++) {
				var id = data.items[i].get('id');
				if (id == node.raw.beanId) {
					return true;
				}
			}
			return false;
		}
	}
});