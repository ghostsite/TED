Ext.define('MEStouch.view.ResourceList', {
	extend : 'Ext.List',
	xtype : 'reslist',
	config : {
	    itemTpl: '{resId} - {resDesc}',
		title : '리소스 아이디 선택',
	    store : 'FilteredRasViewResourceListOut',
	
		items: [{
			xtype: 'searchfield',
			itemId: 'search',
			docked: 'top'
		}]
	}
});
