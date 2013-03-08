Ext.define('MES.store.ConvertWipViewSubStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	pageSize : 1000,
	model : 'MES.model.ConvertWipViewSubOut',
	proxy : {
		type : 'payload',
		api : {
			read : 'service/WipViewSublot.json'
		},
		actionMethods : {
			read : 'POST'
		},
		reader : {
			type : 'json'
		}
	}
});