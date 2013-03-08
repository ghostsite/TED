Ext.define('BAS.controller.field.FieldView', {
	extend : 'BAS.controller.task.TaskView',
	
	stores : [],
	models : [],
	views : [ 'BAS.view.field.FieldView' ],

	refs : [ {
		selector : 'hbas_field_view',
		ref : 'viewer'
	} ],

	init : function() {
		this.control({
			'hbas_field_view' : {
				btnClose : this.onBtnClose,
				btnApprove : this.onBtnApprove,
				btnReject : this.onBtnReject,
				btnRelease : this.onBtnRelease,
				btnCancel : this.onBtnCancel,
				keychange : this.onKeyChange
			}
		});
	},
	
	loadEntity : function(view, keys) {
		keys.tableName = 'MST_FIELD';
		
		this.callParent(arguments);
	}
});