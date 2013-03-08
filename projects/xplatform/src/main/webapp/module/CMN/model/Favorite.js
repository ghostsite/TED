Ext.define('CMN.model.Favorite', {
	extend : 'Ext.data.Model',

	fields : [ {
		name : 'seqNum',
		type : 'string'
	}, {
		name : 'funcName',
		type : 'string'
	}, {
		name : 'userFuncDesc',
		type : 'string'
	}, {
		//국제화 desc추가
		name : 'funcDesc',
		type : 'string',
		convert : function(value, record) {
			return T('Caption.Menu.'+ record.get('userFuncDesc'));
		}
	}, {
		name : 'assemblyFile',
		type : 'string'
	}, {
		name : 'path',
		type : 'string'
	}, {
		name : 'iconIndex',
		type : 'int'
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
