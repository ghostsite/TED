Ext.define('SYS.controller.log.Log4jLogManage', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'admin_log4jlog grid',
		ref : 'grid'
	}, {
		selector : 'admin_log4jlog #btnDelete',
		ref : 'btnDelete'
	}, {
		selector : 'admin_log4jlog',
		ref : 'baseForm'
	}],

	init : function() {
		this.control({
			'admin_log4jlog' : {
				btnClose : this.onBtnClose,
				sup_btnReset : this.onSupBtnReset,
				sup_btnView : this.onSupBtnView,
				gridselectionchange : this.onSelectionchange
			},
			'admin_log4jlog basebuttons' : {
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

	onSupBtnReset : function(sup) {
		sup.getForm().reset();
	},

	onSupBtnView : function(sup) {
		// var queryString = sup.getValues(true);
		// sup.getSupplementClient().setKeys(Ext.Object.fromQueryString(queryString,
		// true));
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