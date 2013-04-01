Ext.define('BAS.controller.task.TaskController', {
	extend : 'Ext.app.Controller',

	requires : [ 'BAS.mixin.TaskRegister', 'BAS.controller.task.NavTask', 'BAS.controller.task.NavEntity', 'BAS.controller.task.TaskList', 'BAS.controller.task.TaskView', 'BAS.controller.task.TaskEdit', 'BAS.controller.task.TaskImport', 'BAS.controller.task.EntityList' ],

	stores : [ ],
	models : [ ],
	views : [ 'task.TaskView', 'task.TaskEdit', 'task.TaskImport', 'task.EntityList' ],

	controlSets : [ 'NavTask', 'NavEntity', 'TaskList', 'TaskView', 'TaskEdit', 'TaskImport', 'EntityList' ],
	               
	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});
		
		SF.mixin('BAS.mixin.TaskRegister');

		var self = this;
		
		Ext.each(this.controlSets, function(set) {
			var controller = self.getController('BAS.controller.task.' + set);
			controller.init();
		});
		
	},

	onViewportRendered : function() {
		SF.addNav({
			xtype : 'nav_task',
			iconCls : 'iconsetDockRequest', // TODO to be changed. 'iconsetDockRequest' ==> 'iconsetDockTaskList'
			itemId : 'nav_task',
			tabConfig : {
				tooltip : T('Caption.Task.Task List')
			}
		});
	}
});
