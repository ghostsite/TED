Ext.define('BAS.view.task.TaskImportView', {
	extend : 'BAS.view.task.TaskView',

	xtype : 'task_import_view',

	initComponent : function() {
		this.callParent();
		
		var self = this;

		this.taskForm.add({
			xtype : 'container',
			itemId : 'cntFileInfo',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			hidden : true,
			items : [{
				xtype : 'button',
				itemId : 'btnImportedFile',
				cls : 'importedFile',
				listeners : {
					click : function() {
						self.fireEvent('filedownload', self);
					}
				}
			}, {
				xtype : 'hidden',
				itemId : 'hdnFileId'
			}]
		});
	}

});