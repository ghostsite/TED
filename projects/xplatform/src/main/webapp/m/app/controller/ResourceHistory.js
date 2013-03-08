Ext.define('MEStouch.controller.ResourceHistory', {
	extend: 'Ext.app.Controller',
	
	requires: [
    'MEStouch.mixin.Setting'
    ],

    config: {
        refs: {
            reshistory: 'reshistory'
        },

        control: {
            reshistory: {
                activate: 'onActivate'
            }
        }
    },

	onActivate: function() {
		// this.getReshistory().removeAll();
		var self = this;

		if(!MEStouch.setting.get('LastResource'))
			return;

		var store = Ext.getStore('RasViewResourceHistoryOut');

		var now = new Date();
		var to = Ext.Date.format(now, 'YmdHis');

		now.setFullYear(now.getFullYear() - 1);
		var from = Ext.Date.format(now, 'YmdHis');
		
		store.load({
			params : {
				procstep: '1',
				resId: MEStouch.setting.get('LastResource').resId,
				nextHistSeq: 2147483647,
				fromTime: from,
				toTime: to,
				includeDelHist: ' '
			}, 
			callback : function(records, operation, success) {
				if(!success) {
					Ext.Msg.alert('서비스 오류', '이력 정보를 가져오지 못했습니다.');
					return;
				}
				
				if(records.length == 0) {
					Ext.Msg.alert('이력정보', '최근 이력이 없습니다.');
				} else {
					Ext.Array.each(records, function(record) {
						var event = record.get('eventId');
						record.set('eventId', self.getEventName(event) || event);
					});
				}
			}
		});
	},
	
	getEventName: function(eventId) {
		if(!eventId)
			return '';
		var store = Ext.getStore('RasViewEventListOut');
		var record = store.findRecord('eventId', eventId);
		if(record)
			return record.get('eventDesc');
		return '';
	},
	
	getResourceName: function(resId) {
		if(!resId)
			return '';
		var store = Ext.getStore('RasViewResourceListOut');
		var record = store.findRecord('resId', resId);
		if(record)
			return record.get('resDesc');
		return '';
	}
});