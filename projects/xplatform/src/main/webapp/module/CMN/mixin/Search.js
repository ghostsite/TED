/**
 * @class CMN.mixin.Search
 * 
 */
Ext.define('CMN.mixin.Search', {
	constructor: function(config) {
		var searchStore = null;
		
		return {
			search : {
				store : function() {
					if(searchStore == null)
						searchStore = Ext.getStore('cmn.appsearch_store');
					return searchStore;
				},
				remove : function(kind) {
					var store = this.store();
					store.queryBy(function(record) {
						return (record.get('kind') === kind);
					}).each(function(record) {
						store.remove(record);
					});
				},
				register : function(config) {
					if(config)
						this.store().add(config);
				}
			} 
		};
	}
});
