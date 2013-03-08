Ext.define('MEStouch.store.RasViewResourceListOut', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        pageSize: 1000,
        model: 'MEStouch.model.RasViewResourceListOut.resList',

        proxy: {
            type: 'ajax',
            api: {
                read: 'service/RasViewResourceList.json'
            },
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                rootProperty: 'resList'
            },
            extraParams: {
                procstep: '1'
            }
        },

		listeners : {
			load : function(store, data, success) {
				if(success)
					Ext.getStore('FilteredRasViewResourceListOut').setData(data);
			}
		}
    }

});