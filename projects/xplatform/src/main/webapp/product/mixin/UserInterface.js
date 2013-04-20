/*
 * TODO 이 Mixin은 CMN 모듈로 이동한다.
 */
Ext.define('mixin.UserInterface', function() {
	function createView(view, config) {
		var comp = null;
		if (typeof(view) === 'string') {
			//var secControlList = {};
			var errMsg = '';
			var callConfig ={
				url: 'pageresource/currentUserCanView',
				params:{ //view == pageresource's code, 'SYS.view.user.UserManage' 
					pageCode : 'page|' + view //这里加page，是因为Resource表要求code必须唯一，好判断权限。
				}
			}
			
			var canView = SF.cf.callServiceSync(callConfig);
			
			if (canView.result.data == false) {
				SF.alertWarn('警告', '您没有权限浏览此页面!');
				return false;
			}
			//config.secControlList = secControlList; //这个挪到Page initComponent的时候调用吧。
			comp = Ext.create(view, config);
			return comp;
		} else {
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
			if (SF.search) {
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

	function doMenu(menu, history) {
		if (!menu.viewModel) {
			SF.error('SYS-E002');
			return;
		}

		try {
			var content_area = Ext.getCmp('content');
			if (!Ext.ClassManager.get(menu.viewModel) && menu.viewModel.indexOf('.') > 1 ){
				var controller = menu.viewModel.replace('.view.', '.controller.');
				if (controller) {
					Ext.syncRequire(controller); // load needed js file
													// controller and view
					if(Ext.ClassManager.get(controller)){
						SF.controller.ApplicationController.unique.getController(controller).init();
					}
					// SF.controller.ApplicationController.unique.getController(controller);
					// //this is for extjs4.2 ,a big bug for mesplus, for
					// getController() has called doInit()
				}
			}

			menu.itemId = menu.itemId || menu.viewModel;

			var screen;
			if (SF.isFitLayout()) { // zhang
				var config = {
					itemId : menu.itemId,
					closable : false
				};
				if(menu.icon){
					Ext.apply(config, {icon: menu.icon});
				}
				var newView = createView(menu.viewModel, config);
				if (newView === false) {
					return false;
				}
				content_area.removeAll();
				screen = content_area.add(newView);
			} else {
				screen = content_area.getComponent(menu.itemId);
				if (!screen) {
					var closable = true;
					if (SF.isCardLayout()) {
						closable = false;
					}
					var config = {
						itemId : menu.itemId,
						closable : closable
					};
					if(menu.icon){
						Ext.apply(config, {icon: menu.icon});
					}
				
					var newView = createView(menu.viewModel,config);
					if (newView === false) {
						return false;
					}
					if (SF.isCardLayout()) {// zhang changed
						screen = content_area.insert(0, newView);
					} else {
						screen = content_area.add(newView);
					}
				}
			}

			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로
			 * keychange 이벤트를 발생시키도록 변경함.
			 */
			if (screen.setKeys) {
				var keys = menu.keys || {}; // zhang added
				screen.setKeys(Ext.apply(keys, {
					icon : menu.icon
				})); // zhang added
				// original is screen.setKeys(menu.keys);
			} else {
				SF.history.add(screen);
			}

			try {
				SF.history.lock();
				if (SF.isTabLayout()) { // tab panel zhang
					content_area.setActiveTab(screen);
				} else if (SF.isCardLayout()) { // card layout for panel zhang
					content_area.getLayout().setActiveItem(screen);
				}
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
			 * 모듈 이름이 4자 이상인 경우는 커스터마이즈된 코드로 인식한다. 커스터마이즈된 코드는 MVC구조를 사용하므로,
			 * 뷰모델을 로드하기 전에, 관련된 컨트롤러를 먼저 동적으로 로드한다. 뷰모델과 관련된 컨트롤러는 뷰모델과 동일한
			 * 클래스명을 가져야 하며, {모듈명}.controller.{클래스명} 이름 구조를 가져야 한다.
			 */
			if (!Ext.ClassManager.get(viewModel) && viewModel.indexOf('.') > 1){
				var controller = viewModel.replace('.view.', '.controller.');
				if (controller) {
					/*
					 * Synchronously Loading 경고를 방지하기 위해서 명시적으로 Ext.syncRequire
					 * 를 선행적으로 호출함.
					 */
					Ext.syncRequire(controller);
					if(Ext.ClassManager.get(controller)){
						SF.controller.ApplicationController.unique.getController(controller).init();
					}
					// SF.controller.ApplicationController.unique.getController(controller);
					// //getController() has contained calling doInit
				}
			}

			var screen = Ext.create(viewModel);
			screen.show();

			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로
			 * keychange 이벤트를 발생시키도록 변경함.
			 */
			if (screen.setKeys) {
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
		// addContentView : addContentView,
		addNav : addNav,
		addSideMenu : addSideMenu,
		popup : popup
	};
}());
