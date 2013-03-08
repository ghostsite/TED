Ext.define('Opc.controller.wip.popup.CheckRuleSetup', {
	extend : 'Opc.controller.PopupController',
	
	views : ['wip.popup.CheckRuleSetup'],
	
	init : function() {
		this.control({
			'wip_popup_checkrule_setup' : {
				btnClose : this.onBtnClose,
				keychange : this.onKeyChange
			}
		});
	},
	
	onKeyChange : function(view, keys) {
		Ext.log(view);
		Ext.log(keys);
	}
});