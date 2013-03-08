Ext.define('Opc.mixin.Ajax', function() {
	function onComplete(conn, resp, options, eOpts) {
		// success or failure message 표시 옵션 추가 2013.01.22
		var operation = options.operation||{};
		var showFailureMsg = operation.showFailureMsg;
		var showSuccessMsg = operation.showSuccessMsg;
		
		var responseObj = Ext.JSON.decode(resp.responseText);
		
		if (responseObj.success === true && showSuccessMsg !== false) {
			SF.success(T('Caption.Other.Success'), responseObj.msg);
		} else if (responseObj.success === false && showFailureMsg !== false) {
			SF.error('SYS-E012', responseObj);
		}
	}
	
	function onException(conn, resp, options, eOpts) {
		if (resp.status === 0) {
			SF.error('SYS-E008');
		} else if (resp.status == 404) {
			var msg = '[' + resp.status + ' ' + resp.statusText + '(' + options.url + ')]';
			SF.error('SYS-E013', {
				msg : msg
			});
		} else if (resp.status >= 400 && resp.status < 500) {
			SF.error('SYS-E009');
			Ext.Msg.confirm(T('Caption.Other.Invalid Session'), T('Message.SYS-E009'), function(btn) {
				if(btn === 'yes')
					document.location.reload();
			});
		} else if (resp.status >= 500) {
			SF.error('SYS-E010');
		} else {
			var msg = '[' + resp.status + ' : ' + resp.statusText + ']';
			SF.error('SYS-E000', {
				msg : msg
			});
		}
	}
	
	function onBefore(conn, resp, options, eOpts) {
	}
	
	Ext.Ajax.on('requestcomplete', onComplete);
	Ext.Ajax.on('requestexception', onException);
	Ext.Ajax.on('beforerequest', onBefore);

	return {
		ajax : {	
		}
	};
}());