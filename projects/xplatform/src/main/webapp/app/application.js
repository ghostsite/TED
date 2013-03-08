Ext.Loader.setConfig({
	enabled : true,
	paths : {
		'SmartFactory' : 'product/SmartFactory.js',
		'Ext.ux' : 'js/ux',
		'Ext.app' : 'js/extjsaddons/app'
	}
});

Ext.require(['SmartFactory']);

Ext.module = function() {
	var modules_order = [];
	var modules = {};

	function getModules() {
		return modules;
	}
	
	function getModule(module) {
		return modules[module];
	}

	function loadResources(module_name, compressed) {
		document.write('<script type="text/javascript" src="module/' + module_name + '/locale/' + login.locale + '.js"></script>');
		if(compressed)
			document.write('<script type="text/javascript" src="module/' + module_name + '/' + module_name + '.js"></script>');
	}
	
	function registerModule(module_name, controllers, compressed) {
		if (modules[module_name])
			return;

		modules[module_name] = controllers;
		modules_order.push(module_name);

		Ext.Loader.setPath(module_name, 'module/' + module_name);
		loadResources(module_name, compressed);
	}

	function getAllControllers() {
		var joined = [];
		for(var i = 0;i < modules_order.length;i++)
			joined = joined.concat(modules[modules_order[i]]);
		return joined;
	}
	
	return {
		modules : getModules,
		register : registerModule,
		controllers : getAllControllers,
		get : getModule
	};
	
}();

Ext.onReady(function() {
	Ext.application({
		name : 'SmartFactory',
		autoCreateViewport : true,

		controllers : [ 'SmartFactory.controller.ApplicationController' ]
				.concat(Ext.module.controllers()),

		launch : function() {
		}
	});
});