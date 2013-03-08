Ext.Loader.setConfig({
    enabled: true,
    paths : {
    	'SmartFactory' : 'opc/SmartFactory.js',
    	'mixin' : 'product/mixin',
    	'CMN' : 'module/CMN',
    	'MES' : 'module/MES',
    	'SEC' : 'module/SEC',
    	'BAS' : 'module/BAS',
    	'ALM' : 'module/ALM'
    }
});

Ext.application({
	appFolder: 'opc',
    autoCreateViewport: true,
    name: 'Opc',
    
    controllers : [ 
                   'ApplicationController',
                   'CustomController',
                   'Intro', 
                   'Menu',
                   'Navigator',
                   'BaseButtons'
                  ],

    launch: function() {
    }
});
