Ext.define('BAS.controller.field.FieldEdit', {
	extend : 'BAS.controller.task.TaskEdit',
	
	stores : [],
	models : [],
	views : [ 'BAS.view.field.FieldEdit' ],

	refs : [ {
		selector : 'hbas_field_edit',
		ref : 'edit'
	} ],

	init : function() {
		this.control({
			'hbas_field_edit' : {
				btnClose : this.onBtnClose,
				btnSubmit : this.onBtnSubmit,
				btnSave :  this.onBtnSave,
				btnCancel : this.onBtnCancel,
				keychange : this.onKeyChange
			},
			'hbas_field_edit form' : {
			}
		});
	},
	
	buildTitle : function(taskType, request, document) {
		var keys = [];

		/* Be supposed : key1 = tableName */
		Ext.Array.each(SF.task.get(taskType, 'entity.view.service.params').slice(1), function(key, i) {
			keys.push(document[key]);
		});
		var keyinfo = keys.join('-');

		return T('Message.Task.Title', {
			reqType : T('Caption.Task.Request.' + request.reqType),
			taskType : T('Caption.Task.Type.' + taskType),
			keyinfo : keyinfo
		});
	},
	
	complementLoadParams : function(params) {
		if(!params)
			params = {};
		params.tableName = 'MST_FIELD';
		
		return params;
	}
});