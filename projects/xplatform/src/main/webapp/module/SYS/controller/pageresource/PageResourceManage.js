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
		
	},
	
	onPageClear : function(button, event, eOpts){
		this.getBtnPageDelete().disable();
		this.getBtnPageUpdate().disable();
		this.getBtnPageCreate().enable();
		
		SF.clearForm(this.getPageForm());
	},
	
	onPageCreate : function(button, event, eOpts){
		//stop here
	},
	
	onPageUpdate : function(button, event, eOpts){
		
	},
	
	onPageDelete : function(button, event, eOpts){
		
	},
	
	showWidgetResourceInfo : function(grid, record){
		
	},
	
	onWidgetClear : function(button, event, eOpts){
		this.getBtnWidgetDelete().disable();
		this.getBtnWidgetUpdate().disable();
		this.getBtnWidgetCreate().enable();
		
		SF.clearForm(this.getWidgetForm());
	},
	
	onWidgetCreate : function(button, event, eOpts){
		
	},
	
	onWidgetUpdate : function(button, event, eOpts){
		
	},
	
	onWidgetDelete : function(button, event, eOpts){
		
	}
	
	
});