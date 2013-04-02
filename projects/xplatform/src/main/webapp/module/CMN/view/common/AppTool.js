Ext.define('CMN.view.common.AppTool', {
	extend : 'Ext.toolbar.Toolbar',
	
	alias : 'widget.cmn.apptool',
	id : 'apptool',
	
	listeners : {
		render : function(comp, obj) {
			var store = Ext.getStore('CMN.store.FavoriteStore');
			store.on('datachanged', this.store_changed, this);
			store.on('clear', this.store_changed, this);
			//store.on('load', this.store_changed, this);
			store.load();
		}	
	},
	
	default_handler :function(button) {
		SmartFactory.doMenu({
			viewModel : button.data.get('path'),
			itemId : button.data.get('code')
		});
	},	
		
	store_changed: function(store) {
		this.removeAll();
		var records = store.data.items;
		for ( var idx in records) {
			var record = records[idx];
			this.add({
				icon : record.get('icon2'),
				scale : 'large',
				//tooltip : T('Caption.Menu.' + record.get('userFuncDesc')),
				tooltip : record.get('qtip'),
				//tooltip: {xtype:'quicktip',shrinkWrap :1,width:60, autoScroll: false,title: record.get('qtip')},
				data : record,
				handler : this.default_handler
			});
		}
		this.show();
	}
});