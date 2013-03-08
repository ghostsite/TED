Ext.define('BAS.view.common.TaskSetupForm', {
	extend : 'Ext.form.Panel',

	xtype : 'mes_task_setup_form',
	requires : [ 'mixin.DeepLink', 'CMN.plugin.Supplement', 'BAS.model.BasViewTaskRequestOut' ],
	
	mixins : {
		deeplink : 'mixin.DeepLink',
		buttonHandler : 'MES.mixin.ButtonHandler'
	},

	bodyCls : 'paddingAll10',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	dockedItems : {
		xtype : 'mes_task_buttons',
		items : [ 'Save', '->','Submit', 'Cancel', 'Close' ]
	},

	initComponent : function() {
		this.plugins = [ Ext.create('CMN.plugin.Supplement') ];

		if (this.buildSupplement != Ext.emptyFn) {
			this.supplement = this.buildSupplement();
			this.supplement.sheet = this.title || 'Supplement';
		}

		this.callParent();

		var self = this;

		this.documentConfig = Ext.applyIf({
			factory : SF.login.factory,
			userId : SF.login.id
		}, this.documentConfig);

		this.frmRequest = this.add(this.buildReqForm(this));
		
		this.frmImport = this.add(this.buildImportForm(this));
		
		var frmDoc = this.buildDocumentForm(this);
		
		if (Ext.typeOf(frmDoc) == 'array') {
			this.frmDocument = this.add({
				xtype : 'form',
				itemId : 'frmDocument',
				title : 'Master Data Infomation',
				bodyCls : 'paddingAll10',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : frmDoc
			});
		} else {
			this.frmDocument = this.add(frmDoc);
		}
		
		/** form 설정 */
		//import시 폼 전체 submit시 설정
		this.getForm().reader = Ext.create('Ext.data.reader.Json', {
			model : 'BAS.model.BasViewTaskRequestOut'
		});
		//request data 분리
		this.frmRequest.getForm().reader = Ext.create('Ext.data.reader.Json', {
			model : 'BAS.model.BasViewTaskRequestOut'
		});
		this.frmRequest.getForm().trackResetOnLoad = true;

		if (this.documentConfig.formModel) {
			this.frmDocument.getForm().reader = Ext.create('Ext.data.reader.Json', {
				model : this.documentConfig.formModel
			});
		}
		this.frmDocument.getForm().trackResetOnLoad = true;
		/** form 설정 */

		// 화면 데이터 변경이 완료되면 이벤트를 발생시킨다.
		this.addEvents('changerequest');
		this.addEvents('afterformload');
	},
	setDocForm : function(reqType){
		if(reqType == 'import'){
			this.frmDocument.setVisible(false);
			this.frmDocument.setDisabled(true);			
			this.sub('btnSave').setVisible(false);
			
			this.importFlag = true;
			this.frmImport.setVisible(true);
		}
		else{
			this.frmDocument.setVisible(true);
			this.frmDocument.setDisabled(false);			
			this.sub('btnSave').setVisible(true);
			
			this.importFlag = false;
			this.frmImport.setVisible(false);
		}
	},	
	getReqValues : function(){
		return this.frmRequest.getValues();
	},
	getDocValues : function(){
		return this.frmDocument.getValues();
	},
	getFileName : function(){
		return this.sub('txtFileName').getValue();
	},
	getFileGroupId : function(){
		return this.sub('txtFileGroupId').getValue();
	},
	getLastReqParams : function() {
		return this.lastParams || this.frmRequest.getValues();
	},

	formLoad : function(data) {
		if (!data)
			return false;
		if (!data.factory) {
			data.factory = this.documentConfig.factory;
		}

		var params = {
			procstep : '1',
			entityType : this.documentConfig.entityType,
			includeActivityFlag : 'Y'
		};
		
		if (data.taskReqId) {
			params.taskReqId = data.taskReqId;
		} 
		else {
			var parameter = [ {
				name : 'procstep',
				value : this.documentConfig.procstep
			} ];
			
			for ( var i = 1; i < 11; i++) {
				var keyName = 'key' + i;
				var val = this.documentConfig[keyName];
				if (val){
					//params[keyName] = data[keyName] || data[val];
					params[keyName] = data[val];
					parameter.push({
						name : val,
						value : data[val]
					});
				}
			}

			params.procstep = '3';
			params.serviceName = this.documentConfig.viewServiceName;
			params.parameter = parameter;
		}
		
		SF.cf.callService({
			url : 'service/basViewTaskRequest.json',
			scope : this,
			params : params,
			showErrorMsg : true,
			callback : function(response, success) {
				if (success) {
					this.lastParams = params;
					var reqData = response.result;

					/* request form setting */
					if (reqData.taskReqId) {
						if(!params.taskReqId){
							Ext.Msg.alert('Check','Please check the document.');
						}
						this.frmRequest.getForm().setValues(reqData);
						this.sub('dvActList').store.loadData(reqData.activityList);
						for ( var i in reqData.activityList) {
							if (reqData.activityList[i].status == 'inprogress') {
								this.sub('txtOpinion').setValue(reqData.activityList[i].opinion || '');
								break;
							}
						}
					} else {
						SF.cf.clearFormFields(this.frmRequest, {
							'txtReqType' : 'txtReqType',
							'txtTitle' : 'txtTitle',
							'chkAutoReleaseFlag' : 'chkAutoReleaseFlag'
						});
						this.sub('dvActList').store.removeAll();
					}
					/* document form setting */
					var docData = reqData.document;
					if (this.frmDocument.getForm()) {
						this.frmDocument.getForm().setValues(docData);
					}
					if(docData.procstep && view.sub('txtProcstep'))
						this.sub('txtProcstep').setValue(docData.procstep);
				}
				this.fireEvent('afterformload', response.result, success);
			}
		});
	},

	buildReqForm : function(main) {
		return {
			xtype : 'form',
			itemId : 'frmRequest',
			bodyCls : 'borderRNone borderLNone borderBNone',
			cls : 'marginB5',
			layout : 'anchor',
			defaults : {
				anchor : '100%'
			},
			items : [ this.zrequestinfo, this.buildActListView() ]
		};
	},
	buildActListView : function(main) {
		return {
			xtype : 'panel',
			bodyCls : 'paddingAll5',
			cls : 'marginB5 requestView',
			items : [ {
				xtype : 'label',
				cls : 'opinionTitle',
				text : 'Opinion List'
			}, {
				xtype : 'dataview',
				itemId : 'dvActList',
				autoScroll : true,
				maxHeight : 60,
				store : Ext.create('Ext.data.Store', {
					fields : [ 'actSeq', 'userId', 'actType', 'status', 'opinion', 'updateTime' ]
				}),
				itemSelector : '.infoItemSet',
				tpl : [ '<div class="opinionList">',
				        '<tpl for=".">',
				        	'<div><span class="user">{userId}</span>:<span class="status">[{status}]</span>{opinion}</div>',
				        '</tpl>',
				        '</div>' ]
			}]
		};
	},

	zrequestinfo : {
		xtype : 'panel',
		title : 'Request Infomation',
		bodyCls : 'paddingAll5',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		items : [ {
			xtype : 'container',
			layout : 'hbox',
			cls : 'marginB5',
			defaults : {
				xtype : 'displayfield'
			},
			items : [ {
				cls : 'textColorBlue fontWeightBold',
				renderer : function(v, me) {
					if(!v){
						v = 'addnew';
					}
					v = v.toLowerCase();
					return T('Caption.BasOther.'+v);
				},
				itemId : 'txtStatus',
				name : 'status'
			}, {
				flex : 1
			}, {
				cls : 'textColorGray',
				hidden : true,
				renderer : function(v, me) {
					if (v)
						return '[' + v.toUpperCase() + ']';
					return '';
				},
				submitValue : true,
				itemId : 'txtReqId',
				name : 'taskReqId'
			} ]
		}, {
			xtype : 'separator'
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			fieldLabel : 'Request',
			labelStyle : 'font-weight:bold',
			items : [ {
				xtype : 'textfield',
				readOnly : true,
				allowBlank : false,
				itemId : 'txtReqType',
				name : 'reqType',
				width : 100
			}, {
				xtype : 'codeview',
				cls : 'marginL10',
				labelWidth : 80,
				itemId : 'cdvApproveUserId',
				name : 'approveUserId',
				fieldLabel : T('Caption.Other.Approver'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				codeviewName : 'SERVICE',
				store : 'SEC.store.SecViewUserListOut.List',
				params : {
					procstep : '1'
				},
				popupConfig : {
					title : T('Caption.Other.Approver'),
					columns : [ {
						header : T('Caption.Other.User ID'),
						dataIndex : 'userId',
						flex : 1
					}, {
						header : T('Caption.Other.Description'),
						dataIndex : 'userDesc',
						flex : 2
					} ]
				},
				fields : [ {
					column : 'userId',
					maxLength : 30,
					enforceMaxLength : true,
					vtype : 'nospace'
				} ]
			}, {
				xtype : 'displayfield',
				flex : 1
			}, {
				xtype : 'checkbox',
				cls : 'marginRL5',
				boxLabel : T('Caption.Other.Auto Release Flag'),
				uncheckedValue : 'N',
				inputValue : 'Y',
				value : 'Y',
				itemId : 'chkAutoReleaseFlag',
				name : 'autoReleaseFlag'
			} ]
		}, {
			xtype : 'textfield',
			fieldLabel : 'Title',
			labelStyle : 'font-weight:bold',
			maxLength : 200,
			enforceMaxLength : true,
			itemId : 'txtTitle',
			name : 'title'
		}, {
			xtype : 'textareafield',
			fieldLabel : 'Opinion',
			height : 60,
			maxLength : 200,
			enforceMaxLength : true,
			itemId : 'txtOpinion',
			name : 'opinion'
		} ]
	},
	
	buildSupplement : Ext.emptyFn,
	buildImportForm : function(main){
		return {
			xtype : 'form',
			itemId : 'frmImport',
			title : 'Import Excel File',
			bodyCls : 'paddingAll10',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'filefield',
				vtype : 'xls', //xls, xlsx 확장자를 체크하는 vtype(CMN.mixin.Vtypes)
				itemId : 'fileUpload',
				cls : 'buttonFix', //filed field에 textfield와 button의 간격을 조절
				fieldLabel : 'Import File',
				labelStyle : 'font-weight:bold',
				buttonText: 'Select File...',
				name : '_fileName',
				listeners: {
					change : function(field,v){
						if(v){
							SF.cf.callService({
								url : 'service/basNewId.json',
								params : {
									procstep : '1',
									prefix : 'TaskRequest',
									suffix : ''
								},
								callback : function(response, success){
									var fileName = '';
									var fileGroupId = '';
									if(success){
										fileName = v;
										fileGroupId = response.result.id;
									}
									main.sub('txtFileName').setValue(fileName);
									main.sub('txtFileGroupId').setValue(fileGroupId);
								},
								scope : main
							});	
						}
						else{
							main.sub('txtFileName').setValue('');
							main.sub('txtFileGroupId').setValue('');
						}
					}
				}
			}, {
				// upload의 파일의 name앞에'_'를 추가하여 파일 변경 여부 판별.
				xtype : 'textfield',
				hidden : true,
				itemId : 'txtFileName',
				name : '__fileName'
			}, {
				xtype : 'textfield',
				hidden : true,
				itemId : 'txtFileGroupId',
				name : 'fileGroupId'
			}]
		};
	},
	buildDocumentForm : function(main) {
		return {
			xtype : 'form',
			itemId : 'frmDocument',
			title : 'Master Data Infomation',
			bodyCls : 'paddingAll10',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			}
		};
	}
});
