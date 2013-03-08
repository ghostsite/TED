Ext.define('BAS.view.task.NavTask', {
	extend : 'Ext.panel.Panel',

	xtype : 'nav_task',

	layout : {
		align : 'stretch',
		type : 'vbox'
	},

	title : T('Caption.Task.Task List'),

	autoScroll : true,
	tbar : [ {
		cls : 'navRefreshBtn',
		itemId : 'btnRefresh'
	} ],

	items : [{
		xtype : 'dataview',
		store : 'BAS.store.BasViewTaskMenuListOut.List',
		cls : 'chgreq-menu-list',
		itemSelector : 'div',
		overItemCls : 'chgreq-menu-hover',
		tpl : [ '<tpl for=".">', 
		        	'<div class={cls}>',
		        		'{title}',
		        		'<tpl if="inprogressSize !== undefined">',
		        			'<span>{inprogressSize}</span>',
		        		'</tpl>',
		        	'</div>',
		        '</tpl>' 
		      ]
	}]
});