Ext.define('MES.view.communicate.common.ChatContainer', {
	extend : 'Ext.tab.Panel',
	
	id : 'mes_chatview',
	
	title : T('Caption.Other.Chatting'),
	
	cls : 'chatting innerBottomTab',
	
	tabPosition : 'bottom',
	
	listeners : {
		beforeClose : function(panel, opt) {
			var cmp = Ext.getCmp('mes.tray_chatnotice');
			if (cmp)
				cmp.destroy();
		}
	}
});