Ext.define('BAS.view.task.TaskImport', {
	extend : 'BAS.view.task.TaskEdit',

	xtype : 'task_import',
	
	title : T('Caption.Task.Import'),

	initComponent : function() {
		this.callParent();
		
		this.taskForm.add(this.buildUploadFields());
	},

	buildUploadFields : function() {
		return {
			xtype : 'container',
			title : '',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'filefield',
				vtype : 'xls',
				name : '_fileName',
				allowBlank : false,
				fieldLabel : T('Caption.Task.Import File'),
				labelStyle : 'font-weight:bold',
				buttonText : T('Caption.Button.Select File')
			}, {
				xtype : 'textfield',
				hidden : true,
				name : '__fileName'
			}, {
				xtype : 'textfield',
				hidden : true,
				name : 'fileGroupId'
			} ]
		};
	}
});