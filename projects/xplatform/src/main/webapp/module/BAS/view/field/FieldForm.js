Ext.define('BAS.view.field.FieldForm', {
	extend : 'Ext.form.Panel',

	title : T('Caption.Menu.Field Form'),

	bodyCls : 'borderRNone borderLNone borderBNone',
	
	initComponent : function() {
		this.items = [ {
			xtype : 'textfield',
			hidden : true,
			name : 'procstep'
		}, {
			xtype : 'textfield',
			hidden : true,
			name : 'tableName',
			value : 'MST_FIELD'
		}, {
			xtype : 'textfield',
			fieldLabel : 'Field Name',
			labelStyle : 'font-weight:bold',
			allowBlank : false,
			maxLength : 20,
			enforceMaxLength : true,
			name : 'key1'
		}, {
			xtype : 'textfield',
			fieldLabel : 'Description',
			maxLength : 100,
			enforceMaxLength : true,
			name : 'data1'
		}, {
			xtype : 'textfield',
			fieldLabel : 'Field Type',
			maxLength : 20,
			enforceMaxLength : true,
			name : 'data2'
		} ];

		this.callParent();
	}
});
