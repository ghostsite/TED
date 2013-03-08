Ext.define('MEStouch.model.RasViewResourceListOut.resList', {
	extend : 'Ext.data.Model',
	config : {
		fields : [ {
			name : 'resId',
			type : 'string'
		}, {
			name : 'resDesc',
			type : 'string'
		}, {
			name : 'scheduleEnableFlag',
			type : 'string'
		}, {
			name : 'eventEnableFlag',
			type : 'string'
		}, {
			name : 'deleteFlag',
			type : 'string'
		}, {
			name : 'resUpDownFlag',
			type : 'string'
		} ]
	}
});