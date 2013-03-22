Ext.define('SEC.store.SecViewFunctionListOut.list', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	pageSize : 1000,
	//model : 'SEC.model.SecViewFunctionListOut.list', zhang recommented 20130322
	proxy : {
		type : 'payload',
		api : {
			read : 'service/SecViewFunctionList.json'
		},
		actionMethods : {
			read : 'POST'
		},
		reader : {
			type : 'json',
			root : 'list'
		}
	}
});