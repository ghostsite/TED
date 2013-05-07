Ext.define('SYS.view.role.RoleManage', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.SYS.view.role.RoleManage'),
	xtype : 'admin_role',

	buttonsOpt : [{
		itemId : 'btnUpdate',
		text : T('Caption.Button.Save'),
		url : 'role/save'
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
				name : 'parentId'//原来是parent.id，但是MenuResource.java的getParent配置为JsonIgnore了。so use getParentId()
			}, {
				xtype : 'hidden',
				fieldLabel : '角色Id',
				name : 'id'
			}, {
				xtype : 'textfield',
				fieldLabel : '父菜单名称',
				name : 'parentName',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : '角色值',
				name : 'code'
			}, {
				xtype : 'textfield',
				fieldLabel : '角色名称 ',
				name : 'name'
			}, {
				xtype : 'textarea',
				fieldLabel : '备注',
				name : 'remark'
			}, {
				xtype : 'container',
				layout : 'hbox',
				items : [{
					xtype : 'numberfield',
					fieldLabel : '序号',
					minValue : 0,
					width : 260,
					name : 'idx'
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
				itemId : 'roleTreeId',
				flex : 1,
				rootVisible : false,
				root : {
					expanded : true,
					text : '角色',
					id : null
				},
				store : Ext.create('Ext.data.TreeStore', {
					proxy : {
						type : 'ajax',
						url : 'role/getSubRoleListByRoleId',
						reader : {
							type : 'json'
						}
					},
					autoLoad : true,
					nodeParam : 'roleId'
				}),
				contextMenu : Ext.create('Ext.menu.Menu', {
					items : [{
						text : '新增子角色',
						iconCls : 'icon-add',
						action : 'showCreate'
					}, {
						text : '修改角色',
						iconCls : 'icon-modify',
						action : 'showUpdate'
					}, '-', {
						text : '删除角色',
						iconCls : 'icon-remove',
						action : 'doDelete'
					}]
				})
			}]
		};
	}
});
