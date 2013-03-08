Ext.define('BAS.view.task.NavEntity', {
	extend : 'Ext.panel.Panel',

	xtype : 'nav_entity',

	title : T('Caption.Task.Entity'),
	
	layout : 'fit',

	autoScroll : true,
	
	listeners : {
		afterrender : function() {
			var data = Ext.Array.map(SF.task.types(), function(type) {
				return {
					title : T('Caption.Task.Type.' + type),
					view : SF.task.get(type, 'entity.list.view')
				};
			});
			
			this.down('dataview').store.loadData(data);
		}
	},

	initComponent : function() {
		var me = this;
		
		var store = Ext.create('Ext.data.JsonStore', {
			model : 'BAS.view.task.NavEntity.Entity',
			fields : [ 'title', 'view' ]
		});
			
		Ext.applyIf(me, {
			items : [ {
				xtype : 'dataview',
				store : store,
				cls : 'requestRegiList', // TODO To be changed.
				itemSelector : 'div',
				overItemCls : 'chgreq-menu-hover',
				tpl : [ '<tpl for="."><div class="requested">{title}</div></tpl>' ]
			} ]
		});

		me.callParent(arguments);
	}
});