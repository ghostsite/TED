Ext.define('BAS.view.task.TaskList', {
	extend : 'Ext.form.Panel',

	requires : [ 'mixin.DeepLink', 'CMN.plugin.Supplement' ],

	mixins : {
		deeplink : 'mixin.DeepLink'
	},
	
	xtype : 'task_list',

	title : T('Caption.Task.Task List'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	dockedItems : [ {
		xtype : 'bas_base_buttons',
		items : [ 'Refresh', '->', 'Close' ]
//		items : [ 'Refresh', '->', 'Submit','Approve','Reject', 'Release','Cancel', 'Close' ]
	} ],
	
	initComponent : function() {
		this.plugins = [ Ext.create('CMN.plugin.Supplement') ];

		this.supplement = this.buildSupplement();
		
		var me = this;

		Ext.applyIf(me, {
			items : [ {
				xtype : 'gridpanel',
				flex : 1,
				cls : 'navyGrid',
				columnLines : true,
				store : 'BAS.store.BasViewTaskListOut.List',
//				selModel : Ext.create('Ext.selection.CheckboxModel'),
				columns : [ {
					xtype : 'rownumberer',
					width : 32,
					text : ''
				}, {
					xtype : 'textactioncolumn',
					dataIndex : 'title',
					flex : 1,
					minWidth : 200,
					text : T('Caption.Task.Title'),
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
					minWidth : 100,
					align : 'center',
					width : 80,
					text : T('Caption.Task.Request Type'),
					renderer : function(v){
						return T('Caption.Task.Request.' + v);
					}
				}, {
					width : 75,
					dataIndex : 'status',
					align : 'center',
					text : T('Caption.Task.Task Status'),
					renderer : function(v){
						return T('Caption.Task.Status.' + v);
					}
				}, {
					width : 76,
					dataIndex : 'submitUserId',
					align : 'center',
					text : T('Caption.Task.Submit User')
				}, {
					dataIndex : 'submitTime',
					width : 132,
					align : 'center',
					text : T('Caption.Task.Submit Time')
				}, {
					dataIndex : 'releaseTime',
					width : 132,
					align : 'center',
					text : T('Caption.Task.Release Time')
				}, {
					width : 96,
					align : 'left',
					text : T('Caption.Task.Elapsed Time'),
					renderer : function(value, meta, record) {
						var status = record.get('status');
						
						if(status === 'canceled')
							return;
						
						var from, to;
						switch(status) {
						case 'created' :
							from = record.get('createTime');
							to = new Date();
							break;
						case 'released' :
							from = record.get('submitTime');
							to = record.get('releaseTime');
							break;
						default :
							from = record.get('submitTime');
							to = new Date();
						}
						
						if(!from || !to)
							return;
						
						return SF.elapsedTime(from, to);
					}
				} ],
				viewConfig : {
					getRowClass : function(record, rowIndex, rowParams, store) {
						var status = record.get('status');
						if(me.menuType == 'submitted' && status != 'submitted' && status != 'approved'){
							return 'textColorGray';
						}
					}
				},
				dockedItems : [ {
					xtype : 'pagingtoolbar',
					store : 'BAS.store.BasViewTaskListOut.List',
					displayInfo : true,
					dock : 'bottom'
				} ]
//			}, {
//				xtype : 'textareafield',
//				cls : 'marginT5 marginR7 marginL5',
//				fieldLabel : T('Caption.Task.Opinion'),
//				height : 45,
//				maxLength : 200,
//				enforceMaxLength : true,
//				name : 'opinion'
			} ]
		});

		me.callParent(arguments);
	},

	buildSupplement : function() {
		return {
			xtype : 'bas_base_sup',

			title : T('Caption.Task.Filter Conditions'),
			
			dockedItems : [ {
				xtype : 'bas_base_buttons',
				items : [ 'View', 'Reset' ]
			} ],
			
			items : [ {
				xtype : 'combobox',
				fieldLabel : T('Caption.Task.Task Type'),
				store : Ext.Array.map(Ext.Array.merge([''], SF.task.types()), function(type) {
					return [type, type ? T('Caption.Task.Type.' + type) : ''];
				}),
				editable : false,
				autoSelect : false,
				name : 'taskType',
				tpl : '<tpl for="."><div class="x-boundlist-item">{field2}&nbsp;</div></tpl>'
			}, {
				xtype : 'codeview',
				fieldLabel : T('Caption.Task.Submit User'),
				codeviewName : 'SERVICE',
				store : 'SEC.store.SecViewUserListOut.List',
				params : {
					procstep : '1'
				},
				popupConfig : {
					title : T('Caption.Task.Submit User'),
					columns : [ {
						header : T('Caption.Task.User ID'),
						dataIndex : 'userId',
						flex : 1
					}, {
						header : T('Caption.Task.Description'),
						dataIndex : 'userDesc',
						flex : 2
					} ]
				},
				fields : [ {
					column : 'userId',
					name : 'submitUserId',
					maxLength : 30,
					enforceMaxLength : true,
					vtype : 'nospace'
				} ]
			}, {
				xtype : 'dateperiod',
				fieldLabel : T('Caption.Task.Submit Time'),
				defaultValue : new Date(),
				period : '1m',
				labelAlign : 'top',
				layout : 'hbox',
				fromName : 'submitTimeFrom',
				toName : 'submitTimeTo'
			} ]
		};
	}
});