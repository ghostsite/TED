Ext.define('SYS.view.type.TypeManage', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.SYS.view.type.TypeManage'),
	xtype : 'admin_type',

	buttonsOpt : [{
		itemId : 'btnUpdate',
		text : T('Caption.Button.Save'),
		url : 'type/save'
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
				fieldLabel : '父基础类型Id',
				name : 'parentId'
			}, {
				xtype : 'textfield',
				fieldLabel : '父基础类型名称',
				name : 'parentName',
				readOnly : true
			}, {
				xtype : 'hidden',
				fieldLabel : '基础类型Id',
				name : 'id'
			}, {
				xtype : 'hidden',
				fieldLabel : 'leafId',
				name : 'leaf'
			}, {
				xtype : 'textfield',
				fieldLabel : '基础类型code',
				name : 'code'
			}, {
				xtype : 'textfield',
				fieldLabel : '基础类型名称',
				name : 'name'
			}, {
				xtype : 'textarea',
				fieldLabel : '备注',
				name : 'remark'
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelWidth : 100
				},
				items : [{
					xtype : 'numberfield',
					fieldLabel : '序号',
					minValue : 0,
					flex : 1,
					name : 'idx'
				}, {
					xtype : 'displayfield',
					flex : 2
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
				itemId : 'typeTreeId',
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
						url : 'type/getSubTypeListByTypeId',
						reader : {
							type : 'json'
						}
					},
					autoLoad : true,
					nodeParam : 'typeId'
				}),
				contextMenu : Ext.create('Ext.menu.Menu', {
					items : [{
						text : '新增子类型数据',
						iconCls : 'icon-add',
						action : 'showCreate'
					}, {
						text : '修改类型数据',
						iconCls : 'icon-modify',
						action : 'showUpdate'
					}, '-', {
						text : '删除类型数据',
						iconCls : 'icon-remove',
						action : 'doDelete'
					}]
				})
			}]
		};
	}
});
