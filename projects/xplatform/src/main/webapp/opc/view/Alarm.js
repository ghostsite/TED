Ext.define('Opc.view.Alarm', {
	extend : 'Opc.view.BaseForm',

	xtype : 'alarm',

	title : T('Caption.Other.Alarm'),

	layout : {
		align : 'stretch',
		type : 'vbox'
	},
	
	initComponent : function() {
		this.callParent();

		this.add(this.buildGeneral());
		this.add(this.buildDetailView());
	},
	
	buildGeneral : function(self) {
		return {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items: [{
				xtype : 'grid',
				cls : 'navyGrid',
				flex : 1,
				store : 'ALM.store.AlarmStore',
				autoScroll : true,
				itemId : 'grdAlarmList',
				selModel : Ext.create('Ext.selection.CheckboxModel'),
				multiSelect : true,
				viewConfig : {
					getRowClass : function(record, rowIndex, rowParams, store) {
						if (record.get('confirmFlag') != 'Y') {
							return 'unconfirmed';
						}
					}
				},
				columns : [ {
					xtype : 'rownumberer',
					cls : 'confirmTd',
					align : 'center',
					width : 45
				},{
					header : T('Caption.Other.Alarm ID'),
					dataIndex : 'alarmId',
					flex : 1,
					hidden : true
				},{
					width : 25,
					align : 'center',
					renderer : function(v,meta,rec){
						var level = rec.get('alarmLevel')||'';
						meta.tdCls = 'alarmLevel level'+level;
					}
				},{
					header : T('Caption.Other.Message'),
					dataIndex : 'alarmMsg',
					flex : 1
				}, {
					header : T('Caption.Other.Issue Date'),
					dataIndex : 'createTime',
					align : 'center',
					width : 200,
					renderer : function(v, meta, rec) {
						return Ext.Date.parse(rec.get('createTime'), 'YmdHis');
					}
				}],
				dockedItems: [{
		            xtype: 'toolbar',
		            dock: 'bottom',
		            ui: 'footer',
		            layout: {
		                pack: 'end'
		            },
		            items: [{
		                minWidth: 80,
		                text : 'Delete',
						itemId : 'btnDel'
		            },{
		                minWidth: 80,
		                text : 'UnRead',
						itemId : 'btnUnRead'
		            }]
				}]
			}]
		};
	},
	
	buildDetailView : function(self) {
		return [{
			xtype : 'splitter',
			height : 5
		},{
			xtype : 'container',
			itemId : 'ctnMain',
			autoScroll : true,
			flex : 1,	
			cls : 'alarmContainer',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : []
		}];
	}
});