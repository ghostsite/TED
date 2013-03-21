Ext.Loader.setPath('mixin', 'product/mixin');

Ext.define('SmartFactory', { //this file is changed by zhang
	
	alternateClassName : ['SF'],
	
	singleton : true,

	requires : [ 'mixin.DeepLink', 
	             'mixin.AutoExpire', 
	             'mixin.Msg', 
	             'mixin.User', 
	             'mixin.Mixin', 
	             'mixin.UserInterface', 
	             'mixin.ExtOverride', 
	             'mixin.LocalSetting', 
	             'mixin.Util', 
	             'mixin.Logger', 
	             'mixin.History', 
	             'mixin.Sound', 
	             'mixin.Lock', 
	             'mixin.Ajax', 
	             'mixin.Exporter',
	             'mixin.Grid'],
	mixins : {
		expire : 'mixin.AutoExpire',
		msg : 'mixin.Msg',
		user : 'mixin.User',
		mixin : 'mixin.Mixin',
		ui : 'mixin.UserInterface',
		subitem : 'mixin.ExtOverride',
		constant : 'mixin.Constant',
		storage : 'mixin.LocalSetting',
		util : 'mixin.Util',
		history : 'mixin.History',
		logger : 'mixin.Logger',
		sound : 'mixin.Sound',
		lock : 'mixin.Lock',
		ajax : 'mixin.Ajax',
		exporter : 'mixin.Exporter',
		helper : 'mixin.Helper', //zhang changed 
		grid : 'mixin.Grid'
	}
});