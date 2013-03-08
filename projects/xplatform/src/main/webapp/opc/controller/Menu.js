Ext.define('Opc.controller.Menu', {
	extend : 'Ext.app.Controller',
	
	stores : ['SEC.store.SecViewFunctionListOut.list'],
	views : ['Menu'],
	
	refs : [ {
		selector : 'opcmenu',
		ref : 'opcMenu'
	}, {
		selector : 'opcmenu dataview',
		ref : 'menuView'
	} ],
	
	init : function() {
		this.control({
			'opcmenu' : {
				show : this.onShow
			},
			'opcmenu dataview' : {
				itemclick : this.onItemClick
			}
		});
	},
	
	onItemClick : function(view, record, item) {
		if(record.data.funcTypeFlag !== 'F')
			return;
		
		SF.go(record.data.path);
		this.getOpcMenu().close();
	},
	
	onShow : function() {
		var win = this.getOpcMenu();
		var listener = Ext.select('.x-mask').addListener('click', function() {
			Ext.select('.x-mask').removeListener(listener);
            win.close();
        });
	}
});