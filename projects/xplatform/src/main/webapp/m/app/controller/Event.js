Ext.define('MEStouch.controller.Event', {
    extend: 'Ext.app.Controller',
    requires: [
    'MEStouch.mixin.Setting'
    ],

    config: {
        refs: {
            event: 'event',
            form: 'event > #eventForm',
            lastTime: 'event > #eventForm [itemId=lastTime]',
            lastEvent: 'event > #eventForm [itemId=lastEvent]',
            resourceField: 'event > #eventForm [itemId=resource]',
			resourceHiddenField: 'event > #eventForm [name=resId]',
            eventField: 'event > #eventForm [name=eventId]',
            billingField: 'event > #eventForm [name=chgSts2]',
            mandayField: 'event > #eventForm [name=chgSts3]',
            moreButton: 'event > #eventForm [itemId=more]',
            startButton: 'event > #eventForm [itemId=start]',
            endButton: 'event > #eventForm [itemId=end]',
            resourceListButton: 'event > #eventForm button[itemId=resourcelist]'
        },

        control: {
            event: {
                initialize: 'onInit'
            },
            resourceHiddenField: {
                change: 'onResourceChanged'
            },
            resourceListButton: {
                tap: 'onResourceSelected'
            },
            moreButton: {
                tap: 'onButtonEventMore'
            },
            startButton: {
                tap: 'onButtonStart'
            },
            endButton: {
                tap: 'onButtonEnd'
            }
        }
    },

	refresh: function() {
		if(!this.getResourceHiddenField().getValue()) {
	        var defaultrc = MEStouch.setting.get('DefaultResource');
	        var rcname, rcnameDisp;

	        if (defaultrc) {
	            rcname = defaultrc;
	            rcnameDisp = MEStouch.setting.get('DefaultResourceDisp');
	        } else {
	            var lastrc = MEStouch.setting.get('LastResource');
	            if (lastrc) {
	            	rcname = lastrc.resId;
	            	rcnameDisp = lastrc.resDesc;
	            }
	        }

	        if (rcname) {
	            this.getResourceField().setValue(rcnameDisp);
				this.getResourceHiddenField().setValue(rcname);
	        }

		} else {
			this.refreshLastInfo();
		}
	},

    onInit: function() {
	    this.getResourceField().isField = true;
    
        var self = this;

		this.refresh();

		this.getEvent().on('painted', function() {
			self.refresh();
		});
		this.getEvent().on('pop', function() {
			self.refresh();
		});
    },

    onResourceSelected: function(field) {
        this.getEvent().push({
            xtype: 'reslist',
            displayTarget: this.getResourceField(),
			valueTarget: this.getResourceHiddenField(),
            navigationView: this.getEvent()
        });
    },

    onResourceChanged: function(field, value) {
        var self = this;
        var store = Ext.getStore('RasViewResourceOut');
        store.load({
            params: {
                procstep: '1',
                resId: value
            },
            callback: function(records) {
                var rc = records[0].data;

                MEStouch.setting.set('LastResource', rc);

               	self.getLastTime().setValue(rc.lastEventTime);
               	self.getLastEvent().setValue(self.getEventName(rc.lastEventId) || rc.lastEventId);
            }
        });
    },

	refreshLastInfo: function() {
        var self = this;
        var store = Ext.getStore('RasViewResourceOut');
        store.load({
            params: {
                procstep: '1',
                resId: this.getResourceHiddenField().getValue()
            },
            callback: function(records) {
                var rc = records[0].data;

                MEStouch.setting.set('LastResource', rc);

               	self.getLastTime().setValue(rc.lastEventTime);
               	self.getLastEvent().setValue(self.getEventName(rc.lastEventId) || rc.lastEventId);
            }
        });
	},

    onButtonEventMore: function(field) {
        if (this.getResourceField().getValue()) {
            this.getEvent().push({
                xtype: 'eventmore'
            });
        } else {
            Ext.Msg.alert(
            "필수입력",
            "상세모드로 이동하기 전에 리소스 아이디를 입력해주세요."
            );
        }
    },

    onButtonStart: function(field) {
		var self = this;
		
        this.getEventField().setValue('PM');
        this.getBillingField().setValue(MEStouch.setting.get('DefaultBilling') || 'Y');

        this.getForm().submit({
            url: 'service/rasResourceEvent.json',
            method: 'POST',
            success: function() {
                Ext.Msg.alert('PM', '정비 시작 요청이 처리되었습니다.');
				self.refreshLastInfo();
            },
            failure: function(form, response) {
				if(response && response.msg)
		            Ext.Msg.alert('오류(PM)', response.msg);
				else
	                Ext.Msg.alert('오류', '정비 시작 요청처리를 실패하였습니다.');
            }
        });


    },

    onButtonEnd: function(field) {
		var self = this;
		
        this.getEventField().setValue('PM_END');
        this.getBillingField().setValue(MEStouch.setting.get('DefaultBilling') || 'Y');

        this.getForm().submit({
            url: 'service/rasResourceEvent.json',
            method: 'POST',
            success: function() {
                Ext.Msg.alert('PM END', '정비 완료 요청 처리되었습니다.');
				self.refreshLastInfo();
            },
            failure: function(form, response) {
				if(response && response.msg)
		            Ext.Msg.alert('오류(PM END)', response.msg);
				else
	                Ext.Msg.alert('오류', '정비 완료 요청처리를 실패하였습니다.');
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