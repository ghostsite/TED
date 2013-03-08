Ext.define('BAS.view.common.NavTaskRequest', {
	extend : 'Ext.panel.Panel',

	xtype : 'bas_nav_request',

	layout : {
		align : 'stretch',
		type : 'vbox'
	},

	title : T('Caption.Other.Task Request'),

	autoScroll : true,
	tbar : [ {
		cls : 'navRefreshBtn',
		itemId : 'btnRefresh'
	} ],

	initComponent : function() {
		var me = this;
		
		me.callParent(arguments);
		
		me.on('afterrender', function() {
			me.add({
				xtype : 'dataview',
				itemId : 'dvTaskRequestMenu',
				store : Ext.create('BAS.store.BasViewTaskRequestMenuListOut'),
				cls : 'chgreq-menu-list',
				itemSelector : 'div',
				overItemCls : 'chgreq-menu-hover',
				tpl : [ '<tpl for="."><div class={cls}>{title}<span>{inprogressSize}/{totalSize}</span></div></tpl>' ]
			});
		});
	}

});