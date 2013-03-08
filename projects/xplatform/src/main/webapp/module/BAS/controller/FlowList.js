Ext.define('BAS.controller.FlowList', {
	extend : 'Ext.app.Controller',

	stores : [ 'BAS.store.BasViewDataListOut.DataList' ],
	models : [ ],
	views : [ 'BAS.view.setup.FlowList' ],
	
	refs : [ {
		selector : 'bas_flow_list',
		ref : 'flowList'
	} ],
	
	init : function() {
		this.control({
			'bas_flow_list' : {
				added : this.onAdded,
				activate : this.onActivate,
				edit : this.onEdit,
				view : this.onView,
				rdostatuschange : this.onRdoStatusChange,
				btnRefresh : this.onBtnRefresh,
				btnAddNew : this.onBtnAddNew
			}
		});
	},
	onAdded : function() {
		this.reload();
	},
	onActivate : function(){
		this.reload();
	},
	reload : function() {
		var view = this.getFlowList();
		view.flowStore.proxy.extraParams = {
			procstep : '1'
		};
		view.flowStore.load();
		
		var extraParams = {
				procstep : '1',
				createUserId : SF.login.id,
				entityType : 'MWipFlwDef'
		};
		var rdoStatus = view.sub('rdoReqStauts');
		if(rdoStatus.getValue().menuType == 'done'){
			extraParams.status = ['released'];
		}
		else {
			extraParams.status = ['approved', 'submitted', 'rejected', 'created'];
		}
		
		view.reqStore.proxy.extraParams = extraParams;
		view.reqStore.load();
	},
	onRdoStatusChange : function(field,val){
		var view = this.getFlowList();
		var extraParams = {
				procstep : '1',
				createUserId : SF.login.id,
				entityType : 'MWipFlwDef'
		};
		if(val == 'done'){
			extraParams.status = ['released'];
		}
		else {
			extraParams.status = ['approved', 'submitted', 'rejected', 'created'];
		}
		
		view.reqStore.proxy.extraParams = extraParams;
		view.reqStore.load();
	},
	onEdit : function(grid, rowIndex, colIndex, reqType){
		var rec = grid.getStore().getAt(rowIndex);
		var data = rec.data;
		var status = data.status;
		if(!status || status == 'created'){
			var keys = {
					reqType : data.reqType || reqType
			};
			if(!data.taskReqId){
				keys.flow = data.flow;
			}
			else{
				keys.taskReqId = data.taskReqId;
			}
			SF.doMenu({
				viewModel : 'BAS.view.setup.FlowSetup',
				itemId : 'flowSetup',
				keys : keys
			});
		}
		else{
			var keys = {
					taskReqId : data.taskReqId
				};
			// 화면 조회 및 실행화면
			//2012.09.13 KKH
			/* taskRequestView에서 실행시 keys를 사용하여 하단부에 FieldView를 표시함. */
			/* import화면은 fileFlag를 판별하여 FieldView에서 선택적으로 표시됨 */
			SF.doMenu({
				viewModel : 'BAS.view.common.TaskRequestView',
				itemId : 'BasTaskRequestView',
				keys : keys
			});
		}
	},
	onView : function(grid, rowIndex, colIndex){
		var rec = grid.getStore().getAt(rowIndex);
		var status = rec.get('status');
		var taskReqId = rec.get('taskReqId');
		
		if(!taskReqId){
			// 선택한 field 의 상세내역화면 표시
			SF.doMenu({
				viewModel : 'BAS.view.setup.FlowView',
				itemId : 'flowView',
				keys : {
					tableName : 'MWipFlwDef',
					flow : rec.get('flow')
				}
			});
		}
		else if(status == 'created'||status =='rejected'){
			SF.doMenu({
				viewModel : 'BAS.view.setup.FlowSetup',
				itemId : 'flowSetup',
				keys : {
					reqType : rec.get('reqType'),
					taskReqId : taskReqId
				}
			});
		}
		else{
			// 화면 조회 및 실행화면
			//2012.09.13 KKH
			/* taskRequestView에서 실행시 keys를 사용하여 하단부에 TaskViewField를 표시함. */
			/* import화면은 fileFlag를 판별하여 TaskViewField에서 선택적으로 표시됨 */
			SF.doMenu({
				viewModel : 'BAS.view.common.TaskRequestView',
				itemId : 'BasTaskRequestView',
				keys : {
					taskReqId : taskReqId
				}
			});
		}
	},
	onBtnRefresh : function(view) {
		this.reload();
	},
	
	onBtnAddNew : function(view) {
		var view = SF.doMenu({
			viewModel : 'BAS.view.setup.FlowSetup',
			itemId : 'fieldSetup',
			keys : {
				reqType : 'create'
			}
		});
	}
});