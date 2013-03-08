Ext.define('SYS.view.authority.AuthorityPortlet', {
	extend : 'Ext.app.Portlet',
	alias : 'widget.authorityPortlet',
	height : 250,
	forceFit : true,
	tools : [{
		type : 'gear',
		qtip : '查看此角色拥有的菜单资源',
		handler : function(event, toolEl, panel) {
			var tree = Ext.getCmp('treAuthorityMenuId');
			var gridPanel = panel.up('panel').items.get(0);
			tree.getRootNode().cascadeBy(function(n) {
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
							Ext.Msg.alert("消息", "保存成功!");
						},
						params : params.join('&')
					});
				}
			}],
			columns : [{
				xtype : 'rownumberer'
			}, {
				header : '资源',
				dataIndex : 'resourceName'
			}, {
				header : '动作',
				dataIndex : 'operationName'
			}],

			viewConfig : {
				listeners : {
					render : function(panel) {
						var dropTarget = new Ext.dd.DropTarget(panel.el, {
							ddGroup : 'tree2GridGroup',
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