Ext.define('MEStouch.store.RasViewResourceOut', {
	extend : 'Ext.data.Store',
	config : {
		autoLoad : false,
		pageSize : 1000,
		model : 'MEStouch.model.RasViewResourceOut',
		proxy : {
			type : 'ajax',
			api : {
				read : 'service/RasViewResource.json'
			},
			actionMethods : {
				read : 'POST'
			},
			reader : {
				type : 'json'
			},
			extraParams : {
				procstep : '1'
			}
		}
	}
});