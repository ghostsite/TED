Ext.define('CMN.view.viewport.West', {
	extend : 'Ext.tab.Panel',

	alias : 'widget.viewport.west',

	id : 'nav',
	
	cls : 'nav',
	
	title : T('Caption.Other.Navigation'),

	tabPosition : 'bottom',

	listeners : {
		tabchange : function(tab, card) {
			tab.setTitle(card.title);
		},
		add : function(tab, card) {
			if(tab.items.length == 1 && tab.items.items[0].componentCls == 'x-panel'){
				tab.setTitle(card.title);
				tab.setActiveTab(card);
			}
		},
		remove : function(tab, card) {
			if(tab.items.length == 0)
				tab.setTitle(tab.initialConfig.title);
		}
	}
});
