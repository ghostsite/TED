Ext.require(['mixin.Communicator']);

Ext.define('ALM.controller.ALMController', {
	extend : 'Ext.app.Controller',

	stores : [ 'ALM.store.AlarmStore' ],
	models : [ 'ALM.model.AlarmModel' ],
	views : [ 'ALM.view.inquiry.ViewPublishMessage', 'ALM.view.transaction.RaiseAlarm', 'ALM.view.component.TextCarousel'],
	
	init : function() {

		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});
	},
		
	onViewportRendered : function() {
		
		this.setStatusBar();
		
		if(SF.session.get('almChannels')) {
			this.setAlarmSubscriptions(SF.session.get('almChannels'));
		} else {
			SF.session.on('almChannels', function(id, val, old) {
				this.setAlarmSubscriptions(val);
			}, this);
		}

		if(SF.setting.get('alarm') != null){
			Ext.getStore('ALM.store.AlarmStore').loadRawData(SF.setting.get('alarm'));
			setTimeout(function() {
				/* 
				 * 최초 화면 로딩 후 1초 정도 지연해서 Tray의 알람 정보를 갱신한다.
				 * (Tray내에 알람관련 컴포넌트들이 완전하게 추가된 이후에 처리하도록 보장한다.) 
				 **/
				SF.cf.checkAlarmCount(); // tray 정보 변경
			}, 1000);
		}
	},
	
	setAlarmSubscriptions : function(channels) {
		Ext.Array.each(channels, function(channel){
			SmartFactory.communicator.subscribe(channel, function(message) {
				var data = Ext.JSON.decode(message.data.toString());
				//file 유뮤 
				if(data.fileinfo != undefined){
					data.fileId = data.fileinfo[0].fileId;
				}
				//날자 형식 변경 
				//data.createTime = Ext.Date.parse(data.createTime, 'YmdHis');								
				Ext.getStore('ALM.store.AlarmStore').add(data); //store에 저장
				SmartFactory.msg('Alarm', data.alarmMsg); //좌측하단에 알람 표시
				SF.cf.checkAlarmCount(); // tray정보 변경
			});
		});
	},
	
	setStatusBar : function() {
		// tray icon 추가
		SF.status.tray([ {
			xtype : 'textcarousel',
			id : 'alm_tray_carousel',
			cls : 'trayNotice',
			iconCls : 'trayNoticeIcon',
			data : [],
			width : 22,
			listeners : {
				click : function(carousel, alarm) {
					if (alarm) {
						SmartFactory.msg('Alarm Clicked', alarm.text);
					}
					SF.doMenu({
						viewModel : 'ALM.view.inquiry.ViewPublishMessage'
					});
				}
			}
		}, {
			xtype : 'button',
			id : 'alm_tray_count',
			cls : 'trayNotice',
			hidden : true,
			handler : function() {
				SF.doMenu({
					viewModel : 'ALM.view.inquiry.ViewPublishMessage'
				});
			}
		}],3);
	}
});