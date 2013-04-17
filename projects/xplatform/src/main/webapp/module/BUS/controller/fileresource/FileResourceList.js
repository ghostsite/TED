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
		if(this.checkCanDownload()){
			var path = 'fileresource/download/' + record.data.id;
			SF.exporter.doDownload(path);
		}
	},

	showPic : function(view, record) {
		Ext.getCmp('showfilepicforbus').getEl().dom.src = 'fileresource/downloadPic/' + record.data.id;// 显示图片
	},
	
	checkCanDownload  : function(){
		var fileCode = SF.getSelectedValueFromGrid(this.getGrid(),'code');
		var callConfig ={
			url: 'fileresource/currentUserCanDownload',
			params:{
				fileCode : fileCode
			}
		}
		
		var canDownload = SF.cf.callServiceSync(callConfig);
		
		if (canDownload.result.data == false) {
			SF.alertWarn('警告', '您没有权限下载此文件!');
			return false;
		}else{
			return true;
		}
	}
});