Ext.define('SYS.controller.user.UserPopup', {
	extend : 'BAS.controller.PopupController',

	views : ['SYS.view.user.UserPopup'],

	refs : [{
		selector : 'admin_userpopup',
		ref : 'form'
	}],

	init : function() {
		this.control({
			'admin_userpopup' : {
				btnSave : this.onBtnSave,
				btnClose : this.onBtnClose,
				keychange : this.onKeyChange
			}
		});
	},

	onBtnClose : function(view) {
		view.close();
	},

	onKeyChange : function(view, keys) {// 区分shi新增还是修改
		var view = this.getForm();
		this.targetControl = keys.targetControl;
		this.targetForm = keys.targetForm;
		
		if (keys.status === 'update') {// 修改
			view.sub('formId').loadRecord(keys.formData.record);
			view.sub('organization.id').setValue(keys.formData.record.raw.orgId);
			view.sub('organization.name').setValue(keys.formData.record.raw.orgName);
		} else if (keys.status === 'create') {// 新增
			view.sub('organization.id').setValue(keys.formData['organization.id']);
			view.sub('organization.name').setValue(keys.formData['organization.name']);
		} else if (keys.status === 'show') {// show
			view.sub('formId').loadRecord(keys.formData.record);
			view.sub('organization.id').setValue(keys.formData.record.raw.orgId);
			view.sub('organization.name').setValue(keys.formData.record.raw.orgName);

			view.sub('formId').getForm().getFields().each(function(f) {
				f.setReadOnly(true);
				//f.setDisabled(true);
			});

			view.sub('btnSave').hide();
		}
	},

	onBtnSave : function() {
		var self = this;
		SF.cf.callServiceForm({
			checkFormValid: true,
			form : this.getForm().sub('formId'),
			url : 'user/save',
			showErrorMsg : false,
			showSuccessMsg : true,
			callback : function(action, success) {
				if (success) {
					var supStuff = self.targetControl.getSupStuff();
					var selNode = supStuff.selNodes[0];
					supStuff.tree.fireEvent('itemclick', null, selNode);
					this.getForm().close();
				}else{
					Ext.Msg.alert('Fail', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		});
	}

});