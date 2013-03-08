/**
 * @class CMN.mixin.Status
 * 
 */
Ext.define('CMN.mixin.Status', {
	constructor : function(config) {
		var _status;
		var _fake = {
			setStatus : Ext.emptyFn,
			showBusy : Ext.emptyFn,
			clearStatus : Ext.emptyFn,
			add : Ext.emptyFn
		};
		
		function status() {
			if(!_status)
				_status = Ext.getCmp('status');
			return _status || _fake;
		}
		
		function set(state) {
			status().setStatus(state);
		}
		
		function get(itemId) {
			return status().sub(itemId);
		}
		
		function busy(o) {
			status().showBusy(o);
		}
		
		function clear() {
			status().clearStatus({
				useDefaults : true
			});
		}
		
		function tray(o, index) {
			if(Ext.typeOf(index) == 'number'){
				status().insert(index, o);
			}else{
				status().add(o);
			}
		}
		
		/* AJAX Event Handling for Status */
		var loadText = T('Caption.Other.Waiting For Server Response');
		var cnt = 0;
		
		function onComplete(conn, resp, options, eOpts) {
			if (--cnt <= 0) {
				cnt = 0;
				clear();
			}
		}
		
		function onException(conn, resp, options, eOpts) {
			if (--cnt < 0) {
				cnt = 0;
			}
		}

		function onBefore(conn, options, eOpts) {
			/*
			 * 파일 Upload는 iframe을 이용한 Fake Ajax이므로, 이벤트가 발생하지 않는다.
			 * Ext.Ajax.request 도큐먼트를 참조하시오.
			 */
			if(options.isUpload) {
				return;
			}
			
			if (++cnt > 0)
				set({
		            text: loadText,
		            iconCls: 'statusProgress'
		        });
		}

		Ext.Ajax.on('requestcomplete', onComplete);
		Ext.Ajax.on('requestexception', onException);
		Ext.Ajax.on('beforerequest', onBefore);

		/* Logger Event Handling for Status */
		
		Ext.Error.handle = function(err) {
			var msg = '[SYS-E000] ' + T('Message.SYS-E000', {
				msg : err.msg
			});
			
			set({
				text : msg,
				iconCls : 'x-status-error',
				clear : false
			});
		};
		
		function onError(code, params, e) {
			var msg = '[' + code + '] ' + T('Message.' + code, params);

			set({
				text : msg,
				iconCls : 'x-status-error',
				clear : false
			});
		}
		
		function onWarn(code, params, e) {
			var msg = '[' + code + '] ' + T('Message.' + code, params);

			set({
				text : msg,
				iconCls : 'x-status-warn',
				clear : false
			});
		}
		
		function onInfo(code, params) {
			var msg = '[' + code + '] ' + T('Message.' + code, params);

			set({
				text : msg,
				iconCls : 'x-status-info',
				clear : false
			});
		}
		
		// log 갯수 출력
		function onSaveLog(logStore){
			var findModels = logStore.query('confirmedFlag', false);
			Ext.getCmp('log_tray').setText(findModels.length || '0'); 
		}
		
		SF.logger.on('error', onError);
		SF.logger.on('warn', onWarn);
		SF.logger.on('info', onInfo);
		SF.logger.on('saveLog', onSaveLog);
		
		return {
			status : {
				set : set,
				get : get,
				busy : busy,
				clear : clear,
				tray : tray
			}
		};
	}
});
