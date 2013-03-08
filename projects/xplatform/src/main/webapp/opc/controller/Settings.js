Ext.define('Opc.controller.Settings', {
	extend : 'Opc.controller.BaseController',
	
	views : ['Settings'],
	
	refs : [ {
		selector : 'settings',
		ref : 'settings'
	} ],
	
	init : function () {
		this.control({
			'settings' : {
				afterrender : this.onAfterRender,
				btnSave : this.onBtnSave,
				btnReset : this.onBtnReset,
				btnClose : this.onBtnClose
			}
		});
	},
	
	onAfterRender : function () {
		this.getSettings().getForm().setValues(SF.setting.all(function(id, value) {
			return id.indexOf('opc-') === 0;
		}));
	},
	
	onBtnSave : function () {
		Ext.Object.each(this.getSettings().getForm().getFieldValues(), function(name, value) {
			SF.setting.set(name, value);
		});
	},
	
	onBtnReset : function () {
		this.getSettings().getForm().reset();
	}
});