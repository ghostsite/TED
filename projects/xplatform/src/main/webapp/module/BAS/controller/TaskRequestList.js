Ext.define('BAS.controller.task.TaskList', {
	extend : 'Ext.app.Controller',

	stores : [ ],
	models : [ ],
	views : [ 'BAS.view.task.TaskList' ],
	
	refs : [ {
		selector : 'task_list',
		ref : 'taskList'
//	}, {
//		selector : 'task_list #grdRequestList',
//		ref : 'grdRequestList'
//	}, {
//		selector : 'task_list #dvTaskRequestMenu',
//		ref : 'navTaskRequestMenu'
	} ],
	
	init : function() {
		this.control({
			'task_list' : {
				added : this.onAdded,
				afterrender : this.onAfterrender,
				activate : this.onActivate,
				keychange : this.onKeyChange,
				view : this.onView,
				btnRefresh : this.onBtnRefresh,
				btnSubmit : this.onBtnSubmit,
				btnApprove : this.onBtnApprove,
				btnReject : this.onBtnReject,
				btnRelease : this.onBtnRelease,
				btnCancel : this.onBtnCancel
			}
		});
	},
	
	onAdded : function(view){
		
	},
	
	onAfterrender : function(view){
		var sup = view.getSupplement();
		sup.on('supplementSelected', function(data) {
			//TODO 검색 작업....
		});
	},
	
	onActivate : function(view) {
		view.store.load();
	},
	
	onKeyChange : function(view, keys) {
		view.setTitle([ T("Caption.Menu." + keys.menuType) ]);

		/*
		 * TODO Filter Condition들 처리가 안되어있다. (Supplement 쪽 검색에 대응이 필요함.)
		 */
		var extraParams = {
			procstep : '1',
			menuType : keys.menuType
		};
		view.store.proxy.extraParams = extraParams;
		view.store.load();
		view.menuType = keys.menuType;
		view.setReqListBtn(keys.menuType);
	},
	
	onView : function(grid, rowIndex, colIndex) {
		var rec = grid.getStore().getAt(rowIndex);
		var entityType = rec.get('entityType');
		var status = rec.get('status');
		var keys = this.getRequestList().getKeys();
		var menuType = keys.menuType;

		if (entityType) {
			if(menuType == 'requested' || menuType == 'request' || menuType == 'done') {
				// 화면 조회 및 실행화면
				SF.doMenu({
					viewModel : 'BAS.view.common.TaskRequestView',
					itemId : 'BasTaskRequestView',
					keys : {
						taskReqId : rec.get('taskReqId')
					}
				});
			}
			else if (status == 'created'||status=='rejected') {
				// TODO : entity 에 따른 화면 정보 수정 및 등록화면
				if(entityType == 'MWipFlwDef'){
					var view = SF.doMenu({
						viewModel : 'BAS.view.setup.FlowSetup',
						itemId : 'BasFlowSetup',
						keys : {
							reqType : rec.get('reqType'),
							taskReqId : rec.get('taskReqId')
						}
					});
				}
				else if(entityType == 'FIELD_TBL'){
					var view = SF.doMenu({
						viewModel : 'BAS.view.setup.FieldSetup',
						itemId : 'BasFieldSetup',
						keys : {
							reqType : rec.get('reqType'),
							taskReqId : rec.get('taskReqId')
						}
					});
				}
				else if(entityType == 'VENDOR_TBL'){
					var view = SF.doMenu({
						viewModel : 'BAS.view.setup.VendorSetup',
						itemId : 'BasVendorSetup',
						keys : {
							reqType : rec.get('reqType'),
							taskReqId : rec.get('taskReqId')
						}
					});
				}
			}
		}
	},

	onBtnRefresh : function(btn) {
		this.getRequestList().store.load();
		this.getNavTaskRequestMenu().store.load();
	},
	
	onBtnSubmit : function(btn) {
		this.doReqListButton('service/basSubmitTaskRequestList.json', btn);
	},
	
	onBtnApprove : function(btn) {
		this.doReqListButton('service/basApproveTaskRequestList.json', btn);
	},
	
	onBtnReject : function(btn) {
		this.doReqListButton('service/basRejectTaskRequestList.json', btn);
	},
	
	onBtnRelease : function(btn) {
		this.doReqListButton('service/basReleaseTaskRequestList.json', btn);
	},
	
	onBtnCancel : function(btn) {
		this.doReqListButton('service/basCancelTaskRequestList.json', btn);
	},
	
	reqListCheckConditon : function(btn, selList) {
		var rtnFlag = true;
		var errMsg = 'Please refer to the list and choose it again.';
		for ( var i in selList) {
			switch (btn.itemId) {
			case 'btnSubmit':
				if (selList[i].data.status != 'created') {
					rtnFlag = false;
					//errMsg = '[created] 상태가 아닌 항목이 있습니다. 다시 선택해 주세요';
				}
				break;
			case 'btnApprove':
			case 'btnReject':
				if (selList[i].data.status != 'submitted') {
					rtnFlag = false;
					//errMsg = '[submitted] 상태가 아닌 항목이 있습니다. 다시 선택해 주세요';
				}
				break;
			case 'btnRelease':
				if (selList[i].data.status != 'approved') {
					rtnFlag = false;
					//errMsg = '[approved] 상태가 아닌 항목이 있습니다. 다시 선택해 주세요';
				}
				break;
			case 'btnCancel':
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
	
	doReqListButton : function(url,btn) {

		var values = this.getRequestList().getValues();
		var selModel = this.getGrdRequestList().getSelectionModel();
		var selList = selModel.getSelection();

		if (!selList || selList.length < 1 || !url || !btn)
			return false;
		if (this.reqListCheckConditon(btn, selList) === false)
			return false;

		var taskReqId = [];
		for ( var i in selList) {
			taskReqId.push(selList[i].data.taskReqId);
		}

		var params = {
			procstep : '1',
			taskReqId : taskReqId
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
				this.onBtnRefresh();
			},
			scope : this
		});
	}
});