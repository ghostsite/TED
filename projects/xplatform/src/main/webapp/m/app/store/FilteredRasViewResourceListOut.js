Ext.define('MEStouch.store.FilteredRasViewResourceListOut', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        pageSize: 1000,
        model: 'MEStouch.model.RasViewResourceListOut.resList'
    }
});