Ext.define('mixin.User', function() {/**changed by zhang*/
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
			id : login.id, //Ext.String.htmlDecode(login.username), //zhang
			loginname : Ext.String.htmlDecode(login.loginname), //zhang added
			name : Ext.String.htmlDecode(login.username),
			locale : Ext.String.htmlDecode(login.locale),
		},
		isAssemblyName : isName
	};
}());