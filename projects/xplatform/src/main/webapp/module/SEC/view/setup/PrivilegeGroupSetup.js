Ext.define('SEC.view.setup.PrivilegeGroupSetup', {
	extend : 'MES.view.form.BaseFormTabs',

	title : T('Caption.Other.Privilege Group Setup'),

	requires : [ 'SEC.model.SecViewPrivilegeGroupOut' ],

	formReader : {
		url : 'service/secViewPrivilegeGroup.json',
		model : 'SEC.model.SecViewPrivilegeGroupOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/secUpdatePrivilegeGroup.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/secUpdatePrivilegeGroup.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/secUpdatePrivilegeGroup.json',
		confirm : {
			fields : {
				field1 : 'prvGrpId'
			}
		}
	} ],

	initComponent : function() {
		this.callParent();

		this.getTabPanel().add([ this.buildGeneralTab(this), this.buildCopyPrivilegeGroupTab(this) ]);
		this.getTabPanel().setActiveTab(0);

		var self = this;
		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.reloadForm(record);
			});
		});

		this.sub('btnCopy').on('click', function(me, e, eOpts) {
			if (self.checkCondition('Copy_Privilege_Group') == true) {
				var msg = T('Message.Copy');
				msg = msg.replace('{field1}', self.sub('txtToPrvGrpId').getValue());
				Ext.MessageBox.confirm(T('Caption.Button.Copy'), msg, function showResult(result) {
					if (result == 'yes') {
						self.itemAction(me, self);
					}
				});
			}
		});
	},

	checkCondition : function(step, form, addParams) {
		if (step == 'Copy_Privilege_Group') {
			if (this.sub('txtPrvGrpId').getValue() == '') {
				SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
				return false;
			}
			if (this.sub('txtToPrvGrpId').getValue() == '') {
				SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
				return false;
			}
		}
		return true;
	},

	itemAction : function(item, self) {
		var toPrvGrpId = self.getForm().getFieldValues()['toPrvGrpId'];
		self.sub('frmCopy').getForm().submit({
			params : {
				procstep : 'C',
				fromPrvGrpId : self.getForm().getFieldValues()['prvGrpId'],
				prvGrpId : toPrvGrpId
			},
			url : 'service/secCopyPrivilegeGroup.json',
			showSuccessMsg : true,
			success : function(form, action) {
				self.getSupplement().refreshGrid(true);
				self.reloadForm(toPrvGrpId);
				self.sub('txtToPrvGrpId').reset();
			}
		});
	},

	reloadForm : function(record) {
		if (Ext.isString(record) === true) {
			this.formLoad({
				prvGrpId : record,
				procstep : '1'
			});
		} else {
			this.formLoad({
				prvGrpId : record.get('prvGrpId'),
				procstep : '1'
			});
		}
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var prvGrpId = form.getValues().prvGrpId;
			var select = {
				column : 'prvGrpId',
				value : prvGrpId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var prvGrpId = form.getValues().prvGrpId;
			var select = {
				column : 'prvGrpId',
				value : prvGrpId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterDelete : function(form, action, success) {
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
				store : Ext.create('SEC.store.SecViewPrivilegeGroupListOut.List'),
				columns : [ {
					header : T('Caption.Other.Privilege Group'),
					dataIndex : 'prvGrpId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'prvGrpDesc',
					flex : 1
				} ]
			}
		};
	},

	buildTopPart : function(main) {
		return [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Privilege Group'),
			name : 'prvGrpId',
			itemId : 'txtPrvGrpId',
			labelStyle : 'font-weight:bold',
			labelWidth : 140,
			maxLength : 20,
			allowBlank : false,
			enforceMaxLength : true
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			name : 'prvGrpDesc',
			labelWidth : 140,
			maxLength : 50,
			enforceMaxLength : true
		} ];
	},

	buildGeneralTab : function(main) {
		return {
			xtype : 'container',
			title : T('Caption.Other.General'),
			cls : 'paddingAll10',
			layout : 'anchor',
			items : [ {
				xtype : 'userstamp',
				anchor : '100%',
				fieldDefaults : {
					labelWidth : 130
				}
			} ]
		};
	},

	buildCopyPrivilegeGroupTab : function(main) {
		return {
			xtype : 'form',
			title : T('Caption.Other.Copy Privilege Group'),
			itemId : 'frmCopy',
			bodyCls : 'paddingAll10',
			layout : {
				type : 'hbox'
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.To Privilege Group'),
				labelWidth : 130,
				labelSeparator : '',
				name : 'toPrvGrpId',
				itemId : 'txtToPrvGrpId',
				submitValue : false,
				flex : 1,
				maxLength : 20,
				enforceMaxLength : true
			}, {
				xtype : 'button',
				text : T('Caption.Button.Copy'),
				itemId : 'btnCopy',
				cls : 'marginL10',
				width : 50
			}, {
				xtype : 'container',
				flex : 1
			} ]
		};
	}
});