//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src',
	'MEStouch': 'app',
	'MEStouch.mixin': 'app/mixin'
});
//</debug>

Ext.define('MEStouch', {
	singleton : true,
	mixins : {
		setting : 'MEStouch.mixin.Setting',
		base64 : 'MEStouch.mixin.Base64'
	}
});

Date.prototype.toString = function() {
	return Ext.Date.format(this, 'Y-m-d H:i:s');
};

Ext.application({
    name: 'MEStouch',

    requires: [
        'Ext.MessageBox'
    ],

	controllers: ['Main', 'Login', 'Event', 'ResourceList', 'Setting', 'EventMore', 'EventList', 'ResourceHistory'],
    views: ['Login', 'TimePicker', 'TimePickerField', 'Main', 'ResourceList', 'ResourceHistory', 'EventList', 'Event', 'EventMore', 'Setting'],
	stores : ['RasViewResourceListOut', 'RasViewResourceOut', 'RasViewEventListOut', 'BasViewDataListOut', 'RasViewResourceHistoryOut', 'FilteredRasViewResourceListOut', 'FilteredBasViewDataListOut'],
	models : ['RasViewResourceListOut.resList', 'RasViewResourceOut', 'RasViewEventListOut.eventList', 'BasViewDataListOut.dataList', 'RasViewResourceHistoryOut.histList'],

    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },
    
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    launch: function() {

		Ext.Date.defaultFormat = 'Y-m-d H:i:s';

		this.autoLogin();
		
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "프로그램 업데이트",
            "이 프로그램이 새로운 버전을 다운로드하였습니다. 페이지를 새로 여시겠습니까?",
            function() {
                window.location.reload();
            }
        );
    },

	gotoLogin: function() {
		// TODO Confirm.
		Ext.Viewport.removeAll(true, false);
		Ext.Viewport.add(Ext.create('MEStouch.view.Login', {})).show();
	},
	
	gotoMain: function() {
		var count = 0;

		function forSync(records, operation, success) {
			if(!success) {
				Ext.Msg.confirm(
		            "서비스 오류",
		            "서비스가 원할하지 않습니다. 페이지를 새로 여십시오.",
		            function() {
		                window.location.reload();
		            }
		        );
			}
			if(++count === 3) {
				if(!MEStouch.setting.get('DefaultUser')) {
					// 등록된 리소스라면, 디폴트 리소스로 설정.
					var record = Ext.getStore('RasViewResourceListOut').findRecord('resId', MEStouch.setting.get('DefaultLogin'));
					if(record) {
						MEStouch.setting.set('DefaultResource', record.get('resId'));
						MEStouch.setting.set('DefaultResourceDisp', record.get('resDesc'));
					}
				}
				// TODO confirm
				Ext.Viewport.removeAll(true, false);
				Ext.Viewport.add(Ext.create('MEStouch.view.Main', {})).show();
			}
		}

		Ext.getStore('BasViewDataListOut').load(forSync);
		Ext.getStore('RasViewEventListOut').load(forSync);
		Ext.getStore('RasViewResourceListOut').load(forSync);
	},
	
	autoLogin: function() {
		var self = this;
		var login = MEStouch.setting.get('DefaultLogin');
		var pwd = MEStouch.base64.decode(MEStouch.setting.get('DefaultPassword'));
		var factory = MEStouch.setting.get('DefaultFactory');

		if(!login) {
			// Ext.Viewport.removeAll(true, false);
			// Ext.Viewport.add(Ext.create('MEStouch.view.Login', {}));
			self.gotoLogin();
			
			return;
		}
		
		Ext.Ajax.request({
			url : '../j_spring_security_check',
			method: 'POST',
			params: {
				j_username : login,
				j_password : pwd,
				j_factory : factory,
				j_language : 'ko'
			},
			success: function() {
				self.gotoMain();
			},
			failure: function() {
				self.gotoLogin();
			}
		})
	}
});
