Ext.define('SYS.view.user2role.User2RoleManage', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.SYS.view.user2role.User2RoleManage'),
	xtype : 'admin_user2role',

	layout : 'fit',

	initComponent : function() {
		this.callParent();

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel');
		var store = Ext.create('SYS.store.User');
		store.getProxy().url = 'user/getUserListByOrgId';// getUserByTypeAndValue
		var self = this;

		return {
			xtype : 'container',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'panel',
				flex: 1,
				cls: 'marginR7',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [{
					xtype : 'treepanel',
					itemId : 'orgTreeId',
					flex : 1,
					rootVisible : true,
					root : {
						expanded : true,
						text : T('Caption.Other.Org'),
						id : 1
					},
					store : Ext.create('Ext.data.TreeStore', {
						proxy : {
							type : 'ajax',
							url : 'organization/getSubOrgListByOrgId',
							reader : {
								type : 'json'
							}
						},
						autoLoad : true,
						nodeParam : 'orgId'
					})
				}]
			}, {
				xtype : 'container',
				title:'用户信息',
				itemId : 'formId',
				flex :3,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [{
					xtype : 'container',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					defaults : {
						flex : 1,
						labelWidth : 60
					},
					items : [{
						xtype : 'combobox',
						fieldLabel : '类型',
						store : Ext.create('Ext.data.ArrayStore', {
							fields : ['searchType', 'searchTypeName'],
							data : [['1', '登录名'], ['2', '用户名'], ['3', '邮箱'], ['4', '状态']]
						}),
						displayField : 'searchTypeName',
						valueField : 'searchType',
						editable : false,
						name : 'searchType',
						itemId : 'searchType',
						cls : 'marginR10',
						listeners : {
							select : function(combo, records) {
								self.fireEvent('selectcbfield', combo, records);
							}
						}
					}, {
						xtype : 'textfield',
						fieldLabel : '值',
						itemId : 'valueId',
						name : 'valueId',
						listeners : {
							specialkey : function(t, e) {
								self.fireEvent('doSearch', t, e);
							}
						}
					}]
				}, {
					xtype : 'grid',
					flex : 1,
					title : '',
					itemId : 'grdInfo',
					cls : 'navyGrid',
					autoScroll : true,
					forceFit : true,
					columnLines : true,
					selModel : selModel,
					viewConfig : {
						plugins : {
							ptype : 'gridviewdragdrop',
							dragGroup : 'firstGridDDGroup'
						}
					},
					store : store,
					columns : [{
						xtype : 'rownumberer'
					}, {
						header : '登录名',
						dataIndex : 'loginName'
					}, {
						header : '姓名',
						dataIndex : 'userName'
					}, {
						header : '邮箱',
						dataIndex : 'email',
						name : 'email'
					}, {
						header : '移动电话',
						dataIndex : 'mobile'
					}, {
						header : '所属机构',
						name : 'orgName',
						dataIndex : 'orgName'
					}],
					listeners : {
						'selectionchange' : function(model, selected, eOpts) {
							self.fireEvent('selectionchange', model, selected, eOpts);
						}
					}
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
				xtype : 'button',
				itemId : 'btnShowRoleUsers',
				iconCls : 'btn-userlist',
				text:'用户'
			},{
				xtype : 'button',
				itemId : 'btnSave',
				iconCls : 'btn-save',
				text:'保存'
			},{
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				cls : 'supplementRefresh',
				itemId : 'btnRefresh',
				width : 24
			}],
			items : [{
				xtype : 'treepanel',
				itemId : 'roleTreeId',
				flex : 1,
				rootVisible : true,
				root : {
					expanded : true,
					text : '基础类型数据',
					id : 0
				},
				store : Ext.create('Ext.data.TreeStore', {
					proxy : {
						type : 'ajax',
						url : 'role/getCurrentUserBiggestSetRoleCascadeWithCheckBox',
						reader : {
							type : 'json'
						}
					},
					autoLoad : true
				})
			}]
		};
	}
});
