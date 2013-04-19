// 由于这个是继承关系，只能合着写一个model，用哪个java类都不合适。
Ext.define('SYS.model.NameRuleItem', {
	extend : 'Ext.data.Model',

	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'category',
		type : 'string'
	}, {
		name : 'idx',
		type : 'int'
	}, {
		name : 'prefix',
		type : 'string'
	}, {
		name : 'dateFormat',
		type : 'string'
	}, {
		name : 'seqFormat',
		type : 'string'
	}, {
		name : 'initValue',
		type : 'int'
	}, {
		name : 'currentValue',
		type : 'int'
	}, {
		name : 'step',
		type : 'int'
	}]
});
