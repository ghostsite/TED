Ext.define('Opc.controller.ApplicationController', {
	extend : 'Ext.app.Controller',
	
	requires : [
	        	'SmartFactory',
	        	'mixin.Communicator',
	            'Opc.mixin.Agent', 
	            'Opc.mixin.BarcodePrint', 
	            'Opc.mixin.ElectronicScale',
	            'Opc.mixin.Navigation',
	            'Opc.mixin.Status',
	        	'Opc.mixin.Custom',
	            'CMN.mixin.Vtypes',
	        	'MES.mixin.CodeView',
	        	'MES.mixin.Constant',
	        	'MES.mixin.CommonFunction',
	        	'CMN.data.proxy.PayloadProxy',
	            'MES.data.CodeViewRegister', 
	            'MES.view.window.CodeViewPopup',
	            'CMN.view.form.DatePeriodField',
	            'ALM.view.component.TextCarousel'
	           ],
	
   	models : ['ALM.model.AlarmModel', 'CMN.model.Log'],
	stores : ['ALM.store.AlarmStore', 'CMN.store.LogStore'],
	views : [
	         'MES.view.form.field.CodeViewField',
	         'CMN.view.form.DatePeriodField'
	        ],
	
	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});

		SF.mixin('CMN.mixin.Vtypes');
		SF.mixin('MES.mixin.Constant');
		SF.mixin('MES.mixin.CodeView');
		SF.mixin('MES.mixin.CommonFunction');
		
		Ext.create('MES.data.CodeViewRegister');
		SF.mixin('Opc.mixin.Status');
		SF.mixin('Opc.mixin.Agent');
		SF.mixin('Opc.mixin.BarcodePrint');
		SF.mixin('Opc.mixin.ElectronicScale');
		SF.mixin('Opc.mixin.Navigation');
		SF.mixin('Opc.mixin.Custom');
		
		// CodeViewPopup의 크기를 조정한다.
		MES.view.window.CodeViewPopup.override({
			width : 800,
			height : 600
		});
		
		// Communicator mixin 등록 및 접속/해제 이벤트 처리
		SF.mixin('mixin.Communicator', {
			memberJoinedIn : function(message) {
				SF.msg('Joined in.', message.data.username);
				Ext.getCmp('serverIndicator').removeCls('off');
			},
			memberJoinedOut : function(message) {
				SF.msg('Joined out.', message.data.username);
				Ext.getCmp('serverIndicator').addCls('off');
			}
		});
	},
	
	onViewportRendered : function() {

		/* Load시에 사용한 로드 프로그레스바를 제거함 */
		var lp = document.getElementById('_loadprogress');
		if(lp)
			document.body.removeChild(lp);
		
		/* Alarm Facility Setup */
		var store = Ext.getStore('ALM.store.AlarmStore');

		if(sessionInfo.messagingLocation){
			SF.communicator.join(sessionInfo.messagingLocation);

			Ext.Array.each(sessionInfo.almChannels, function(channel){
				SmartFactory.communicator.subscribe(channel, function(message) {
					var data = Ext.JSON.decode(message.data.toString());
					//file 유뮤 
					if(!data.fileinfo){
						data.fileId = data.fileinfo[0].fileId;
					}

					store.add(data); //store에 저장
					SmartFactory.msg('Alarm', data.alarmMsg); //좌측하단에 알람 표시
					SF.alarm.checkAlarmCount(); // tray정보 변경
				});
			});
		}

		//시작시 web storage에 저장된 alarm 정보 가져온다.
		if(SmartFactory.setting.get('alarm') != null){
			Ext.Array.each(SmartFactory.setting.get('alarm'), function(record){
				store.add(record);
			});
			SF.alarm.checkAlarmCount(); // tray 정보 변경
		}
	}
});