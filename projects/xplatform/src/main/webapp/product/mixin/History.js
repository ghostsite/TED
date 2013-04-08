/**
 * @class mixin.History
 * 
 */
Ext.define('mixin.History', function() {
	/* 네비게이션의 히스토리 시스템을 셋업한다. */
	Ext.util.History.init();

	var _locked = false;
	
	function parse(token) {
		if (!token)
			return {
				viewModel : undefined,
				keys : undefined
			};

		/*
		 * token은 ':' 구분자로 구분된 2개의 파라미터(viewModel : keys)로 이루어져있다. 그런데, 마지막 keys
		 * 파라미터의 경우에는 내부에 ':' 문자를 포함할 수 있으므로, token.split(':') 으로 해결할 수가 없다.
		 * 따라서, 정규표현식에 의한 token 분해 처리를 하도록 하였다.
		 */
		var params = token.match(/([^:]*):{0,1}([\S\s]*)/);
		params.shift();
		var p = params[1] ? Ext.Object.fromQueryString(params[1], true) : undefined;
		
		return {
			viewModel : params[0],
			keys : p,
			icon: p.icon //zhang added 20140402 for F5 refresh , retain icon
		};
	}

	Ext.util.History.on('change', function(token) {
		if(!token)
			return;
			
		var anchor = parse(token);
		var vm = anchor.viewModel;
		var itemId = anchor.viewModel;
		var keys = anchor.keys;
		
		if(!vm) {
			SF.error('SYS-E002');
			return;
		}
		
		//zhang,原来的都删除了，因为调用的就是doMenu,仿照opc History.js
		SF.doMenu(anchor);
		//end 
	});
	
	/*
	 * History Change 이벤트가 발생하지 않는 경우에 강제로 발생시키는 메쏘드이다.
	 * 예를 들면, 화면이 최초에 열리는 시점에 발생시킨다. 
	 */
	function force() {
		Ext.util.History.fireEvent('change', Ext.util.History.getToken());
	}
	
	function anchor() {
		var args = [];
		for(var i = 0;i < arguments.length;i++) {
			if(!arguments[i])
				args[i] = '';
			else if(arguments[i] instanceof Array || arguments[i] instanceof Object)
				args[i] = Ext.Object.toQueryString(arguments[i], true);
			else
				args[i] = '' + arguments[i];
		}
		
		return args.join(':');
	}
	
	function add(view, keys, force) {
		if(_locked)
			return;

		var token = '';
		var viewModel = (typeof view === 'string') ? view : Ext.getClassName(view);
		
		/*
		 * view가 없이 호출하는 경우는 Anchor가 없는 URL을 History에 추가하라는 의미이다.
		 */
		if (viewModel) {
			if (keys !== undefined)
				token = anchor(viewModel, keys);
			else if (view.getKeys && view.getKeys() !== undefined)
				token = anchor(viewModel, view.getKeys());
			else
				token = anchor(viewModel);
		}

		var oldtoken = Ext.util.History.getToken();

		if ((!oldtoken) || oldtoken != token) {
			Ext.History.add(token, true, true);
		}
	}

	function back() {
		Ext.util.History.back();
	}

	function forward() {
		Ext.util.History.forward();
	}
	
	function isSameKey(key1, key2) {
		return Ext.JSON.encode(key1) === Ext.JSON.encode(key2);
	}
	
	function lock() {
		_locked = true;
	}
	
	function unlock() {
		_locked = false;
	}
	
	return {
		history : {
			force : force,
			add : add,
			back : back,
			forward : forward,
			isSameKey : isSameKey,
			lock : lock,
			unlock : unlock
		}
	};
}());
