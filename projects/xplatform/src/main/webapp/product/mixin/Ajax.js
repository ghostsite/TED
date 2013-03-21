Ext.define('mixin.Ajax', function() { //this file is changed by zhang
	//TODO  : 2013.02.05  mixin.Ajax onComplete에서 매번  json decode이 되므로 비효율적임
	//Ext.override(Ext.data.proxy.Server,{}) : exception시에만 error message를 decode함. 
	//단, success시 공용 팝업이 표시되지 않아 방법 모색 후 적용예정.
	function onComplete(conn, resp, options, eOpts) {
		var showFailureMsg = true;
		var showSuccessMsg = false;
		/* 2013.02.28 KKH responseText 값이 없으면 메세지 설정 처리 필요없음*/ 
		if(!resp.responseText){
			return;
		}
		var responseObj = Ext.JSON.decode(resp.responseText);
		/* 2013.02.28 KKH Ext.Ajax.request 호출시 decode한 결과를 채워준다. callback에서 중복으로 decode필요없음*/ 
		resp.responseObj = responseObj;
		
		if (options.operation && options.operation.showFailureMsg != undefined) {
			showFailureMsg = options.operation.showFailureMsg;
		} else if (options.scope && options.scope.showFailureMsg != undefined) {
			showFailureMsg = options.scope.showFailureMsg;
		} else if (options.showFailureMsg != undefined) {
			showFailureMsg = options.showFailureMsg;
		}

		if (options.operation && options.operation.showSuccessMsg != undefined) {
			showSuccessMsg = options.operation.showSuccessMsg;
		} else if (options.scope && options.scope.showSuccessMsg != undefined) {
			showSuccessMsg = options.scope.showSuccessMsg;
		} else if (options.showSuccessMsg != undefined) {
			showSuccessMsg = options.showSuccessMsg;
		}

		if (Ext.isFunction(showFailureMsg)) {
			showFailureMsg = showFailureMsg(responseObj);
		}

		if (Ext.isFunction(showSuccessMsg)) {
			showSuccessMsg = showSuccessMsg(responseObj);
		}
		
		if (showSuccessMsg === true && responseObj.success === true) {
			SF.msgRtn(responseObj.msgcode, responseObj);
		}else if (showFailureMsg === true && responseObj.success === false) {
			SF.msgRtn(responseObj.msgcode, responseObj);
			SF.error('SYS-E012', responseObj);
		}
	}
	
	function onException(conn, resp, options, eOpts) {
		if (resp.status === 0) {
			SF.error('SYS-E008');
			Ext.Msg.alert(T('Caption.Other.Communication Failure'), T('Message.SYS-E008'));
		} else if (resp.status == 404) {
			var msg = '[' + resp.status + ' ' + resp.statusText + '(' + options.url + ')]';
			SF.error('SYS-E013', {
				msg : msg
			});
			Ext.Msg.alert(T('Caption.Other.Not Found'), T('Message.SYS-E013', {
				msg : msg
			}));
		} else if (resp.status >= 400 && resp.status < 500) {
			SF.error('SYS-E009');
			Ext.Msg.confirm(T('Caption.Other.Invalid Session'), T('Message.SYS-E009'), function(btn) {
				if(btn === 'yes')
					//document.location.reload(); //zhang
					document.location='/xp';
			});
		} else if (resp.status >= 500) {
			SF.error('SYS-E010');
			Ext.Msg.alert(T('Caption.Other.Server Error'), T('Message.SYS-E010'));
		} else {
			var msg = '[' + resp.status + ' : ' + resp.statusText + ']';
			SF.error('SYS-E000', {
				msg : msg
			});
			Ext.Msg.alert(T('Caption.Other.Unknown Error'), T('Message.SYS-E000', {
				msg : msg
			}));
		}
	}
	/** 
	 * 2013.02.28 6.1.1.1이후 변경-KKH
	 * Ext.Ajax.request 호출시 pageSize 미지정시 모든 list 가져오는 옵션추가함
	 * pageSize/Index 또는 params에 pageSize/Index추가(params우선적용됨)
	 */
	function onBeforeRequest( conn, options, eOpts ){
		if(options && options.params){
			options.params = Ext.applyIf(options.params, {
				pageSize : options.pageSize||1000,
				pageIndex : options.pageIndex||0
			});
		}
	}
	Ext.Ajax.on('requestcomplete', onComplete);
	Ext.Ajax.on('requestexception', onException);
	Ext.Ajax.on('beforerequest', onBeforeRequest);
	return {
		ajax : {	
		}
	};
}());