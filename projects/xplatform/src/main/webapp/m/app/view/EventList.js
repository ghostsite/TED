Ext.define('MEStouch.view.EventList', {
	extend : 'Ext.List',
	xtype : 'eventlist',
	config : {
	    itemTpl: '{eventId}-{eventDesc}',
		title : '이벤트 선택',
	    store : 'RasViewEventListOut'
	}
});
