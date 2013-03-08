Ext.define('CMN.store.FavoriteStore', {
	extend : 'Ext.data.Store',

	storeId : 'cmn.favorite_store',

	autoLoad : false,

	model : 'CMN.model.Favorite',

	proxy : {
		type : 'ajax',
		//url : 'service/SecViewFavoritesList.json',
		url : 'menuresource/getCurrentUserFavoriteMenusCascade',
		reader : {
			type : 'json'
			//root : 'list'
		},
		actionMethods : {
			read : 'GET'
		},
		extraParams : {
			procstep : '1'
			//programId : SF.login.programId
		}
	}
});