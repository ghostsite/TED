Ext.define('SEC.store.SecViewFavoritesListOut.list', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	pageSize : 1000,
	model : 'SEC.model.SecViewFavoritesListOut.list',
	proxy : {
		type : 'payload',
		api : {
			read : 'service/SecViewFavoritesList.json'
		},
		actionMethods : {
			read : 'POST'
		},
		reader : {
			type : 'json',
			root : 'list'
		}
	}
});