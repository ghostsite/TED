Ext.define('SYS.controller.fileresource.FileResourceManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_fileresource #fileresourcegrid',
		ref : 'grid'
	}],

	init : function() {
		this.control({
			'admin_fileresource #fileresourcegrid' : {
				itemdblclick : this.doDownload,
				itemclick : this.showPic
			}
		});
	},

	// 下载
	doDownload : function(view, record) {
		console.log(record);
		var path = 'fileresource/download/' + record.data.id;
		SF.exporter.doDownload(path);
	},

	showPic : function(view, record) {
		console.log(record);
		Ext.getCmp('showfilepic').getEl().dom.src = 'fileresource/downloadPic/' + record.data.id;// 显示图片
	}
});