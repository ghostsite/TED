Ext.define('CMN.view.common.RowStatic', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.rowstatic',

	width : 23,

	sortable : false,

	align : 'left',

	constructor : function(config) {
		this.callParent(arguments);
	},

	// private
	resizable : false,
	hideable : false,
	menuDisabled : true,
	cls : Ext.baseCSSPrefix + 'row-numberer',

	// private
	renderer : function(value, metaData, record, rowIdx, colIdx, store) {
		metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
		return value;
	}
});