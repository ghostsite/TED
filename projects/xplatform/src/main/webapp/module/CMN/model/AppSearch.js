Ext.define('CMN.model.AppSearch', {
	extend : 'Ext.data.Model',

	fields : [ {
		name : 'kind',
		type : 'string'
	}, {
		name : 'key',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'desc',
		type : 'string'
	}, {
		name : 'item',
		type : 'auto'
	}, {
		name : 'handler',
		type : 'function'
	} ]
});
