Ext.require(['MES.mixin.CodeView', 'MES.mixin.CommonFunction', 'MES.data.CodeViewRegister']);

Ext.define('MES.controller.MESController', {
	extend : 'Ext.app.Controller',
	requires : ['MES.view.form.BaseForm', 'MES.view.form.BaseFormTabs', 'MES.view.form.BaseFormComposite'],
	stores : [],
	models : [],
	views : ['MES.view.form.field.CodeViewField', 'MES.view.form.field.MultiCodeViewField',
	'MES.view.form.field.CodeViewColumn', 'MES.view.form.SupplementForm', 
	'MES.view.form.SupplementGridForm', 'MES.view.form.SupplementTabs',
	'MES.view.form.field.BaseButtons', 'MES.view.form.field.LineSeparator', 
	'MES.view.form.field.Decimalfield', 'MES.view.form.field.ColorField', 
	'MES.view.form.field.FixedColumn', 'MES.view.form.field.TextActionColumn'
	],

	
	controlSets : [],

	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			},
			'basebuttons' : {
				// before event
				beforeCreate : this.onBeforeCreate,
				beforeUpdate : this.onBeforeUpdate,
				beforeDelete : this.onBeforeDelete,
				beforeUndelete : this.onBeforeUndelete,
				beforeVersionUp : this.onBeforeVersionUp,
				beforeProcess : this.onBeforeProcess,
				beforeRelease : this.onBeforeRelease,
				beforeExport : this.onBeforeExport,
				beforeClose : this.onBeforeClose,

				// after event
				afterCreate : this.onAfterCreate,
				afterUpdate : this.onAfterUpdate,
				afterDelete : this.onAfterDelete,
				afterUndelete : this.onAfterUndelete,
				afterVersionUp : this.onAfterVersionUp,
				afterProcess : this.onAfterProcess,
				afterRelease : this.onAfterRelease,
				afterView : this.onAfterView,
				afterRefresh : this.onAfterRefresh,
				afterClose : this.onAfterClose
			}
		});

		var self = this;

		Ext.each(this.controlSets, function(set) {
			var controller = self.getController('MES.controller.' + set);
			controller.init();
		});

		// mixin 설정
		this.setMixin();

		this.setShiftInfo();
	},

	// before event handler
	onBeforeCreate : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnCreate', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeCreate(form, addParams, url);
	},

	onBeforeUpdate : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnUpdate', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeUpdate(form, addParams, url);
	},

	onBeforeDelete : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnDelete', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeDelete(form, addParams, url);
	},

	onBeforeUndelete : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnUndelete', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeUndelete(form, addParams, url);
	},

	onBeforeVersionUp : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnVersionUp', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeVersionUp(form, addParams, url);
	},

	onBeforeProcess : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnProcess', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeProcess(form, addParams, url);
	},

	onBeforeRelease : function(form, addParams, url, scope) {
		if (scope.checkCondition('btnRelease', form, addParams) === false) {
			return false;
		}
		return scope.onBeforeRelease(form, addParams, url);
	},

	onBeforeExport : function(form, addParams, url, scope) {
		return scope.onBeforeExport(scope, addParams, url);
	},

	onBeforeClose : function(scope) {
		return scope.onBeforeClose();
	},

	// after event handler
	onAfterCreate : function(form, action, success, scope) {
		scope.onAfterCreate(form, action, success);
	},

	onAfterUpdate : function(form, action, success, scope) {
		scope.onAfterUpdate(form, action, success);
	},

	onAfterDelete : function(form, action, success, scope) {
		scope.onAfterDelete(form, action, success);
	},

	onAfterUndelete : function(form, action, success, scope) {
		scope.onAfterUndelete(form, action, success);
	},

	onAfterVersionUp : function(form, action, success, scope) {
		scope.onAfterVersionUp(form, action, success);
	},

	onAfterProcess : function(form, action, success, scope) {
		scope.onAfterProcess(form, action, success);
	},

	onAfterRelease : function(form, action, success, scope) {
		scope.onAfterRelease(form, action, success);
	},

	onAfterView : function(form, scope) {
		scope.onAfterView(form);
	},

	onAfterRefresh : function(form, scope) {
		scope.onAfterRefresh(form);
	},

	onAfterClose : function(scope) {
		scope.onClose();
	},

	onViewportRendered : function() {
		// status bar 설정(alarm, Communicator, agent)
		this.setStatusBar();
	},

	setMixin : function() {
		SF.mixin('MES.mixin.CodeView');
		SF.mixin('MES.mixin.CommonFunction');
		Ext.create('MES.data.CodeViewRegister');
	},

	setStatusBar : function() {
		// tray icon 추가
		SF.status.tray([{
			xtype : 'button',
			itemId : 'btnServer',
			cls : 'trayServer'
		}]);
	},

	setShiftInfo : function() {
	}
});