Ext.define('CMN.view.common.NavFavorite', {
	extend : 'Ext.grid.Panel',

	alias : 'widget.cmn.nav_favorite',

	id : 'cmn.view.nav_favorite',

	listeners : {
		render : function(comp, obj) {
			this.store.on('datachanged', this.store_changed, this);
			this.store.on('clear', this.store_changed, this);
		},
		itemclick : function(view, record, item, index, e, opt) {
			SmartFactory.doMenu({
				viewModel : record.get('path'), 
				itemId : record.get('code'),
				icon: record.get('icon')
			});
		}
	},

	tbar : [ {
		cls : 'navRefreshBtn',
		listeners : {
			click : function(button) {
				var store = Ext.getStore('CMN.store.FavoriteStore');
				store.load();
			}
		}
	}, {
		cls : 'navClearBtn',
		listeners : {
			click : function() {
				var store = Ext.getStore('CMN.store.FavoriteStore');
				store.removeAll(false);
			}
		}
	} ],

	columns : [ {
		header : T('Caption.Other.Description'),
		dataIndex : 'path',
		width : 200,
		renderer : function( value, metadata, record){
			return '<img src="'+record.get('icon2')+'" />'+ T('Caption.Menu.'+ value);
		}
	}, {
		header : T('Caption.Other.Function'),
		dataIndex : 'text',
		width : 100
	} ],

	store : 'CMN.store.FavoriteStore',

	store_changed : function() {
		this.getView().refresh();
	}
});