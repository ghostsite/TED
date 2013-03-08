Ext.define('SEC.view.setup.SecurityGroupSetup', {
	extend : 'MES.view.form.BaseFormTabs',

	title : T('Caption.Other.Security Group Setup'),

	requires : [ 'SEC.model.SecViewSecgrpOut' ],

	formReader : {
		url : 'service/secViewSecgrp.json',
		model : 'SEC.model.SecViewSecgrpOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/secUpdateSecgrp.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/secUpdateSecgrp.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/secUpdateSecgrp.json',
		confirm : {
			fields : {
				field1 : 'secGrpId' 
			}
		}
	} ],

	initComponent : function() {
		this.callParent();
		var self = this;
		var tabpnl = this.getTabPanel();
		tabpnl.add(this.buildGeneralTab(this));
		tabpnl.add(this.buildCopySecurityGroupTab(this));
		tabpnl.setActiveTab(0);
		
		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.reloadForm(record);
			});
		});

		this.sub('btnCopy').on('click', function(me, e, eOpts) {
			if(self.checkCondition('Copy_SecGrp') == true){
				var msg = T('Message.Copy');
				msg = msg.replace('{field1}', self.sub('txtToSecGrpId').getValue());
				Ext.MessageBox.confirm(T('Caption.Button.Copy'), msg, function showResult(result) {
					if (result == 'yes') {
						self.itemAction(me, self);
					}
				});
			}
		});
	},

	checkCondition : function(step, form, addParams){
		if(step == 'Copy_SecGrp'){
			if (this.sub('txtSecGrpId').getValue() == '') {
				SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
				return false;
			}
			if (this.sub('txtToSecGrpId').getValue() == '') {
				SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
				return false;
			}
		}
		return true;
	},
	
	itemAction : function(item, self) {
		var toSecGrpId = self.getForm().getFieldValues()['toSecGrpId'];
		var select = {
			column : 'toSecGrpId',
			value : toSecGrpId
		};
		self.sub('frmCopy').getForm().submit({
			params : {
				procstep : 'C',
				fromSecGrpId : self.getForm().getFieldValues()['secGrpId'],
				secGrpId : toSecGrpId
			},
			url : 'service/secCopySecgrp.json',
			showSuccessMsg : true,
			success : function(form, action) {
				self.getSupplement().refreshGrid(true, select);
				self.sub('txtToSecGrpId').reset();
			}
		});
	},

	reloadForm : function(record) {
		if (Ext.isString(record) === true) {
			this.formLoad({
				secGrpId : record,
				procstep : '1'
			});
		} else {
			this.formLoad({
				secGrpId : record.get('secGrpId'),
				procstep : '1'
			});
		}
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var secGrpId = form.getValues().secGrpId;
			var select = {
				column : 'secGrpId',
				value : secGrpId
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var secGrpId = form.getValues().secGrpId;
			var select = {
				column : 'secGrpId',
				value : secGrpId
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
				store : Ext.create('SEC.store.SecViewSecgrpListOut.List'),
				columns : [ {
					header : T('Caption.Other.Security Group'),
					dataIndex : 'secGrpId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'secGrpDesc',
					flex : 1
				} ]
			}
		};
	},

	buildTopPart : function(main) {
		return [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Security Group'),
			name : 'secGrpId',
			itemId : 'txtSecGrpId',
			labelStyle : 'font-weight:bold',
			labelWidth : 140,
			maxLength : 20,
			allowBlank : false,
			enforceMaxLength : true
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			name : 'secGrpDesc',
			labelWidth : 140,
			maxLength : 50,
			enforceMaxLength : true
		} ];
	},

	buildGeneralTab : function(main) {
		return {
			xtype : 'userstamp',
			title : T('Caption.Other.General'),
			cls : 'paddingAll10',
			fieldDefaults : {
				labelWidth : 130
			}
		};
	},

	buildCopySecurityGroupTab : function(main) {
		return {
			xtype : 'form',
			title : T('Caption.Other.Copy Security Group'),
			itemId : 'frmCopy',
			cls : 'paddingAll10',
			layout : {
				type : 'hbox'
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.To Security Group'),
				labelWidth : 130,
				labelSeparator : '',
				name : 'toSecGrpId',
				itemId : 'txtToSecGrpId',
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