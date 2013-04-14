Ext.define('SEC.view.setup.UserProfile', {
	extend : 'MES.view.form.BaseForm',

	requires : ['SYS.model.User'],

	title : T('Caption.Other.Profile'),

	icon : 'image/icon/properties.gif',

	formReader : {
		url : 'user/getUserById',
		model : 'SYS.model.User'
	},

	buttonsOpt : [{
		itemId : 'btnUpdate',
		url : 'user/updateCurrentUser'
	}],

	initComponent : function() {
		this.callParent();
		var self = this;
		self.formLoad({
			userId : SmartFactory.login.id
		});
	},

	layout : 'anchor',
	anchor : '100%',

	defaults : {
		labelSeparator : '',
		labelWidth : 130
	},

	// TODO , 가 없는 상태에서 만들어진 사용자 정보는 UserSetup에서 , 설정을 해야만 Profile
	// 화면에서 업데이타가 가능하다
	onBeforeUpdate : function(form, addParams, url) {
		return true; // check
	},

	onAfterFormLoad : function(form, response) {
		var result = response.result;
		if (result.success) {
			var data = result.data;// do what you want to do.
		}
	},

	items : [{
		xtype : 'container',
		layout : {
			xtype : 'hbox',
			align : 'stretch'
		},
		anchor : '100%',
		flex : 1,
		items : [{
			xtype : 'displayfield',
			fieldLabel : T('Caption.Other.Login Name'),
			value : SmartFactory.login.loginname,
			labelWidth : 130,
			flex : 1
		}, {
			xtype : 'textfield',
			name : 'id',
			flex : 1,
			hidden : true
		}, {
			xtype : 'textfield',
			name : 'loginName',
			value : SmartFactory.login.loginname,
			flex : 1,
			hidden : true
		}]
	}, {
		xtype : 'textfield',
		fieldLabel : T('Caption.Other.User Name'),
		name : 'userName',
		cls : 'marginTR5',
		labelWidth : 130,
		anchor : '50%'
	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [{
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Password'),
			name : 'password',
			inputType : 'password',
			cls : "marginR10",
			labelWidth : 130,
			flex : 1
		}, {
			xtype : 'checkbox',
			boxLabel : T('Caption.Other.Change Password Flag'),
			name : 'needToUpdatePwd',
			inputValue : 1,
			uncheckedValue : 0,
			flex : 1
		}]
	}, {
		xtype : 'textfield',
		fieldLabel : T('Caption.Other.Email'),
		name : 'email',
		cls : 'marginTR5',
		labelWidth : 130,
		anchor : '50%'
	}, {
		xtype : 'radiogroup',
		fieldLabel : T('Caption.Other.Sex'),
		width : 400,
		items : [{
			boxLabel : T('Caption.Other.Male'),
			name : 'sex',
			inputValue : 1
		}, {
			boxLabel : T('Caption.Other.Female'),
			name : 'sex',
			inputValue : 0
		}]
	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [{
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Phone Mobile'),
			name : 'mobile',
			cls : 'marginR10',
			labelWidth : 130,
			flex : 1
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Phone Home'),
			name : 'phoneHome',
			labelWidth : 110,
			flex : 1
		}]
	}, {
		xtype : 'container',
		layout : 'hbox',
		cls : 'marginT5',
		items : [{
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Phone Office'),
			name : 'phoneWork',
			cls : 'marginR10',
			labelWidth : 130,
			flex : 1
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Phone Other'),
			name : 'phoneOther',
			labelWidth : 110,
			flex : 1
		}]
	}, {
		xtype : 'container',
		layout : 'hbox',
		cls : 'marginT5',
		items : [{
			xtype : 'datefield',
			fieldLabel : T('Caption.Other.Birthday'),
			name : 'birthday',
			format : 'Y-m-d',
			submitFormat : 'Y-m-d',
			cls : 'marginR10',
			labelWidth : 130,
			flex : 1
		}, {
			xtype : 'datefield',
			fieldLabel : T('Caption.Other.Enter Date'),
			name : 'enterDate',
			format : 'Y-m-d',
			submitFormat : 'Y-m-d',
			labelWidth : 110,
			flex : 1
		}]
	}, {
		xtype : 'textfield',
		fieldLabel : T('Caption.Other.Address'),
		cls : "marginT5",
		anchor : '100%',
		name : "address"
	}, {
		xtype : 'textarea',
		fieldLabel : T('Caption.Other.Remark'),
		cls : "marginT5",
		anchor : '100%',
		name : "remark"
	}, {
		xtype : 'separator'
	}]
});