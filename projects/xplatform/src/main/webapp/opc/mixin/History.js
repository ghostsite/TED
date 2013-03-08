/**
 * @class Opc.mixin.History
 * 
 */
Ext.define('Opc.mixin.History', function() {
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

		return {
			viewModel : params[0],
			keys : params[1] ? Ext.Object.fromQueryString(params[1], true) : undefined
		};
	}

	/* 네비게이션의 히스토리 시스템을 셋업한다. */
	Ext.util.History.init();

	var _locked = false;
	
	Ext.util.History.on('change', function(token) {
		if (!token)
			token = 'Opc.view.Intro';

		var anchor = parse(token);

		SF.go(anchor.viewModel, anchor.keys);
		/* SF.go 로 대치될 수 있는 지 검증 후 아래 부분을 삭제한다. */
//		try {
//			if(!Ext.ClassManager.get(anchor.viewModel)) {
//				var controller = anchor.viewModel.replace('.view.', '.controller.');
//				Opc.controller.Navigator.singletonController.getController(controller).init();
//			}
//			
//			var screen = Opc.controller.Navigator.singleton.child(anchor.viewModel) || Opc.controller.Navigator.singleton.add(Ext.create(anchor.viewModel, {
//				itemId : anchor.viewModel,
//				header : false
//			}));
//			Opc.controller.Navigator.singletonController.getPageTitle().setText(screen.title);
//		} catch (e) {
//			SF.error('SYS-E001', {
//				view : anchor.viewModel
//			}, e);
//			return;
//		}
//		if (anchor.keys && screen && screen.setKeys) {
//			/*
//			 * History는 변경하지 말고, Keys 값만을 바꾸라. 이미 변경된 History에 의해서 수행되는 부분이므로,
//			 * History를 변경하지 말 것을 두번째 파라미터로 전달한다.
//			 */
//			screen.setKeys(anchor.keys, true);
//		}
//
//		Opc.controller.Navigator.singleton.getLayout().setActiveItem(screen);
	});

	/*
	 * History Change 이벤트가 발생하지 않는 경우에 강제로 발생시키는 메쏘드이다. 예를 들면, 화면이 최초에 열리는 시점에
	 * 발생시킨다.
	 */
	function force() {
		Ext.util.History.fireEvent('change', Ext.util.History.getToken());
	}

	function anchor() {
		var args = [];
		for ( var i = 0; i < arguments.length; i++) {
			if (!arguments[i])
				args[i] = '';
			else if (arguments[i] instanceof Array || arguments[i] instanceof Object)
				args[i] = Ext.Object.toQueryString(arguments[i]);
			else
				args[i] = '' + arguments[i];
		}

		return args.join(':');
	}

	function add(view, keys) {
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
//			else if (view.getKeys && view.getKeys() !== undefined)
//				token = anchor(view.getXType(), view.getKeys());
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
			parse : parse,
			lock : lock,
			unlock : unlock
		}
	};
}());
