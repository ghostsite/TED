/*
 * 2012-07-18 수정 - 김진호
 * onAfterCreate, onAfterUpdate의 select 추가
 */

Ext.define('BAS.view.setup.OperationSetup', {

	extend : 'SetupForm01',

	title : T('Caption.Menu.Operation Setup'),

	requires : [ 'WIP.model.WipViewOperationOut' ],

	groupDefaultTable : SF_GCM_OPER_GRP,
	groupItemName : SF_GRP_OPERATION,
	cmfItemName : SF_CMF_OPER,

	groupFieldNamePrefix : 'operGrp',
	cmfFieldNamePrefix : 'operCmf',

	attrType : 'OPER',

	formReader : {
		url : 'service/WipViewOperation.json',
		model : 'WIP.model.WipViewOperationOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/wipUpdateOperation.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/wipUpdateOperation.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/wipUpdateOperation.json',
		confirm : {
			fields : {
				field1 : 'oper' 
			}
		}
	} ],

	initComponent : function() {
		this.callParent();
		var self = this;

		this.on('afterrender', function() {
			var supplement = self.getSupplement();
			/*
			 * Supplement에 대한 이벤트리스너 등록은 클라이언트 뷰의 afterrender 이벤트 발생 이후에 해야한다.
			 */
			supplement.on('supplementSelected', function(record) {
				self.reloadForm(record.data);
			});
		});

	},

	// Error 메시지 수정
	checkCondition : function(step, form, addParams) {
		var values = form.getValues();
		var tabpnl = this.getTabPanel();

		if (addParams) {
			switch (addParams.procstep) {
			case SF_STEP_CREATE:
			case SF_STEP_UPDATE:
				if (values.unit1 == '' && values.unit2 == '' && values.unit3 == '') {
					Ext.Msg.alert('Error', T('Message.ValidInput', {
						field1 : T('Caption.Other.Unit 1')
					}));
					tabpnl.setActiveTab(0);
					this.sub('cdvUnit1').focus();
					return false;
				}
				if (values.unit1 != '' && (values.unit1 == values.unit2 || values.unit1 == values.unit3)) {
					Ext.Msg.alert('Error', T('Message.159'));
					tabpnl.setActiveTab(0);
					this.sub('cdvUnit1').focus();
					return false;
				}
				if (values.unit2 != '' && (values.unit2 == values.unit1 || values.unit2 == values.unit3)) {
					Ext.Msg.alert('Error', T('Message.159'));
					tabpnl.setActiveTab(0);
					this.sub('cdvUnit2').focus();
					return false;
				}
				if (values.unit3 != '' && (values.unit3 == values.unit1 || values.unit3 == values.unit2)) {
					Ext.Msg.alert('Error', T('Message.159'));
					tabpnl.setActiveTab(0);
					this.sub('cdvUnit3').focus();
					return false;
				}
				break;
			}
		}
	},

	reloadForm : function(params) {
		if (!params)
			return;

		var grid = this.sub('tabGridAttribute');

		grid.attrLoad({
			procstep : '1',
			attrType : this.attrType,
			attrKey : params.oper
		});

		this.formLoad({
			procstep : '1',
			oper : params.oper
		});
	},
	
	onAfterCreate : function(form, action, success) {
		if (success) {

			var select = {
				column : 'oper',
				value : form.getValues().oper || ''
			};

			this.getSupplement().refreshGrid(true, select);
			// var params = {};
			// params.matId = action.result.oper;
			// params.matVer = action.result.matVer;
			// this.reloadForm(params);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'oper',
				value : form.getValues().oper || ''
			};

			this.getSupplement().refreshGrid(true, select);
			// var params = {};
			// params.matId = action.result.oper;
			// params.matVer = action.result.matVer;
			// this.reloadForm(params);
		}
	},

	onAfterDelete : function(form, action, success) {
		this.getSupplement().refreshGrid(true);
		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});
	},

	buildTopPart : function(main) {
		return [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Operation'),
			itemId : 'txtOperId',
			labelStyle : 'font-weight:bold',
			allowBlank : false,
			name : 'oper',
			maxLength : 10,
			enforceMaxLength : true
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			itemId : 'txtOperDesc',
			name : 'operDesc',
			maxLength : 50,
			enforceMaxLength : true
		} ];
	},

	buildGeneralTab : function(main) {
		return {
			xtype : 'container',
			title : T('Caption.Other.General'),
			itemId : 'zbasic',
			layout : {
				type : 'anchor',
				anchor : '100%'
			},

			cls : 'paddingRL7 paddingT5',

			items : [ {
				xtype : 'container',
				anchor : '100%',
				layout : {
					type : 'hbox'
				},
				defaults : {
					flex : 1
				},
				items : [ {
					xtype : 'container',
					items : [ {
						xtype : 'fieldset',
						flex : 1,
						title : T('Caption.Other.General'),
						layout : {
							type : 'anchor'
						},
						defaults : {
							labelWidth : 110,
							anchor : '100%',
							labelSeparator : ''
						},
						items : [ {
							xtype : 'codeview',
							fieldLabel : T('Caption.Other.Unit 1'),
							allowBlank : false,
							labelStyle : 'font-weight:bold',
							itemId : 'cdvUnit1',
							codeviewName : 'Unit',
							name : 'unit1'
						}, {
							xtype : 'codeview',
							fieldLabel : T('Caption.Other.Unit 2'),
							itemId : 'cdvUnit2',
							codeviewName : 'Unit',
							name : 'unit2'
						}, {
							xtype : 'codeview',
							fieldLabel : T('Caption.Other.Unit 3'),
							itemId : 'cdvUnit3',
							codeviewName : 'Unit',
							name : 'unit3'
						}, {
							xtype : 'codeview',
							fieldLabel : T('Caption.Other.Area ID'),
							itemId : 'cdvArea',
							codeviewName : 'Area',
							name : 'areaId'
						}, {
							xtype : 'codeview',
							fieldLabel : T('Caption.Other.Sub Area ID'),
							itemId : 'cdvSubArea',
							codeviewName : 'SubArea',
							name : 'subAreaId'
						} ]
					}, {
						xtype : 'fieldset',
						flex : 1,
						title : T('Caption.Other.Table Information'),
						layout : {
							type : 'anchor'
						},
						defaults : {
							labelWidth : 110,
							anchor : '100%',
							labelSeparator : ''
						},
						items : [ {
							xtype : 'codeview',
							title : T('Caption.Other.Loss Table'),
							fieldLabel : T('Caption.Other.Loss Table'),
							itemId : 'cdvLossTbl',
							codeviewName : 'TbGcmTable',
							name : 'lossTbl'
						}, {
							xtype : 'codeview',
							title : T('Caption.Other.Bonus Table'),
							fieldLabel : T('Caption.Other.Bonus Table'),
							itemId : 'cdvBonusTbl',
							codeviewName : 'TbGcmTable',
							name : 'bonusTbl'
						}, {
							xtype : 'codeview',
							title : T('Caption.Other.Rework Table'),
							fieldLabel : T('Caption.Other.Rework Table'),
							itemId : 'cdvReworkTbl',
							codeviewName : 'TbGcmTable',
							name : 'reworkTbl'
						} ]
					} ]
				}, {
					xtype : 'container',
					defaults : {
						labelWidth : 110,
						labelSeparator : ''
					},
					cls : 'marginT7 marginL10',
					items : [ {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.Transit Operation'),
						name : 'transitFlag',
						itemId : 'chkTransitFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					}, {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.Inventory Operation'),
						name : 'invFlag',
						itemId : 'chkInvFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					}, {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.Shipping Operation'),
						name : 'shipFlag',
						itemId : 'chkShipFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					}, {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.End Operation'),
						name : 'endOperFlag',
						itemId : 'chkEndOperFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					}, {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.ERP Interface'),
						name : 'erpFlag',
						itemId : 'chkRrpFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					}, {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.Start Required'),
						name : 'startRequireFlag',
						itemId : 'chkStartRequireFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					}, {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.PULL Operation'),
						name : 'pushPullFlag',
						itemId : 'chkPushPullFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					}, {
						xtype : 'checkbox',
						boxLabel : T('Caption.Other.Check Security Operation'),
						name : 'secChkFlag',
						itemId : 'chkSecChkFlag',
						inputValue : 'Y',
						uncheckedValue : ' '
					} ]
				} ]
			}, {
				xtype : 'separator'
			}, {
				xtype : 'userstamp',
				anchor : '100%'
			} ]
		};
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			grid : {
				store : Ext.create('WIP.store.WipViewOperationListOut.List'),
				params : {
					procstep : '1'
				},
				columns : [ {
					text : T('Caption.Other.Operation'),
					flex : 1,
					dataIndex : 'oper'// 'OPER'
				}, {
					text : T('Caption.Other.Desc'),
					flex : 1,
					dataIndex : 'operDesc'// 'OPER_DESC'
				} ]
			}
		};
	}
});
