Ext.define('SYS.controller.log.LogManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_log grid',
		ref : 'grid'
	}, {
		selector : 'admin_log #btnDelete',
		ref : 'btnDelete'
	}, {
		selector : 'admin_log',
		ref : 'baseForm'
	}],

	init : function() {
		this.control({
			'admin_log' : {
				btnClose : this.onBtnClose,
				sup_btnResetclick : this.onSupBtnReset,
				sup_btnViewclick : this.onSupBtnView,
				gridselectionchange : this.onSelectionchange
			},
			'admin_log basebuttons' : {
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
		this.getBaseForm().getSupplement().getForm().reset();
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
			type : sup.sub('type').getValue()
		};
		store.load({
			params : params
		});
	}

});