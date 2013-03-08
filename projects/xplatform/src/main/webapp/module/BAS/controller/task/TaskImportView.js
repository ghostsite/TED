Ext.define('BAS.controller.task.TaskImportView', {
	extend : 'BAS.controller.task.TaskView',
	
	onFileDownload : function(view) {
		var fileId = view.down('#hdnFileId').getValue();
		if(!fileId) {
			/* TODO Error Handling */
			Ext.msg.alert('Alert', 'File Id Not Defined');
		}
		var url = 'service/bas_download_file/' + fileId + '.do';
		SF.exporter.doDownload(url);
	},
	
	blockEditables : function(view) {
		/* Do Nothing */
	},
	
	fillTaskForm : function(view, data, ownStep) {
		this.callParent([view, data, ownStep]);
		
		if(data.fileinfo && data.fileinfo[0]) {
			
			var fileinfo = data.fileinfo[0];

			view.taskForm.down('#cntFileInfo').show();
			view.taskForm.down('#btnImportedFile').setText(fileinfo.fileName);
			view.taskForm.down('#hdnFileId').setValue(fileinfo.fileId);
		};
	},
	
	fillDocumentForm : function(view, document) {
		var grid = view.documentForm.down('grid');
		
		grid.getStore().loadData(document.dataList);
	}
});
