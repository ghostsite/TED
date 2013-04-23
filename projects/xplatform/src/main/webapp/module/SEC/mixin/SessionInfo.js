Ext.define('SEC.mixin.SessionInfo', function() { //目前这个没有用到，可以暂时保留,存放一些配置信息。
	var info = sessionInfo;
	
	Ext.define('SEC.mixin.SessionInfo.Inner', {
		mixins: {
			observable : 'Ext.util.Observable'
		},
		
		set : function(id, val) {
			var old = info[id];
			info[id] = val;
			this.fireEvent(id, val, old);
		},
		
		get : function(id) {
			return info[id];
		},
		
		reload : function() {
			Ext.Ajax.request({
				//url : 'service/SecViewSessionInfo',
				method : 'GET',
				success : function(response, opts) {
					var result = Ext.JSON.decode(response.responseText);
					
					Ext.Object.each(result, function(key, val) {
						this.set(key, val);
					});
				},
				scope : this
			});
		},
		
		constructor: function (config) {
	        this.mixins.observable.constructor.call(this, config);
	    }
	});
	
	var session = Ext.create('SEC.mixin.SessionInfo.Inner');

	return {
		session : session
	};
}());
