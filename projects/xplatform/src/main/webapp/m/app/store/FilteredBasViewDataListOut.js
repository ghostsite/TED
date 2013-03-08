Ext.define('MEStouch.store.FilteredBasViewDataListOut', {
	extend : 'Ext.data.Store',
	config : {
		autoLoad : false,
		pageSize : 1000,
		model : 'MEStouch.model.BasViewDataListOut.dataList'
	}
});