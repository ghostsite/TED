Ext.define('TES.controller.GIS', {
	extend : 'Ext.app.Controller',

	views : ['TES.view.GIS'],

	requires : ['GeoExt.panel.Map', 'GeoExt.data.FeatureStore', 'GeoExt.grid.column.Symbolizer', 'GeoExt.selection.FeatureModel', 'Ext.grid.GridPanel', 'Ext.layout.container.Border'],

	init : function() {
		this.control();
	}

});