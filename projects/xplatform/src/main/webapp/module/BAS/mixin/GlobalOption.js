Ext.define('BAS.mixin.GlobalOption', function(){
	var options = {};
	if(window.globalOptionList){
		Ext.Array.each(globalOptionList.optionList, function(v) {
			setGlobalOption(v.optionName, v);
		});
	}
	else{
		//refreshGlobalOption(); ghostzhang changed becareful<NOTE> ,原来是打得开，因为抛异常在url : 'service/BasViewGlobalOptionList.json',
	}
	
//	refreshGlobalOption();

	function refreshGlobalOption() {
		/* TODO 부트 스트래핑 과정에서 비동기 방식은 사용하면 안된다. 개선 요. */
		deleteAllGlobalOption();
		Ext.Ajax.request({
			url : 'service/BasViewGlobalOptionList.json',
			async  : false, //비동기식으로 callback 호출까지 함수를 끝내지 않고 대기한다.
			method : 'GET',
			params : {
				procstep : '1',
				pageSize : 5000
			},
			success : function(response, opts) {
				var result = Ext.JSON.decode(response.responseText);
				Ext.Array.each(result.optionList, function(v) {
					setGlobalOption(v.optionName, v);
				});
			},
			scope : this
		});
	};
	
	function getGlobalOption(name) {
		return options[name];
	};
	
	function setGlobalOption(name, value) {
		options[name] = value;
	};
	
	function putGlobalOptionAll(obj) {
		options = Ext.merge(options, obj);
	};
	
	function getGlobalOptionNameList() {
		var props = [];
		for(var prop in options) {
			props.push(prop);
		}
		return props;
	};
	
	function deleteAllGlobalOption() {
		options = {};
	};
	
	function deleteGlobalOption(name) {
		delete options[name];
	};
	
	function getGlobalOptionAll() {
		return options;
	};
	
	return {
		option : {
			refresh : refreshGlobalOption,
			putAll : putGlobalOptionAll,
			removeAll : deleteAllGlobalOption,
			remove : deleteGlobalOption,
			get : getGlobalOption,
			set : setGlobalOption,
			names : getGlobalOptionNameList,
			all : getGlobalOptionAll
		}
	};
}());