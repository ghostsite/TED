Ext.define('BAS.controller.FlowSetup', {
	extend : 'Ext.app.Controller',

	stores : [  'BAS.store.WipViewFlowExtOut', 'BAS.store.WipViewFlowExtOut.operationList' ],
	models : [ ],
	views : [ 'BAS.view.setup.FlowSetup','BAS.view.common.NavTaskRequest' ],
	
	refs : [ {
		selector : 'bas_flow_setup',
		ref : 'flowSetup'
	}, {
		selector : 'bas_nav_request #dvTaskRequestMenu',
		ref : 'navTaskRequestMenu'
	} ],
	
	init : function() {
		this.control({
			'bas_flow_setup' : {
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
			procstep = 'I';
			break;
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
		view.sub('txtTitle').setValue('['+keys.reqType+'/FLOW] '+(keys.flow||''));

		if(keys.reqType != 'import'){
			view.sub('txtProcstep').setValue(procstep);
			if(!keys.taskReqId && keys.reqType != 'update' && keys.reqType != 'delete'){
				view.sub('txtFlow').setReadOnly(false);
			}
			else{
				view.sub('txtFlow').setReadOnly(true);
				view.formLoad(keys);
			}
		}
	},
	onAfterFormLoad : function(result, success){
		var view = this.getFlowSetup();
		var docData = result.document;
		if (!docData)
			return;
		
		/* document form setting */
		view.sub('tabGridAttribute').attrLoad({
			procstep : '1',
			attrType : view.attrType,
			attrKey : docData.flow
		});
				
		/* oper grid list setting */
		var operationList = docData.operationList;
		var store = view.sub('grdOperAttach').store;
		var index = 0;
		if(operationList){
			store.loadData(operationList);
			index = operationList.length;
		}
		else{
			store.removeAll();
		}
		var addRecs = store.add({
			'oper' : 'Attach ...'
		});
		addRecs[0].index = index;
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

		var operationList = [];
		view.sub('grdOperAttach').store.each(function(rec){
			if(rec.data.oper == 'Attach ...')
				return;
			operationList.push(rec.data);
		});
		docData.operationList = operationList;
		
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
		var view = this.getFlowSetup();
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
		var view = this.getFlowSetup();
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
		var view = this.getFlowSetup();
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