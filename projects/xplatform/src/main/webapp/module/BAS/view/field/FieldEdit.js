Ext.define('BAS.view.field.FieldEdit', {
	extend : 'BAS.view.task.TaskEdit',

	requires : [ 'BAS.view.field.FieldForm' ],

	title : T('Caption.Menu.Field Edit'),

	xtype : 'hbas_field_edit',

	autoScroll : true,

	bodyCls : 'paddingAll10',
	
	taskType : 'MST_FIELD',
	
	initComponent : function() {
		this.callParent();
	},

	buildDocumentForm : function() {
		return Ext.create('BAS.view.field.FieldForm', {
			itemId : 'frmDocument',
			title : ''
		});
	}
});