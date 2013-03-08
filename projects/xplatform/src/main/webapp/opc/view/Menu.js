Ext.define('Opc.view.Menu', {
	extend : 'Ext.window.Window',

	xtype : 'opcmenu',

	title : 'Menu',

	modal : true,

	titleAlign : 'center',

	width : 310,

	height : 600,

	layout : 'fit',

	items : [ {
		xtype : 'dataview',
		itemId : 'menubar',
		autoScroll : true,
		store : 'SEC.store.SecViewFunctionListOut.list',
		itemSelector : 'div',
		cls : 'menuPop',
		tpl : [ '<tpl for=".">', 
		        '<tpl if="funcTypeFlag == \'F\'">', 
		        	'<div class="menuItem">',
		        		'<span style="background:url(image/menuIcon/{iconIndex}_32.png) 7px 0 no-repeat"></span>{[T("Caption.Menu." + values.funcDesc)]}', 
		        	'</div>', 
		        '</tpl>',
				'<tpl if="funcTypeFlag != \'F\'">', 
					'<div class="menuGroup">',
						'{[T("Caption.Menu." + values.funcDesc)]}', 
					'</div>', 
				'</tpl>', 
			'</tpl>' ]
	} ]
});