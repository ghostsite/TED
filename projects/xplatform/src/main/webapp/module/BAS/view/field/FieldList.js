Ext.define('BAS.view.field.FieldList', {
	extend : 'BAS.view.task.EntityList',

	title : T('Caption.Menu.Field List'),

	xtype : 'hbas_field_list',
	
	taskType : 'MST_FIELD',
	
	initComponent : function() {
		this.callParent();
	},

	buildSupplementTop : function() {
		return {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			defaults : {
				labelWidth : 80
			},
			items : [ {
				xtype : 'textfield',
				name : 'key1Like',
				fieldLabel : T('Caption.Other.Field Name')
			}, {
				xtype : 'textfield',
				name : 'data2',
				fieldLabel : T('Caption.Other.Field Type')
			} ]
		};
	},

	getEntityColumns : function() {
		var self = this;
		return [ {
			xtype : 'textactioncolumn',
			header : T('Caption.Other.Field Name'),
			dataIndex : 'key1',
			flex : 1,
			handler : function(grid, rowIndex) {
				self.fireEvent('entityview', self, grid.store.getAt(rowIndex).data);
			}
		}, {
			header : T('Caption.Other.Field Desc'),
			dataIndex : 'data1',
			flex : 2
		}, {
			header : T('Caption.Other.Field Type'),
			dataIndex : 'data2'
		} ];
	}
});