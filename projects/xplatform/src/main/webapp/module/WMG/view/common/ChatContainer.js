Ext.define('WMG.view.common.ChatContainer', {
	extend : 'Ext.tab.Panel',
	
	id : 'wmg_chatview',
	
	title : T('Caption.Other.Chatting'),
	
	//cls : 'chatting innerBottomTab',
	
	icon:'image/iconCommunicator16.png',
	
	tabPosition : 'bottom',
	
	listeners : {
		beforeClose : function(panel, opt) {
			var cmp = Ext.getCmp('wmg.tray_chatnotice');
			if (cmp)
				cmp.destroy();
		}
	}
});