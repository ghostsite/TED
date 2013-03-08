Ext.define('BAS.controller.task.NavEntity', {
	extend : 'Ext.app.Controller',

	requires : [ ],

	stores : [ ],
	models : [ ],
	views : [ 'BAS.view.task.NavEntity' ],

	init : function() {
		this.control({
			'nav_entity dataview' : {
				itemclick : this.onEntityClick
			}
		});
	},
	
	onEntityClick : function(view, record) {
		SF.doMenu({
			viewModel : record.get('view')
		});
	}
});
