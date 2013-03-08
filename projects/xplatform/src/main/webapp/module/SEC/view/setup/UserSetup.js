Ext.define('SEC.view.setup.UserSetup', {
	extend : 'MES.view.form.BaseFormTabsEntity',

	title : T('Caption.Other.User Setup'),

	requires : [ 'SEC.model.SecViewUserExtOut' ],

	groupItemName : SF_GRP_USER,
	cmfItemName : SF_CMF_USER,

	groupFieldNamePrefix : 'userGrp',
	cmfFieldNamePrefix : 'userCmf',

	formReader : {
		url : 'service/secViewUserExt.json',
		model : 'SEC.model.SecViewUserExtOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/secUpdateUserExt.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/secUpdateUserExt.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/secUpdateUserExt.json',
		confirm : {
			fields : {
				field1 : 'userId'
			}
		}
	} ],

	initComponent : function() {
		this.callParent();

		var self = this;

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.reloadForm(record);
			});
		});
	},

	reloadForm : function(record) {
		if (Ext.isString(record) === true) {
			this.formLoad({
				userId : record,
				procstep : '1'
			});
		} else {
			this.formLoad({
				userId : record.get('userId'),
				procstep : '1'
			});
		}
	},
	
	onAfterCreate : function(form, action, success) {
		if (success) {
			var userId = form.getValues().userId;
			var select = {
				column : 'userId',
				value : userId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var userId = form.getValues().userId;
			var select = {
				column : 'userId',
				value : userId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterDelete : function(form, action, success) {
		if (!success)
			return;
		this.getSupplement().refreshGrid(true);
		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			grid : {
				procstep : '1',
				store : Ext.create('SEC.store.SecViewUserListOut.List'),
				columns : [ {
					header : T('Caption.Other.User ID'),
					dataIndex : 'userId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'userDesc',
					flex : 1
				} ]
			}
		};
	},

	buildTopPart : function(main) {
		return [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.User ID'),
			name : 'userId',
			maxLength : 20,
			enforceMaxLength : true,
			labelWidth : 140,
			allowBlank : false,
			labelStyle : 'font-weight:bold'
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			maxLength : 50,
			labelWidth : 140,
			enforceMaxLength : true,
			name : 'userDesc'
		} ];
	},

	buildAttributeSetupTab : Ext.emptyFn,

	buildGeneralTab : function(main) {
		return {
			xtype : 'container',
			layout : 'anchor',
			title : T('Caption.Other.General'),
			cls : 'paddingAll7',
			defaults : {
				labelSeparator : '',
				labelWidth : 130
			},
			items : [ {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelSeparator : '',
					labelWidth : 130,
					flex : 1
				},
				items : [ {
					xtype : 'textfield',
					name : 'userPassword',
					maxLength : 20,
					enforceMaxLength : true,
					fieldLabel : T('Caption.Other.Password'),
					labelStyle : 'font-weight:bold',
					inputType : 'password'
				}, {
					xtype : 'checkbox',
					name : 'chgPassFlag',
					cls : 'marginL10',
					boxLabel : T('Caption.Other.Change Password Flag'),
					inputValue : 'Y',
					uncheckedValue : 'N'
				} ]
			}, {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Security Group'),
				labelStyle : 'font-weight:bold',
				name : 'secGrpId',
				anchor : '50%',
				codeviewName : 'TbSecGroup'
			}, {
				xtype : 'textfield',
				anchor : '100%',
				fieldLabel : T('Caption.Other.Email'),
				maxLength : 50,
				enforceMaxLength : true,
				name : 'emailId'
			}, {
				xtype : 'radiogroup',
				fieldLabel : T('Caption.Other.Sex'),
				labelStyle : 'font-weight:bold',
				items : [ {
					boxLabel : T('Caption.Other.Male'),
					name : 'sexFlag',
					inputValue : 'M'
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
				defaults : {
					labelSeparator : '',
					labelWidth : 130,
					flex : 1
				},
				items : [ {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Phone Office'),
					name : 'phoneOffice',
					maxLength : 20,
					enforceMaxLength : true
				}, {
					xtype : 'datefield',
					cls : 'marginL5',
					fieldLabel : T('Caption.Other.Birthday'),
					name : 'birthday',
					format: 'Y-m-d',
					submitFormat : 'Ymd'
				} ]
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelSeparator : '',
					labelWidth : 130,
					flex : 1
				},
				items : [ {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Phone Home'),
					name : 'phoneHome',
					maxLength : 20,
					enforceMaxLength : true
				}, {
					xtype : 'datefield',
					cls : 'marginL5',
					fieldLabel : T('Caption.Other.Enter Date'),
					name : 'enterDate',
					format: 'Y-m-d',
					submitFormat : 'Ymd'
				} ]
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelSeparator : '',
					labelWidth : 130,
					flex : 1
				},
				items : [ {
					xtype : 'textfield',
					fieldLabel : T('Caption.Other.Phone Mobile'),
					name : 'phoneMobile',
					maxLength : 20,
					enforceMaxLength : true
				}, {
					xtype : 'datefield',
					cls : 'marginL5',
					fieldLabel : T('Caption.Other.Retire Date'),
					name : 'retireDate',
					format: 'Y-m-d',
					submitFormat : 'Ymd'
				} ]
			}, {
				xtype : 'textfield',
				anchor : '100%',
				fieldLabel : T('Caption.Other.Phone Other'),
				name : 'phoneOther',
				maxLength : 20,
				enforceMaxLength : true
			}, {
				xtype : 'separator'
			}, {
				xtype : 'datefield',
				itemId : 'dteExpire',
				fieldLabel : T('Caption.Other.Expire Date'),
				name : 'expireDate',
				format: 'Y-m-d',
				submitFormat : 'Ymd',
				labelWidth : 150,
				anchor : '50%',
				maxLength : 20,
				enforceMaxLength : true
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelSeparator : ''
				},
				items : [ {
					xtype : 'textfield',
					flex : 0.5,
					fieldLabel : T('Caption.Other.Password Change Period '),
					labelWidth : 150,
					name : 'passwordChangePeriod',
					maxLength : 20,
					enforceMaxLength : true

				}, {
					xtype : 'label',
					margin : '1 0 0 3',
					text : T('Caption.Other.days '),
					flex : 0.1
				}, {
					xtype : 'checkbox',
					flex : 0.4,
					boxLabel : T('Caption.Other.Clear Old Password')
				} ]
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelSeparator : ''
				},
				items : [ {
					xtype : 'checkbox',
					flex : 0.5,
					boxLabel : T('Caption.Other.Must Change Password At Next Login'),
					name : 'changePasswordFlag',
					inputValue : 'Y',
					uncheckedValue : 'N'
				}, {
					xtype : 'label',
					flex : 0.1
				}, {
					xtype : 'checkbox',
					flex : 0.4,
					boxLabel : T('Caption.Other.Clear Login Fail Count'),
					cls : 'marginL5',
					name : 'passwordFailCount',
					inputValue : '1',
					uncheckedValue : '0'
				} ]
			}, {
				xtype : 'separator'
			}, {
				xtype : 'userstamp',
				fieldDefaults : {
					labelWidth : 130
				}
			} ]
		};
	}
});