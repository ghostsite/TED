Ext.define('SYS.view.user2role.RoleContainUsersPopup', {
	extend : 'BAS.view.common.BasePopup',
	xtype : 'admin_rolecontainuserspopup',
	title : '角色下的用户',
	autoScroll : true,
	width : 600,
	height : 400,
	modal : true,
	layout : 'fit',
	modal : false,// 是否为模式窗口
	icon  : 'image/icon/wlorb.png',

	dockedItems : [{
		xtype : 'bas_base_buttons',
		items : ['->', {
			itemId : 'btnDelete',
			text : '删除',
			disabled : true
		}, 'Save', 'Close']
	}],

	initComponent : function() {
		this.items = [this.buildForm(this)];
		this.callParent();
	},

	buildForm : function(me) {
		var roleHasUsersStore = Ext.create('Ext.data.Store', {
			model : 'SYS.model.User',
			proxy : {
				type : 'ajax',
				url : 'role/getUserListByRoleId',
				reader : {
					type : 'json',
					root : 'result',
					successProperty : 'success'
				}
			}
		});

		return {
			xtype : 'grid',
			enableDrop : true,
			store : roleHasUsersStore,
			forceFit : true,
			selModel : Ext.create('Ext.selection.CheckboxModel'),
			columns : [{
				xtype : 'rownumberer'
			}, {
				id : 'loginName',
				header : '登录名',
				dataIndex : 'loginName'
			}, {
				header : '姓名',
				dataIndex : 'userName'
			}, {
				header : '邮箱',
				dataIndex : 'email',
				id : 'email',
				name : 'email'
			}, {
				header : '状态',
				id : 'state',
				dataIndex : 'state'
			}, {
				header : '所属机构',
				id : 'orgName',
				name : 'orgName',
				dataIndex : 'orgName'
			}]
		};
	}
});