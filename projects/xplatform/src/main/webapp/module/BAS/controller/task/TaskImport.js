Ext.define('BAS.controller.task.TaskImport', {
	extend : 'BAS.controller.task.TaskEdit',
	
	checkCondition : function(step, view) {
//		var approveUserId = view.down('field[name=approveUserId]');
//		if(step === 'submit' && !approveUserId.getValue()) {
//			approveUserId.markInvalid('Mandatory Field.');
//			return false;
//		}
		return true;	
	},
	
	buildTitle : function(taskType, request, document) {
		return T('Message.Task.Import Title', {
			taskType : T('Caption.Task.Type.' + taskType)
		});
	},

	complementImportParams : Ext.emptyFn,
	
	complementDocument : Ext.emptyFn,
	
	buildParams : function(view) {
		var params = this.callParent([view]);

		var fileName = view.down('field[name=_fileName]').getValue();
		if(fileName) {
			params['__fileName'] = fileName;
			params.fileGroupId = view.down('field[name=fileGroupId]').getValue();
		}
		
		this.complementImportParams(view, params);

		var document = {};
		document.procstep = SF.task.get(view.taskType, 'task.request.import.service.procstep');
		this.complementDocument(view, document);
		
		params.document = Ext.JSON.encode(document);

		return params;
	},
	
	buildApproveList : function(view) {
		/* Multipart 요청인 경우에는 Array내의 오브젝트들을 stringify 해서 넘겨주도록 한다. */
		return Ext.Array.map(this.callParent([view]), function(el) {
			return Ext.JSON.encode(el);
		});
	},
	
	onBtnClose : function(view) {
		view.close();
	},
	
	onBtnSubmit : function(view) {
		/*
		 * TODO 오류 및 성공시 사용자에게 알려주는 처리, 서버작업 진행중일 때 Progress Bar 동작시키는 처리.
		 */
		var params = this.buildParams(view);

		if (this.checkCondition('submit', view, params) === false)
			return false;
		
		view.getForm().submit({
			url : 'service/basSubmitTask.json',
			params : params,
			success : function(form, action) {
				view.close();
			},
			failure : function() {
				Ext.log('failed', arguments);
			},
			scope : view
		});
	},
	
	onChangeFile : function(field, file) {
		var form = field.up('form');
		if(file) {
			SF.cf.callService({
				url : 'service/basNewId.json',
				params : {
					procstep : '1',
					prefix : 'TaskImport',
					suffix : ''
				},
				callback : function(response, success) {
					var fileName = '';
					var fileGroupId = '';
					
					if(success) {
						fileName = file;
						fileGroupId = response.result.id;
					}
					
					form.getForm().setValues({
						'__fileName' : fileName,
						fileGroupId : fileGroupId
					});
				}
			});
		}
	}
});
