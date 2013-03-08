Ext.define('SmartFactory.view.Viewport', {
	extend : 'Ext.container.Viewport',

	alias : 'xviewport',
	
	layout : 'border',
	
	requires: ['SmartFactory.view.Downloader'],

	defaults : {
		split : false,
		collapsible : false
	},

	items : [ {
		xtype : 'viewport.north',
		region : 'north',
		height : 73
	}, {
		xtype : 'viewport.west',
		region : 'west',
		collapsible : true,
		width : 200,
		split : true
	}, {
		xtype : 'viewport.east',
		region : 'east',
		collapsible : true,
		width:240,
		split : true
	}, {
		xtype : 'viewport.south',
		region : 'south',
		height : 24,
		items : [{
            xtype: 'filedownloader',
            id: 'filedownloader',
            hidden : true
        }]
	}, {
		xtype : 'viewport.center',
		region : 'center'
	} ]
});
