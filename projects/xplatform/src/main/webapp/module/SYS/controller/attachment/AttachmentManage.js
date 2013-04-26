Ext.define('SYS.controller.attachment.AttachmentManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_attachment #attachmentgrid',
		ref : 'grid'
	}],

	init : function() {
		this.control({
			'admin_attachment #attachmentgrid' : {
				itemdblclick : this.doDownload,
				itemclick : this.showPic
			}
		});
	},

	// 下载
	doDownload : function(view, record) {
		var path = 'attachment/download/' + record.data.id;
		SF.exporter.doDownload(path);
	},

	showPic : function(view, record) {
		Ext.getCmp('showattachmentpic').getEl().dom.src = 'attachment/downloadPic/' + record.data.id;// 显示图片
	}
});