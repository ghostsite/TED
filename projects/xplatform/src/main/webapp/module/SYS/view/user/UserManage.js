Ext.define('SYS.view.user.UserManage', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.SYS.view.user.UserManage'),
	xtype : 'admin_user',

	buttonsOpt : [{
		itemId : 'btnDelete',
		url : 'user/deleteAll',
		disabled : true,
		confirm : {
			msg : T('Message.Sure Delete Data?')
		}
	}],

	layout : 'fit',

	addBtnResetPwd : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '密码重置',
			itemId : 'btnResetpwd',
			disabled : true,
			handler : function(t, e) {
				me.fireEvent('btnResetPwd', t, e);
			}
		};
	},

	addBtnShowCreate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '创建',
			itemId : 'btnShowCreate',
			disabled : true,
			handler : function(t, e) {
				me.fireEvent('btnShowCreate', t, e);
			}
		}
	},

	addBtnShowUpdate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '修改',
			itemId : 'btnShowUpdate',
			disabled : true,
			handler : function(t, e) {
				me.fireEvent('btnShowUpdate', t, e);
			}
		}
	},

	initComponent : function() {
		this.callParent();

		var basebuttons = this.getButtons();
		basebuttons.insert(0, this.addBtnResetPwd());
		basebuttons.insert(2, this.addBtnShowUpdate());
		basebuttons.insert(2, this.addBtnShowCreate());

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel');
		var store = Ext.create('SYS.store.User');
		store.getProxy().url = 'user/getUserListByOrgId'; // or
		// getUserByTypeAndValue
		var self = this;

		return {
			xtype : 'container',
			itemId : 'formId',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'fieldcontainer',
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
					header : '办公电话',
					dataIndex : 'telephone'
				}, {
					header : '性别',
					renderer : function(val) {
						if (val == '0') {
							return '<span style="color:green;">' + '男' + '</span>';
						} else if (val == '1') {
							return '<span style="color:red;">' + '女' + '</span>';
						}
						return val;
					},
					dataIndex : 'sex'
				}, {
					header : '状态',
					renderer : function(val) {
						if (val == '0') {
							return '<span style="color:red;">' + '停用' + '</span>';
						} else if (val == '1') {
							return '<span style="color:green;">' + '启用' + '</span>';
						}
						return val;
					},
					dataIndex : 'state'
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
				itemId : 'orgTreeId',
				flex : 1,
				rootVisible : true,
				root : {
					expanded : true,
					text : T('Caption.Other.Org'),
					id : null
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
				}),
				contextMenu : Ext.create('Ext.menu.Menu', {
					items : [{
						text : '新增子组织',
						iconCls : 'icon-add',
						action : 'showCreate'
					}, {
						text : '修改组织',
						iconCls : 'icon-modify',
						action : 'showUpdate'
					}, '-', {
						text : '删除组织',
						iconCls : 'icon-remove',
						action : 'doDelete'
					}]
				})
			}]
		};
	}
});
