/*
 * TODO 이 Mixin은  CMN 모듈로 이동한다.
 */
Ext.define('mixin.UserInterface', function() {
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
	/* Navigation 영역에 탭을 추가하기 */
	function addNav(config) {
		var defaults = {
			tabConfig : {
				width : 29,
				height : 22,
				padding : '0 0 0 2px'
			}
		};

		try {
			var nav = Ext.getCmp('nav').add(Ext.merge(defaults, config));

			if(SF.search) {
				SF.search.register({
					kind : 'nav',
					key : nav.itemId,
					name : nav.title,
					handler : function(item) {
						Ext.getCmp('nav').setActiveTab(nav);
					}
				});
			}
		} catch (e) {
			SF.error('SYS-E003', {}, e);
		}
	}

	/* MainMenu 영역의 Side에 탭을 추가하기 */
	function addSideMenu(view, config) {
		try {
			var sidemenu = Ext.getCmp('sidemenu');
			var menu = Ext.create(view, config);

			sidemenu.insert(0, menu);

		} catch (e) {
			SF.error('SYS-E004', {
				view : view
			}, e);
		}
	}

	// TODO : resource List Main에 active 이벤트를 위해서 수정하였음. 문제가 된다면 기존
	// addContentView로 복원필요
	function addContentView(view) {
		var comp = null;
		var bNewComp = false; // 새로 생성된 comp 여부
		var content_area = Ext.getCmp('content');

		if (typeof (view) === 'string') {
			comp = createView(view, {
				closable : true
			});

			if(!comp){
				return false;
			}
		
			content_area.add(comp);
			bNewComp = true;
		} else {
			if (view.itemId) {

				comp = content_area.getComponent(view.itemId);
			}

			if (comp) {
				// 중복 Tab
				if (view.opt) {
					comp.opt = view.opt;
				}
			} else {
				// 새로 생성 Tab
				view.closable = true;
				comp = content_area.add(view);
				bNewComp = true;
			}
		}

		if (comp.tab.active) {
			// tab이 active 상태라면 다시 하번 active 이벤트 발생
			comp.setActive(true);
		} else {
			// tab이 active 상태가 아니라면 active tab으로 지정
			content_area.setActiveTab(comp);
			if (bNewComp && content_area.items.length == 1) {
				// 새로 생성되는 tab라면 active 이벤트 발생
				comp.setActive(true);
			}
		}
	}

	/* Main Content 영역에 탭을 추가하기 - 히스토리에 연동되며 로드할 데이타의 키정보를 넘길 수 있다. */
	/* TODO doMenu 메쏘드의 명칭을 수정 ==> showContent 또는 show */
	function doMenu(menu, history) {
		if (!menu.viewModel) {
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
			if(!Ext.ClassManager.get(menu.viewModel) && menu.viewModel.indexOf('.') > 1) {
				var controller = menu.viewModel.replace('.view.', '.controller.');
				if(controller) {
					/*
					 * Synchronously Loading 경고를 방지하기 위해서 명시적으로 Ext.syncRequire 를 선행적으로 호출함.
					 */
					Ext.syncRequire(controller);
					SF.controller.ApplicationController.unique.getController(controller).init();
				}
			}
			
			menu.itemId = menu.itemId || menu.viewModel; 
			var screen = content_area.getComponent(menu.itemId);
			if(!screen){
				var newView = createView(menu.viewModel, {
					itemId : menu.itemId,
					closable : true
				});
				 if(newView === false){
					 return false;
				 }
				 screen = content_area.add(newView);
			}
			
			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로 keychange 이벤트를 발생시키도록 변경함.
			 */
			if (screen.setKeys) {
				screen.setKeys(menu.keys);
			} else {
				SF.history.add(screen);
			}
			
			try {
				SF.history.lock();
				content_area.setActiveTab(screen);
			} finally {
				SF.history.unlock();
			}

			return screen;
		} catch (e) {
			SF.error('SYS-E001', {
				view : menu.viewModel
			}, e);
		}
	}

	function popup(viewModel, keys) {
		if (!viewModel) {
			SF.error('SYS-E002');
			return;
		}

		try {
			/*
			 * 모듈 이름이 4자 이상인 경우는 커스터마이즈된 코드로 인식한다.
			 * 커스터마이즈된 코드는 MVC구조를 사용하므로, 뷰모델을 로드하기 전에, 관련된 컨트롤러를 먼저 동적으로 로드한다.
			 * 뷰모델과 관련된 컨트롤러는 뷰모델과 동일한 클래스명을 가져야 하며, {모듈명}.controller.{클래스명} 이름 구조를 가져야 한다.
			 */
			if(!Ext.ClassManager.get(viewModel) && viewModel.indexOf('.') > 1) {
				var controller = viewModel.replace('.view.', '.controller.');
				if(controller) {
					/*
					 * Synchronously Loading 경고를 방지하기 위해서 명시적으로 Ext.syncRequire 를 선행적으로 호출함.
					 */
					Ext.syncRequire(controller);
					SF.controller.ApplicationController.unique.getController(controller).init();
				}
			}
			
			var screen = Ext.create(viewModel);
			screen.show();

			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로 keychange 이벤트를 발생시키도록 변경함.
			 */
			if(screen.setKeys) {
				screen.setKeys(keys);
			}

			return screen;
		} catch (e) {
			SF.error('SYS-E001', {
				view : viewModel
			}, e);
		}
	}

	return {
		doMenu : doMenu,
		addContentView : addContentView,
		addNav : addNav,
		addSideMenu : addSideMenu,
		popup : popup
	};
}());
