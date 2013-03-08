/**
 * @class Opc.mixin.Status
 * 
 */
Ext.define('Opc.mixin.Status', {
	constructor : function(config) {
		var _status = null;
		var _empty = {
			addCls : Ext.emptyFn,
			removeCls : Ext.emptyFn,
			update : Ext.emptyFn
		};

		function status() {
			if (!_status)
				_status = Ext.getCmp('opcStatus');
			return _status || _empty;
		}
		
		function _truncate(msg) {
			var truncated = msg || '';
			var idx = truncated.indexOf('\n');
			if(idx !== -1)
				return truncated.substr(0, idx);
			return truncated;
		}

		function normal(title, msg, iconCls) {
			
			msg = msg ? msg.substr(0,150) + ' ...'  : '';
			
			status().update({
				title : title,
				msg : _truncate(msg),
				iconCls : iconCls
			});
			status().removeCls('success');
			status().removeCls('fail');
		}
		
		function success(title, msg) {
			SF.sound.success();
			
			msg = msg ? msg.substr(0,150) + ' ...'  : '';
			
			status().update({
				title : title,
				msg : _truncate(msg)
			});
			status().addCls('success');
			status().removeCls('fail');
		}

		function failure(title, msg) {
			SF.sound.failure();
			
			msg = msg ? msg.substr(0,150) + ' ...'  : '';
			
			status().update({
				title : title,
				msg : _truncate(msg)
			});
			status().addCls('fail');
			status().removeCls('success');
		}

		/* AJAX Event Handling for Status */
		var loadText = T('Caption.Other.Waiting For Server Response');
		var cnt = 0;
		
		function onComplete(conn, resp, options, eOpts) {
			if (--cnt < 0) {
				cnt = 0;
			}
		}
		
		function onException(conn, resp, options, eOpts) {
			if (--cnt < 0) {
				cnt = 0;
			}
		}

		function onBefore(conn, resp, options, eOpts) {
			if (++cnt > 0)
				SF.normal(loadText, '', 'statusProgress');
		}

		Ext.Ajax.on('requestcomplete', onComplete);
		Ext.Ajax.on('requestexception', onException);
		Ext.Ajax.on('beforerequest', onBefore);

		/* Logger Event Handling for Status */
		
		Ext.Error.handle = function(err) {
			failure('[SYS-E000] ', T('Message.SYS-E000', {
				msg : err.msg
			}));
		};
		
		function onError(code, params, e) {
			var title = '[' + code + ']';
			var msg = T('Message.' + code, params);
			
			failure(title, msg);
		}
		
		function onWarn(code, params, e) {
		}
		
		function onInfo(code, params) {
			var title = '[' + code + ']';
			var msg = T('Message.' + code, params);
			normal(title, msg);
		}
		
		SF.logger.on('error', onError);
		SF.logger.on('warn', onWarn);
		SF.logger.on('info', onInfo);
		
		return {
			normal : normal,
			success : success,
			failure : failure
		};
	}
});