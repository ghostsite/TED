Ext.define('CMN.model.Log', {
	extend : 'Ext.data.Model',

	fields : [ {
		name : 'level',
		type : 'string'
	}, {
		name : 'code',
		type : 'string'
	}, {
		name : 'issueDate',
		type : 'date',
		dateFormat : 'Y-m-d h:i:s'
	}, {
		name : 'params',
		type : 'auto'
	}, {
		name : 'ex',
		type : 'auto'
	},{
		name : 'confirmedFlag',
		type : 'boolean',
		defaultValue : false
	} ]
});