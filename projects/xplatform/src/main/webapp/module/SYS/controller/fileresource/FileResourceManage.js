Ext.define('SYS.controller.fileresource.FileResourceManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_fileresource #fileresourcegrid',
		ref : 'grid'
	},{
		selector : 'admin_fileresource #btnRemoveFile',
		ref : 'btnRemoveFile'
	},{
		selector : 'admin_fileresource #showfilepic',
		ref : 'pic'
	}],

	init : function() {
		this.control({
			'admin_fileresource #fileresourcegrid' : {
				itemdblclick : this.doDownload,
				itemclick : this.showPic,
				selectionchange : this.changeButtonsStatus//改变button remove disabled or enabled
			},
			'admin_fileresource #btnRemoveFile' : {
				click : this.onDeleteFile
			}
		});
	},

	changeButtonsStatus : function(model, selected, eOpts) {
		var me = this;
		var flag = selected.length > 0 ? true : false;
		if (flag) {
			this.getBtnRemoveFile().enable();
		} else {
			this.getBtnRemoveFile().disable();
		}
	},
	
	
	// 下载
	doDownload : function(view, record) {
		console.log(record);
		var path = 'fileresource/download/' + record.data.id;
		SF.exporter.doDownload(path);
	},

	//展示pic
	showPic : function(view, record) {
		console.log(record);
		//Ext.getCmp('showfilepic').getEl().dom.src = 'fileresource/downloadPic/' + record.data.id;// 显示图片
		this.getPic().setSrc('fileresource/downloadPic/' + record.data.id);// 显示图片
	},
	
	//删除, no check
	onDeleteFile : function(button){
		var fileId = SF.getSelectedIdFromGrid(this.getGrid());
		var self = this;
		if(fileId){
			Ext.Msg.confirm('信息', '确认删除？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
						method : 'POST',
						url : 'fileresource/delete',
						params : {
							resourceId : fileId
						},
						success : function(response, opts) {
							SF.alertInfo('信息','删除成功!');
							self.getGrid().getStore().reload();
						},
						failure : function(response, opts) {
							var rs = Ext.decode(response.responseText);
							SF.alertError('错误',rs.msg);
						}
					});
				}
			});
		}
	
		
	}
});