Ext.define('mixin.AutoExpire', function() {
	var MINIMUM_TTL = 10;

	var refreshHandler;
	var timeoutHandler;

	var expireTTL = 0;
	var timer;
	
	function timerHandler() {
		var now = Ext.Date.now();
		var diff = (getLastUpdateTime() + expireTTL * 1000) - now;
		if(diff <= 0) {
			if(timeoutHandler)
				timeoutHandler.call(null);
			stop();
		} else {
			timer = setTimeout(timerHandler, diff);
		}
	}
	
	function getLastUpdateTime() {
		return parseInt(Ext.util.Cookies.get('last-update-time') || '0');
	}
	
	/* TODO LastUpdateTime을 세션변수에 저장하는 방법으로 변경해야 한다. */
	function refresh() {
		var now = Ext.Date.now();
		/* 10초 이내에 반복적으로 발생한 refresh 이벤트는 처리하지 않는다. */
		if(now > getLastUpdateTime() + 10000) {
			Ext.util.Cookies.set('last-update-time', now);
			if(refreshHandler)
				refreshHandler.call(null);
		}
	}
	
	function start(ttl) {
		refresh();

		/* 
		 * Ajax 요청시와 Browser 에서 <=, => 으로 이동하는 경우에 자동 Refresh 하도록 함.  
		 * 그 밖에 경우에는 SF.autoexpire.refresh() 메쏘드를 해당 조건시 호출하면 된다.
		 * 예를 들어, 사용자가 Content Area의 TAB을 바꿔가는 액션을 하는 경우에도, LastUpdateTime을 Refresh 하고 싶은 경우 등이다.
		 */ 
		Ext.util.History.on('change', refresh);
		Ext.Ajax.on('beforerequest', refresh);
		
		/* TTL(Time To Live)은 초단위로 설정하며, 숫자형이어야 한다. 그리고, 최소한 MINIMUM_TTL초 이상으로 설정되어야 한다. */
		if(ttl && (typeof(ttl) === 'number') && ttl >= MINIMUM_TTL) {
			expireTTL = ttl;
			timer = setTimeout(timerHandler, ttl * 1000);
		}
	}
	
	function stop() {
		Ext.util.History.un('change', refresh);
		Ext.Ajax.un('beforerequest', refresh);
		
		expireTTL = 0;
		if(timer)
			clearTimeout(timer);
		timer = undefined;
	}
	
	function on(event, handler) {
		switch(event) {
		case 'refresh' :
			refreshHandler = handler;
			break;
		case 'timeout' :
			timeoutHandler = handler;
			break;
		default :
			Ext.log('Undefined event for AutoExpire : ', event);
		}
	}
	
	var autoExpireTTL  = 60 * 60;
	if(typeof(autoExpireTTL) === 'number') {
		on('timeout', function() {
			document.location.href = typeof(LOGOUT_URL) === 'undefined' ? 'logout' : LOGOUT_URL;
		});
		
		start(autoExpireTTL);
	}

	return {
		autoexpire : {
			start : start,
			stop : stop,
			refresh : refresh,
			on : on
		}
	};
}());