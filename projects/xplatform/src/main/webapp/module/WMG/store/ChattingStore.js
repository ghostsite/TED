Ext.define('WMG.store.ChattingStore', {
	extend : 'Ext.data.Store',
	
	storeId : 'chat_store',
	
	fields : [{
		name : 'name',
		type : 'string'
	}, {
		name : 'time',
		type : 'string'
	}, {
		name : 'content',
		type : 'string'
	}, {
		name : 'itsme',
		type : 'boolean'
	}]
});