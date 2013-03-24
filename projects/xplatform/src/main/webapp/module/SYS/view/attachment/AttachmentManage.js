Ext.define('SYS.view.attachment.AttachmentManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_attachment',
	requires : ['SYS.model.Attachment', 'Ext.ux.ProgressBarPager', 'Ext.ux.grid.RowExpander'],

	title : T('Caption.Menu.SYS.view.attachment.AttachmentManage'),
	// layout : 'fit',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();

		this.on('afterrender', function() {
		});
	},

	buildForm : function(me) {
		return Ext.create('MES.view.form.field.MultiFileUploader', {
			title : '附件管理',
			uploadUrl : 'attachment/upload',
			downloadUrl : 'attachment/download'
		});
	}
});