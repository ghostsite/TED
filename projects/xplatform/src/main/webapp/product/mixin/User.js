Ext.define('mixin.User', function() {
	var names = {};
	var myNames = {};
	
	function setAssemblyName(name){
		names[name] = true;
	}
	function setMyAssemblyName(name){
		myNames[name] = true;
	}
	
	function isName(name){
		if(myNames[name]){
			return true;
		}
		if(names[name]){
			return false;
		}
		else{
			return null;
		}
	}
	return {
		login : {
			id : Ext.String.htmlDecode(login.username),
			name : Ext.String.htmlDecode(login.username),
			factory : Ext.String.htmlDecode(login.factory),
			locale : Ext.String.htmlDecode(login.locale),
			group : Ext.String.htmlDecode(login.group),
			programId : Ext.String.htmlDecode(login.programId || 'WEBClient')
		},
		isAssemblyName : isName
	};
}());