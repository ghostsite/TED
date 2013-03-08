Ext.define('MEStouch.mixin.Setting', function() {
	var defaultSettings = [];
	
	Ext.define('MEStouch.mixin.Setting.Model', {
	    extend: 'Ext.data.Model',
	    config: {
	        fields: [{
				name : 'id',
				type : 'string'
			}, {
				name : 'value',
				type : 'auto'
			}],
	        proxy: {
	            type: 'localstorage',
	            id  : 'MEStouch-settings'
	        }
	    }
	});

	var store = Ext.create('Ext.data.Store', {
		model : 'MEStouch.mixin.Setting.Model',
		autoSync : true
	});
	
	function getLocalSetting(name) {
		var record = store.getById(name);
		if(record)
			return record.get('value');
		else
			return null;
	};
	
	function setLocalSetting(name, value) {
		var record = store.getById(name);
		var old;
		if(!record) {
			var set = Ext.create('MEStouch.mixin.Setting.Model', {
				id : name,
				value : undefined
			});
			store.add(set);
			record = store.getById(name);
		}

		record.set('value', value);
		record.commit();
		
		return old;
	};
	
	Ext.define('MEStouch.mixin.Setting.Inner', {
		mixins: ['Ext.mixin.Observable'],
		
		set : function(id, val) {
			var old = setLocalSetting(id, val);
			this.fireEvent(id, val, old);
		},
		
		get : function(id) {
			return getLocalSetting(id);
		}
	});
	
	store.on('load', function(store, records) {
		for(var i = 0;i < defaultSettings.length;i++) {
			if(!store.getById(defaultSettings[i].id)) {
				setLocalSetting(defaultSettings[i].id, defaultSettings[i].value);
			}
		}
	});
	
	try {
		store.load();
	} catch(e) {
		/* 잘못된 형식의 local cache인 경우 로컬스토리지를 클리어시킴 */
		store.getProxy().clear();
		store.load();
	}

	return {
		setting : Ext.create('MEStouch.mixin.Setting.Inner')
	}
}());