/**
 * @class WIP.view.setup.MaterialSetup Material 의 관리 품목을 정의하고, 수정, 삭제하는 역활을 한다.
 * @extends WIP.view.common.AbstractEntitySetup
 * @author Kyunghyang
 * 
 * @cfg groupItemName 각 모듈의 Group item 명을 설정한다. ('GRP_MATERIAL')
 * @cfg cmfItemName 각 모듈의 CMF item 명을 설정한다. ('CMF_MATERIAL')
 * @cfg groupFieldNamePrefix Group 의 컬럼명
 * @cfg cmfFieldNamePrefix CMF의 컬럼명
 * @cfg cmfMaxCnt : 화면에 설정할 CMF 최대 필드 수
 * 
 */

Ext.define('BAS.view.setup.MaterialSetup', {
	extend : 'SetupForm01',

	title : T('Caption.Menu.Material Setup'),

	requires : [ 'WIP.model.WipViewMaterialOut' ],

	// 상수 정의 변경됨 수정완료
	groupDefaultTable : SF_GCM_MATERIAL_GRP,
	groupItemName : SF_GRP_MATERIAL,
	groupFieldNamePrefix : 'matGrp',

	cmfItemName : SF_CMF_MATERIAL,
	cmfFieldNamePrefix : 'matCmf',

	attrType : 'MATERIAL',

	formReader : {
		url : 'service/wipViewMaterial.json',
		model : 'WIP.model.WipViewMaterialOut'
	},

	buildSupplement : function() {
		return {
			xtype : "matselector"
		// exportTitle : T('Caption.Menu.Material Setup')
		};
	},

	buttonsOpt : [ {
		itemId : 'btnVersionUp',
		url : 'service/wipUpdateMaterial.json'
	}, {
		itemId : 'btnCreate',
		url : 'service/wipUpdateMaterial.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/wipUpdateMaterial.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/wipUpdateMaterial.json',
		confirm : {
			fields : {
				field1 : 'matId'
			}
		}
	} ],

	initComponent : function() {

		this.callParent();

		var self = this;

		var grdRightGrid = this.sub('grdRightGrid');
		var grdLeftGrid = this.sub('grdLeftGrid');

		grdRightGrid.store.load({
			params : {
				procstep : '1'
			}
		});

		this.getTabPanel().on('tabchange', function(tabPanel, newCard, oldCard, eOpts) {
			if (newCard.itemId == "tabAttachFlow") {
				self.sub('basebuttons').disabledItem('btnCreate', true);
				self.sub('basebuttons').disabledItem('btnDelete', true);
			} else {
				self.sub('basebuttons').disabledItem('btnCreate', false);
				self.sub('basebuttons').disabledItem('btnDelete', false);
			}
		});

		this.on('afterrender', function() {
			var supplement = self.getSupplement();
			supplement.on('selectrow', function(selectedRow, seletedData) {
				var btnDel = self.getButtons().sub('btnDelete');
				if (seletedData['deleteFlag'] == 'Y') {
					btnDel.setText(T('Caption.Button.Undelete'));
					btnDel.userConfig.confirm.title = T('Caption.Button.Undelete');
					btnDel.userConfig.confirm.msg = T('Message.Undelete');
				} else {
					btnDel.setText(T('Caption.Button.Delete'));
					btnDel.userConfig.confirm.title = T('Caption.Button.Delete');
					btnDel.userConfig.confirm.msg = T('Message.Delete');
				}
				self.reloadForm(seletedData);
			});

			supplement.on('selectnode', function(selectedNode, seletedData) {
				var btnDel = self.getButtons().sub('btnDelete');
				if (seletedData['deleteFlag'] == 'Y') {
					btnDel.setText(T('Caption.Button.Undelete'));
					btnDel.userConfig.confirm.title = T('Caption.Button.Undelete');
					btnDel.userConfig.confirm.msg = T('Message.Undelete');
				} else {
					btnDel.setText(T('Caption.Button.Delete'));
					btnDel.userConfig.confirm.title = T('Caption.Button.Delete');
					btnDel.userConfig.confirm.msg = T('Message.Delete');
				}
				self.reloadForm(seletedData);
			});
		});

		// Attach Flow
		var leftGridSelected = [];
		var leftGridSelectedSeq = null;
		var leftGridSelectedRowModel = null;
		var rightGridSelected = [];
		var btnArrowLeft = this.sub('btnArrowLeft');
		var btnArrowRight = this.sub('btnArrowRight');

		grdLeftGrid.on('select', function(rowModel, record, index, eOpts) {
			leftGridSelected = rowModel.getSelection();
			leftGridSelectedRowModel = rowModel.store;
			leftGridSelectedSeq = index;

			self.sub('txtOptFlowGroup').setValue(record.data.optFlowGroup);
			self.sub('txtOptFlowOptionFlag').setValue(record.data.optFlowOptionFlag);
		});

		grdRightGrid.on('select', function(rowModel, record, index, eOpts) {
			rightGridSelected = rowModel.getSelection();
		});

		btnArrowLeft.on('click', function(button, event, opts) {
			if (!rightGridSelected || !leftGridSelected)
				return;

			var selectedList = rightGridSelected;
			var addBeforeFlow = leftGridSelected[0].data.flow;
			var addBeforeFlowSeqNum = leftGridSelectedSeq + 1;
			var optFlowGroup = self.sub('txtOptFlowGroup').getValue();
			if (optFlowGroup == '') {
				optFlowGroup = ' ';
			}
			var optFlowOptionFlag = self.sub('txtOptFlowOptionFlag').getValue();
			if (optFlowOptionFlag == '') {
				optFlowOptionFlag = ' ';
			}

			self.AttachFlow(self, selectedList, 0, addBeforeFlow, addBeforeFlowSeqNum, optFlowGroup, optFlowOptionFlag);
		});

		// Detach Flow
		btnArrowRight.on('click', function(button, event, opts) {
			if (!leftGridSelected)
				return;

			var selectedList = leftGridSelected;

			self.DetachFlow(self, selectedList, 0);
		});

		// Flow Up
		var btnArrowUp = this.sub('btnArrowUp');

		btnArrowUp.on('click', function(button, event, opts) {

			// attach 선택
			if (leftGridSelected[0].data.flow == 'Attach ...')
				return;
			// 첫번째 flow 선택
			if (leftGridSelectedSeq == 0)
				return;

			var chkIndex = [];

			for ( var i = 0; i < leftGridSelected.length; i++) {
				if (leftGridSelected[i].index == 0)
					return;
				if (leftGridSelected[i].index == leftGridSelectedRowModel.count() - 1)
					return;
				chkIndex.push(leftGridSelected[i].index);
			}

			chkIndex.sort();

			if (chkIndex.length > 1) {
				for ( var i = 0; i < chkIndex.length; i++) {
					if (chkIndex.length - 1 != i) {
						if (chkIndex[i] != chkIndex[i + 1] - 1) {
							return;
						}
					}
				}
			}

			var selectedList = leftGridSelected;
			var upDownFlag = 'UP';
			var fixSeqNum = leftGridSelected[0].index;
			var fixFlow = leftGridSelectedRowModel.getAt(fixSeqNum - 1).data.flow;

			self.swapFlowSeq(self, selectedList, upDownFlag, fixSeqNum, fixFlow, 0);
		});

		// Flow Down
		var btnArrowDown = this.sub('btnArrowDown');

		btnArrowDown.on('click', function(button, event, opts) {

			// attach 선택
			if (leftGridSelected[0].data.flow == 'Attach ...')
				return;
			// 첫번째 flow 선택
			if (leftGridSelectedSeq == leftGridSelectedRowModel.count() - 2)
				return;

			var chkIndex = [];

			for ( var i = 0; i < leftGridSelected.length; i++) {
				if (leftGridSelected[i].index == leftGridSelectedRowModel.count() - 2)
					return;
				if (leftGridSelected[i].index == leftGridSelectedRowModel.count() - 1)
					return;

				chkIndex.push(leftGridSelected[i].index);
			}

			chkIndex.sort();

			if (chkIndex.length > 1) {
				for ( var i = 0; i < chkIndex.length; i++) {
					if (chkIndex.length - 1 != i) {
						if (chkIndex[i] != chkIndex[i + 1] - 1) {
							return;
						}
					}
				}
			}

			var selectedList = leftGridSelected;
			var upDownFlag = 'DOWN';
			var fixSeqNum = leftGridSelected[leftGridSelected.length - 1].index + 2;
			var fixFlow = leftGridSelectedRowModel.getAt(fixSeqNum - 1).data.flow;

			self.swapFlowSeq(self, selectedList, upDownFlag, fixSeqNum, fixFlow, leftGridSelected.length - 1);
		});

		// Flow Update
		this.sub('btnFlowUpdate').on('click', function(button, event, opts) {
			var optFlowGroup = self.sub('txtOptFlowGroup').getValue();
			if (optFlowGroup == '') {
				optFlowGroup = ' ';
			}
			var optFlowOptionFlag = self.sub('txtOptFlowOptionFlag').getValue();
			if (optFlowOptionFlag == '') {
				optFlowOptionFlag = ' ';
			}

			if (leftGridSelected.length > 0) {
				// 왼쪽 그리드에 선택된 데이타가 있으면 flow Update 실행
				self.updateFlowInfo(leftGridSelected[0].data.flow, leftGridSelected[0].data.flowSeqNum, optFlowGroup, optFlowOptionFlag);
			}
		});

		this.sub('txtMatId').on('change', function(me, newValue, oldValue) {
			if (newValue != oldValue) {
				self.sub('txtMatVer').setValue('1');
			}
		});

		this.sub('btnExport').on('click', function() {
			self.onExportGrid();
		});
	},

	updateFlowInfo : function(flow, flowSeqNum, optFlowGroup, optFlowOptionFlag) {
		if (optFlowGroup != '' && optFlowOptionFlag != '') {
			Ext.Ajax.request({
				url : 'service/WipUpdateOptionalFlow.json',
				method : 'POST',
				params : {
					procstep : SF_STEP_UPDATE,
					matId : this.sub('txtMatId').getValue(),
					matVer : this.sub('txtMatVer').getValue(),
					flow : flow,
					flowSeqNum : flowSeqNum,
					optFlowGroup : optFlowGroup,
					optFlowOptionFlag : optFlowOptionFlag
				},
				success : function(response, opts) {
					var result = Ext.JSON.decode(response.responseText);
					if (result.success) {
						this.refreshGrid(true, 'grdLeftGrid');
					} 
				},
				scope : this
			});
		}
	},

	swapFlowSeq : function(self, selectedList, upDownFlag, fixSeqNum, fixFlow, index) {

		var params = null;

		if (upDownFlag == 'UP') {
			if (selectedList.length == index)
				return;

			params = {
				procstep : '1',
				matId : this.sub('txtMatId').getValue(),
				matVer : this.sub('txtMatVer').getValue(),
				flowSeqNum1 : fixSeqNum,
				flow1 : fixFlow,
				flowSeqNum2 : selectedList[index].index + 1,
				flow2 : selectedList[index].data.flow
			};
			fixSeqNum += 1;
			index += 1;

		} else {
			if (0 > index)
				return;

			params = {
				procstep : '1',
				matId : this.sub('txtMatId').getValue(),
				matVer : this.sub('txtMatVer').getValue(),
				flowSeqNum1 : selectedList[index].index + 1,
				flow1 : selectedList[index].data.flow,
				flowSeqNum2 : fixSeqNum,
				flow2 : fixFlow
			};
			fixSeqNum -= 1;
			index -= 1;
		}

		Ext.Ajax.request({
			url : 'service/WipSwapFlowSeq.json',
			method : 'POST',
			params : params,

			success : function(response, opts) {

				var result = Ext.JSON.decode(response.responseText);

				if (result.success) {
					self.swapFlowSeq(self, selectedList, upDownFlag, fixSeqNum, fixFlow, index);
					this.refreshGrid(true, 'grdLeftGrid');
				} 
			},
			scope : this
		});

	},

	AttachFlow : function(self, selectedList, index, addBeforeFlow, addBeforeFlowSeqNum, optFlowGroup, optFlowOptionFlag) {

		if (selectedList.length != index) {
			if (addBeforeFlow == 'Attach ...') {
				addBeforeFlow = '';
			}

			Ext.Ajax.request({
				url : 'service/WipAttachFlowTomaterial.json',
				method : 'POST',
				params : {
					procstep : '1',
					flow : selectedList[index].data.flow,
					matId : this.sub('txtMatId').getValue(),
					matVer : this.sub('txtMatVer').getValue(),
					addBeforeFlow : addBeforeFlow,
					addBeforeFlowSeqNum : addBeforeFlowSeqNum
				},
				success : function(response, opts) {
					var result = Ext.JSON.decode(response.responseText);

					if (result.success) {

						Ext.Ajax.request({
							url : 'service/WipUpdateOptionalFlow.json',
							method : 'POST',
							params : {
								procstep : SF_STEP_UPDATE,
								flow : selectedList[index].data.flow,
								matId : this.sub('txtMatId').getValue(),
								matVer : this.sub('txtMatVer').getValue(),
								flowSeqNum : addBeforeFlowSeqNum,
								optFlowGroup : optFlowGroup,
								optFlowOptionFlag : optFlowOptionFlag
							},
							success : function(response, opts) {
								var result = Ext.JSON.decode(response.responseText);

								if (result.success) {
									this.refreshGrid(true, 'grdLeftGrid');
									this.AttachFlow(self, selectedList, index + 1, addBeforeFlow, addBeforeFlowSeqNum + 1, optFlowGroup,
											optFlowOptionFlag);

									self.sub('txtOptFlowGroup').setValue(null);
									self.sub('txtOptFlowOptionFlag').setValue(null);
								} 
							},
							scope : self
						});

					}
				},
				scope : this
			});
		}
	},

	DetachFlow : function(self, selectedList, index) {
		if (selectedList.length != index) {
			if (selectedList[index].data.flow != 'Attach ...') {
				Ext.Ajax.request({
					url : 'service/WipDetachFlowFrommaterial.json',
					method : 'POST',
					params : {
						procstep : '1',
						flow : selectedList[index].data.flow,
						matId : this.sub('txtMatId').getValue(),
						matVer : this.sub('txtMatVer').getValue(),
						flowSeqNum : selectedList[index].data.flowSeqNum - index
					},
					success : function(response, opts) {
						var result = Ext.JSON.decode(response.responseText);

						if (result.success) {
							this.refreshGrid(true, 'grdLeftGrid');
							this.DetachFlow(self, selectedList, index + 1);
						}
					},
					scope : this
				});
			}
		}
	},

	refreshGrid : function(reload, gridId) {
		var grid = this.sub(gridId);
		var store = grid.store;

		var params = {
			procstep : '1'
		};

		if (gridId === 'grdLeftGrid') {
			params.procstep = '2';
			params.matId = this.sub('txtMatId').getValue();
			params.matVer = this.sub('txtMatVer').getValue();
		}

		if (reload) {
			store.load({
				params : params,
				callback : function(records, operation, success) {
					if (success) {
						grid.store.add({
							'flow' : 'Attach ...'
						});

						if (grid.getActionEl()) {
							grid.getSelectionModel().select(0);
						}
					}
				}
			});
		}
	},

	reloadForm : function(record) {
		if (!record)
			return;

		var grid = this.sub('tabGridAttribute');
		var grdLeftGrid = this.sub('grdLeftGrid');

		grid.attrLoad({
			procstep : '1',
			attrType : this.attrType,
			attrKey : record.matId + " : " + record.matVer
		});

		this.formLoad({
			procstep : '1',
			matId : record.matId,
			matVer : record.matVer
		});

		grdLeftGrid.store.load({
			params : {
				procstep : '2',
				matId : record.matId,
				matVer : record.matVer
			},
			callback : function(records, operation, success) {
				if (success) {
					grdLeftGrid.store.add({
						'flow' : 'Attach ...'
					});
					selModel = grdLeftGrid.getSelectionModel();
					if (grdLeftGrid.getActionEl())
						selModel.select(0);
				}
			},
			scope : this
		});

	},

	onExportGrid : function() {
		var grid = this.sub('grdLeftGrid');
		if (!grid)
			return;

		var exportParams = {
			procstep : '2',
			matId : this.sub('txtMatId').getValue(),
			matVer : this.sub('txtMatVer').getValue()
		};

		var params = SF.cf.getExportParams(this.title, grid, exportParams);
		Ext.Ajax.request({
			url : 'service/WipViewFlowList.xls',
			params : params || {},
			form : this.downloadForm, // 폼에 설정한 iframe
			isUpload : true,
			scope : this
		});
	},

	// undelete면 procstep 변경
	onBeforeDelete : function(form, addParams, url) {
		var chkDeleteFlag = this.sub('chkDeleteFlag');
		if (chkDeleteFlag.getValue()) {
			addParams['procstep'] = SF_STEP_UNDELETE;
		}
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			// var params = {};
			// params.matId = form.getFieldValues()['matId'];
			// params.matVer = form.getFieldValues()['matVer'];
			// this.reloadForm(params);
			this.getSupplement().refreshSelector(2, [ {
				column : 'matId',
				value : form.getFieldValues()['matId']
			}, {
				column : 'matVer',
				value : form.getFieldValues()['matVer']
			} ]);
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			// var params = {};
			// params.matId = form.getFieldValues()['matId'];
			// params.matVer = form.getFieldValues()['matVer'];
			// this.reloadForm(params);
			this.getSupplement().refreshSelector(2, [ {
				column : 'matId',
				value : form.getFieldValues()['matId']
			}, {
				column : 'matVer',
				value : form.getFieldValues()['matVer']
			} ]);
		}
	},

	onAfterDelete : function(form, action, success) {
		var matId = form.getFieldValues()['matId'];
		var matVer = form.getFieldValues()['matVer'];
		var select = [ {
			column : 'matId',
			value : matId
		}, {
			column : 'matVer',
			value : matVer
		} ];

		this.getForm().getFields().each(function(f) {
			f.setValue(null);
		});

		this.getSupplement().refreshSelector(2, select);
	},

	onAfterVersionUp : function(form, action, success) {
		if (success) {
			// BoMSetId 때문에 VersionUp 다음에 변경된 version을 알수 없어 select refresh 할 수
			// 없다.
			this.getSupplement().refreshSelector(2);
		}
	},

	// create, update, delete 체크
	checkCondition : function(step, form, addParams) {
		return true;
	},

	buildTopPart : function(main) {
		return [ {
			xtype : 'container',
			itemId : 'zbasic',
			layout : {
				type : 'hbox',
				align : 'top'
			},
			items : [ {
				xtype : 'textfield',
				itemId : 'txtMatId',
				name : 'matId',
				flex : 2,
				maxLength : 30,
				enforceMaxLength : true,
				fieldLabel : T('Caption.Other.Material'),
				labelSeparator : '',
				labelStyle : 'font-weight:bold',
				allowBlank : false
			}, {
				xtype : 'textfield',
				itemId : 'txtMatVer',
				name : 'matVer',
				flex : 1,
				cls : 'marginL5',
				maxLength : 50,
				enforceMaxLength : true,
				fieldLabel : T('Caption.Other.Version'),
				labelSeparator : '',
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				readOnly : true
			} ]
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			labelSeparator : '',
			itemId : 'txtMatDesc',
			name : 'matDesc'
		} ];
	},

	buildGeneralTab : function(main) {
		return {
			xtype : 'container',
			title : T('Caption.Other.General'),
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			cls : 'paddingRL7 paddingT5',
			minHeight : '430',
			items : [ {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : {
					xtype : 'fieldset',
					title : T('Caption.Other.General'),
					layout : 'anchor',
					flex : 1,
					cls : 'marginR7',
					defaults : {
						xtype : 'textfield',
						labelWidth : 120,
						anchor : '100%',
						labelSeparator : ''
					},
					items : [ {
						xtype : 'codeview',
						codeviewName : 'MaterialType',
						itemId : 'cdvMatType',
						name : 'matType',
						fieldLabel : T('Caption.Other.Material Type'),
						labelSeparator : '',
						labelStyle : 'font-weight:bold',
						allowBlank : false
					}, {
						xtype : 'codeview',
						codeviewName : 'Unit',
						itemId : 'cdvUnit1',
						name : 'unit1',
						fieldLabel : T('Caption.Other.Unit 1'),
						labelSeparator : '',
						labelStyle : 'font-weight:bold',
						allowBlank : false
					}, {
						xtype : 'codeview',
						codeviewName : 'Unit',
						itemId : 'cdvUnit2',
						name : 'unit2',
						fieldLabel : T('Caption.Other.Unit 2'),
						labelSeparator : ''
					}, {
						xtype : 'codeview',
						codeviewName : 'Unit',
						itemId : 'cdvUnit3',
						name : 'unit3',
						fieldLabel : T('Caption.Other.Unit 3'),
						labelSeparator : ''
					}, {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						// maxLength : 10,
						// enforceMaxLength : true,
						// allowDecimals : false, //true: 소수,정수 - false : 정수
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Default Qty 1'),
						itemId : 'numDefQty1',
						name : 'defQty1'
					}, {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Default Qty 2'),
						name : 'defQty2'
					}, {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Default Qty 3'),
						name : 'defQty3'
					}, {
						xtype : 'userstamp',
						fieldDefaults : {
							anchor : '100%'
						},
						showOption : {
							display : 'CUD',
							layout : 'anchor'
						}
					}, {
						xtype : 'checkboxgroup',
						vertical : true,
						columns : 2,
						items : [ {
							boxLabel : T('Caption.Other.Delete Flag'),
							itemId : 'chkDeleteFlag',
							inputValue : 'Y',
							name : 'deleteFlag',
							disabled : true
						}, {
							boxLabel : T('Caption.Other.Deactive Flag'),
							itemId : 'chkDeactiveFlag',
							inputValue : 'Y',
							name : 'deactiveFlag'
						} ]
					} ]
				}
			}, {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : [ {
					xtype : 'fieldset',
					title : T('Caption.Other.Relation'),
					layout : 'anchor',
					flex : 1,
					defaults : {
						xtype : 'textfield',
						labelWidth : 110,
						maxLength : 30,
						enforceMaxLength : true,
						anchor : '100%',
						labelSeparator : ''
					},
					items : [ {
						fieldLabel : T('Caption.Other.Base Material'),
						itemId : 'txtBaseMatId',
						name : 'baseMatId'
					}, {
						fieldLabel : T('Caption.Other.Vendor'),
						itemId : 'txtVendorId',
						name : 'vendorId'
					}, {
						fieldLabel : T('Caption.Other.Vendor Material'),
						itemId : 'txtVendorMatId',
						name : 'vendorMatId'
					}, {
						fieldLabel : T('Caption.Other.Customer'),
						itemId : 'txtCustomerId',
						name : 'customerId'
					}, {
						fieldLabel : T('Caption.Other.Customer Material'),
						itemId : 'txtCustomerMatId',
						name : 'customerMatId'
					}, {
						fieldLabel : T('Caption.Other.MFG Division'),
						itemId : 'txtMfgDevision',
						name : 'mfgDevision'
					}, {
						xtype : 'checkbox',
						padding : '0 0 0 115',
						boxLabel : T('Caption.Other.Subcontract Flag'),
						itemId : 'chkSubcontractFlag',
						name : 'subcontractFlag',
						inputValue : 'Y'
					} ]
				}, {
					xtype : 'fieldset',
					title : T('Caption.Other.Target'),
					layout : 'anchor',
					flex : 1,
					defaults : {
						xtype : 'decimalfield',
						labelWidth : 110,
						anchor : '100%',
						labelSeparator : '',
						minValue : 0,
						maxValue : 9999999,
						cls : 'textAlignRight'
					},
					items : [ {
						fieldLabel : T('Caption.Other.Target Yield'),
						name : 'targetYield'
					}, {
						fieldLabel : T('Caption.Other.Target Due Day'),
						name : 'targetDueDay'
					}, {
						fieldLabel : T('Caption.Other.Target Qty 1'),
						name : 'targetQty1'
					}, {
						fieldLabel : T('Caption.Other.Target Qty 2'),
						name : 'targetQty2'
					}, {
						fieldLabel : T('Caption.Other.Target Qty 3'),
						name : 'targetQty3'
					} ]
				} ]
			} ]
		};
	},

	buildPropertiesTab : function(main) {
		return {
			xtype : 'container',
			title : T('Caption.Other.Properties'),
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			flex : 1,
			cls : 'paddingRL7 paddingT5',
			minHeight : '430', // scroll 표시를 위한 최저 height 기재필요
			items : [ {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : [ {
					xtype : 'fieldset',
					title : T('Caption.Other.Weight'),
					layout : 'anchor',
					flex : 1,
					cls : 'marginR7',
					defaults : {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						labelWidth : 110,
						anchor : '100%',
						labelSeparator : ''
					},
					items : [ {
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Net'),
						name : 'weightNet'
					}, {
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Gross'),
						name : 'weightGross'
					}, {
						xtype : 'textfield',
						fieldLabel : T('Caption.Other.Weight Unit'),
						maxLength : 10,
						enforceMaxLength : true,
						itemId : 'txtWeightUnit',
						name : 'weightUnit'
					} ]
				}, {
					xtype : 'fieldset',
					title : T('Caption.Other.Volume'),
					layout : 'anchor',
					flex : 1,
					cls : 'marginR7',
					defaults : {
						labelWidth : 110,
						anchor : '100%',
						labelSeparator : ''
					},
					items : [ {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Volume'),
						itemId : 'txtVolume',
						name : 'volume'
					}, {
						xtype : 'textfield',
						maxLength : 10,
						enforceMaxLength : true,
						fieldLabel : T('Caption.Other.Volume Unit'),
						itemId : 'txtVolumeUnit',
						name : 'volumeUnit'
					} ]
				}, {
					xtype : 'fieldset',
					title : T('Caption.Other.Dimension'),
					layout : 'anchor',
					flex : 2,
					cls : 'marginR7',
					defaults : {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						labelWidth : 110,
						anchor : '100%',
						labelSeparator : ''
					},
					items : [ {
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Horizontal'),
						name : 'dimensionHr'
					}, {
						xtype : 'textfield',
						fieldLabel : T('Caption.Other.Horizontal Unit'),
						maxLength : 10,
						enforceMaxLength : true,
						itemId : 'txtDimensionHrUnit',
						name : 'dimensionHrUnit'
					}, {
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Vertical'),
						name : 'dimensionVt'
					}, {
						xtype : 'textfield',
						fieldLabel : T('Caption.Other.Vertical Unit'),
						maxLength : 10,
						enforceMaxLength : true,
						itemId : 'txtDimensionVt',
						name : 'dimensionVtUnit'
					}, {
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Height'),
						name : 'dimensionHt'
					}, {
						xtype : 'textfield',
						fieldLabel : T('Caption.Other.Height Unit'),
						maxLength : 10,
						enforceMaxLength : true,
						itemId : 'txtDimensionHtUnit',
						name : 'dimensionHtUnit'
					} ]
				} ]
			}, {
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				cls : 'paddingT7',
				items : [ {
					xtype : 'fieldset',
					cls : 'paddingT5',
					layout : 'anchor',
					defaults : {
						labelWidth : 130,
						anchor : '100%',
						labelSeparator : ''
					},
					items : [ {
						xtype : 'codeview',
						codeviewName : 'MaterialPackType',
						itemId : 'cdvPackType',
						name : 'packType',
						fieldLabel : T('Caption.Other.Pack Type'),
						labelSeparator : ''

					}, {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Pack Lot Count'),
						itemId : 'txtPackLotCount',
						name : 'packLotCount'
					}, {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						cls : 'textAlignRight',
						fieldLabel : T('Caption.Other.Pack Qty'),
						itemId : 'txtPackQty',
						name : 'packQty'
					}, {
						xtype : 'codeview',
						codeviewName : 'TbBomSet',
						itemId : 'cdvBomSetId',
						name : 'bomSetId',
						fieldLabel : T('Caption.Other.BOM Set ID'),
						labelSeparator : ''
					}, {
						xtype : 'textfield',
						maxLength : 10,
						enforceMaxLength : true,
						fieldLabel : T('Caption.Other.Default INV Operation'),
						itemId : 'txtDefInvOper',
						name : 'defInvOper'
					} ]
				}, {
					xtype : 'fieldset',
					title : T('Caption.Other.Stock Level'),
					layout : 'anchor',
					flex : 1,
					defaults : {
						xtype : 'decimalfield',
						decimalPrecision : 3,
						minValue : 0,
						maxValue : 9999999,
						cls : 'textAlignRight',
						labelWidth : 110,
						anchor : '100%',
						labelSeparator : ''
					},
					items : [ {
						fieldLabel : T('Caption.Other.Low error'),
						name : 'leStockLevel',
						itemId : 'txtLeStockLevel'
					}, {
						fieldLabel : T('Caption.Other.Low Warning'),
						name : 'lwStockLevel',
						itemId : 'txtLwStockLevel'
					}, {
						fieldLabel : T('Caption.Other.High error'),
						name : 'heStockLevel',
						itemId : 'txtHeStockLevel'
					}, {
						fieldLabel : T('Caption.Other.High Warning'),
						name : 'hwStockLevel',
						itemId : 'txtHwStockLevel'
					} ]
				}, {
					xtype : 'container',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					flex : 1,
					items : [ {
						xtype : 'fieldset',
						title : T('Caption.Other.IQC'),
						layout : 'anchor',
						flex : 1,
						cls : 'marginR7',
						defaults : {
							xtype : 'checkbox',
							labelWidth : 110,
							anchor : '100%',
							labelSeparator : ''
						},
						items : [ {
							boxLabel : T('Caption.Other.Flag'),
							name : 'iqcFlag',
							itemId : 'chkIiqcFlag',
							inputValue : 'Y'
						}, {
							boxLabel : T('Caption.Other.Sample Flag'),
							name : 'iqcSampleFlag',
							itemId : 'chkIqcSampleFlag',
							inputValue : 'Y'
						}, {
							boxLabel : T('Caption.Other.Sample Rule'),
							name : 'iqcSampleRule',
							itemId : 'chkIqcSampleRule',
							inputValue : 'Y'
						} ]
					}, {
						xtype : 'fieldset',
						title : T('Caption.Other.OQC'),
						layout : 'anchor',
						flex : 1,
						defaults : {
							xtype : 'checkbox',
							labelWidth : 110,
							anchor : '100%',
							labelSeparator : ''
						},
						items : [ {
							boxLabel : T('Caption.Other.Flag'),
							name : 'oqcFlag',
							itemId : 'chkOqcFlag',
							inputValue : 'Y'
						}, {
							boxLabel : T('Caption.Other.Sample Flag'),
							name : 'oqcSampleFlag',
							itemId : 'chkOqcSampleFlag',
							inputValue : 'Y'
						}, {
							boxLabel : T('Caption.Other.Sample Rule'),
							name : 'oqcSampleRule',
							itemId : 'chkOqcSampleRule',
							inputValue : 'Y'
						} ]
					} ]
				} ]
			} ]
		};
	},

	buildOtherTabs : function() {
		return {
			xtype : 'container',
			title : T('Caption.Other.Attach Flow'),
			itemId : 'tabAttachFlow',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			cls : 'paddingTB7 paddingRL7',
			items : [ {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : {
					xtype : 'grid',
					itemId : 'grdLeftGrid',
					flex : 1,
					multiSelect : true,
					selModel : Ext.create('Ext.selection.RowModel', {
						mode : 'MULTI'
					}),
					cls : 'borderRL navyGrid',
					columnLines : true,
					store : Ext.create('WIP.store.WipViewFlowListOut.flowList'),
					selModel : Ext.create('Ext.selection.RowModel', {
						mode : 'MULTI'
					}),
					columns : [ {
						header : T('Caption.Other.Attached Flow'),
						width : 150,
						dataIndex : 'flow'
					}, {
						header : T('Caption.Other.Group'),
						width : 100,
						dataIndex : 'flowDesc'
					}, {
						header : T('Caption.Other.Option'),
						width : 100,
						dataIndex : 'optFlowGroup'
					}, {
						header : T('Caption.Other.Description'),
						width : 250,
						dataIndex : 'optFlowOptionFlag'
					} ]
				}
			}, {
				xtype : 'container',
				width : 40,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				cls : 'attachBtns',
				items : [ {
					xtype : 'container',
					layout : {
						type : 'vbox',
						align : 'center',
						pack : 'center'
					},
					flex : 1,
					defaults : {
						width : 24
					},
					items : [ {
						xtype : 'button',
						itemId : 'btnArrowLeft',
						cls : 'btnArrowLeft marginB5'
					}, {
						xtype : 'button',
						itemId : 'btnArrowRight',
						cls : 'btnArrowRight'
					} ]
				}, {
					xtype : 'container',
					layout : {
						type : 'vbox',
						align : 'center',
						pack : 'center'
					},
					height : 80,
					defaults : {
						width : 24,
						cls : 'marginB5'
					},
					items : [ {
						xtype : 'button',
						itemId : 'btnArrowUp',
						cls : 'btnArrowUp marginB5'
					}, {
						xtype : 'button',
						itemId : 'btnArrowDown',
						cls : 'btnArrowDown marginB5'
					}, {
						xtype : 'button',
						text : 'E',
						itemId : 'btnExport'
					} ]
				} ]
			}, {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				items : [ {
					xtype : 'container',
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					height : 55,
					items : [ {
						xtype : 'container',
						layout : {
							type : 'vbox',
							align : 'stretch'
						},
						flex : 1,
						defaults : {
							labelSeparator : '',
							labelWidth : 130
						},
						items : [ {
							xtype : 'textfield',
							fieldLabel : T('Caption.Other.Optional Group'),
							maxLength : 20,
							enforceMaxLength : true,
							itemId : 'txtOptFlowGroup',
							name : 'optFlowGroup'
						}, {
							xtype : 'textfield',
							fieldLabel : T('Caption.Other.Optional Group Option'),
							maxLength : 1,
							enforceMaxLength : true,
							itemId : 'txtOptFlowOptionFlag',
							name : 'optFlowOptionFlag'
						} ]
					}, {
						xtype : 'container',
						layout : {
							type : 'vbox',
							align : 'stretch',
							pack : 'end'
						},
						width : 60,
						items : [ {
							xtype : 'button',
							itemId : 'btnFlowUpdate',
							text : T('Caption.Button.Update'),
							cls : 'marginL7 marginB5'
						} ]
					} ]
				}, {
					xtype : 'grid',
					itemId : 'grdRightGrid',
					flex : 1,
					cls : 'borderRL navyGrid',
					columnLines : true,
					store : Ext.create('WIP.store.WipViewFlowListOut.flowList'),
					selModel : Ext.create('Ext.selection.RowModel', {
						mode : 'MULTI'
					}),
					columns : [ {
						header : T('Caption.Other.Flow'),
						width : 150,
						dataIndex : 'flow'
					}, {
						header : T('Caption.Other.Description'),
						flex : 1,
						dataIndex : 'flowDesc'
					} ]
				} ]
			} ]
		};
	}

});
