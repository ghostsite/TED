Ext.define('SYS.view.org.OrgManage', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.SYS.view.org.OrgManage'),
	xtype : 'admin_org',

	buttonsOpt : [{
		itemId : 'btnUpdate',
		text : T('Caption.Button.Save'),
		url : 'organization/save'
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
				fieldLabel : '父机构Id',
				name : 'parentId'
			}, {
				xtype : 'textfield',
				fieldLabel : '父机构名称',
				name : 'parentName',
				readOnly : true
			}, {
				xtype : 'hidden',
				fieldLabel : '机构Id',
				name : 'id'
			}, {
				xtype : 'textfield',
				fieldLabel : '机构名称',
				allowBlank : false,
				name : 'name'
			}, {
				xtype : 'hidden',
				fieldLabel : 'VersionLock',
				name : 'versionLock'
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'textfield',
					fieldLabel : '地址',
					cls : 'marginR5',
					name : 'address',
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : '传真',
					name : 'fax',
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'textfield',
					fieldLabel : '主页',
					name : 'homePage',
					cls : 'marginR5',
					flex : 1
				}, {
					xtype : 'textfield',
					fieldLabel : '电话',
					name : 'telephone',
					flex : 1
				}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'numberfield',
					fieldLabel : '序号',
					name : 'idx',
					minValue : 0,
					flex : 1
				}, {
					xtype : 'displayfield',
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
