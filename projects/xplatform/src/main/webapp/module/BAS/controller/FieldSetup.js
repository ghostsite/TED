Ext.define('BAS.controller.FieldSetup', {
	extend : 'Ext.app.Controller',

	stores : [ 'BAS.store.BasViewDataListOut.DataList' ],
	models : [ ],
	views : [ 'BAS.view.setup.FieldSetup','BAS.view.common.NavTaskRequest' ],
	
	refs : [ {
		selector : 'bas_field_setup',
		ref : 'fieldSetup'
	}, {
		selector : 'bas_nav_request #dvTaskRequestMenu',
		ref : 'navTaskRequestMenu'
	} ],
	
	init : function() {
		this.control({
			'bas_field_setup' : {
				keychange : this.onKeyChange,
				afterformload : this.onAfterFormLoad,
				btnSave : this.onBtnSave,
				btnSubmit : this.onBtnSubmit,
				btnCancel : this.onBtnCancel
			}
		});
	},

	onKeyChange :function(view, keys){
		view.lastParams = '';
		SF.cf.clearFormFields(view);
		if(!keys){
			return false;
		}
		var procstep = '';
		switch(keys.reqType){
		case 'create' :
		case 'update' :
			procstep = 'U';
			break;
		case 'delete' :
			procstep = 'D';
			break;
		}
		view.setDocForm(keys.reqType);
		
		view.sub('chkAutoReleaseFlag').setValue('Y');
		view.sub('txtReqType').setValue(keys.reqType);
		view.sub('txtTitle').setValue('['+keys.reqType+'/'+keys.tableName+'] '+(keys.key1||''));
			
		if(keys.reqType != 'import'){
			view.sub('txtProcstep').setValue(procstep);
			view.sub('txtTableName').setValue(keys.tableName);
			view.sub('txtFieldName').setValue(keys.key1||'');
			if(!keys.taskReqId && keys.reqType != 'update' && keys.reqType != 'delete'){
				view.sub('txtFieldName').setReadOnly(false);
			}
			else{
				view.sub('txtFieldName').setReadOnly(true);
				view.formLoad(keys);
			}
		}
	},
	onAfterFormLoad : function(result, success){

	},
	checkCondition : function(step, view, data){
		data = data||view.getValues();
		
		switch(step){
		default :
			if(!data.approveUserId){
				Ext.Msg.alert('Error','Please input Approve User ID');
				return false;
			}
			if(view.importFlag && !view.getFileGroupId()){
				Ext.Msg.alert('Error','Please select the file');
				return false;
			}
			if(view.getForm().isValid() === false)
				return false;
			break;
		}
	},
	getParams : function(view){
		var reqData = view.getReqValues();
		var docData = view.getDocValues();

		var params = {
				procstep : '1',
				entityType : view.documentConfig.entityType,
				factory : view.documentConfig.factory,
				userId : view.documentConfig.userId,
				serviceName : view.documentConfig.reqServiceName,
				document : docData,
				title : reqData.title,
				reqType : reqData.reqType
		};
		
		if(view.importFlag){
			docData = view.documentConfig.importParams;
			params.serviceName = view.documentConfig.impServiceName;
			params.document = JSON.stringify(docData);
			var fileName = view.getFileName();
			if(fileName){
				params['__fileName'] = fileName;
				params.fileGroupId = view.getFileGroupId();
			}
		}
		
		docData.factory = docData.factory||SF.login.factory;
		
		for(var i =1; i<11;i++){
			var keyName = 'key'+i;
			var val = view.documentConfig[keyName];
			if(val)
				params[keyName] = docData[val];
		}

		Ext.applyIf(params, reqData);
		
		return params;
	},

	onBtnSave : function(btn) {
		var me = this;
		var view = this.getFieldSetup();
		var params = this.getParams(view);
		
		if(this.checkCondition('btnSave',view, params) === false)
			return false;
		
		SF.cf.callService({
			url : 'service/basUpdateTaskRequest.json',
			params : params,
			callback : function(response, success){
				if(success){
					me.getNavTaskRequestMenu().store.load();
					view.close();
				}
			},
			scope : view
		});
	},
	
	onBtnSubmit : function(btn) {
		var me= this;
		var view = this.getFieldSetup();
		var params = this.getParams(view);

		if(this.checkCondition('btnSubmit',view, params) === false)
			return false;

		Ext.Msg.confirm('Confirm', 'Do you want to submit this document?', function(result) {
			if (result == 'yes') {
				if(view.importFlag){
					view.getForm().submit({
						url : 'service/basSubmitTaskRequest.json',
						params : params,
						success : function(form, action) {
							me.getNavTaskRequestMenu().store.load();
							view.close();
						},
						scope : view
					});
				}
				else{
					SF.cf.callService({
						url : 'service/basSubmitTaskRequest.json',
						params : params,
						callback : function(response, success){
							if(success){
								me.getNavTaskRequestMenu().store.load();
								view.close();
							}
						},
						scope : view
					});	
				}
			}
		});
	},
	
	onBtnCancel : function(btn) {
		var me= this;
		var view = this.getFieldSetup();
		var reqData = view.frmRequest.getValues();
		
		Ext.Msg.confirm('Confirm', 'Do you want to cancel?', function(result) {
			if (result == 'yes') {
				if(reqData.taskReqId){
					SF.cf.callService({
						url : 'service/basCancelTaskRequest.json',
						params : {
							procstep : '1',
							taskReqId : reqData.taskReqId
						},
						callback : function(response, success){
							if(success){
								me.getNavTaskRequestMenu().store.load();
								view.close();
							}
						},
						scope : view
					});
				}
				else{
					view.close();
				}
			}
		});
	}
});