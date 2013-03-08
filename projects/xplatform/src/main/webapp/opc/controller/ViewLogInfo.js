Ext.define('Opc.controller.ViewLogInfo', {
	extend : 'Opc.controller.BaseController',
	
	views : ['ViewLogInfo'],
	
	refs : [ {
		selector : 'viewloginfo',
		ref : 'viewloginfo'
	}, {
		selector : 'viewloginfo grid#grdLogList',
		ref : 'grdLogList'
	},{
		selector : 'viewloginfo #viewLog',
		ref : 'viewLog'
	} ],
	
	init : function() {
		this.control({
			'viewloginfo' : {
				btnClose : this.onBtnClose
			},
			'viewloginfo grid#grdLogList' : {
				itemclick : this.onGrdLogItemClick
			},
			'viewloginfo button#btnDel' : {
				click : this.onBtnDeleteClick
			}
		});
	},
	
	onGrdLogItemClick : function(grid, record){
		var data = Ext.clone(record.data);
		
		data.exMsg = T('Message.' + data.code, data.params);
		data.exMsg = data.exMsg ? data.exMsg.substr(0,150) + ' ...'  : '';
		
		if(data.ex){
			data.stackTrace = printStackTrace({
				e : data.ex
			}).join('<br/>');
		}
		
		
		this.getViewLog().update(data);
	},
	
	onBtnDeleteClick : function(me){
		var grid = this.getGrdLogList();
		var store = grid.getStore();
		var selectedRow = grid.selModel.getSelection();
		
		for(var i=0; i< selectedRow.length; i++){
			store.remove(selectedRow[i]);
		}
	}
});