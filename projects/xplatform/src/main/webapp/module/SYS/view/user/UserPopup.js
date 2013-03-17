Ext.define('SYS.view.user.UserPopup', {
	extend : 'BAS.view.common.BasePopup',
	xtype : 'admin_userpopup',
	title : '用户信息',
	autoScroll : true,
	width : 600,
	height : 400,
	modal : true,
	layout : 'fit',

	dockedItems : [{
		xtype : 'bas_base_buttons',
		items : ['->', 'Save', 'Close']
	}],

	initComponent : function() {
		this.items = [this.buildForm(this)];
		this.callParent();
	},

	buildForm : function(me) {
		return {
			xtype : 'form',
			layout : 'anchor',
			itemId : 'formId',
			items : {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				defaults : {
					labelWidth : 60
				},
				items : [{
					xtype : 'displayfield',
					name : 'organization.name',
					itemId : 'organization.name',
					fieldLabel : '所属部门',
					cls : 'marginB7',
					readOnly : true
				}, {
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
						xtype : 'textfield',
						allowBlank : false,
						invalidText : '登录名必填',
						fieldLabel : '登录名',
						name : 'loginName'
					}, {
						xtype : 'textfield',
						fieldLabel : '用户名',
						name : 'userName'
					}]
				}, {
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
						xtype : 'textfield',
						fieldLabel : '移动电话',
						name : 'mobile'
					}, {
						xtype : 'textfield',
						fieldLabel : '办公电话',
						name : 'telephone'
					}]
				}, {
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
						xtype : 'radiogroup',
						fieldLabel : '性别',
						// width : 220,
						columns : 3,
						vertical : false,
						items : [{
							boxLabel : '男',
							name : 'sex',
							inputValue : 0
						}, {
							boxLabel : '女',
							name : 'sex',
							inputValue : 1,
							checked : true
						}]
					}, {
						xtype : 'combobox',
						fieldLabel : '状态',
						store : Ext.create('Ext.data.ArrayStore', {
							fields : ['stateValue', 'stateName'],
							data : [[1, '启用'], [0, '停用']]
						}),
						displayField : 'stateName',
						valueField : 'stateValue',
						editable : false,
						name : 'state',
						itemId : 'state'
					}]
				}, {
					xtype : 'textfield',
					fieldLabel : '地址',
					name : 'address'
				}, {
					xtype : 'textarea',
					fieldLabel : '备注',
					name : 'remark'
				}, {
					xtype : 'hidden',
					name : 'id',
					itemId : 'id'
				}, {
					xtype : 'hidden',
					name : 'versionLock'
				}, {
					xtype : 'hidden',
					name : 'organization.id',
					itemId : 'organization.id'
				}]
			}
		};
	}
});