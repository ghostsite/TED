Ext.define('Opc.mixin.Alarm', function() {
	
	// checkAlarmCount()
	// - tray알람정보와 web storage에 데이터를 set하는 function
	function checkAlarmCount() {
		var alarmStore = Ext.getStore('ALM.store.AlarmStore');
		var count = 0;
		var storageData = [];
		// confirmFlag 확인안한 alarm들 갯수 체크
		Ext.Array.each(alarmStore.data.items, function(item) {
			if (item.data.confirmFlag != 'Y')
				count++;
		});
		// alm_tray_carousel data초기화
		Ext.getCmp('alm_tray_carousel').setData([]);
		Ext.getCmp('alm_tray_count').setText(count); // tray 카운트 셋
		if (count == 0) { // 확인안한 알람이 없으면 원래되로
			Ext.getCmp('alm_tray_carousel').setWidth(0);
			Ext.getCmp('alm_tray_count').setVisible(false);
		} else {
			var data = [];

			Ext.getCmp('alm_tray_carousel').setWidth(300);

			Ext.Array.each(alarmStore.data.items, function(item) {
				var date = Ext.Date.parse(item.data.createTime, 'YmdHis');
				if (item.data.confirmFlag != 'Y') {
					data.push({
						time : Ext.Date.format(date, 'H:i'),
						text : item.data.alarmMsg
					});
				}
			});
			Ext.getCmp('alm_tray_carousel').setData(data);
			Ext.getCmp('alm_tray_count').setVisible(true);
		}

		Ext.Array.each(alarmStore.data.items, function(item) {
			storageData.push(item.data);
		});
		SmartFactory.setting.set('alarm', null);
		SmartFactory.setting.set('alarm', storageData);
	}

	return {
		alarm : {
			checkAlarmCount : checkAlarmCount
		}
	};
}());
