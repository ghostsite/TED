Ext.define('BAS.controller.VendorList', {
	extend : 'Ext.app.Controller',

	stores : [ 'BAS.store.BasViewDataListOut.DataList' ],
	models : [ ],
	views : [ 'BAS.view.setup.VendorList' ],
	
	refs : [ {
		selector : 'bas_vendor_list',
		ref : 'vendorList'
	} ],
	
	init : function() {
		this.control({
			'bas_vendor_list' : {
				added : this.onAdded,
				activate : this.onActivate,
				edit : this.onEdit,
				view : this.onView,
				rdostatuschange : this.onRdoStatusChange,
				btnRefresh : this.onBtnRefresh,
				btnAddNew : this.onBtnAddNew,
				btnImport : this.onBtnImport
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
		var view = this.getVendorList();
		view.gcmStore.proxy.extraParams = {
			procstep : '1',
			tableName : 'VENDOR_TBL'
		};
		view.gcmStore.load();
		
		var extraParams = {
				procstep : '1',
				createUserId : SF.login.id,
				entityType : 'VENDOR_TBL'
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
		var view = this.getVendorList();
		var extraParams = {
				procstep : '1',
				createUserId : SF.login.id,
				entityType : 'VENDOR_TBL'
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
		var status = rec.get('status');
		if(!status || status == 'created'){
			var keys = {
					reqType : rec.get('reqType')||reqType,
					tableName : 'VENDOR_TBL'
			};
			if(!rec.get('taskReqId')){
				for(var i=1;i<=10;i++){
					if(rec.get('key'+i))
						keys['key'+i] = rec.get('key'+i);
				}	
			}
			else{
				keys.taskReqId = rec.get('taskReqId');
			}
			SF.doMenu({
				viewModel : 'BAS.view.setup.VendorSetup',
				itemId : 'vendorSetup',
				keys : keys
			});
		}
		else{
			var keys = {
					taskReqId : rec.get('taskReqId')
				};
			// 화면 조회 및 실행화면
			//2012.09.13 KKH
			/* taskRequestView에서 실행시 keys를 사용하여 하단부에 VendorView를 표시함. */
			/* import화면은 fileFlag를 판별하여 VendorView에서 선택적으로 표시됨 */
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
		var taskReqId =  rec.get('taskReqId');
		if(!taskReqId){
			// 선택한 field 의 상세내역화면 표시
			SF.doMenu({
				viewModel : 'BAS.view.setup.VendorView',
				itemId : 'vendorView',
				keys : {
					tableName : 'VENDOR_TBL',
					key1 : rec.get('key1')
				}
			});
		}
		else if(status == 'created'||status =='rejected'){
			SF.doMenu({
				viewModel : 'BAS.view.setup.VendorSetup',
				itemId : 'vendorSetup',
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
			viewModel : 'BAS.view.setup.VendorSetup',
			itemId : 'vendorSetup',
			keys : {
				reqType : 'create',
				tableName : 'VENDOR_TBL'
			}
		});
	},
	onBtnImport : function(view) {
		var view = SF.doMenu({
			viewModel : 'BAS.view.setup.VendorSetup',
			itemId : 'vendorSetup',
			keys : {
				reqType : 'import',
				tableName : 'VENDOR_TBL'
			}
		});
	}
});