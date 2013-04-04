Ext.define('TES.view.Exporter', {
	extend : 'MES.view.form.BaseForm',
	title : 'Exporter',
	xtype : 'tes_exporter',

	initComponent : function() {
		this.callParent();
	},

	createFakeData : function(count) {
		var firstNames = ['Ed', 'Tommy', 'Aaron', 'Abe', 'Jamie', 'Adam', 'Dave', 'David', 'Jay', 'Nicolas', 'Nige'], lastNames = ['Spencer', 'Maintz', 'Conran', 'Elias', 'Avins', 'Mishcon', 'Kaneda', 'Davis', 'Robinson', 'Ferrero', 'White'], ratings = [1, 2, 3, 4, 5], salaries = [100, 400, 900, 1500, 1000000];

		var data = [];
		for (var i = 0; i < (count || 25); i++) {
			var ratingId = Math.floor(Math.random() * ratings.length), salaryId = Math.floor(Math.random() * salaries.length), firstNameId = Math.floor(Math.random() * firstNames.length), lastNameId = Math.floor(Math.random() * lastNames.length),

			rating = ratings[ratingId], salary = salaries[salaryId], name = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

			data.push({
				id : 'rec-' + i,
				rating : 'abc',
				salary : '你好',
				name : name
			});
		}
		return data;
	},
	buildForm : function() {
		Ext.define('Employee', {
			extend : 'Ext.data.Model',
			fields : [{
				name : 'rating',
				type : 'string'
			}, {
				name : 'salary',
				type : 'string'
			}, {
				name : 'name'
			}]
		});

		var store = Ext.create('Ext.data.Store', {
			id : 'store',
			data : this.createFakeData(50),
			model : 'Employee',
			proxy : {
				type : 'memory'
			}
		});

		var jumpToRow = function() {
			var fld = grid.down('#gotoLine');
			if (fld.isValid()) {
				grid.view.bufferedRenderer.scrollTo(fld.getValue() - 1, true);
			}
		};

		var grid = Ext.create('Ext.grid.Panel', {
			width : 700,
			height : 500,
			title : 'Bufffered Grid of 5,000 random records',
			store : store,
			loadMask : true,
			plugins : 'bufferedrenderer',
			selModel : {
				pruneRemoved : false
			},
			viewConfig : {
				trackOver : false
			},

			dockedItems : [{
				xtype : 'toolbar',
				dock : 'top',
				items : [{
					xtype : 'exporterbutton',
					downloadName:'导出的Excel'
				}]
			}],

			features : [{
				ftype : 'groupingsummary',
				groupHeaderTpl : 'All staff on {name:usMoney}',
				showSummaryRow : false
			}],
			// grid columns
			columns : [{
				xtype : 'rownumberer',
				width : 40,
				sortable : false
			}, {
				text : 'Name',
				flex : 1,
				sortable : true,
				dataIndex : 'name',
				groupable : false
			}, {
				text : 'Rating',
				width : 125,
				sortable : true,
				dataIndex : 'rating',
				groupable : false
			}, {
				text : 'Salary',
				width : 125,
				sortable : true,
				dataIndex : 'salary',
				align : 'right'
			}],
			bbar : [{
				labelWidth : 70,
				fieldLabel : 'Jump to row',
				xtype : 'numberfield',
				minValue : 1,
				maxValue : store.getTotalCount(),
				allowDecimals : false,
				itemId : 'gotoLine',
				enableKeyEvents : true,
				listeners : {
					specialkey : function(field, e) {
						if (e.getKey() === e.ENTER) {
							jumpToRow();
						}
					}
				}
			}, {
				text : 'Go',
				handler : jumpToRow
			}]
		});

		return grid;

	}
});