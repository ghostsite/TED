Ext.define('SYS.controller.pageresource.PageResourceManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_pageresource #pageGridId',
		ref : 'pageGrid'
	},{
		selector : 'admin_pageresource #widgetGridId',
		ref : 'widgetGrid'
	},{
		selector : 'admin_pageresource #pageFormId',
		ref : 'pageForm'
	},{
		selector : 'admin_pageresource #widgetFormId',
		ref : 'widgetForm'
	},{
		selector : 'admin_pageresource #btnPageDelete',
		ref : 'btnPageDelete'
	},{
		selector : 'admin_pageresource #btnPageUpdate',
		ref : 'btnPageUpdate'
	},{
		selector : 'admin_pageresource #btnPageCreate',
		ref : 'btnPageCreate'
	},{
		selector : 'admin_pageresource #btnWidgetDelete',//btnWidgetDelete,借用的BaseButtons.js里面的btnDelete,一下2个也是。
		ref : 'btnWidgetDelete'
	},{
		selector : 'admin_pageresource #btnWidgetUpdate',
		ref : 'btnWidgetUpdate'
	},{
		selector : 'admin_pageresource #btnWidgetCreate',
		ref : 'btnWidgetCreate'
	},{
		selector : 'admin_pageresource #btnWidgetClear',
		ref : 'btnWidgetClear'
	}],

	init : function() {
		this.control({
			'admin_pageresource #pageGridId' : {
				itemclick : this.showPageResourceInfo
			},
			'admin_pageresource #btnPageClear' : {
				click : this.onPageClear
			},
			'admin_pageresource #btnPageCreate' : {
				click : this.onPageCreate
			},
			'admin_pageresource #btnPageUpdate' : {
				click : this.onPageUpdate
			},
			'admin_pageresource #btnPageDelete' : {
				click : this.onPageDelete
			},
			
			'admin_pageresource #widgetGridId' : {
				itemclick : this.showWidgetResourceInfo
			},
			'admin_pageresource #btnWidgetClear' : {
				click : this.onWidgetClear
			},
			'admin_pageresource #btnWidgetCreate' : {
				click : this.onWidgetCreate
			},
			'admin_pageresource #btnWidgetUpdate' : {
				click : this.onWidgetUpdate
			},
			'admin_pageresource #btnWidgetDelete' : {
				click : this.onWidgetDelete
			}
		});
	},
	
	showPageResourceInfo : function(grid, record){
		this.getBtnPageDelete().enable();
		this.getBtnPageUpdate().enable();
		this.getBtnPageCreate().disable();
		
		this.getBtnWidgetClear().enable();
		this.getBtnWidgetCreate().enable();
		this.getBtnWidgetDelete().disable();
		this.getBtnWidgetUpdate().disable();
		
		//this.getPageForm().getForm().loadRecord(record);这种方法不弄load到Operation
		var pageForm = this.getPageForm();
		pageForm.form.load({
			url : 'pageresource/getPageResourceById',
			params : {
				resourceId : record.raw.id
			}
		});
		
		this.getWidgetGrid().getStore().load({
			params:{
				resourceId : record.get('id')			
			}
		});
		
		this.clearWidgetForm();
		this.getWidgetForm().getForm().findField('page.id').setValue(record.get('id'));
	},
	
	onPageClear : function(button, event, eOpts){
		this.getBtnPageDelete().disable();
		this.getBtnPageUpdate().disable();
		this.getBtnPageCreate().enable();
		
		SF.clearForm(this.getPageForm());
	},
	
	onPageCreate : function(button, event, eOpts){
		var self = this;
		var config = {
			checkFormValid: true,
			form : this.getPageForm(),
			url : 'pageresource/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息','创建成功!');
					self.refreshPageGrid();
					SF.clearForm(self.getPageForm());
				}else{
					SF.alertError('错误',Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};
		
		SF.cf.callServiceForm(config);
	},
	
	onPageUpdate : function(button, event, eOpts){
		var self = this;
		var config = {
			checkFormValid: true,
			form : this.getPageForm(),
			url : 'pageresource/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息','变更成功!');
					self.refreshPageGrid();
					SF.clearForm(self.getPageForm());
				}else{
					SF.alertError('错误',Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};
		
		SF.cf.callServiceForm(config);
	},
	
	onPageDelete : function(button, event, eOpts){
		var pageFormPanel = this.getPageForm();
		var self = this;
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'pageresource/delete',
					params : {
						resourceId : pageFormPanel.getForm().findField('id').getValue()
					},
					success : function(response, opts) {
						SF.alertInfo('信息','删除成功!');
						self.refreshPageGrid();
						SF.clearForm(self.getPageForm());
					},
					failure : function(response, opts) {
						var rs = Ext.decode(response.responseText);
						SF.alertError('错误',rs.msg);
					}
				});
			}
		});
	},
	
	showWidgetResourceInfo : function(grid, record){
		this.getBtnWidgetDelete().enable();
		this.getBtnWidgetUpdate().enable();
		this.getBtnWidgetCreate().disable();
		
		//this.getWidgetForm().getForm().loadRecord(record);
		
		var widgetForm = this.getWidgetForm();
		widgetForm.form.load({
			url : 'widgetresource/getWidgetResourceById',
			params : {
				resourceId : record.raw.id
			}
		});
	},
	
	onWidgetClear : function(button, event, eOpts){
		this.getBtnWidgetDelete().disable();
		this.getBtnWidgetUpdate().disable();
		this.getBtnWidgetCreate().enable();
		
		//SF.clearForm(this.getWidgetForm());
		this.clearWidgetForm();
	},
	
	onWidgetCreate : function(button, event, eOpts){
		var self = this;
		var config = {
			checkFormValid: true,
			form : this.getWidgetForm(),
			url : 'widgetresource/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息','创建成功!');
					self.refreshWidgetGrid();
					self.clearWidgetForm();
				}else{
					SF.alertError('错误',Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};
		
		SF.cf.callServiceForm(config);
	},
	
	onWidgetUpdate : function(button, event, eOpts){
		var self = this;
		var config = {
			checkFormValid: true,
			form : this.getWidgetForm(),
			url : 'widgetresource/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					SF.alertInfo('信息','变更成功!');
					self.refreshWidgetGrid();
					self.clearWidgetForm();
				}else{
					SF.alertError('错误',Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		};
		
		SF.cf.callServiceForm(config);
	
	},
	
	onWidgetDelete : function(button, event, eOpts){
		var widgetFormPanel = this.getWidgetForm();
		var self = this;
		Ext.Msg.confirm('信息', '确认删除？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					method : 'POST',
					url : 'widgetresource/delete',
					params : {
						resourceId : widgetFormPanel.getForm().findField('id').getValue()
					},
					success : function(response, opts) {
						SF.alertInfo('信息','删除成功!');
						self.refreshWidgetGrid();
						self.clearWidgetForm();
					},
					failure : function(response, opts) {
						var rs = Ext.decode(response.responseText);
						SF.alertError('错误',rs.msg);
					}
				});
			}
		});
	},
	
	refreshPageGrid : function(){
		this.getPageGrid().getStore().loadPage(1);
	},
	
	refreshWidgetGrid : function(){
		var pageId = SF.getSelectedIdFromGrid(this.getPageGrid());
		var params = {
			resourceId : pageId
		};
		this.getWidgetGrid().getStore().load({
			params : params
		});
	},
	
	clearWidgetForm : function(){
		SF.cf.clearFormFields(this.getWidgetForm(), {'page.id': 'page.id'});
	}
	
});