Ext.define('MEStouch.store.RasViewEventListOut', {
	extend : 'Ext.data.Store',
	config : {
		autoLoad : false,
		pageSize : 1000,
		model : 'MEStouch.model.RasViewEventListOut.eventList',
		proxy : {
			type : 'ajax',
			api : {
				read : 'service/RasViewEventList.json'
			},
			actionMethods : {
				read : 'POST'
			},
			reader : {
				type : 'json',
				rootProperty : 'eventList'
			},
			extraParams : {
				procstep : '1'
			}
		},
		listeners : {
			load : function(store) {
				store.insert(0, {
					eventId : '',
					eventDesc : ''
				});
			}
		}
	}
});