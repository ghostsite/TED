Ext.define('BUS.view.excel2grid.Excel2GridShow', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.BUS.view.excel2grid.Excel2GridShow'),
	xtype : 'bus_excel2gridshow',

	layout : 'fit',

	addBtnShowImport : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '导入',
			itemId : 'btnShowImport',
			handler : function(t, e) {
				me.fireEvent('btnShowImport', t, e);
			}
		}
	},

	initComponent : function() {
		this.callParent();

		var basebuttons = this.getButtons();
		basebuttons.insert(1, this.addBtnShowImport());

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function() {
		var self = this;

		return {
			xtype : 'container',
			itemId : 'formId',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'fieldcontainer',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				defaults : {
					flex : 1,
					labelWidth : 60
				},
				items : [{
					xtype : 'filefield',
					fieldLabel : T('Caption.Other.File'),
					emptyText : '选择Excel,模板webapp/resources/data/tes/excel2grid.xls',
					labelWidth : 130,
					flex : 1,
					buttonText : '',
					buttonConfig : {
						iconCls : 'upload-icon'
					},
					itemId : 'excelField',
					name : 'excelField'
				}]
			}, {
				xtype : 'grid',
				flex : 1,
				title : '',
				itemId : 'grdInfo',
				cls : 'navyGrid',
				autoScroll : true,
				forceFit : true,
				columnLines : true,
				store : '',
				columns : []
			}]
		};
	}

});
