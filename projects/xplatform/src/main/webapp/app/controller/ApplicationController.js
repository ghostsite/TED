Ext.define('SmartFactory.controller.ApplicationController', {
	extend: 'Ext.app.Controller',
	
	statics : {
		unique : null
	},
	
	init : function() {
		SmartFactory.controller.ApplicationController.unique = this;
		
		this.callParent();
	}

});