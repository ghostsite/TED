Ext.define('WMG.store.CommunicatorStore', {
	extend : 'Ext.data.Store',

	storeId : 'wmg.communicator_store',

	autoLoad : true,

	model : 'WMG.model.Communicator',

	proxy : {
		type : 'ajax',
		url : 'communicator/getOnLineUsers',
		reader : {
			type : 'json'
		}
	}
});