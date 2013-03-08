Ext.define('BAS.controller.task.TaskList', {
	extend : 'Ext.app.Controller',

	stores : [ 'BAS.store.BasViewTaskListOut.List' ],
	models : [ ],
	views : [ 'BAS.view.task.TaskList' ],
	
	refs : [ {
		selector : 'task_list',
		ref : 'taskList'
//	}, {
//		selector : 'task_list textareafield[name=opinion]',
//		ref : 'txtOpinion'
	}, {
		selector : 'task_list grid',
		ref : 'grdTaskList'
	} ],
	
	init : function() {
		this.control({
			'task_list' : {
				activate : this.onActivate,
				keychange : this.onKeyChange,
				view : this.onView,
				btnRefresh : this.onBtnRefresh,
				btnClose : this.onBtnClose,
//				btnSubmit : this.onBtnSubmit,
//				btnApprove : this.onBtnApprove,
//				btnReject : this.onBtnReject,
//				btnRelease : this.onBtnRelease,
//				btnCancel : this.onBtnCancel,
				sup_btnView : this.onSupBtnView,
				sup_btnReset : this.onSupBtnReset
			}
		});
	},

	/* Event Handlers */
	
	onKeyChange : function(view, keys) {
		view.setTitle(T("Caption.Task.Menu." + keys.menuType));
		
		this.reload();
		
//		this.controlButtons();

		view.getSupplement().getForm().reset();
		view.getSupplement().getForm().setValues(keys.search);
	},
	
	onActivate : function(view) {
		this.reload();
	},
	
	/* Task View Event Handler */
	
	onView : function(grid, rowIndex, colIndex) {
		var rec = grid.getStore().getAt(rowIndex);

		var taskType = rec.get('taskType');
		var status = rec.get('status');
		var taskId = rec.get('taskId');
		var reqType = rec.get('reqType');

		switch(status) {
		case 'created' :
		case 'assigned' :
			SF.doMenu({
				viewModel : SF.task.get(taskType, 'task.request.' + reqType + '.edit'),
				keys : {
					taskType : taskType,
					taskId : taskId,
					reqType : reqType
				}
			});
			return;
		default :
			SF.doMenu({
				viewModel : SF.task.get(taskType, 'task.request.' + reqType + '.view'),
				keys : {
					taskType : taskType,
					taskId : taskId,
					reqType : reqType
				}
			});
		}
	},

	/* Supplement Event Handlers */

	onSupBtnView : function(sup) {
		var search = sup.getForm().getValues();
		var keys = this.getTaskList().getKeys(); 
		keys.search = search;
		this.getTaskList().setKeys(keys);
	},
	
	onSupBtnReset : function(sup) {
		sup.getForm().reset();
	},
	
	/* Button Click Event Handlers */

	onBtnRefresh : function(view) {
		this.reload();
	},

	onBtnClose : function(view) {
		view.close();
	},
	
	onBtnSubmit : function(view) {
		this.doAction('service/basSubmitTaskList.json', 'submit');
	},
	
	onBtnApprove : function(view) {
		this.doAction('service/basApproveTaskList.json', 'approve');
	},
	
	onBtnReject : function(view) {
		this.doAction('service/basRejectTaskList.json', 'reject');
	},
	
	onBtnRelease : function(view) {
		this.doAction('service/basReleaseTaskList.json', 'release');
	},
	
	onBtnCancel : function(view) {
		this.doAction('service/basCancelTaskList.json', 'cancel');
	},
	
	/* private methods */
	
	reload : function() {
		var view = this.getTaskList();
		var keys = view.getKeys();
		var menuType = keys ? keys.menuType : 'todo';
		var taskOptions = Ext.clone(keys.search) || {};
		
		taskOptions.menuType = menuType;
		
		var store = Ext.getStore('BAS.store.BasViewTaskListOut.List');
		store.proxy.extraParams = {
			procstep : '1',
			task : taskOptions
		};
		store.load();
	},

	checkCondition : function(action, selList) {
		var rtnFlag = true;
		var errMsg = 'Please refer to the list and choose it again.';
		for ( var i in selList) {
			switch (action) {
			case 'submit':
				if (selList[i].data.status != 'created') {
					rtnFlag = false;
					//errMsg = '[created] 상태가 아닌 항목이 있습니다. 다시 선택해 주세요';
				}
				break;
			case 'approve':
			case 'reject':
				if (selList[i].data.status != 'submitted') {
					rtnFlag = false;
					//errMsg = '[submitted] 상태가 아닌 항목이 있습니다. 다시 선택해 주세요';
				}
				break;
			case 'release':
				if (selList[i].data.status != 'approved') {
					rtnFlag = false;
					//errMsg = '[approved] 상태가 아닌 항목이 있습니다. 다시 선택해 주세요';
				}
				break;
			case 'cancel':
				if (selList[i].data.status == 'released') {
					rtnFlag = false;
					//errMsg = '[released] 상태인 항목이 있습니다. 다시 선택해 주세요';
				}
				break;
			}
		}

		if (rtnFlag === false) {
			Ext.Msg.alert('Error', errMsg);
		}
		return rtnFlag;
	},
	
	doAction : function(url, action) {

		var values = this.getTaskList().getValues();
		var selModel = this.getGrdTaskList().getSelectionModel();
		var selList = selModel.getSelection();

		if (!selList || selList.length < 1 || !url || !btn)
			return false;
		if (this.checkCondition(action, selList) === false)
			return false;

		var taskId = [];
		for ( var i in selList) {
			taskId.push(selList[i].data.taskId);
		}

		var params = {
			procstep : '1',
			taskId : taskId
		};
		if (values.opinion) {
			params.opinion = values.opinion;
		}
		SF.cf.callService({
			url : url,
			params : params,
			callback : function(response, success) {
				if (!success)
					return false;
				this.reload();
			},
			scope : this
		});
	},
	
	controlButtons : function() {
		var view = this.getTaskList();
		var keys = view.getKeys();
		var menuType = keys ? keys.menuType : 'todo';
		
		var btnSubmit = false;
		var btnApprove = false;
		var btnReject = false;
		var btnRelease = false;
		var btnCancel = false;

		switch (menuType) {
		case 'todo':
			btnApprove = true;
			btnReject = true;
			break;
		case 'submitted':
			btnRelease = true;
			btnCancel = true;
			break;
		case 'returned':
			btnCancel = true;
			break;
		case 'created':
			btnSubmit = true;
			btnCancel = true;
			break;
		}

		view.down('button#btnSubmit').setVisible(btnSubmit);
		view.down('button#btnApprove').setVisible(btnApprove);
		view.down('button#btnReject').setVisible(btnReject);
		view.down('button#btnRelease').setVisible(btnRelease);
		view.down('button#btnCancel').setVisible(btnCancel);
	}

});