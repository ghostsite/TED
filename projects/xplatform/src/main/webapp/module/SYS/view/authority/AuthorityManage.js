Ext.define('SYS.view.authority.AuthorityManage', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.SYS.view.authority.AuthorityManage'),
	xtype : 'admin_authority',
	uses : ['Ext.ux.portal.PortalPanel', 'Ext.ux.portal.PortalColumn', 'SYS.view.authority.AuthorityPortlet'],
	layout : 'fit',

	initComponent : function() {
		this.callParent();

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function() {
		return {
			xtype : 'portalpanel',
			layout:'fit',
			id : 'portalid',
			tbar : [this.createRoleMenuButton(), this.createAddAllButton(), '-', this.createSaveAllButton()],
			items : [{
				id : 'col-1',
				items : []
			}, {
				id : 'col-2',
				items : []
			}, {
				id : 'col-3',
				items : []
			}]
		};
	},

	// 创建toobar中的menubutton
	createRoleMenuButton : function() {
		var self = this;
		var menu = Ext.create('Ext.menu.Menu', {});

		var statics = this.statics();
		Ext.Ajax.request({
			method : 'GET',
			url : 'role/getRolesCascadeByRoleList',
			success : function(response) {
				var roleMenu = Ext.decode(response.responseText);
				statics.trimMenuCascade(roleMenu);
				statics.setCheckHandlerCascade(roleMenu);
				menu.add(roleMenu.items);
				statics.addCheckItemCheckChangedListenerCascade(menu);
			}
		});
		return Ext.create('Ext.button.Button', {
			text : '选择角色',
			iconCls : 'bmenu',
			menu : menu
		});
	},

	// 创建添加所有的button in toolbar
	createAddAllButton : function() {
		var statics = this.statics();
		return {
			text : '添加所有',//对于选中的菜单等(只对当天activeTabPanel,不知针对tabPanel下的所有的panel)权限，添加到所有的portlet中。
			tooltip : '添加所有',
			iconCls : 'icon-add',
			handler : function(button, e) {
				var checkedNodeList = [];
				var supTabPanel = Ext.getCmp('authoritySupId');
				var activeTabTree = supTabPanel.getTabPanel().getActiveTab(); //activeTab is a tree
				//var tree = Ext.getCmp('treAuthorityMenuId');
				activeTabTree.getRootNode().cascadeBy(function(n) {
					if (n.isLeaf() && n.get('checked')) {
						checkedNodeList.push(n);
					}
				});
				statics.addACLListPortal(checkedNodeList, button.ownerCt.ownerCt);
			}
		}
	},

	// 创建保存所有的button in toolbar
	createSaveAllButton : function() {
		var statics = this.statics();
		return {
			text : '保存所有',
			tooltip : '保存所有角色拥有的权限',
			iconCls : 'btn-save',
			handler : function(button, e) {
				var portal = button.ownerCt.ownerCt;
				var gridPanels = statics.getAllGridPanels(portal);
				Ext.each(gridPanels, function(gridPanel) {
					var saveButtons = gridPanel.getDockedItems('toolbar')[0].query('button[text=保存]');
					if (null != saveButtons && saveButtons.length > 0) {
						var saveButton = saveButtons[0];
						if (saveButton.handler) {
							saveButton.handler.call(saveButton.scope || saveButton, saveButton);
						}
					}
				});
			}
		}
	},

	buildSupplement : function() {
		var menuStore = Ext.create('Ext.data.TreeStore', {
			autoLoad : true,
			nodeParam : 'resourceId',
			proxy : {
				type : 'ajax',
				url : 'menuresource/getSubMenusCascadeFilterByRoleWithACLCheckBox'
			},
			root : {
				text : '菜单',
				id : null,
				expanded : true
			}
		});
		
		var fileStore = Ext.create('Ext.data.TreeStore', {
			autoLoad : true,
			nodeParam : 'resourceId',
			proxy : {
				type : 'ajax',
				url : 'fileresource/getFilesFilterByRoleWithACLCheckBox'
			},
			root : {
				text : '文件',
				id : null,
				expanded : true
			}
		});

		return { //注意：这个tabPanel是eager load，一次加载3个也Panel页面。so，操作的可以操作3个panel.
			xtype : 'tabssup',
			title : '资源',
			tabPosition : 'bottom',
			id : 'authoritySupId',
			tabs : [{
				xtype : 'treepanel',
				id : 'treAuthorityMenuId',
				itemId : 'treAuthorityMenuId',
				title : '菜单',
				//iconCls : 'navi',
				icon:'image/menuIcon/0004_16.png',
				autoScroll : true,
				store : menuStore,
				rootVisible : false,
				viewConfig : {
					plugins : {
						ptype : 'treeviewdragdrop',
						dragGroup : 'menuTree2GridGroup'
					}
				},
				listeners : {
					'checkchange' : {
						fn : function(node, checked) {
							SF.setCheckedCascade(node, checked);
						}
					}
				},
				tbar : [{
					cls : 'navRefreshBtn',
					tooltip:'展开所有',
					listeners : {
						click : function(button) {
							Ext.getCmp('treAuthorityMenuId').expandAll();
						}
					}
				}]
			}, {
				xtype : 'treepanel',
				title : '文件',
				id : 'treAuthorityFileId',
				itemId : 'treAuthorityFileId',
				//iconCls : 'navi',
				icon:'image/menuIcon/0003_16.png',
				autoScroll : true,
				store : fileStore,
				rootVisible : false,
				viewConfig : {
					plugins : {
						ptype : 'treeviewdragdrop',
						dragGroup : 'fileTree2GridGroup'
					}
				},
				listeners : {
					'checkchange' : {
						fn : function(node, checked) {
							SF.setCheckedCascade(node, checked);
						}
					}
				},
				tbar : [{
					cls : 'navRefreshBtn',
					tooltip:'展开所有',
					listeners : {
						click : function(button) {
							Ext.getCmp('treAuthorityFileId').expandAll();
						}
					}
				}]
			}, {
				title : '页面元素',
				html : '虚位以待',
				autoScroll : true
			}]
		};
	},

	statics : {
		// 组1:2Role Menu的Trim，把menu:null的删除
		trimMenuCascade : function(roleMenu) {
			var length = roleMenu.items.length;
			for (var i = 0; i < length; i++) {
				var item = roleMenu.items[i];
				if (item.menu == null || item.menu.items == null || item.menu.items.length == 0) {
					delete item.menu;
				} else {
					SYS.view.authority.AuthorityManage.trimMenuCascade(item.menu);
				}
			}
		},
		// 工具方法：给1个portlet 中的grid
		// 中添加一个acl，还需要校验是否重复。
		addACL2Grid : function(node, panel) {
			if (!node.isLeaf()) { // 非叶子节点不能添加
				return;
			}

			var found = panel.getStore().query('id', node.raw.beanId);
			if (found.length == 0) {
				var parentNode = node.parentNode;
				var acl = Ext.create('SYS.model.ACL', {
					id : node.raw.beanId,
					resourceName : parentNode.raw.text,
					operationName : node.raw.text,
					type : parentNode.raw.type
				});
				panel.getStore().add(acl);
				return true;
			} else {
				return false;
			}
		},

		// 工具方法：给1个portlet中的 grid
		// 中添加多个acl，还需要校验是否重复。
		addACLList2Grid : function(nodes, panel) {
			Ext.Array.each(nodes, function(node) {
				SYS.view.authority.AuthorityManage.addACL2Grid(node, panel);
			});
		},

		// 工具方法：给N个portlet中的grid grid
		// 中添加多个acl，还需要校验是否重复。
		addACLList2GridList : function(nodes, panels) {
			Ext.Array.each(nodes, function(node) {
				Ext.Array.each(panels, function(panel) {
					SYS.view.authority.AuthorityManage.addACL2Grid(node, panel);
				});
			});
		},

		// 给portal中添加多个ACLList
		addACLListPortal : function(nodes, portal) {
			var gridPanels = SYS.view.authority.AuthorityManage.getAllGridPanels(portal);
			SYS.view.authority.AuthorityManage.addACLList2GridList(nodes, gridPanels);
		},
		
		// 获得portal下所有的portlet
		getAllPortlets : function(portal) {
			var length = portal.items.length;
			var portlets = [];
			for (var i = 0; i < length; i++) {
				var columnPanel = portal.items.get(i);
				var columnPanelItemsLength = columnPanel.items.length;
				for (var j = 0; j < columnPanelItemsLength; j++) {
					var portlet = columnPanel.items.get(j);
					portlets.push(portlet);
				}
			}
			return portlets;
		},

		// 获得portal下所有的gridPanel
		getAllGridPanels : function(portal) {
			var portlets = SYS.view.authority.AuthorityManage.getAllPortlets(portal);
			var gridPanels = [];
			Ext.Array.each(portlets, function(portlet) {
				gridPanels.push(portlet.items.get(0));
			});
			return gridPanels;
		},

		// 组1:1右边 角色级联菜单的CheckAl Function
		checkAllFun : function(item, checked) {
			var allitems = item.ownerCt.items;
			var isChecked = item.checked;
			for (var i = 2; i < allitems.length; i++) {
				var one = allitems.get(i);
				one.setChecked(isChecked);
			}
		},

		// 组1:3 "checkHandler" :
		// ".role.checkAllFun" "checkHandler" :
		// null 把字符串转化为function
		setCheckHandlerCascade : function(roleMenu) {
			if (roleMenu == null || roleMenu.items == null || roleMenu.items.length == 0) {
				return;
			}
			var length = roleMenu.items.length;
			for (var i = 0; i < length; i++) {
				var item = roleMenu.items[i];
				item.checkHandler = eval(item.checkHandler);
				/**
				 * if(item.checkHandler == null){ delete item.checkHandler; }
				 * if(".role.checkAllFun" === item.checkHandler){
				 * item.checkHandler = eval(.role.checkAllFun); }
				 */
				SYS.view.authority.AuthorityManage.setCheckHandlerCascade(item.menu);
			}
		},

		// 检查portlet是否在portal中, for 1:4 , beanId is roleId
		getPortletByRoleId : function(baseItem) {
			var porlets = Ext.ComponentQuery.query('authorityPortlet[roleId=' + baseItem.beanId + ']');
			if (porlets != null && porlets.length > 0) { // 找到
				return porlets[0];
			} else {
				return null;
			}
		},

		// 组1:4 listener instance, baseItem is roleId
		checkItemCheckChangedListener : function(baseItem, checked) {
			if (baseItem.text == '选择所有') {
				var nextAllItems = baseItem.parentMenu.query('> menucheckitem'); // [text
				// !=选择所有]
				// 不管用
				Ext.Array.each(nextAllItems, function(item) {
					if (item.text != '选择所有') {
						item.setChecked(checked);
					}
				});
				return;
			}

			if (checked) {
				if (SYS.view.authority.AuthorityManage.getPortletByRoleId(baseItem) != null) {
					return;
				} else {
					var newone = Ext.widget('authorityPortlet', {
						title : baseItem.text,
						roleId : baseItem.beanId
					});
					var portal = Ext.getCmp('portalid');

					var allsize = [];
					allsize.push(portal.getComponent(0));
					allsize.push(portal.getComponent(1));
					allsize.push(portal.getComponent(2));
					var minSizeCmp = Ext.Array.min(allsize, function(a, b) {
						return a.items.length > b.items.length ? 1 : -1;
					});
					minSizeCmp.add(newone);
				}
			} else {// remove portlet in portal
				var portlet = SYS.view.authority.AuthorityManage.getPortletByRoleId(baseItem);
				if (null != portlet) {
					portlet.ownerCt.remove(portlet);
				}
			}
		},

		// 组1:5Role Menu的listeners:'itemclick'
		addCheckItemCheckChangedListenerCascade : function(roleMenu) {
			var length = roleMenu.items.length;
			for (var i = 0; i < length; i++) {
				var item = roleMenu.items.get(i);
				if (item) {
					item.on({
						'checkchange' : SYS.view.authority.AuthorityManage.checkItemCheckChangedListener
					});
				}
				if (item.menu) {
					SYS.view.authority.AuthorityManage.addCheckItemCheckChangedListenerCascade(item.menu);
				}
			}
		}
	}
});
