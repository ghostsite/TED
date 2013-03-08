/*
 * File: BAS.view.common.TaskList
 */

Ext.define('BAS.view.common.TaskList', {
	extend : 'Ext.panel.Panel',
	
	xtype : 'bas_task_list',
	
	requires : [ 'mixin.DeepLink', 'CMN.plugin.Supplement' ],

	mixins : {
		deeplink : 'mixin.DeepLink',
		buttonHandler : 'MES.mixin.ButtonHandler'
	},
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	dockedItems : [ {
		xtype : 'mes_task_buttons',
		//TODO : export 사용여부 미설정
		items : [ 'Refresh', '->', 'AddNew','Import', 'Close' ]
	}],

	initComponent : function() {
		var me = this;
		this.plugins = [ Ext.create('CMN.plugin.Supplement') ];
		this.reqStore = Ext.create('BAS.store.BasViewTaskRequestListOut.list', {
			buffered : true
		});
		if (this.buildSupplement != Ext.emptyFn) {
			this.supplement = this.buildSupplement();
		}

		Ext.applyIf(me, {
			items : [ me.buildList(me), {
				xtype : 'splitter',
				height : 5
			}, me.buildReqGrid(me) ]
		});
		
		this.addEvents('edit');

		this.callParent(arguments);
	},
	buildReqGrid : function(me){
		return {
			xtype : 'gridpanel',
			title : 'Task Request List',
			itemId : 'grdReq',
			flex : 1,
			cls : 'navyGrid',
			columnLines : true,
			store : this.reqStore,
			columns : [ {
				xtype : 'rownumberer',
				width : 25,
				text : ''
			}, {
				dataIndex : 'factory',
				width : 55,
				align : 'center',
				text : 'Factory'
			}, {
				xtype : 'textactioncolumn',
				dataIndex : 'title',
				minWidth : 200,
				flex : 1,
				text : 'Title',
				handler : function(grid, rowIndex, colIndex) {
					me.fireEvent('view',grid, rowIndex, colIndex);
				}
			}, {
				dataIndex : 'fileGroupId',
				width : 25,
				renderer : function(v,mata,rec){
					if(v){
						mata.tdCls = 'iconClip';
					}
					return '';
				}
			}, {
				dataIndex : 'reqType',
				width : 80,
				align : 'center',
				text : 'Task Type',
				renderer : function(v){
					if(v)
						v = v.toLowerCase();
					return T('Caption.BasOther.reqtype'+v);
				}
			}, {
				width : 75,
				dataIndex : 'status',
				align : 'center',
				text : 'Status',
				renderer : function(v){
					if(v)
						v = v.toLowerCase();
					return T('Caption.BasOther.'+v);
				}
			}, {
				width : 70,
				dataIndex : 'createUserId',
				align : 'center',
				text : 'Requester'
			}, {
				width : 70,
				dataIndex : 'approveUserId',
				align : 'center',
				text : 'Approver'
			}, {
				dataIndex : 'createTime',
				width : 140,
				align : 'center',
				text : 'Request Time'
			} ],
			viewConfig : {
				getRowClass : function(record, rowIndex, rowParams, store) {
				}
			},
			dockedItems : [ {
                xtype: 'toolbar',
                dock : 'bottom',
                items: ['->',{
                	xtype : 'radiogroup',
                	itemId : 'rdoReqStauts',
                	columns : 2,
                	width : 300,
                	value : '',
                	listeners: {
                        change: function(field,val){
                        	me.fireEvent('rdostatuschange',field,val.menuType);
                        }
                    },
                	items : [{
                		boxLabel : 'Current',
                		name : 'menuType', 
                		inputValue : '',
                		checked: true
                	}, {
                		boxLabel : 'History',
                		name : 'menuType', 
                		inputValue : 'done'
                	}]
                }]
            } ]
		};
	},
	buildList : function(me){
		return {
			xtype : 'gridpanel',
			itemId : 'grdGcm',
			flex : 2,
			cls : 'navyGrid',
			store : [],
			columns : [ ]
		};
	},
	buildSupplement : Ext.emptyFn
});