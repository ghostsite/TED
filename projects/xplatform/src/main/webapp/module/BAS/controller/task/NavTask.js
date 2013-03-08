Ext.define('BAS.controller.task.NavTask', {
	extend : 'Ext.app.Controller',

	requires : [ ],

	stores : [ 'BAS.store.BasViewTaskMenuListOut.List' ],
	models : [ 'BAS.model.BasViewTaskMenuListOut.List' ],
	views : [ 'BAS.view.task.NavTask' ],

	init : function() {
		this.control({
			'nav_task' : {
				activate : this.onActivated
			},
			'nav_task dataview' : {
				itemclick : this.onTaskListClick
			},
			'nav_task button#btnRefresh' : {
				click : this.onButtonRefreshClick
			}
		});
	},
	
	onActivated : function() {
		this.reload();
	},

	onTaskListClick : function(view, record) {
		if (record && record.get('menuType')) {
			SF.doMenu({
				viewModel : 'BAS.view.task.TaskList',
				keys : {
					menuType : record.get('menuType')
				}
			});
		}
	},

	onButtonRefreshClick : function() {
		this.reload();
	},
	
	reload : function() {
		var store = Ext.getStore('BAS.store.BasViewTaskMenuListOut.List');
		store.proxy.extraParams = {
			procstep : 1
		};
		store.load();
	}
});
