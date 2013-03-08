Ext.define('mixin.Util', function() {
	function camelize(src) {
		var lowers = src.toLowerCase();
		return lowers.replace(/[A-Z]([A-Z]+)|(?:^|[-_])(\w)/g, function(x, c) {
			var x0 = x.charAt(0);

			if (x0 == '-' || x0 == '_')
				return x.substr(1).toUpperCase();
			return x;
		});
	}
	
	function elapsedTime(from, to, unit) {
		var diff = to - from;

		// strip the miliseconds
		diff /= 1000;

		var seconds = Math.round(diff % 60);
		// remove seconds from the date
		diff = Math.round(diff / 60);
		// get minutes
		var minutes = Math.round(diff % 60);
		// remove minutes from the date
		diff = Math.round(diff / 60);
		// get hours
		var hours = Math.round(diff % 24);
		// remove hours from the date
		diff = Math.round(diff / 24);

		// the rest of Time Diff is number of days
		var days = diff;
		
		var text = 'Text.Elapsed Hours';
		
		if(unit) {
			switch(unit.charAt(0)) {
			case 's' :
				text = 'Text.Elapsed Seconds';
				break; 
			case 'm' :
				text = 'Text.Elapsed Minutes';
				break; 
			case 'h' :
				text = 'Text.Elapsed Hours';
				break; 
			case 'd' :
				text = 'Text.Elapsed Days';
				break; 
			}
		}
		
		return T(text, {
			days : days,
			hours : hours,
			minutes : minutes,
			seconds : seconds
		});
	}
	
	return {
		camelize : camelize,
		elapsedTime : elapsedTime
	};
}());
