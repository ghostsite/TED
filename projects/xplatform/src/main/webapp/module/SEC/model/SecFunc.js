Ext.define('SEC.model.SecFunc', {
	extend : 'Ext.data.Model',

	fields : [ {
		name : 'text',
		type : 'string'
	}, {
		name : 'leaf',
		type : 'boolean'
	}, {
		name : 'funcName',
		type : 'string'
	}, {
		name : 'funcDesc',
		type : 'string'
	}, {
		name : 'funcTypeFlag',
		type : 'string'
	}, {
		name : 'funcGroup',
		type : 'string'
	}, {
		name : 'assemblyFile',
		type : 'string'
	}, {
		name : 'path',
		type : 'string'
	}, {
		name : 'dispLevel',
		type : 'string'
	}, {
		name : 'separator',
		type : 'string'
	}, {
		name : 'shortCut',
		type : 'string'
	}, {
		name : 'iconIndex',
		type : 'int'
	}, {
		name : 'icon',
		type : 'string'
	}, {
		name : 'addToolBar',
		type : 'string'
	}]
});
