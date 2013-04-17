Ext.define('SYS.controller.urlresource.UrlResourceManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_urlresource #urlGridId',
		ref : 'urlGrid'
	},{
		selector : 'admin_urlresource #urlFormId',
		ref : 'urlForm'
	},{
		selector : 'admin_urlresource #btnUrlDelete',
		ref : 'btnUrlDelete'
	},{
		selector : 'admin_urlresource #btnUrlUpdate',
		ref : 'btnUrlUpdate'
	},{
		selector : 'admin_urlresource #btnUrlCreate',
		ref : 'btnUrlCreate'
	}],

	init : function() {
		this.control({
			'admin_urlresource #urlGridId' : {
				itemclick : this.showUrlResourceInfo
			},
			'admin_urlresource #btnUrlClear' : {
				click : this.onUrlClear
			},
			'admin_urlresource #btnUrlCreate' : {
				click : this.onUrlCreate
			},
			'admin_urlresource #btnUrlUpdate' : {
				click : this.onUrlUpdate
			},
			'admin_urlresource #btnUrlDelete' : {
				click : this.onUrlDelete
			}
		});
	},
	
	showUrlResourceInfo : function(grid, record){
		this.getBtnUrlDelete().enable();
		this.getBtnUrlUpdate().enable();
		this.getBtnUrlCreate().disable();
		
		//this.getUrlForm().getForm().loadRecord(record);这种方法不弄load到Operation
		var urlForm = this.getUrlForm();
		urlForm.form.load({
			url : 'urlresource/getUrlResourceById',
			params : {
				resourceId : record.raw.id
			}
		});
	},
	
	onUrlClear : function(button, event, eOpts){
		this.getBtnUrlDelete().disable();
		this.getBtnUrlUpdate().disable();
		this.getBtnUrlCreate().enable();
		
		SF.clearForm(this.getUrlForm());
	},
	
	onUrlCreate : function(button, event, eOpts){
		var self = this;
		var config = {
			checkFormValid: true,
			form : this.getUrlForm(),
			url : 'urlresource/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息','创建成功!');
					self.refreshUrlGrid();
					SF.clearForm(self.getUrlForm());
				}else{
					SF.alertError('错误',Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};
		
		SF.cf.callServiceForm(config);
	},
	
	onUrlUpdate : function(button, event, eOpts){
		var self = this;
		var config = {
			checkFormValid: true,
			form : this.getUrlForm(),
			url : 'urlresource/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息','变更成功!');
					self.refreshUrlGrid();
					SF.clearForm(self.getUrlForm());
				}else{
					SF.alertError('错误',Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};
		
		SF.cf.callServiceForm(config);
	},
	
	onUrlDelete : function(button, event, eOpts){
		var urlFormPanel = this.getUrlForm();
		var self = this;
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'urlresource/delete',
					params : {
						resourceId : urlFormPanel.getForm().findField('id').getValue()
					},
					success : function(response, opts) {
						SF.alertInfo('信息','删除成功!');
						self.refreshUrlGrid();
						SF.clearForm(self.getUrlForm());
					},
					failure : function(response, opts) {
						var rs = Ext.decode(response.responseText);
						SF.alertError('错误',rs.msg);
					}
				});
			}
		});
	},
	
	refreshUrlGrid : function(){
		this.getUrlGrid().getStore().loadPage(1);
	}
	
});