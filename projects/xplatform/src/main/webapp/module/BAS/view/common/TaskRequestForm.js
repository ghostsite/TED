Ext.define('BAS.view.common.TaskRequestForm', {
	extend : 'Ext.form.Panel',
	
	xtype : 'bas_requestform',
	
	requires : [ 'mixin.DeepLink' ],
	mixins : {
		deeplink : 'mixin.DeepLink',
		buttonHandler : 'MES.mixin.ButtonHandler'
	},
	
	title : T('Caption.Other.Task Request'),
	
	bodyCls : 'paddingAll10',
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	dockedItems : {
		xtype : 'mes_task_buttons',
		items : [ '->', 'Close' ]
	},

	initComponent : function() {
		this.callParent();
		var self = this;
	}
});
