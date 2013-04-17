Ext.define('BUS.controller.fileresource.FileResourceList', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'bus_fileresource #fileresourcegrid',
		ref : 'grid'
	}],

	init : function() {
		this.control({
			'bus_fileresource #fileresourcegrid' : {
				itemdblclick : this.doDownload,
				itemclick : this.showPic
			}
		});
	},

	// 下载
	doDownload : function(view, record) {
		//TODO check authority that file can be downloaed
		//check()
		
		var path = 'fileresource/download/' + record.data.id;
		SF.exporter.doDownload(path);
	},

	showPic : function(view, record) {
		Ext.getCmp('showfilepicforbus').getEl().dom.src = 'fileresource/downloadPic/' + record.data.id;// 显示图片
	}
});