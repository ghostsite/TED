Ext.define('SEC.store.SecViewFuncTreeStore', {
	extend : 'Ext.data.TreeStore',

	autoLoad : false,

	model : 'SEC.model.SecFunc',

	// root : {
	// text : SmartFactory.login.factory,
	// expanded : true
	// },

	defaultRootId : SmartFactory.login.factory,

	proxy : {
		type : 'ajax',
		url : 'service/SecViewFunctionNodeList.json',
		reader : {
			type : 'json',
			root : 'list'
		},
		actionMethods : {
			read : 'GET'
		}
	}
});
