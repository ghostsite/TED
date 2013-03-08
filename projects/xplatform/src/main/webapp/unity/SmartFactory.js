Ext.Loader.setPath('mixin', 'product/mixin');

Ext.define('SmartFactory', {
	
	alternateClassName : ['SF'],
	
	singleton : true,

	requires : [ 'mixin.DeepLink', 'mixin.AutoExpire', 'mixin.History', 'mixin.User', 'mixin.Mixin', 'mixin.Msg', 'mixin.UserInterface', 'mixin.ExtOverride', 'mixin.Util', 'mixin.Logger', 'mixin.Lock', 'mixin.Ajax', 'mixin.Exporter'],
	mixins : {
		user : 'mixin.User',
		expire : 'mixin.AutoExpire',
		mixin : 'mixin.Mixin',
		msg : 'mixin.Msg',
		history : 'mixin.History',
		ui : 'mixin.UserInterface',
		subitem : 'mixin.ExtOverride',
		constant : 'mixin.Constant',
		util : 'mixin.Util',
		logger : 'mixin.Logger',
		lock : 'mixin.Lock',
		ajax : 'mixin.Ajax',
		exporter : 'mixin.Exporter'
	}
});
