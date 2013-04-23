Ext.define('CMN.store.MainMenuStore', {
	extend : 'Ext.data.TreeStore',

	storeId : 'cmn.mainmenu_store',

	autoLoad : false,

	model : 'CMN.model.MainMenu',
	
	root : {
		text : 'MainMenu',
		expanded : true
	},

	constructor : function(config) {
		/* proxy config가 SmartFactory를 참조하므로, 생성자 안쪽으로 넣었다. */
		config.proxy = {
			type : 'ajax',
			//url : 'service/SecViewFunctionNodeList.json',
			url : 'menuresource/getCurrentUserMenusCascade',
			reader : {
				type : 'json'
				//root : 'list'
			},
			actionMethods : {
				read : 'GET'
			}
		};
		
		this.callParent([config]);
	},
	
	listeners : {
		'load' : function(store, node, records, success) {
			if (!success || !SF.search)
				return;
			
			/*
			 * 이미 SearchStore에 등록되어있는 메뉴들을 다 제거한다.
			 */
			SF.search.remove('menu');
			
			/*
			 * 새로 로드된 메뉴들 SearchStore에 등록한다.
			 */
			node.cascadeBy(function(record) {
				var text = T('Caption.Menu.' + record.get('text'));
				record.set('text', text);

				if (!record.isLeaf())
					return;
				SF.search.register({
					kind : 'menu',
					key : record.get('code'),
					name : text,
					item : {
						viewModel : record.get('path'),
						itemId : record.get('code')
					},
					handler : function(searchItem) {
						SF.doMenu(searchItem.get('item'));
					}
				});
				
				// 2010-08-10 record Commit 추가
				record.commit();
			});
		}
	}
});
