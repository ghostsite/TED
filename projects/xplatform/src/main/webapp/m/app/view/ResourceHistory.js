Ext.define('MEStouch.view.ResourceHistory', {
	extend : 'Ext.List',
	
	xtype : 'reshistory',
	
	config : {
	    itemTpl: [
			'<div class="lastEventId">{eventId}</div>',
			'<div class="lastEventInfo">{tranTime}<span>{newPriSts} - {newSts1}</span></div>'
		],
	    store : 'RasViewResourceHistoryOut'
	}
});
