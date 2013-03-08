Ext.define('MEStouch.store.RasViewResourceHistoryOut', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        pageSize: 20,
		// TODO Reverse Time Sort.

        model: 'MEStouch.model.RasViewResourceHistoryOut.histList',

        proxy: {
            type: 'ajax',
            api: {
                read: 'service/RasViewResourceHistory.json'
            },
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                rootProperty: 'histList'
            }
        }
    }
});