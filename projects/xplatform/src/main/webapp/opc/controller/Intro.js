Ext.define('Opc.controller.Intro', {
	extend : 'Ext.app.Controller',
	
	views : ['Intro'],
	
	refs : [ {
		selector : 'lotlist',
		ref : 'lotlist'
	}, {
		selector : 'navigator',
		ref : 'navigator'
	}, {
		selector : 'intro',
		ref : 'intro'
	} ],
	
	init : function() {
		this.control({
			'intro' : {
				afterrender : this.onAfterRender
			}
		});
	},
	
	onAfterRender : function() {
		var element = this.getIntro().getEl();
		
		element.on({
			delegate : '.menu1',
			click : function() {
				SF.go('Opc.view.wip.LotList');
			}
		});
		element.on({
			delegate : '.menu2',
			click : function() {
				SF.go('Opc.view.Alarm');
			}
		});
		element.on({
			delegate : '.menu3',
			click : function() {
				SF.go('Opc.view.Settings');
			}
		});
	}
});