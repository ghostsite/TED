Ext.define('BUS.controller.excel2grid.Excel2GridShow', {
	extend : 'Ext.app.Controller',

	refs : [{
		selector : 'bus_excel2gridshow',
		ref : 'baseForm'
	}, {
		selector : 'bus_excel2gridshow #grdInfo',
		ref : 'grid'
	}],

	init : function() {
		this.control({
			'bus_excel2gridshow' : {
				btnClose : this.onBtnClose
			},
			'bus_excel2gridshow #btnShowImport' : {
				click : this.onImport
			}
		});
	},

	refreshGrid : function() {
		this.getGrid().store.reload();
	},

	onImport : function(form, addParams, url) {
		var self = this;
		SF.cf.callServiceForm({
			checkFormValid : true,
			form : this.getBaseForm(),
			url : 'business/excel2grid/uploadAndShow',
			showErrorMsg : true,
			showSuccessMsg : false,
			callback : function(action, success) {
				if (success) {
					self.showDataInGrid(action.response);
				} else {
					SF.alertError('错误', Ext.decode(action.response.responseText).msg);
				}
			},
			scope : this
		});
	},

	showDataInGrid : function(response) {
		var rs = Ext.decode(response.responseText);
		var gridStore = Ext.create('Ext.data.Store', {
			fields : rs.fields
		});
		this.getGrid().reconfigure(gridStore, rs.columns);
		gridStore.loadData(rs.content);
	},

	onBtnClose : function(view) {
		view.close();
	}

});