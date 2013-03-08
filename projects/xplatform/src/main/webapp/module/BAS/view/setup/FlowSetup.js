Ext.define('BAS.view.setup.FlowSetup', {
	extend : 'BAS.view.common.TaskSetupForm',

	xtype : 'bas_flow_setup',
	
	title : T('Caption.Menu.Flow Setup'),

	requires : [  'BAS.model.WipViewFlowExtOut', 'BAS.model.WipViewFlowExtOut.operationList' ],

	groupDefaultTable : SF_GCM_FLOW_GRP,
	groupItemName : SF_GRP_FLOW,
	cmfItemName : SF_CMF_FLOW,
	
	groupFieldNamePrefix : 'flowGrp',
	cmfFieldNamePrefix : 'flowCmf',
	attrType : 'FLOW',

	documentConfig : {
		formModel : 'WIP.model.WipViewFlowOut',
		viewServiceName : 'wipViewFlowExt',
		reqServiceName : 'wipUpdateFlowExt',
		entityType : 'MWipFlwDef',
		procstep : '1',
		key1 : 'factory',
		key2 : 'flow'
		// key 설정.....
	},

	initComponent : function() {
		this.callParent();
		var self = this;
		
		var attachOperSelected = null;
		var operGrdSelected = null;

		this.on('afterrender', function() {
			self.sub('grdOperList').store.load({
				params : {
					procstep : '1'
				}
			});
		});
		// Seq change Button Up클릭시
		this.sub('grdOperAttach').on('select', function(rowModel, record, index, opts) {
			attachOperSelected = rowModel.getSelection();
			attachRowModel = rowModel.store;

			self.sub('txtOptOperGroup').setValue(record.data.optOperGroup);
			self.sub('txtOptOperOptionFlag').setValue(record.data.optOperOptionFlag);
		});

		// Attach Operation
		this.sub('grdOperList').on('select', function(rowModel, record, index, opts) {
			operGrdSelected = rowModel.getSelection();
		});

		/* attach buttons */
		this.sub('btnAttach').on('click', function(button, event, opts) {
			if (operGrdSelected == null || attachOperSelected == null)
				return;
			var attachStore = self.sub('grdOperAttach').store;
			
			var success = true;
			for(var i in operGrdSelected){
				operGrdSelected[i].data.optOperGroup = self.sub('txtOptOperGroup').getValue()||' ';
				operGrdSelected[i].data.optOperOptionFlag = self.sub('txtOptOperOptionFlag').getValue()||' ';
				
				var ret = attachStore.find('oper', operGrdSelected[i].data.oper);
				if(ret != -1){
					success = false;
					break;
				}
			}
			if(!success){
				Ext.Msg.alert('Error', T('Message.111'));
				return;
			}

			var index = attachOperSelected[0].index;
			
			if (attachStore.find('oper', attachOperSelected[0].data.oper) == -1 || !index) { 
				// 선택한 oper가 없을때
				index = attachStore.getCount()-1;
			}
			
			attachStore.insert(index,operGrdSelected);
			self.setIndexing(attachStore);
		});

		// Detach Operation
		this.sub('btnDetach').on('click', function(button, event, opts) {
			if (operGrdSelected == null || attachOperSelected == null)
				return;
			
			var attachStore = self.sub('grdOperAttach').store;
			
			if (attachStore.find('oper', attachOperSelected[0].data.oper) == -1 || attachStore.last() == attachOperSelected[0]) {
				// 선택한 oper가 없을때
				return;
			}
			attachStore.remove(attachOperSelected);
			self.setIndexing(attachStore);
		});

		// operation update
		this.sub('btnOperUpdate').on('click', function(button, event, opts) {
			var operGroup = self.sub('txtOptOperGroup').getValue()||' ';
			var optionFlag = self.sub('txtOptOperOptionFlag').getValue()||' ';

			if (attachOperSelected[0]) {
				if (attachOperSelected[0].data.oper != 'Attach ...') {
					attachOperSelected[0].set('optOperGroup', operGroup);
					attachOperSelected[0].set('optOperOptionFlag', optionFlag);
				}
			}
		});
	},

	setIndexing : function(store){
		var index = 0;
		store.each(function(rec){
			rec.index = index;
			index++;
		});
	},

	buildDocumentForm : function(main){
		return [{
			xtype : 'textfield',
			hidden : true,
			itemId : 'txtProcstep',
			allowBlank : false,
			name : 'procstep'
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Flow'),
			itemId : 'txtFlow',
			labelStyle : 'font-weight:bold',
			name : 'flow',
			allowBlank : false,
			maxLength : 20,
			enforceMaxLength : true
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			itemId : 'txtFlowDesc',
			name : 'flowDesc',
			maxLength : 50,
			enforceMaxLength : true
		}, {
			xtype : 'tabpanel',
			itemId : 'baseTabPanel',
			autoScroll : true, // 내용이 많아지면 scroll이 표시
			flex : 1,
			bodyCls : 'scrollXHidden',// scroll 중 가로 스크롤 감춤
			items : [
	         	this.buildGroupSetupTab(this),
	         	this.buildGeneralTab(this),
        		this.buildAttributeSetupTab(this),
        		this.buildCustomFieldSetupTab(this)
        	]
		}];
	},

	buildGeneralTab : function(main) {
		return {
			xtype : 'container',
			cls : 'paddingRL7 paddingTB5',
			title : T('Caption.Other.Attach Operation'),
			itemId : 'tabAttach',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			flex : 1,
			items : [  {
				xtype : 'grid',
				flex : 1,
				itemId : 'grdOperAttach',
				cls : 'navyGrid',
				multiSelect : true,
				selModel : Ext.create('Ext.selection.RowModel', {
					mode : 'MULTI'
				}),
				store : Ext.create('Ext.data.Store',{
					model : 'BAS.model.WipViewFlowExtOut.operationList',
					data : [{'oper' : 'Attach ...'}]
				}),
				columns : [ {
					header : T('Caption.Other.Operation'),
					dataIndex : 'oper',
					flex : 1
				}, {
					header : T('Caption.Other.Group'),
					dataIndex : 'optOperGroup',
					flex : 1
				}, {
					header : T('Caption.Other.Option'),
					dataIndex : 'optOperOptionFlag',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'operDesc',
					flex : 2
				} ]
			}, {
				xtype : 'container',
				layout : {
					type : 'vbox',
					align : 'center'
				},
				width : 40,
				defaults : {
					xtype : 'button',
					width : 24
				},
				items : [ {
					xtype : 'component',
					flex : 1
				}, {
					itemId : 'btnAttach',
					cls : 'btnArrowLeft marginB5'
				}, {
					itemId : 'btnDetach',
					cls : 'btnArrowRight'
				}, {
					xtype : 'component',
					flex : 1
				}, {
					itemId : 'btnUp',
					cls : 'btnArrowUp marginT5 marginB5'
				}, {
					itemId : 'btnDown',
					cls : 'btnArrowDown'
				}]
			}, {
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [ {
					xtype : 'container',
					layout : 'hbox',
					items : [ {
						xtype : 'container',
						layout : 'anchor',
						flex : 1,
						defaults : {
							anchor : '100%',
							labelWidth : 130,
							submitValue : false
						},
						items : [ {
							xtype : 'textfield',
							fieldLabel : T('Caption.Other.Optional Group'),
							itemId : 'txtOptOperGroup',
							maxLength : 20,
							enforceMaxLength : true
						}, {
							xtype : 'textfield',
							fieldLabel : T('Caption.Other.Optional Group Option'),
							itemId : 'txtOptOperOptionFlag',
							maxLength : 1,
							enforceMaxLength : true
						} ]
					}, {
						xtype : 'button',
						text : T('Caption.Button.Update'),
						itemId : 'btnOperUpdate',
						cls : 'marginL7 marginB5',
						width : 60
					} ]
				}, {
					xtype : 'grid',
					cls : 'navyGrid',
					flex : 1,
					itemId : 'grdOperList',
					multiSelect : true,
					selModel : Ext.create('Ext.selection.RowModel', {
						mode : 'MULTI'
					}),
					store : Ext.create('BAS.store.WipViewOperationListOut.List'),
					columns : [ {
						header : T('Caption.Other.Operation'),
						dataIndex : 'oper',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'operDesc',
						flex : 2
					} ]
				} ]
			} ]
		};
	},

	buildGroupSetupTab : function(main) {
		var grpCmfTypeName = main.grpCmfTypeName||'';
		var groupDefaultTable = SmartFactory.gcmGrp[grpCmfTypeName]||main.groupDefaultTable;
		var groupItemName = SmartFactory.grp[grpCmfTypeName]||main.groupItemName;
		return {
			xtype : 'wip_view_groupsetup',
			title : T('Caption.Other.Group Setup'),
			itemId : 'tabGroupsetup',
			itemName : groupItemName,
			groupDefaultTable : groupDefaultTable,
			fieldNamePrefix : main.groupFieldNamePrefix,
			cmfMaxCnt : 10
		};
	},

	buildAttributeSetupTab : function(main) {
		return {
			xtype : 'bas_attrgrid',
			title : T('Caption.Other.Attribute'),
			itemId : 'tabGridAttribute',
			attrType : main.attrType,
			showFailureMsg : false
		};
	},

	buildCustomFieldSetupTab : function(main) {
		var grpCmfTypeName = main.grpCmfTypeName||'';
		var cmfItemName = SmartFactory.cmf[grpCmfTypeName]||main.cmfItemName;
		return {
			xtype : 'wip_view_groupsetup',
			title : T('Caption.Other.Customized Field'),
			itemId : 'tabCmfsetup',
			useCodeView : true,
			itemName : cmfItemName,
			fieldNamePrefix : main.cmfFieldNamePrefix,
			cmfMaxCnt : main.cmfMaxCnt
		};
	}
});
