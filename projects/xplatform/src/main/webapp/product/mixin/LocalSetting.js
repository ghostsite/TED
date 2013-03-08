Ext.define('mixin.LocalSetting', function() {
	Ext.define('mixin.LocalSetting.Model', {
	    extend: 'Ext.data.Model',
        fields: [{
			name : 'id',
			type : 'string'
		}, {
			name : 'value',
			type : 'auto'
		}],
        proxy: {
            type: 'localstorage',
            id  : 'smartfactory-settings'
        }
	});

	var store = Ext.create('Ext.data.Store', {
		model : 'mixin.LocalSetting.Model',
		autoSync : true
	});
	
	function getSettingsObject(filterFn) {
		var obj = {};
		
		if(filterFn) {
			store.each(function(record) {
				var id = record.get('id');
				var value = record.get('value');
				if(filterFn(id, value))
					obj[id] = value;
			});
		} else {
			store.each(function(record) {
				obj[record.get('id')] = record.get('value');
			});
		}

		return obj;
	}
	
	function getLocalSetting(name) {
		var record = store.getById(name);
		if(record)
			return record.get('value');
		else
			return undefined;
	}
	
	function setLocalSetting(name, value) {
		var record = store.getById(name);

		if(!record) {
			var set = Ext.create('mixin.LocalSetting.Model', {
				id : name,
				value : undefined
			});
			store.add(set);
			record = store.getById(name);
		}
		
		var old = record;

		record.set('value', value);
		record.commit();
		
		return old;
	}
	
	Ext.define('mixin.LocalSetting.Inner', {
		mixins: {
			observable : 'Ext.util.Observable'
		},
		
		constructor: function (config) {
	        this.mixins.observable.constructor.call(this, config);
	    },
	
		set : function(id, val) {
			var old = setLocalSetting(id, val);
			this.fireEvent(id, val, old);
		},
		
		get : function(id) {
			return getLocalSetting(id);
		},
		
		all : function(filterFn) {
			return getSettingsObject(filterFn);
		}
	});
	
	try {
		store.load();
	} catch(e) {
		SF.error('SYS-E006', {}, e);
		/* 잘못된 형식의 local cache인 경우 로컬스토리지를 클리어시킴 */
		store.getProxy().clear();
		store.load();
	}

	return {
		setting : Ext.create('mixin.LocalSetting.Inner')
	};
}());
