Ext.define('SEC.view.setup.FunctionSetup', {
	extend : 'MES.view.form.BaseForm',
	requires : [ 'SEC.model.SecViewFunctionOut' ],
	title : T('Caption.Menu.Function Setup'),

	formReader : {
		url : 'service/SecViewFunction.json',
		model : 'SEC.model.SecViewFunctionOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/SecUpdateFunction.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/SecUpdateFunction.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/SecUpdateFunction.json',
		confirm : {
			fields : {
				field1 : 'funcName'
			}
		}
	} ],

	defaults : {
		anchor : '0%',
		labelSeparator : '',
		labelWidth : 120
	},

	initComponent : function() {

		this.callParent();

		var self = this;

		this.add(this.hiddenField);

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.on('supplementSelected', function(record) {
				self.reloadForm(record.data.funcName);

			});

			supplement.sub('cdvFuncGroup').on('change', function(recod) {
				supplement.refreshGrid(true);
			});
		});

		// url 주소가 Miracom.BASCore.BASViewFlexibleInquiryMenu 일때 inquiry ID 필드
		// 활성화
		this.sub('txtassemblyName').on('change', function(txt) {
			if ('Miracom.BASCore.BASViewFlexibleInquiryMenu' === txt.getValue()) {
				self.sub('cdvInquiryID').setDisabled(false);
			}
		});

		this.sub('cdvInquiryID').on('change', function(txt) {
			self.sub('txtCtlName10').setValue(self.sub('cdvInquiryID').getValue());
		});

		var iconIndexStore = Ext.create('BAS.store.BasViewIconListOut.List');
		iconIndexStore.load({
			params : {
				procstep : '1'
			}
		});
		this.sub('cbiconIndex').store = iconIndexStore;
		
		this.sub('cbshortCutDisp').on('change', function(me, newValue){
			if(newValue == '&#160;'){
				me.setValue('');
			}
		});
	},

	checkCondition : function(step, form, addParams) {
		if (addParams.procstep == SF_STEP_CREATE || addParams.procstep == SF_STEP_UPDATE) {
			var tempShortCut = ''; // hidden 필드에 들어가기전 임시 문자열 변수
			var checkShortCut = 0; // ctrl, alt, shift key 체크확인

			// F1 ~ F12 은 단독으로 선택 가능하지만 그외의 문자는 CTRL, ALT, SHIFT 조합이어야 한다.

			if (this.sub("chkCtrl").getValue()) {
				tempShortCut += 'C';
				checkShortCut++;
			} else {
				tempShortCut += '-';
			}

			if (this.sub("chkAlt").getValue()) {
				tempShortCut += 'A';
				checkShortCut++;
			} else {
				tempShortCut += '-';
			}

			if (this.sub("chkShift").getValue()) {
				tempShortCut += 'S';
				checkShortCut++;
			} else {
				tempShortCut += '-';
			}

			var cbshortCutDisp = this.sub("cbshortCutDisp");
			var str = cbshortCutDisp.getValue() ? cbshortCutDisp.getValue().trim() : '';
			if (str.length > 0) {
				if (this.sub("cbshortCutDisp").findRecord('key', str).get('singleKeyFlag') != 'Y') {
					if (checkShortCut == 0) {
						SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
						tempShortCut = ' ';
						return false;
					}
				}
				tempShortCut += this.sub("cbshortCutDisp").getValue();
			} else {
				if (checkShortCut != 0) {
					SmartFactory.msgBox('Mes Client', T('Message.108'), 'OK');
					tempShortCut = ' ';
					return false;
				} else {
					tempShortCut = ' ';
				}
			}
			// 검증 & 조합된 값을 hidden 필드에 저장
			this.sub('txtShortCut').setValue(tempShortCut);

			// InquiryID는 control10 필드에 저장
			this.sub('txtCtlName10').setValue(this.sub('cdvInquiryID').getValue());
		}
		return true;
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'funcName',
				value : form.getValues().funcName
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var select = {
				column : 'funcName',
				value : form.getValues().funcName
			};
			this.getSupplement().refreshGrid(true, select);
		}
	},

	onAfterDelete : function(form, action, success) {
		if (success) {
			this.getSupplement().refreshGrid(true);
			this.getForm().getFields().each(function(f) {
				f.setValue(null);
			});
		}
	},

	reloadForm : function(funcName) {
		this.formLoad({
			procstep : '1',
			funcName : funcName
		});
	},

	onAfterFormLoad : function(form, action) {
		if (action.result.success) {
			// ctrl, alt, shift, 콤보박스 키 출력
			var shortKey = action.result.data['shortCut'];

			if (shortKey.charAt(0) === 'C') {
				this.sub("chkCtrl").setValue('true');
			} else {
				this.sub("chkCtrl").setValue('false');
			}

			if (shortKey.charAt(1) === 'A') {
				this.sub("chkAlt").setValue('true');
			} else {
				this.sub("chkAlt").setValue('false');
			}

			if (shortKey.charAt(2) === 'S') {
				this.sub("chkShift").setValue('true');
			} else {
				this.sub("chkShift").setValue('false');
			}

			if (shortKey) {
				this.sub('cbshortCutDisp').setValue(shortKey.substring(3));
			} else {
				this.sub('cbshortCutDisp').setValue('');
			}

			// 콘트롤10 필드 내용을 inquiry 필드에 출력 & Disable True, False 선택
			if ('Miracom.BASCore.BASViewFlexibleInquiryMenu' === this.sub('txtassemblyName').getValue()) {
				this.sub('cdvInquiryID').setDisabled(false);
				this.sub('cdvInquiryID').setValue(this.sub('txtCtlName10').getValue());
			} else {
				this.sub('cdvInquiryID').setDisabled(true);
				this.sub('cdvInquiryID').setValue();
			}
		}
	},

	hiddenField : {
		xtype : 'hidden',
		name : 'shortCut',
		itemId : 'txtShortCut'
	},

	buildForm : function() {
		var controls = [];
		for ( var i = 1; i <= 10; i++) {
			controls.push({
				xtype : 'textfield',
				name : 'ctlName' + i,
				itemId : 'txtCtlName' + i,
				maxLength : 20,
				enforceMaxLength : true
			});
		}

		var tabs = [];
		for ( var i = 1; i <= 10; i++) {
			tabs.push({
				xtype : 'textfield',
				name : 'tabName' + i,
				maxLength : 20,
				enforceMaxLength : true
			});
		}

		var options = [];
		for ( var i = 1; i <= 10; i++) {
			options.push({
				xtype : 'textfield',
				name : 'optName' + i,
				maxLength : 20,
				enforceMaxLength : true
			});
		}
		
		return [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Function Name'),
			labelStyle : 'font-weight:bold',
			itemId : 'txtfuncName',
			name : 'funcName',
			anchor : '100%',
			maxLength : 12,
			enforceMaxLength : true,
			allowBlank : false
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			itemId : 'txtfuncDesc',
			anchor : '100%',
			maxLength : 50,
			enforceMaxLength : true,
			name : 'funcDesc'
		}, {
			xtype : 'separator',
			anchor : '100%'
		}, {
			xtype : 'codeview',
			codeviewName : 'FunctionGroup',
			fieldLabel : T('Caption.Other.Function Group'),
			anchor : '50%',
			itemId : 'cdvFuncGroup',
			name : 'funcGroup'
		}, {
			xtype : 'container',
			anchor : '100%',
			height : 28,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'combobox',
				name : 'funcTypeFlag',
				fieldLabel : T('Caption.Other.Function Type'),
				labelWidth : 120,
				itemId : 'cmbfuncTypeFlag',
				displayField : 'name',
				valueField : 'value',
				flex : 1,
				editable : false,
				store : Ext.create('Ext.data.Store', {
					fields : [ 'name', 'value' ],
					data : [ {
						"name" : "Function",
						"value" : "F"
					}, {
						"name" : "Program",
						"value" : "P"
					}, {
						"name" : "Menu",
						"value" : "M"
					} ]
				})
			}, {
				xtype : 'checkbox',
				name : 'fldEnMaskUseFlag',
				itemId : 'chkFldEnMaskUseFlag',
				flex : 1,
				boxLabel : T('Caption.Other.Field Enable Mask Use Flag'),
				inputValue : 'Y',
				uncheckedValue : ' ',
				cls : 'marginL5'
			} ]
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Assembly File'),
			itemId : 'txtassemblyFile',
			anchor : '100%',
			name : 'assemblyFile',
			maxLength : 100,
			enforceMaxLength : true
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Assembly Name'),
			itemId : 'txtassemblyName',
			anchor : '100%',
			name : 'path',
			maxLength : 100,
			enforceMaxLength : true
		}, {
			xtype : 'fieldcontainer',
			height : 28,
			anchor : '100%',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			fieldLabel : T('Caption.Other.Short Cut/Icon'),
			items : [ {
				xtype : 'checkbox',
				itemId : 'chkCtrl',
				name : 'chkCtrl',
				boxLabel : 'CTRL',
				width : 50,
				cls : 'marginR5'
			}, {
				xtype : 'checkbox',
				itemId : 'chkAlt',
				name : 'chkAlt',
				boxLabel : 'ALT',
				width : 50,
				cls : 'marginR5'
			}, {
				xtype : 'checkbox',
				itemId : 'chkShift',
				name : 'chkShift',
				boxLabel : 'Shift',
				cls : 'marginR5',
				width : 50
			}, {
				xtype : 'combo',
				mode : 'local',
				name : 'shortCutDisp',
				itemId : 'cbshortCutDisp',
				displayField : 'key',
				valueField : [ 'key' ],
				editable : false,
				cls : 'marginR5',
				flex : 1,
				submitValue : false,
				store : Ext.create('SEC.store.ShortcutStore')
			}, {
				xtype : 'combo',
				queryMode : 'local',
				name : 'iconIndex',
				displayField : 'iconIndex',
				valueField : 'iconIndex',
				editable : false,
				flex : 1,
				itemId : 'cbiconIndex',
				listConfig : {
					loadingText : 'Select Icon Index',
					emptyText : 'No matching icons found.',

					getInnerTpl : function() {
						return '<div>{iconIndex}</span> <image src="{icon}"/></div>';
					},
					minWidth : 50
				}
			} ]
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Help URL'),
			itemId : 'txtHelpURL',
			anchor : '100%',
			name : 'helpUrl'
		}, {
			xtype : 'codeview',
			codeviewName : 'TbBasInquiry',
			fieldLabel : T('Caption.Other.Inquiry ID'),
			itemId : 'cdvInquiryID',
			anchor : '50%',
			name : 'inquiryId'
		}, {
			xtype : 'userstamp',
			anchor : '100%'
		}, {
			xtype : 'separator',
			anchor : '100%'
		}, {
			xtype : 'container',
			anchor : '100%',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			height : 320,
			defaults : {
				flex : 1,
				xtype : 'fieldset',
				layout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			items : [ {
				title : T('Caption.Other.Control Name'),
				items : controls
			}, {
				title : T('Caption.Other.Tab Page Name'),
				cls : 'marginRL7',
				items : tabs
			}, {
				title : T('Caption.Other.Option Name'),
				items : options
			} ]
		} ];
	},

	// Supplement grid form
	buildSupplement : function() {
		return {
			xtype : 'gridsup',

			fields : {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Function Group'),
				allowBlank : false,
				labelStyle : 'font-weight:bold',
				itemId : 'cdvFuncGroup',
				codeviewName : 'FunctionGroup',
				name : 'funcGroup',
				flex : 1
			},

			grid : {
				store : Ext.create('SEC.store.SecViewFunctionListOut.list'),
				columns : [ {
					header : T('Caption.Other.Function Name'),
					dataIndex : 'funcName',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'funcDesc',
					flex : 1
				} ]
			}
		};
	}
});