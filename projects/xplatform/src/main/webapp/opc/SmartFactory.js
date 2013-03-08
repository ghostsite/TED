Ext.Loader.setPath('mixin', 'product/mixin');

Ext.define('SmartFactory', {
	
	alternateClassName : ['SF'],
	
	singleton : true,

	mixins : {
		expire : 'mixin.AutoExpire',
		msg : 'mixin.Msg',
		logger : 'mixin.Logger',
		user : 'mixin.User',
		mixin : 'mixin.Mixin',
		subitem : 'mixin.ExtOverride',
		storage : 'mixin.LocalSetting',
		util : 'mixin.Util',
		lock : 'mixin.Lock',
		sound : 'mixin.Sound',
		history : 'Opc.mixin.History',
		ajax : 'Opc.mixin.Ajax',
		alarm : 'Opc.mixin.Alarm'
	}
});
