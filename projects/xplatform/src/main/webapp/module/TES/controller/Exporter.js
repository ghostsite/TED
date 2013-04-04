Ext.define('TES.controller.Exporter', {
	extend : 'Ext.app.Controller',

	views : ['TES.view.Exporter'],

	requires : ['Ext.ux.exporter.Exporter'],

	init : function() {
		this.control({});
	}

});