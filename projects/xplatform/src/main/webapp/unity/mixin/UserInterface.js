/*
 * TODO 이 Mixin은  CMN 모듈로 이동한다.
 */
Ext.define('mixin.UserInterface', function() {
	/* Navigation 영역에 탭을 추가하기 */
	function addNav(config) {
	}

	/* MainMenu 영역의 Side에 탭을 추가하기 */
	function addSideMenu(view, config) {
	}

	// TODO : resource List Main에 active 이벤트를 위해서 수정하였음. 문제가 된다면 기존
	// addContentView로 복원필요
	function addContentView(view) {
	}

	var _content_area = null;
	
	function getContentArea() {
		if(!_content_area)
			_content_area = Ext.getCmp('content');
		return _content_area;
	}
	
	var _title_component = null;
	
	function setTitle(title) {
		if(!_title_component)
			_title_component = Ext.getCmp('title');

		if(_title_component)
			_title_component.update({
				title : title
			});
	}

	/* Main Content 영역에 탭을 추가하기 - 히스토리에 연동되며 로드할 데이타의 키정보를 넘길 수 있다. */
	/* TODO doMenu 메쏘드의 명칭을 수정 ==> showContent 또는 show */
	function doMenu(menu, history) {
		if (!menu.viewModel) {
			SF.error('SYS-E002');
			return;
		}

		try {
			var content_area = getContentArea();
			
			/*
			 * 모듈 이름이 4자 이상인 경우는 커스터마이즈된 코드로 인식한다.
			 * 커스터마이즈된 코드는 MVC구조를 사용하므로, 뷰모델을 로드하기 전에, 관련된 컨트롤러를 먼저 동적으로 로드한다.
			 * 뷰모델과 관련된 컨트롤러는 뷰모델과 동일한 클래스명을 가져야 하며, {모듈명}.controller.{클래스명} 이름 구조를 가져야 한다.
			 */
			if(!Ext.ClassManager.get(menu.viewModel) && menu.viewModel.indexOf('.') > 3) {
				var controller = menu.viewModel.replace('.view.', '.controller.');
				if(controller)
					SF.controller.ApplicationController.unique.getController(controller).init();
			}
			
			var screen = content_area.getComponent(menu.itemId) || content_area.add(Ext.create(menu.viewModel, {
				itemId : menu.itemId,
				header : false,
				closable : false
			}));

			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로 keychange 이벤트를 발생시키도록 변경함.
			 */
			if (screen.setKeys) {
				screen.setKeys(menu.keys);
			}

			setTitle(screen.title);

			content_area.getLayout().setActiveItem(screen);

			return screen;
		} catch (e) {
			SF.error('SYS-E001', {
				view : menu.viewModel
			}, e);
		}
	}

	return {
		doMenu : doMenu,
		addContentView : addContentView,
		addNav : addNav,
		addSideMenu : addSideMenu
	};
}());
