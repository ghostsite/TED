Ext.define('mixin.Sound', function() {
	function sound_div() {
		var div = document.getElementById('sf_sound');
		if(!div) {
			var div = document.createElement('div');
			div.setAttribute('id', 'sf_sound');
			document.body.appendChild(div);			
		}
		
		return div;
	}
	
	function ring(url) {
		sound_div().innerHTML=
			"<embed src='" + url + "' hidden=true autostart=true loop=false>";
	}
	
	function notice() {
		ring('sound/notice.wav');
	}
	
	function failure() {
		ring('sound/failure.wav');
	};
	
	function success() {
		ring('sound/success.wav');
	};
	
	return {
		sound : {
			ring : ring,
			notice : notice,
			failure : failure,
			success : success
		}
	};
}());