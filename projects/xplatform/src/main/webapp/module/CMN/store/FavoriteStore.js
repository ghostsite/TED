Ext.define('CMN.store.FavoriteStore', {
	extend : 'Ext.data.Store',

	storeId : 'cmn.favorite_store',

	autoLoad : false,

	model : 'CMN.model.Favorite',

	proxy : {
		type : 'ajax',
		url : 'menuresource/getCurrentUserFavoriteMenusCascade',
		reader : {
			type : 'json'
		},
		actionMethods : {
			read : 'GET'
		}
	}
});