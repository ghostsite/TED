Ext.define('TES.view.Printer', {
	extend : 'MES.view.form.BaseForm',
	title : 'Printer',
	xtype : 'tes_printer',

	initComponent : function() {
		this.callParent();
	},

	buildForm : function() {

		// sample static data for the store
		var myData = [['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am'], ['Alcoa Inc', 29.01, 0.42, 1.47, '9/1 12:00am'], ['Altria Group Inc', 83.81, 0.28, 0.34, '9/1 12:00am'], ['American Express Company', 52.55, 0.01, 0.02, '9/1 12:00am'], ['American International Group, Inc.', 64.13, 0.31, 0.49, '9/1 12:00am'], ['AT&T Inc.', 31.61, -0.48, -1.54, '9/1 12:00am'], ['Boeing Co.', 75.43, 0.53, 0.71, '9/1 12:00am'], ['Caterpillar Inc.', 67.27, 0.92, 1.39, '9/1 12:00am'], ['Citigroup, Inc.', 49.37, 0.02, 0.04, '9/1 12:00am'], ['E.I. du Pont de Nemours and Company', 40.48, 0.51, 1.28, '9/1 12:00am'], ['Exxon Mobil Corp', 68.1, -0.43, -0.64, '9/1 12:00am'], ['General Electric Company', 34.14, -0.08, -0.23, '9/1 12:00am'], ['General Motors Corporation', 30.27, 1.09, 3.74, '9/1 12:00am'], ['Hewlett-Packard Co.', 36.53, -0.03, -0.08, '9/1 12:00am'], ['Honeywell Intl Inc', 38.77, 0.05, 0.13, '9/1 12:00am'], ['Intel Corporation', 19.88, 0.31, 1.58, '9/1 12:00am'], ['International Business Machines', 81.41, 0.44, 0.54, '9/1 12:00am'], ['Johnson & Johnson', 64.72, 0.06, 0.09, '9/1 12:00am'], ['JP Morgan & Chase & Co', 45.73, 0.07, 0.15, '9/1 12:00am'], ['McDonald\'s Corporation', 36.76, 0.86, 2.40, '9/1 12:00am'], ['Merck & Co., Inc.', 40.96, 0.41, 1.01, '9/1 12:00am'], ['Microsoft Corporation', 25.84, 0.14, 0.54, '9/1 12:00am'], ['Pfizer Inc', 27.96, 0.4, 1.45, '9/1 12:00am'], ['The Coca-Cola Company', 45.07, 0.26, 0.58, '9/1 12:00am'], ['The Home Depot, Inc.', 34.64, 0.35, 1.02, '9/1 12:00am'], ['The Procter & Gamble Company', 61.91, 0.01, 0.02, '9/1 12:00am'], ['United Technologies Corporation', 63.26, 0.55, 0.88, '9/1 12:00am'], ['Verizon Communications', 35.57, 0.39, 1.11, '9/1 12:00am'], ['Wal-Mart Stores, Inc.', 45.45, 0.73, 1.63, '9/1 12:00am']];

		/**
		 * Custom function used for column renderer
		 * 
		 * @param {Object}
		 *            val
		 */
		function change(val) {
			if (val > 0) {
				return '<span style="color:green;">' + val + '</span>';
			} else if (val < 0) {
				return '<span style="color:red;">' + val + '</span>';
			}
			return val;
		}

		/**
		 * Custom function used for column renderer
		 * 
		 * @param {Object}
		 *            val
		 */
		function pctChange(val) {
			if (val > 0) {
				return '<span style="color:green;">' + val + '%</span>';
			} else if (val < 0) {
				return '<span style="color:red;">' + val + '%</span>';
			}
			return val;
		}

		// create the data store
		var store = Ext.create('Ext.data.ArrayStore', {
			fields : [{
				name : 'company'
			}, {
				name : 'price',
				type : 'float'
			}, {
				name : 'change',
				type : 'float'
			}, {
				name : 'pctChange',
				type : 'float'
			}, {
				name : 'lastChange',
				type : 'date',
				dateFormat : 'n/j h:ia'
			}],
			data : myData
		});

		// //////////////////////////////////////////////////////////////////////////////////////
		// Grid 1
		// //////////////////////////////////////////////////////////////////////////////////////
		// create the Grid
		var grid = Ext.create('Ext.grid.Panel', {
			cls : 'marginT7',
			store : store,
			stateful : true,
			stateId : 'stateGrid',
			columns : [{
				text : 'Company',
				flex : 1,
				sortable : false,
				dataIndex : 'company'
			}, {
				text : 'Price',
				width : 75,
				sortable : true,
				renderer : 'usMoney',
				dataIndex : 'price'
			}, {
				text : 'Change',
				width : 75,
				sortable : true,
				renderer : change,
				dataIndex : 'change'
			}, {
				text : '% Change',
				width : 75,
				sortable : true,
				renderer : pctChange,
				dataIndex : 'pctChange'
			}, {
				text : 'Last Updated',
				width : 85,
				sortable : true,
				renderer : Ext.util.Format.dateRenderer('m/d/Y'),
				dataIndex : 'lastChange'
			}],
			height : 350,
			width : '100%',
			title : 'Array Grid with Print Option',
			tbar : [{
				text : 'Print',
				iconCls : 'icon-print',
				handler : function() {
					Ext.ux.grid.Printer.printAutomatically = false;
					Ext.ux.grid.Printer.print(grid);
				}
			}]
		});

		// //////////////////////////////////////////////////////////////////////////////////////
		// Grid 2
		// //////////////////////////////////////////////////////////////////////////////////////
		var grid2 = Ext.create('Ext.grid.Panel', {
			cls : 'marginT7',
			store : store,
			columns : [Ext.create('Ext.grid.RowNumberer'), {
				text : "Company",
				flex : 1,
				sortable : true,
				dataIndex : 'company'
			}, {
				text : "Price",
				width : 120,
				sortable : true,
				renderer : Ext.util.Format.usMoney,
				dataIndex : 'price'
			}, {
				text : "Change",
				width : 120,
				sortable : true,
				dataIndex : 'change'
			}, {
				text : "% Change",
				width : 120,
				sortable : true,
				dataIndex : 'pctChange'
			}, {
				text : "Last Updated",
				width : 120,
				sortable : true,
				renderer : Ext.util.Format.dateRenderer('m/d/Y'),
				dataIndex : 'lastChange'
			}],
			columnLines : true,
			width : '100%',
			height : 300,
			title : 'Grid with Numbered Rows',
			tbar : [{
				text : 'Print',
				iconCls : 'icon-print',
				handler : function() {
					Ext.ux.grid.Printer.printAutomatically = false;
					Ext.ux.grid.Printer.print(grid2);
				}
			}]
		});

		// //////////////////////////////////////////////////////////////////////////////////////
		// Grid 3
		// //////////////////////////////////////////////////////////////////////////////////////
		Ext.create('Ext.data.Store', {

			storeId : 'employeeStore',
			fields : ['firstname', 'lastname', 'seniority', 'department'],
			groupField : 'department',
			data : [{
				firstname : "Michael",
				lastname : "Scott",
				seniority : 7,
				department : "Management"
			}, {
				firstname : "Dwight",
				lastname : "Schrute",
				seniority : 2,
				department : "Sales"
			}, {
				firstname : "Jim",
				lastname : "Halpert",
				seniority : 3,
				department : "Sales"
			}, {
				firstname : "Kevin",
				lastname : "Malone",
				seniority : 4,
				department : "Accounting"
			}, {
				firstname : "Angela",
				lastname : "Martin",
				seniority : 5,
				department : "Accounting"
			}]
		});

		var grid3 = Ext.create('Ext.grid.Panel', {
			cls : 'marginT7',
			border: true,
			title : 'Column Template Demo',
			store : Ext.data.StoreManager.lookup('employeeStore'),
			columns : [{
				text : 'Full Name',
				xtype : 'templatecolumn',
				tpl : '{firstname} {lastname}',
				flex : 1
			}, {
				text : 'Department (Yrs)',
				xtype : 'templatecolumn',
				tpl : '{department} ({seniority})'
			}],
			height : 200,
			width : '100%',
			tbar : [{
				text : 'Print',
				iconCls : 'icon-print',
				handler : function() {
					Ext.ux.grid.Printer.printAutomatically = false;
					Ext.ux.grid.Printer.print(grid3);
				}
			}]
		});

		return {
			xtype : 'container',
			layout : 'vbox',
			items : [grid, grid2, grid3]
		}
	}
});