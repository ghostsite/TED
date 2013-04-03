Ext.define('SYS.view.attachment.AttachmentManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_attachment',
	requires : ['SYS.model.Attachment', 'Ext.ux.ProgressBarPager', 'Ext.grid.plugin.RowExpander'],

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
		var store = Ext.create('SYS.store.Attachment');
		store.getProxy().url = 'attachment/getAllAttachment';
		store.load();
		return {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'container',
				layout : 'hbox',
				items : [{
					xtype : 'grid',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'gridmap',
					height : 300,
					forceFit : true,
					flex : 2,
					store : store,
					columns : [{
						header : '种类',
						dataIndex : 'typeCode',
						flex : 1
					}, {
						header : '文件名',
						dataIndex : 'originName',
						flex : 2
					}, {
						header : '文件大小',
						dataIndex : 'fileSize',
						flex : 1
					}, {
						header : '后缀',
						dataIndex : 'fileType',
						flex : 1
					}]
				}, {
					xtype : 'box',
					cls:'paddingL10',
					id : 'showpic',
					width : 240,
					name : 'showpic',
					autoEl : {
						tag : 'img',
						src : '',
						// class:'ImageStyle'
						width : 240,
						height : 300
					}
				}]
			}, Ext.create('MES.view.form.field.MultiFileUploader', {
				title : '附件管理',
				uploadUrl : 'attachment/upload',
				downloadUrl : 'attachment/download'
			})]
		};
	}
});