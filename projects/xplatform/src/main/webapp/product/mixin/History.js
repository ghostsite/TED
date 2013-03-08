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

		return {
			viewModel : params[0],
			keys : params[1] ? Ext.Object.fromQueryString(params[1], true) : undefined
		};
	}

	function createView(view, config){
		var comp = null;
		if (typeof (view) === 'string') {
			var secChecked = SF.isAssemblyName(view);
			config.secChecked = secChecked;
			var secControlList = {};
			var errMsg = '';
			var result = '';
			if(secChecked === true){
				var params = {
						procstep : '1',
						programId : SF.login.programId,
						funcName : view
				};
				Ext.Ajax.request({
					showFailureMsg : false,
					url : 'service/secViewFunctionDetail.json',
					method : 'POST',
					jsonData : params,
					async : false,
					success : function(response, opts) {
						result = Ext.JSON.decode(response.responseText) || {};
						if (result.success) {
							for ( var i = 1; i <= 10; i++) {
								var ctlName = result['ctlName' + i];
								if (ctlName)
									secControlList[ctlName] = result['ctlEnFlag' + i] || ''; // 'Y' or other
							}
						}
						else{
							errMsg = result.msg;
						}
					}
				});
			}
			else if(secChecked === false){
				errMsg = T('Message.SEC-0008');
			}
			if(errMsg){
				Ext.Msg.alert('Open Error',errMsg);
				return false;
			}
			config.secControlList = secControlList;
			comp = Ext.create(view, config);
			return comp;
		}
		else{
			return view;
		}
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

		try {
			var content_area = Ext.getCmp('content');
			
			/*
			 * 모듈 이름이 4자 이상인 경우는 커스터마이즈된 코드로 인식한다.
			 * 커스터마이즈된 코드는 MVC구조를 사용하므로, 뷰모델을 로드하기 전에, 관련된 컨트롤러를 먼저 동적으로 로드한다.
			 * 뷰모델과 관련된 컨트롤러는 뷰모델과 동일한 클래스명을 가져야 하며, {모듈명}.controller.{클래스명} 이름 구조를 가져야 한다.
			 */
			if(!Ext.ClassManager.get(vm) && vm.indexOf('.') > 1) {
				var controller = vm.replace('.view.', '.controller.');
				if(controller) {
					/*
					 * Synchronously Loading 경고를 방지하기 위해서 명시적으로 Ext.syncRequire 를 선행적으로 호출함.
					 */
					Ext.syncRequire(controller);
					SF.controller.ApplicationController.unique.getController(controller).init();
				}
			}
			var screen = content_area.getComponent(itemId);
			if(!screen){
				var newView = createView(vm, {
					itemId : itemId,
					closable : true
				});
				 if(newView === false){
					 return false;
				 }
				 screen = content_area.add(newView);
			}
			
			if(screen.setKeys) {
				/*
				 * History는 변경하지 말고, Keys 값만을 바꾸라.
				 * 이미 변경된 History에 의해서 수행되는 부분이므로, History를 변경하지 말 것을 두번째 파라미터로 전달한다.
				 */
				screen.setKeys(keys, true);
			}
			
			try {
				lock();

				content_area.setActiveTab(screen);
			} finally {
				unlock();
			}

			return screen;
		} catch (e) {
			SF.error('SYS-E001', {
				view : vm
			}, e);
		}
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
