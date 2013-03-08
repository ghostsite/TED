Ext.define('MES.view.form.field.FixedColumn', {
	extend : 'Ext.grid.column.Column',
	
	alias : 'widget.fixedcolumn',
	
	renderer : function(value, metaData, record, rowIndex, colIndex){
		var precision = this.columns[colIndex].precision || 0;
		return Ext.Number.toFixed(parseFloat(value), precision);
	}
});