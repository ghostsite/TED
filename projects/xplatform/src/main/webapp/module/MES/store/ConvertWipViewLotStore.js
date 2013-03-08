Ext.define('MES.store.ConvertWipViewLotStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	pageSize : 1000,
	model : 'MES.model.ConvertWipViewLotOut',
	proxy : {
		type : 'payload',
		api : {
			read : 'service/WipViewLot.json'
		},
		actionMethods : {
			read : 'POST'
		},
		reader : {
			type : 'json'
		}
	}
});