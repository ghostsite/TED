Ext.define('SYS.controller.workday.WorkDayManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_workday grid',
		ref : 'grid'
	}, {
		selector : 'admin_workday #btnDelete',
		ref : 'btnDelete'
	}, {
		selector : 'admin_workday',
		ref : 'baseForm'
	}],

	init : function() {
		this.control({
			'admin_workday' : {
				btnClose : this.onBtnClose,
				sup_btnResetclick : this.onSupBtnReset,
				sup_btnViewclick : this.onSupBtnView,
				sup_btnGenerateclick : this.onSupBtnGenerate,
				gridselectionchange : this.onSelectionchange
			},
			'admin_workday basebuttons' : {
				beforeDelete : this.onBeforeDelete,
				afterDelete : this.onAfterDelete
			}
		});
	},

	onBeforeDelete : function(form, addParams, url) {
		var gridPanel = this.getGrid();
		var params = SF.getSelectedIdArrayFromGrid(gridPanel);
		addParams['ids'] = params;
	},

	onAfterDelete : function(form, action, success, scope) {
		if (!success)
			return;
		this.onSupBtnView(this.getBaseForm().getSupplement());
	},

	onSelectionchange : function(model, selected, eOpts) {
		if (selected && selected.length > 0) {
			this.getBtnDelete().enable();
		} else {
			this.getBtnDelete().disable();
		}
	},

	onBtnClose : function(view) {
		view.close();
	},

	onSupBtnReset : function() {
		var sup = this.getBaseForm().getSupplement();
		sup.getForm().reset();
	},

	onSupBtnView : function() {
		var sup = this.getBaseForm().getSupplement();
		var params = {
			start : 0,
			limit : SF.page.pageSize
		}
		var store = this.getGrid().store;
		store.proxy.extraParams = {
			from : sup.sub('from').getRawValue(),
			to : sup.sub('to').getRawValue(),
			workDay : sup.sub('workDay').getValue()
		};
		store.load({
			params : params
		});
	},

	onSupBtnGenerate : function(sup) {
		var self = this;
		Ext.Msg.confirm(T('Message.Info'), T('Message.WorkDayGenerate?'), function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : 'workday/generate',
					method : 'POST',
					params : {
						from : sup.sub('from').getRawValue(),
						to : sup.sub('to').getRawValue()
					},
					success : function(response, opts) {
						SF.alertInfo(T('Message.Info'),T('Message.WorkDayGenOK'));
						self.onSupBtnView(sup);
					}
				});
			}
		});
	}
});