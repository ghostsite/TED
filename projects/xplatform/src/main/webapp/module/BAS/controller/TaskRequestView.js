Ext.define('BAS.controller.TaskRequestView', {
	extend : 'Ext.app.Controller',

	stores : [ 'BAS.store.BasViewTaskRequestListOut.list' ],
	models : [ ],
	views : [ 'BAS.view.common.TaskRequestView','BAS.view.common.NavTaskRequest' ],
	
	refs : [ {
		selector : 'bas_requestview',
		ref : 'requestView'
	}, {
		selector : 'bas_nav_request #dvTaskRequestMenu',
		ref : 'navTaskRequestMenu'
	} ],
	
	init : function() {
		this.control({
			'bas_requestview' : {
				keychange : this.onKeyChange,
				afterformload : this.onAfterFormLoad,
				btnSave : this.onBtnSave,
				btnApprove : this.onBtnApprove,
				btnReject : this.onBtnReject,
				btnRelease : this.onBtnRelease,
				btnCancel : this.onBtnCancel
			}
		});
	},
	onKeyChange : function(view, keys) {
		
		var extraParams = {
			procstep : '1',
			taskReqId : keys.taskReqId,
			includeActivityFlag : 'Y'
		};
		view.store.proxy.extraParams = extraParams;
		view.store.load();

	},
	
	onAfterFormLoad : function(view, reqData, success){
		//TODO : entity 별 화면구성
		this.makeTaskRequestView(view,reqData);
		
		if(view.docForm){
			view.docForm.formLoad(reqData,success);
		}
	},

	makeTaskRequestView : function(view,reqData){
		var viewModel = '';
		if(reqData.entityType== 'MWipFlwDef'){
			viewModel = 'BAS.view.setup.FlowView';
		}
		else if(reqData.entityType== 'FIELD_TBL'){
			viewModel = 'BAS.view.setup.FieldView';
		}
		else if(reqData.entityType== 'VENDOR_TBL'){
			viewModel = 'BAS.view.setup.VendorView';
		}
		
		if(view.docForm){
			view.remove(view.docForm);
		}
		
		if(viewModel){
			//TODO : "import"  선언 ie error 수정예정 2012.10.04 KKH
			var docForm = Ext.create(viewModel, {
				itemId : 'docForm',
				baseForm : view,
				'import' : reqData.reqType=='import'?'Y':'N'
			});
			view.docForm = view.add(docForm);
		}
	},

	onBtnSave : function(btn) {
		var me = this;
		Ext.Msg.confirm('Confirm', 'Do you want to save this document?', function(result) {
			if (result == 'yes') {
				me.doReqViewButton('service/basUpdateTaskRequestOpinion.json', btn);
			}
		});
	},
	onBtnApprove : function(btn) {
		var me = this;
		Ext.Msg.confirm('Confirm', 'Do you want to approve this document?', function(result) {
			if (result == 'yes') {
				me.doReqViewButton('service/basApproveTaskRequest.json', btn);
			}
		});
	},
	onBtnReject : function(btn) {
		var me = this;
		Ext.Msg.confirm('Confirm', 'Do you want to reject this document?', function(result) {
			if (result == 'yes') {
				me.doReqViewButton('service/basRejectTaskRequest.json', btn);
			}
		});
	},
	onBtnRelease : function(btn) {
		var me = this;
		Ext.Msg.confirm('Confirm', 'Do you want to release?', function(result) {
			if (result == 'yes') {
				me.doReqViewButton('service/basReleaseTaskRequest.json', btn);
			}
		});
	},
	onBtnCancel : function(btn) {
		var me = this;
		Ext.Msg.confirm('Confirm', 'Do you want to cancel?', function(result) {
			if (result == 'yes') {
				me.doReqViewButton('service/basCancelTaskRequest.json', btn);
			}
		});
	},
	
	doReqViewButton : function(url,btn) {
		var me = this;
		var view = this.getRequestView();
		var reqData = view.store.getAt(0).data;
		var viewValues = view.getValues();
		if (!reqData||!url)
			return false;
		
		var params = {
				procstep : '1',
				taskReqId : reqData.taskReqId,
				opinion : viewValues.opinion
			};
		if (viewValues.opinion) {
			params.opinion = viewValues.opinion;
		}

		SF.cf.callService({
			url : url,
			params : params,
			callback : function(response, success) {
				if (!success)
					return false;
//					if(btn.itemId != 'btnCancel'){
//						view.store.load();
//					}
				me.getNavTaskRequestMenu().store.load();
				view.close();
			},
			scope : this
		});
	}
});