Ext.define('BAS.view.setup.FlowView',{
	extend : 'Ext.form.Panel',
	
	requires : [  'BAS.model.WipViewFlowExtOut', 'BAS.model.WipViewFlowExtOut.operationList' ],

	mixins : {
		deeplink : 'mixin.DeepLink'
	},
	
	layout : 'fit',
	flex : 1,
	title : 'Flow Data',

	groupDefaultTable : SF_GCM_FLOW_GRP,
	groupItemName : SF_GRP_FLOW,
	cmfItemName : SF_CMF_FLOW,
	groupFieldNamePrefix : 'flowGrp',
	cmfFieldNamePrefix : 'flowCmf',
	attrType : 'FLOW',
	
	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},
	
	initComponent : function(){
		this.store = Ext.create('Ext.data.Store',{
			model : 'BAS.model.WipViewFlowExtOut'
		});
		this.operStore = Ext.create('Ext.data.Store',{
			fields : ['oper','operDesc','optOperGroup','optOperOptionFlag']
		});
		this.callParent();
		var self = this;
		this.formLoadLock = SF.createLock();
		
		if(this.import == 'N'){
			// 승인 진행중인 데이터 표시
			this.add(this.buildReqView(self));
		}else{
			// 원본데이터 조회 표시
			this.add(this.buildDataForm(self));
			this.addDocked({
				xtype : 'toolbar',
				dock : 'bottom',
				ui : 'footer',
				items : [ '->', {
					minWidth : 75,
					xtype : 'button',
					text : 'Close',
					handler : function(){
						self.close();
					}
				} ]
			} );
		}
		
		this.on('keychange',function(view, keys){
			// keychange는 DataForm일경우만 적용됨.
			SF.cf.callService({
				url : 'service/WipViewFlow.json',
				scope : this,
				params : {
					procstep : '1',
					flow : keys.flow
				},
				callback : function(response, success){
					if(success){
						self.formLoad(response.result,success);
					}
				}
			});
		});
	},
	formLoad : function(data, success){
		this.formLoadLock.ready(this._formLoad, this, [data, success]);
	},
	_formLoad : function(data, success){
		this.reqData = data;
		var docData = data.document||data;
		if(success){
		    if(this.import == 'N'){
		    	this.store.loadData([docData]);
				if(docData.operationList){
					this.operStore.loadData(docData.operationList);
				}
			}
			else {
				this.sub('tabGridAttribute').attrLoad({
					procstep : '1',
					attrType : this.attrType,
					attrKey : docData.flow
				});
				
				this.getForm().setValues(docData);
				/* oper grid list setting */
				if(docData){
					this.sub('grdOperAttach').store.load({
						params : {
							procstep : '2',
							flow : docData.flow
						}
					});
				}
			}
		}
		else{
			this.fileGroupId = '';
			this.store.removeAll();
			SF.cf.clearFormFields(this);
		}
	},
	
	buildReqView : function(){
		var infoList = [ {
			label : 'Flow',
			value : 'flow'
		}, {
			label : 'Description',
			value : 'flowDesc'
		}, {
			label : 'Group 1',
			value : 'flowGrp1'
		}, {
			label : 'CMF 1',
			value : 'flowCmf1'
		} ];
		var tpl = '<tpl for="."><div class="infoItemSet">';
		Ext.Array.each(infoList, function(field) {
			var div = '';
			if (field.div) {
				div = field.div;
			} else {
				div = '<div>';
			}

			tpl += '<tpl if="'+field.value+'!=null">' +div + '<span>' + field.label + '</span>{' + field.value + '}</div></tpl>';
		});
		tpl += '</div></tpl>';
		return [{
			xtype : 'dataview',
			itemId : 'dvDocument',
			store : this.store,
			itemSelector : '.infoItemSet',
			tpl : tpl
		}, {
			xtype : 'label',
			cls : 'opinionTitle',
			text : 'Operation List'
		}, {
			xtype : 'dataview',
			itemId : 'dvOper',
			store : this.operStore,
			itemSelector : '.infoItemSet',
			tpl : [
	               '<tpl for="."><div class="infoItemSet">',
	               '<div><span>{oper} [ {optOperGroup} / {optOperOptionFlag} ]</span>{operDesc}</div>',
	               '</div></tpl>'
	        ]
		} ];
	},
	buildDataForm : function(main){
		return {
			xtype : 'container',
			cls : 'marginTB10 marginRL10',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			defaults : {
				anchor : '100%',
				labelWidth : 120,
				submitValue : false,
				readOnly : true
			},
			items : [{
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Flow'),
				itemId : 'txtFlow',
				labelStyle : 'font-weight:bold',
				name : 'flow',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Description'),
				itemId : 'txtFlowDesc',
				name : 'flowDesc',
				readOnly : true
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
			}]
		};
	},

	buildGeneralTab : function(main) {
		return {
			xtype : 'grid',
			itemId : 'grdOperAttach',
			title : T('Caption.Other.Attach Operation'),
			layout : 'fit',
			cls : 'navyGrid',
			columnLines : true,
			store : Ext.create('WIP.store.WipViewOperationListOut.List'),
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
			readOnly : true,
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
			readOnly : true,
			itemName : cmfItemName,
			fieldNamePrefix : main.cmfFieldNamePrefix,
			cmfMaxCnt : main.cmfMaxCnt
		};
	}
});
