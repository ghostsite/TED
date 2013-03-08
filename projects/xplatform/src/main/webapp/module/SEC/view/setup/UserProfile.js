Ext.define('SEC.view.setup.UserProfile', {
	extend : 'MES.view.form.BaseForm',

	requires : [ 'SEC.model.SecViewUserExtOut' ],

	title : T('Caption.Other.Profile'),

	formReader : {
		url : 'service/secViewUserExt.json',
		model : 'SEC.model.SecViewUserExtOut'
	},

	buttonsOpt : [ {
		itemId : 'btnUpdate',
		url : 'service/secUpdateUserExt.json'
	} ],

	initComponent : function() {
		this.callParent();

		var self = this;

		self.formLoad({
			userId : SmartFactory.login.id,
			procstep : '1'
		});
	},

	layout : 'anchor',
	anchor : '100%',

	defaults : {
		labelSeparator : '',
		labelWidth : 130
	},

	// TODO GRP, CMF가 없는 상태에서 만들어진 사용자 정보는 UserSetup에서 GRP, CMF 설정을 해야만 Profile
	// 화면에서 업데이타가 가능하다
	onBeforeUpdate : function(form, addParams, url) {
		// user setup 설정한 cmf, grp 설정을 update시 params로 추가
		Ext.apply(addParams, this.cmf);
		Ext.apply(addParams, this.grp);

		return false;
	},

	// profile 화면에서는 cmf, grp 정보를 설정하지 않기 때문에 user setup 설정한 cmf 정보를 변경하지 않고
	// 로컬에 저장하였다가 그대로 다시 전송한다.
	onAfterFormLoad : function(form, response) {
		var result = response.result;
		if (result.success) {
			var data = result.data;
			this.cmf = {
				userCmf1 : data.userCmf1 || '',
				userCmf2 : data.userCmf2 || '',
				userCmf3 : data.userCmf3 || '',
				userCmf4 : data.userCmf4 || '',
				userCmf5 : data.userCmf5 || '',
				userCmf6 : data.userCmf6 || '',
				userCmf7 : data.userCmf7 || '',
				userCmf8 : data.userCmf8 || '',
				userCmf9 : data.userCmf9 || '',
				userCmf10 : data.userCmf10 || ''
			};
			this.grp = {
				userGrp1 : data.userGrp1 || '',
				userGrp2 : data.userGrp2 || '',
				userGrp3 : data.userGrp3 || '',
				userGrp4 : data.userGrp4 || '',
				userGrp5 : data.userGrp5 || '',
				userGrp6 : data.userGrp6 || '',
				userGrp7 : data.userGrp7 || '',
				userGrp8 : data.userGrp8 || '',
				userGrp9 : data.userGrp9 || '',
				userGrp10 : data.userGrp10 || ''
			};
		}
	},

	items : [ {
		xtype : 'container',
		layout : {
			xtype : 'hbox',
			align : 'stretch'
		},
		anchor : '100%',
		flex : 1,
		items : [ {
			xtype : 'displayfield',
			fieldLabel : T('Caption.Other.User ID'),
			value : SmartFactory.login.id,
			labelWidth : 150,
			flex : 1
		}, {
			xtype : 'textfield',
			name : 'userId',
			flex : 1,
			hidden : true
		} ]
	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Password'),
			name : 'userPassword',
			inputType : 'password',
			labelWidth : 150,
			flex : 1
		}, {
			xtype : 'checkbox',
			boxLabel : T('Caption.Other.Change Password Flag'),
			name : 'chgPassFlag',
			inputValue : 'Y',
			cls : 'marginL10',
			uncheckedValue : 'N',
			flex : 1
		} ]
	}, {
		xtype : 'codeview',
		fieldLabel : T('Caption.Other.Security Group'),
		name : 'secGrpId',
		codeviewName : 'TbSecGroup',
		cls : 'marginR5',
		labelWidth : 150,
		anchor : '50%'
	}, {
		xtype : 'textfield',
		fieldLabel : T('Caption.Other.Email'),
		name : 'emailId',
		cls : 'marginR5',
		labelWidth : 150,
		anchor : '50%'
	}, {
		xtype : 'radiogroup',
		fieldLabel : T('Caption.Other.Sex'),
		width : 400,
		items : [ {
			boxLabel : T('Caption.Other.Male'),
			name : 'sexFlag',
			inputValue : 'M',
			cls : 'marginL10'
		}, {
			boxLabel : T('Caption.Other.Female'),
			name : 'sexFlag',
			inputValue : 'F'
		}, {
			boxLabel : T('Caption.Other.Group'),
			name : 'sexFlag',
			inputValue : 'G'
		} ]
	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Phone Mobile'),
			name : 'phoneMobile',
			labelWidth : 150,
			flex : 1
		}, {
			xtype : 'textfield',
			cls : 'marginL10',
			fieldLabel : T('Caption.Other.Phone Home'),
			name : 'phoneHome',
			labelWidth : 110,
			flex : 1
		} ]
	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Phone Office'),
			name : 'phoneOffice',
			labelWidth : 150,
			flex : 1
		}, {
			xtype : 'textfield',
			cls : 'marginL10',
			fieldLabel : T('Caption.Other.Phone Other'),
			name : 'phoneOther',
			labelWidth : 110,
			flex : 1
		} ]
	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [ {
			xtype : 'datefield',
			fieldLabel : T('Caption.Other.Birthday'),
			name : 'birthday',
			format : 'Y-m-d',
			submitFormat : 'Ymd',
			labelWidth : 150,
			flex : 1
		}, {
			xtype : 'datefield',
			fieldLabel : T('Caption.Other.Enter Date'),
			cls : 'marginL10',
			name : 'enterDate',
			format : 'Y-m-d',
			submitFormat : 'Ymd',
			labelWidth : 110,
			flex : 1
		} ]

	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [ {
			xtype : 'datefield',
			fieldLabel : T('Caption.Other.Retire Date'),
			name : 'retireDate',
			format : 'Y-m-d',
			submitFormat : 'Ymd',
			labelWidth : 150,
			flex : 1
		}, {
			xtype : 'datefield',
			fieldLabel : T('Caption.Other.Expire Date'),
			cls : 'marginL10',
			name : 'expireDate',
			format : 'Y-m-d',
			submitFormat : 'Ymd',
			labelWidth : 110,
			flex : 1
		} ]
	}, {
		xtype : 'separator'
	}, {
		xtype : 'container',
		layout : 'hbox',
		anchor : '50%',
		items : [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Password Change Period '),
			labelWidth : 150,
			flex : 1,
			name : 'passwordChangePeriod'
		}, {
			xtype : 'textfield',
			html : T('Caption.Other.days '), // 문자열 맨 끝에 space 있음
			cls : 'marginL5 marginR5',
			width : 40
		} ]
	}, {
		xtype : 'container',
		layout : 'hbox',
		items : [ {
			xtype : 'checkbox',
			boxLabel : T('Caption.Other.Clear Old Password'),
			margin : '0 0 0 155'
		}, {
			xtype : 'checkbox',
			boxLabel : T('Caption.Other.Must Change Password At Next Login'),
			name : 'changePasswordFlag',
			cls : 'marginL10',
			inputValue : 'Y',
			uncheckedValue : 'N'
		}, {
			xtype : 'checkbox',
			boxLabel : T('Caption.Other.Clear Login Fail Count'),
			name : 'passwordFailCount',
			cls : 'marginL10',
			inputValue : '1',
			uncheckedValue : '0'
		} ]
	}, {
		xtype : 'userstamp',
		anchor : '100%',
		cls : 'marginT7',
		fieldDefaults : {
			labelWidth : 150
		}
	} ]
});