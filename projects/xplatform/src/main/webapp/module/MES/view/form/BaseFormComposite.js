Ext.define('MES.view.form.BaseFormComposite', {
	extend : 'Ext.tab.Panel',

	alternateClassName : 'BaseFormComposite',

	mixins : {
		deeplink : 'mixin.DeepLink'
	},

	requires : [ 'mixin.DeepLink' ],

	initComponent : function() {

		this.callParent();

		var self = this;

		this.buildForms(this);

		this.items.each(function(form, index) {
			/*
			 * 각 폼의 onBeforeClose 핸들러는 각 function의 origin에 저장한다. 하나의 폼에서라도
			 * onBeforeClose핸들러가 호출되면, 모든 폼의 onBeforeClose의 origin을 수행하게된다.
			 */
			var origin = form.onBeforeClose;
			form.onBeforeClose = function() {
				var go = true;
				self.items.each(function(f) {
					go = go && f.onBeforeClose.origin.call(f, f);
				});
				return go;
			};

			form.onBeforeClose.origin = origin;

			/*
			 * 각 폼의 onClose 핸들러는 각 function의 origin에 저장한다. 하나의 폼에서라도 onClose핸들러가
			 * 호출되면, 모든 폼의 onClose의 origin을 수행하게된다. 그런 후에 메인 패널을 close한다.
			 */
			origin = form.onClose;
			form.onClose = function() {
				self.items.each(function(f) {
					f.onClose.origin.call(f, f);
				});
				self.close();
			};

			form.onClose.origin = origin;

			/*
			 * 각 폼의 setKey 함수를 재정의 하여 상의 Tab에 setKeys를 호출하도록 변경한다.
			 */
			origin = form.setKeys;
			form.setKeys = function(keys, silent) {
				this._keys = keys;

				keys = keys || {};
				keys.activeTab = index;

				self.setKeys(keys, silent);
			};

			form.setKeys.origin = origin;
		});

		/*
		 * 하위 탭에 Activate 이벤트를 전달한다.(Supplement와 연동 등을 위해서..)
		 */
		this.on('activate', function() {
			if (self.getActiveTab())
				self.getActiveTab().fireEvent('activate');
		});

		// key change가 일어나면 하위 탭에 keychange 이벤트를 연결한다.
		this.on('keychange', function(view, keys) {
			if(!keys)
				keys = {};
			
			var activeTab = keys.activeTab || 0;

			// keys.activeTab 히스토리에서 가져올 경우 문자형태로 가져오는 경우가 생겨 형변환 한다.
			if (Ext.typeOf(activeTab) === 'string') {
				activeTab = parseInt(activeTab);
				if (isNaN(activeTab)) {
					activeTab = 0;
				}
			}

			var tab = view.setActiveTab(activeTab);

			// 하위탭에 keychage 이벤트를 발생할때는 keys.activeTab은 삭제하고 이벤트를 발생한다.
			var cloneKeys = Ext.clone(keys);
			delete cloneKeys.activeTab;

			tab.fireEvent('keychange', tab, cloneKeys);
		});
	},

	buildForms : Ext.emptyFn
});