Ext.define('Opc.controller.wip.LotList', {
	extend : 'Opc.controller.BaseController',
	
	views : ['wip.LotList'],
	
	requires : [
	        	'WIP.store.WipViewOperationListOut.list',
	        	'WIP.store.WipViewLotListByOperationOut.list',
	        	'RAS.store.RasViewResourceListOut.resList',
	        	'RAS.store.RasViewLotbyresListOut.lotList'
	           ],
	
	refs : [ {
		selector : 'lotlist',
		ref : 'lotList'
	}, {
		selector : 'lotlist #grdLotList',
		ref : 'lotListGrid'
	}, {
		selector : 'navigator',
		ref : 'navigator'
	}, {
		selector : 'navigator #settingOperation',
		ref : 'operCodeview'
	}, {
		selector : 'navigator #settingResource',
		ref : 'resCodeview'
	} ],
	
	init : function() {
		this.control({
			'navigator #settingOperation' : {
				select : this.onOperationChanged
			},
			'navigator #settingResource' : {
				select : this.onResourceChanged
			},
			'lotlist #grdLotList' : {
				select : this.onSelectLot
			},
			'lotlist' : {
				keychange : this.onKeyChanged,
				btnClose : this.onBtnClose
			}
		});
	},
	
	changeLotListByOper : function(oper) {
		var store = this.getLotListGrid().store;
		Ext.create('WIP.store.WipViewLotListByOperationOut.list').load({
			params : {
				procstep : '1',
				oper : oper
			},
			callback : function(records, operation, success) {
				if (success)
					store.loadRecords(records);
			}
		});
	},
	
	changeLotListByRes : function(resId) {
		var store = this.getLotListGrid().store;
		Ext.create('RAS.store.RasViewLotbyresListOut.lotList').load({
			params : {
				procstep : '1',
				resId : resId
			},
			
			callback : function(records, operation, success) {
				if (success)
					store.loadRecords(records);
			}
		});
	},
	
	onKeyChanged : function(view, keys) {
		if(!keys) {
			return;
		}
		
		this.getOperCodeview().setValue(keys.oper);
		this.getResCodeview().setValue(keys.resId);
		
		if(keys.oper)
			this.changeLotListByOper(keys.oper);
		else if(keys.resId)
			this.changeLotListByRes(keys.resId);
	},
	
	onOperationChanged : function(record) {
		this.getLotList().setKeys({
			oper : this.getOperCodeview().getValue(),
			resId : this.getResCodeview().getValue() 
		});
	},
	
	onResourceChanged : function(record) {
		this.getLotList().setKeys({
			oper : this.getOperCodeview().getValue(),
			resId : this.getResCodeview().getValue() 
		});
	},
	
	onSelectLot : function(model, record, idx, obj) {
		SF.setting.set('current_lot_id', record.get('lotId'));
	}
});