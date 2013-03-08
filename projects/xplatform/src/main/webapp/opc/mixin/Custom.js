Ext.define('Opc.mixin.Custom', {
	constructor : function(config) {
		var topBarAddendums = [];
		var settingAddendums = [];
		
		function addToTop(component) {
			if(component) {
				if(component instanceof Array) {
					Ext.Array.each(component, function(comp) {
						topBarAddendums.push(comp);
					});
				} else {
					topBarAddendums.push(component);
				}
			}

			return topBarAddendums;
		}
		
		function addToSetting(component) {
			if(component) {
				if(component instanceof Array) {
					Ext.Array.each(component, function(comp) {
						settingAddendums.push(comp);
					});
				} else {
					settingAddendums.push(component);
				}
			}

			return settingAddendums;
		}
		
		return {
			custom : {
				top : addToTop,
				setting : addToSetting
			}
		};
	}
});