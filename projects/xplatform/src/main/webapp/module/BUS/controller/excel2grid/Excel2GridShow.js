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
		var rs = response.responseObj || Ext.decode(response.responseText) || {};
		var gridStore = Ext.create('Ext.data.Store', {
			fields : rs.fields
		});
		this.getGrid().reconfigure(gridStore, rs.columns);
		gridStore.loadData(rs.content);

		this.buildFilter(rs);
	},

	onBtnClose : function(view) {
		view.close();
	},

	// 创建下面的过滤的textfield,跟CodeViewPopup不同,这个要根据返回的值来生成
	buildFilter : function(rs) { // rs.columns, rs.fields, rs.content
		var self = this;
		var columns = rs.columns;
		var fieldset = rs.fields;
		var items = [];
		for (var i in columns) {
			var column = columns[i];
			// column.dataIndex 컬럼명
			items.push({
				listeners : {
					specialkey : function(textfield, e) {
						if (e.getKey() == e.ENTER) {
							self.doFilter(textfield);
						}
					},
					change : function(textfield, val) {
						//self.doFilter(textfield, val);
					}
				},
				xtype : 'textfield',
				name : column.dataIndex,
				hideLabel : true,
				emptyText : column.header,
				height: 20,
				flex:1
			});
		}
		
		this.getBaseForm().sub('formId').add({
			xtype : 'panel',
			height : 39,
			cls : 'windowSearchField',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			itemId : 'searchFields',
			items : items
		});
		
	},

	doFilter : function(textfield) {
		if(textfield.getValue()){
			this.getGrid().store.filter(textfield.name, textfield.getValue());
		}else{
			this.getGrid().store.clearFilter();
		}
	}

});