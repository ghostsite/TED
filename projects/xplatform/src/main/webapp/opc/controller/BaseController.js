Ext.define('Opc.controller.BaseController', {
	extend : 'Ext.app.Controller',
	
	onBtnClose : function(view) {
		view.close();
	},
	
	clearForm : function(view) {
		var anchor = Ext.History.getToken();
		var obj = SF.history.parse(anchor);
		view.close();
		SF.go(obj.viewModel, obj.keys || {});
	}
});
	