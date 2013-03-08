Ext.define('Opc.controller.wip.LotInfo', {
	extend : 'Opc.controller.BaseController',
	
	views : ['wip.LotInfo'],
	
	refs : [ {
		selector : 'lotinfo [itemId=txtLotId]',
		ref : 'lotid'
	} ],
	
	init : function() {
		this.control({
			'lotinfo' : {
				activate : this.onActivate,
				btnClose : this.onBtnClose
			}
		});
	},
	
	onActivate : function() {
	}
});