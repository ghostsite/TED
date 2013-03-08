Ext.define('CMN.view.common.NavMainMenu', {
	extend : 'Ext.tree.Panel',

	alias : 'widget.cmn.nav_mainmenu',

	id : 'cmn.view.nav_mainmenu',

	rootVisible : false,

	listeners : {
		beforerender : function(comp, obj) {
			this.store.on('clear', this.store_changed, this);
		},
		itemclick : function(view, record, item, index, e, opt) {
			if (record.get('leaf')) {
				SmartFactory.doMenu({
					viewModel : record.get('path'),
					itemId : record.get('code')
				});
			}
		}
	},

	tbar : [ {
		cls : 'navRefreshBtn',
		listeners : {
			click : function(button) {
				var store = Ext.getStore('CMN.store.MainMenuStore');
				store.load();
			}
		}
	} ],

	store : 'CMN.store.MainMenuStore',

	store_changed : function(store) {
		this.getView().refresh();
	}
});