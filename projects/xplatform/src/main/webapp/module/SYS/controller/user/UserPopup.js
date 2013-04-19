Ext.define('SYS.controller.user.UserPopup', {
	extend : 'BAS.controller.PopupController',

	views : ['SYS.view.user.UserPopup'],

	uses : ['SYS.model.User'],

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

		//view.sub('formId').loadRecord(keys.formData.record);
		if (keys.status === 'create') {// 新增
			view.sub('organization.id').setValue(keys.formData['organization.id']);
			view.sub('organization.name').setValue(keys.formData['organization.name']);
		} else if (keys.status === 'update') {// 修改
			var res = this.loadData(view, {
				userId : keys.formData.record.raw.id
			});
			var record = Ext.create('SYS.model.User', res.responseObj); // response.response.responseObj || Ext.JSON.decode(response.response.responseText);
			view.sub('formId').loadRecord(record);
			view.sub('organization.id').setValue(res.responseObj.orgId);
			view.sub('organization.name').setValue(keys.formData.record.raw.orgName);
			// form.findField()不行，因为这个findField返回的是Field类型，而box是Component类型，少了一个层次
			Ext.getCmp('showuserpicforpopup').getEl().dom.src = 'attachment/downloadPic/' + res.responseObj.pic.id;
		} else if (keys.status === 'show') {// show
			var res = this.loadData(view, {
				userId : keys.formData.record.raw.id
			});
			var record = Ext.create('SYS.model.User', res.responseObj);
			view.sub('formId').loadRecord(record);
			view.sub('organization.id').setValue(res.responseObj.orgId);
			view.sub('organization.name').setValue(res.responseObj.orgName);
			// form.findField()不行，因为这个findField返回的是Field类型，而box是Component类型，少了一个层次
			view.sub('formId').getForm().getFields().each(function(f) {
				f.setReadOnly(true);
				// f.setDisabled(true);
			});
		
			view.sub('userpic').setReadOnly(true);
			view.sub('userpic').setDisabled(true);
			view.sub('needToUpdatePic').setDisabled(true);
			view.sub('btnSave').hide();
			
			if(res.responseObj && res.responseObj.pic && res.responseObj.pic.id){
				Ext.getCmp('showuserpicforpopup').getEl().dom.src = 'attachment/downloadPic/' + res.responseObj.pic.id;
			}
		}
	},

	loadData : function(view, params, onAfterFormLoad) {
		var config = {
			url : 'user/getUserById',
			params : params,
			method : 'GET'
		};
		return SF.cf.callServiceSync(config);
		/**
		 * var reader = Ext.create('Ext.data.reader.Json', { url :
		 * 'user/getUserById', model : 'SYS.model.User' });
		 * view.sub('formId').reader = reader;
		 * view.sub('formId').getForm().load({ params : params, success
		 * :onAfterFormLoad, failure : onAfterFormLoad, url: reader.url, method :
		 * 'POST', scope : this });
		 */
	},

	onBtnSave : function() {
		var self = this;
		SF.cf.callServiceForm({
			checkFormValid : true,
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
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		});
	}

});