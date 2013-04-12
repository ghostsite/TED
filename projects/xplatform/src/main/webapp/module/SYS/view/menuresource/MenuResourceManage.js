Ext.define('SYS.view.menuresource.MenuResourceManage', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.SYS.view.menuresource.MenuResourceManage'),
	xtype : 'admin_menuresource',

	buttonsOpt : [{
		itemId : 'btnUpdate',
		text : T('Caption.Button.Save'),
		url : 'menuresource/save'
	}],

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function() {
		return {
			xtype : 'container',
			cls : 'paddingAll7',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			defaults : {
				xtype : 'textfield',
				labelWidth : 100
			},
			items : [{
				xtype : 'hidden',
				fieldLabel : '父菜单Id',
				name : 'parentId' // 原来是parent.id，但是MenuResource.java的getParent配置为JsonIgnore了。so
				// use getParentId()
			}, {
				xtype : 'hidden',
				fieldLabel : '菜单Id',
				name : 'id'
			}, {
				xtype : 'hidden',
				fieldLabel : 'VersionLock',
				name : 'versionLock'
			}, {
				xtype : 'textfield',
				fieldLabel : '父菜单名称',
				name : 'parentName',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : '菜单值',
				name : 'code'
			}, {
				xtype : 'textfield',
				fieldLabel : '菜单名称 ',
				name : 'name'
			}, {
				xtype : 'textfield',
				fieldLabel : '菜单路径',
				name : 'path'
			}, {
				xtype : 'textarea',
				fieldLabel : '备注',
				name : 'description'
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'textfield',
					fieldLabel : '信息提示',
					name : 'quicktip',
					cls : 'marginR10',
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : '图标CSS',
					name : 'iconCls',
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				cls : 'paddingT7',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'combobox',
					fieldLabel : 'ICON',
					name : 'icon',
					cls : 'marginR10',

					store : Ext.create('Ext.data.Store', {
						fields : ['path', 'shortpath'],
						proxy : {
							type : 'ajax',
							url : 'menuresource/getMenuIconList/16',
							reader : {
								type : 'json'
							}
						},
						autoLoad : true
					}),
					queryMode : 'local',
					displayField : 'path',
					valueField : 'path',
					listConfig : {
						getInnerTpl : function(displayField) {
							// return '<img src="{path}" class="icon"/> {' + displayField + '}';
							return '<img src="{path}" class="icon"/> {shortpath}';
						}
					},
					flex : 1
				}, {
					xtype : 'combobox',
					fieldLabel : 'ICON2',
					name : 'icon2',
					
					store : Ext.create('Ext.data.Store', {
						fields : ['path', 'shortpath'],
						proxy : {
							type : 'ajax',
							url : 'menuresource/getMenuIconList/32',
							reader : {
								type : 'json'
							}
						},
						autoLoad : true
					}),
					queryMode : 'local',
					displayField : 'path',
					valueField : 'path',
					listConfig : {
						getInnerTpl : function(displayField) {
							// return '<img src="{path}" class="icon"/> {' + displayField + '}';
							return '<img src="{path}" class="icon"/> {shortpath}';
						}
					},
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				cls : 'paddingT7',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'numberfield',
					fieldLabel : 'buttonWidth',
					name : 'buttonWidth',
					minValue : 0,
					cls : 'marginR10',
					flex : 1
				}, {
					xtype : 'numberfield',
					fieldLabel : 'buttonIconAlign',
					name : 'buttonIconAlign',
					minValue : 0,
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				cls : 'paddingT7',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'numberfield',
					fieldLabel : '序号',
					name : 'idx',
					minValue : 0,
					cls : 'marginR10',
					flex : 1
				}, {
					xtype : 'checkbox',
					fieldLabel : '节点类型',
					boxLabel : '叶子',
					name : 'leaf',
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				cls : 'paddingT7',
				defaults : {
					labelWidth : 100
				},
				items : [{
					flex : 1,
					xtype : 'container',
					layout : 'hbox',
					cls : 'marginR10',
					items : [{
						xtype : 'checkbox',
						fieldLabel : '权限',
						boxLabel : '查看',
						name : 'canView'
					}, {
						xtype : 'checkbox',
						fieldLabel : '',
						boxLabel : '新增',
						cls : 'marginRL10',
						name : 'canAdd'
					}, {
						xtype : 'checkbox',
						fieldLabel : '',
						boxLabel : '更新',
						cls : 'marginRL10',
						name : 'canUpdate'
					}, {
						xtype : 'checkbox',
						fieldLabel : '',
						cls : 'marginRL10',
						boxLabel : '删除',
						name : 'canDelete'
					}]
				}, {
					xtype : 'checkbox',
					fieldLabel : '快捷方式',
					boxLabel : '是',
					name : 'favorite',
					flex : 1
				}]
			}]
		};
	},

	buildSupplement : function() {
		return {
			xtype : 'panel',
			bodyStyle : 'padding:3px',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			bbar : [{
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				cls : 'supplementRefresh',
				itemId : 'btnRefresh',
				width : 24
			}],
			items : [{
				xtype : 'treepanel',
				itemId : 'menuResourceTreeId',
				flex : 1,
				rootVisible : true,
				root : {
					expanded : true,
					text : '菜单',
					id : null
				},
				store : Ext.create('Ext.data.TreeStore', {
					proxy : {
						type : 'ajax',
						url : 'menuresource/getSubMenuResourceListByResourceId',
						reader : {
							type : 'json'
						}
					},
					autoLoad : true,
					nodeParam : 'resourceId'
				}),
				contextMenu : Ext.create('Ext.menu.Menu', {
					items : [{
						text : '新增子菜单',
						iconCls : 'icon-add',
						action : 'showCreate'
					}, {
						text : '修改菜单',
						iconCls : 'icon-modify',
						action : 'showUpdate'
					}, '-', {
						text : '删除菜单',
						iconCls : 'icon-remove',
						action : 'doDelete'
					}]
				})
			}]
		};
	}
});
