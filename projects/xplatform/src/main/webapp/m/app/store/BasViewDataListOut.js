Ext.define('MEStouch.store.BasViewDataListOut', {
	extend : 'Ext.data.Store',
	config : {
		autoLoad : false,
		pageSize : 1000,
		model : 'MEStouch.model.BasViewDataListOut.dataList',
		proxy : {
			type : 'ajax',
			api : {
				read : 'service/BasViewDataList.json'
			},
			actionMethods : {
				read : 'POST'
			},
			reader : {
				type : 'json',
				rootProperty : 'dataList'
			},
			extraParams : {
				procstep : '1',
				tableName : 'RES_GRP_1'
			}
		},

		listeners : {
			load : function(store, data, success) {
				if(success)
					Ext.getStore('FilteredBasViewDataListOut').setData(data);
			}
		}
	}
});