/**
 * @class (BAS.view.setup.AttributeSetup) 아이템 별로 Attribute 을 정의한다.
 * @extends MES.view.form.BaseForm
 * @author Seungho Kuk
 * 
 * @cfg
 * 
 */

/*
 * 2012-07-16 수정 - 김진호
 * buildSupplement refreshGrid에 select 추가하여 이벤트 발생(reloadForm 삭제)
 */
Ext.define('BAS.view.setup.AttributeSetup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Menu.Attribute Setup'),

	requires : [ 'BAS.model.BasViewAttributeNameOut' ],

	formReader : {
		url : 'service/basViewAttributeName.json',
		model : 'BAS.model.BasViewAttributeNameOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateAttribute.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/basUpdateAttribute.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/basUpdateAttribute.json',
		confirm : {
			fields : {
				field1 : 'attrName'
			}
		}
	} ],

	initComponent : function() {

		this.callParent();

		var self = this;

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.sub('cdvAttrType').on('change', function(field, value) {
				supplement.refreshGrid(true);
			});

			supplement.on('supplementSelected', function(record) {
				self.setKeys({
					attrType : record.get('attrType'),
					attrName : record.get('attrName')
				});
			});
		});
		
		this.on('keychange', function(view, keys) {
			if(!keys)
				return;
			
			self.reloadForm(keys);
		});

		this.sub('cmbValidTblType').on('select', function(combo, records, eOps) {

			if (records[0].data.field1 == ' ') {
				self.sub('chkAllowBlank').setDisabled(true);
			} else {
				self.sub('chkAllowBlank').setDisabled(!records[0].data.field1);
			}

		});

	},

	checkCondition : function(procstep, form, addParams) {

		var attrType = this.sub('cdvAttrType');
		if (!attrType.getValue()) {
			Ext.Msg.alert('Error', T('Message.ValidInput', {
				field1 : T('Caption.Other.Attribute Type')
			}));
			attrType.getField(0).focus();
			return false;
		}

		var attrName = this.sub('txtAttrName');
		if (!attrName.getValue()) {
			Ext.Msg.alert('Error', T('Message.ValidInput', {
				field1 : T('Caption.Other.Attribute Name')
			}));
			attrName.focus();
			return false;
		}

		var attrSeq = this.sub('numAttrSeq');
		if (attrSeq.getValue() < 0) {
			Ext.Msg.alert('Error', T('Message.114'));
			attrSeq.focus();
			return false;
		}

		if (procstep === SF_STEP_CREATE || procstep === SF_STEP_UPDATE) {

			var attrFmt = this.sub('cmbAttrFmt');
			if (!attrFmt.getValue()) {
				attrFmt.setValue('A');
			}

			var attrSize = this.sub('numAttrSize');
			if (attrSize.getValue() < 1) {
				Ext.Msg.alert('Error', T('Message.114'));
				attrSize.focus();
				return false;
			}

			var validTblType = this.sub('cmbValidTblType');
			var validTbl = this.sub('cdvValidTbl');
			if (validTblType.getValue()) {
				if (!validTbl.getValue()) {
					Ext.Msg.alert('Error', T('Message.ValidInput', {
						field1 : T('Caption.Other.Valid Table')
					}));
					return false;
				}
			} else {
				validTbl.setValue('');
			}
		}
		return true;
	},

	onBeforeCreate : function(form, addParams, url) {
		if (this.checkCondition(addParams.procstep, form, addParams) == false) {
			return false;
		}
	},

	onBeforeUpdate : function(form, addParams, url) {
		if (this.checkCondition(addParams.procstep, form, addParams) == false) {
			return false;
		}
	},

	onBeforeDelete : function(form, addParams, url) {
		if (this.checkCondition(addParams.procstep, form, addParams) == false) {
			return false;
		}
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var attrName = form.getValues().attrName;
			var attrType = form.getValues().attrType;
			var select = [{
				column : 'attrName',
				value : attrName
			},{
				column : 'attrType',
				value : attrType
			}];
			
			this.getSupplement().refreshGrid(true,select);
			this.setKeys({
				attrType : attrType,
				attrName : attrName
			});
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var select = [{
				column : 'attrName',
				value : form.getValues().attrName
			},{
				column : 'attrType',
				value : form.getValues().attrType
			}];
			
			this.getSupplement().refreshGrid(true,select);
			//this.reloadForm(action.form.getValues());
		}
	},

	onAfterDelete : function(form, action, success) {
		this.getSupplement().refreshGrid(true);
		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});
	},

	reloadForm : function(data) {

		this.formLoad({
			procstep : '1',
			attrType : data.attrType,
			attrName : data.attrName
		});

		if (data.validTblType == '') {
			this.sub('chkAllowBlank').setDisabled(true);
		} else {
			this.sub('chkAllowBlank').setDisabled(false);
		}

	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			
			autoFormLoad : false,
			
			title : T('Caption.Other.Attribute Setup'),

			fields : [ {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				height : 28,
				defaults : {
					labelSeparator : '',
					labelAlign : 'left'
				},
				items : [ {
					xtype : 'codeview',
					fieldLabel : T('Caption.Other.Attribute Type'),
					itemId : 'cdvAttrType',
					name : 'attrType',
					codeviewName : 'AttributeType'
				} ]
			} ],

			grid : {
				searchField : 'attrName',
				columnLines : true,
				store : Ext.create('BAS.store.BasViewAttributeNameListOut.nameList'),
				columns : [ {
					header : T('Caption.Other.Seq'),
					width : 40,
					align : 'center',
					dataIndex : 'attrSeq'
				}, {
					header : T('Caption.Other.Name'),
					width : 140,
					dataIndex : 'attrName'
				}, {
					header : T('Caption.Other.Type'),
					width : 80,
					dataIndex : 'attrType'
				}, {
					header : T('Caption.Other.Description'),
					width : 140,
					dataIndex : 'attrDesc'
				} ]
			}
		};
	},

	buildForm : function() {
		return {
			xtype : 'container',
			layout : 'anchor',
			defaults : {
				anchor : '100%',
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
					xtype : 'codeview',
					codeviewName : 'AttributeType',
					fieldLabel : T('Caption.Other.Attribute Type'),
					allowBlank : false,
					labelStyle : 'font-weight:bold',
					itemId : 'cdvAttrType',
					name : 'attrType'
				}, {
					xtype : 'numberfield',
					cls : 'marginL5',
					fieldLabel : T('Caption.Other.Seq'),
					allowBlank : false,
					labelStyle : 'font-weight:bold',
					maxValue : 9999999999,
					minValue : 0,
					itemId : 'numAttrSeq',
					name : 'attrSeq'
				} ]
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Attribute Name'),
				allowBlank : false,
				labelStyle : 'font-weight:bold',
				maxLength : 100,
				enforceMaxLength : true,
				itemId : 'txtAttrName',
				name : 'attrName'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Description'),
				maxLength : 100,
				enforceMaxLength : true,
				itemId : 'txtAttrDesc',
				name : 'attrDesc'
			}, {
				xtype : 'separator'
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					labelSeparator : '',
					labelWidth : 130,
					flex : 1
				},
				items : [ {
					xtype : 'combobox',
					store : Ext.create('Ext.data.Store', {
						fields : [ 'abbr', 'name' ],
						data : [ {
							"abbr" : "A",
							"name" : "A : Ascii"
						}, {
							"abbr" : "N",
							"name" : "N : Number"
						}, {
							"abbr" : "F",
							"name" : "F : Float"
						} ]
					}),
					displayField : 'name',
					valueField : 'abbr',
					editable : false,
					fieldLabel : T('Caption.Other.Format'),
					itemId : 'cmbAttrFmt',
					name : 'attrFmt'
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Check Security'),
					itemId : 'chkSecChkFlag',
					name : 'secChkFlag',
					inputValue : 'Y',
					cls : 'marginL7'
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
					xtype : 'numberfield',
					fieldLabel : T('Caption.Other.Size'),
					maxValue : 9999999999,
					minValue : 0,
					itemId : 'numAttrSize',
					name : 'attrSize'
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Key History Independent'),
					itemId : 'chkKeyHistIndependentFlag',
					name : 'keyHistIndependentFlag',
					inputValue : 'Y',
					cls : 'marginL7'
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
					xtype : 'combobox',
					store : [ [ ' ', '&#160;' ], [ 'A', 'A : Allowed' ], [ 'N', 'N : Not Allowed' ] ],
					displayField : 'name',
					valueField : 'abbr',
					editable : false,
					fieldLabel : T('Caption.Other.Valid Table Type'),
					itemId : 'cmbValidTblType',
					name : 'validTblType'
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Allow Blank Value'),
					itemId : 'chkAllowBlank',
					name : 'allowBlank',
					inputValue : 'Y',
					disabled : true,
					cls : 'marginL7'
				} ]
			}, {
				xtype : 'codeview',
				codeviewName : 'TbGcmTable',
				fieldLabel : T('Caption.Other.Valid Table'),
				itemId : 'cdvValidTbl',
				name : 'validTbl',
				anchor : '50%'
			}, {
				xtype : 'userstamp',
				fieldDefaults : {
					labelWidth : 130
				}
			} ]
		};
	}
});