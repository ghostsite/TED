Ext.define('CMN.model.Favorite', { //zhang changed
	extend : 'Ext.data.Model',

	fields : [ {
		name : 'idx',
		type : 'int'
	}, {
		name : 'code',
		type : 'string'
	}, {
		name : 'text',
		type : 'string'
	}, {
		name : 'path',
		type : 'string'
	}, {
		name : 'icon',
		type : 'string'
	}, {
		name : 'icon2',
		type : 'string'
	}, {
		name : 'icon3',
		type : 'string'
	}, {
		name : 'qtip',
		type : 'string'
	} ]
});
