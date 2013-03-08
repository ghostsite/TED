Ext.define('CMN.model.MainMenu', {
	extend : 'Ext.data.Model',

	fields : [ {
		//국제화 추가
		name : 'text',
		type : 'string',
		convert: function(value, record) {
			return T('Caption.Menu.' + record.get('code'));
		}
	}, {
		name : 'leaf',
		type : 'boolean'
	}, {
		name : 'funcName',
		type : 'string'
	}, {
		//국제화 추가
		name : 'funcDesc',
		type : 'string',
		convert: function(value, record) {
			return T('Caption.Menu.' + value);
		}
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
		name : 'code',
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
		name : 'addToolBar',
		type : 'string'
	}]
});
