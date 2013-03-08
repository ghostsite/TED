Ext.define('BAS.view.field.FieldView', {
	extend : 'BAS.view.task.TaskView',

	requires : [ 'BAS.view.field.FieldForm' ],

	title : T('Caption.Menu.Field View'),

	xtype : 'hbas_field_view',

	autoScroll : true,
	
	bodyCls : 'paddingAll10',

	taskType : 'MST_FIELD',
	
	buildDocumentForm : function() {
		return Ext.create('BAS.view.field.FieldForm', {
			itemId : 'frmDocument',
			title : ''
		});
	}
});