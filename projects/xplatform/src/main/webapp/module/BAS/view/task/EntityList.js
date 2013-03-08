/*
 * File: BAS.view.task.ExaminationList
 */

Ext.define('BAS.view.task.EntityList', {
	extend : 'Ext.panel.Panel',

	xtype : 'task_entity_list',

	requires : [ 'mixin.DeepLink', 'CMN.plugin.Supplement' ],

	mixins : {
		deeplink : 'mixin.DeepLink'
	},

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	dockedItems : [ {
		xtype : 'bas_base_buttons',
		items : [ 'Export', '->', 'AddNew', 'Import', 'Close' ]
	} ],

	initComponent : function() {
		this.plugins = [ Ext.create('CMN.plugin.Supplement') ];

		if (this.buildSupplement != Ext.emptyFn) {
			this.supplement = this.buildSupplement();
		}

		Ext.applyIf(this, {
			items : [ this.buildEntityGrid(), {
				xtype : 'splitter',
				height : 5
			}, this.buildTaskGrid() ]
		});

		this.callParent(arguments);

	},

	buildEntityGrid : function() {
		var columns = Ext.Array.merge(this.getEntityHeadColumns(), this.getEntityColumns(), this.getEntityTailColumns());
		return {
			xtype : 'grid',
			flex : 2,
			cls : 'navyGrid',
			columnLines : true,
			store : this.getEntityStore(),
			columns : columns,
			viewConfig : {
				enableTextSelection : true,
				getRowClass : function(record, rowIndex, rowParams, store) {
				}
			},
			dockedItems : [ {
				xtype : 'pagingtoolbar',
				store : this.getEntityStore(),
				displayInfo : true,
				dock : 'bottom'
			} ]
		};
	},

	buildTaskGrid : function() {
		var me = this;
		return {
			xtype : 'grid',
			flex : 1,
			title : T('Caption.Task.Entity Modification History'),
			itemId : 'grdTask',
			cls : 'navyGrid',
			columnLines : true,
			store : this.getTaskStore(),
			columns : [ {
				xtype : 'rownumberer',
				width : 30
			}, {
				xtype : 'textactioncolumn',
				dataIndex : 'title',
				minWidth : 200,
				flex : 1,
				text : T('Caption.Task.Title'),
				handler : function(grid, rowIndex) {
					me.fireEvent('taskview', me, grid.store.getAt(rowIndex).data);
				}
			}, {
				dataIndex : 'reqType',
				width : 100,
				align : 'center',
				text : T('Caption.Task.Request Type'),
				renderer : function(v) {
					return T('Caption.Task.Request.' + v);
				}
			}, {
				dataIndex : 'status',
				align : 'center',
				text : T('Caption.Task.Task Status'),
				renderer : function(v) {
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
					
					return SF.elapsedTime(from, to);
				}
			} ],
			viewConfig : {
				enableTextSelection : true,
				getRowClass : function(record, rowIndex, rowParams, store) {
				}
			},
			dockedItems : [ {
				xtype : 'pagingtoolbar',
				store : this.getTaskStore(),
				displayInfo : true,
				dock : 'bottom'
			} ]
		};
	},

	getEntityHeadColumns : function() {
		var me = this;
		return [ {
			xtype : 'rownumberer',
			width : 30
		}, {
			xtype : 'actioncolumn',
			width : 40,
			align : 'center',
			items : [ {
				iconCls : 'iconEdit',
				handler : function(grid, rowIndex) {
					me.fireEvent('entityedit', me, grid.store.getAt(rowIndex).data);
				},
				tooltip : T('Caption.Task.ToolTip.edit')
			}, {
				iconCls : 'iconDelete',
				handler : function(grid, rowIndex) {
					me.fireEvent('entitydelete', me, grid.store.getAt(rowIndex).data);
				},
				tooltip : T('Caption.Task.ToolTip.delete')
			} ]
		} ];
	},

	getEntityTailColumns : function() {
		return [ {
			dataIndex : 'createUserId',
			width : 76,
			text : T('Caption.Other.Create User')
		}, {
			dataIndex : 'createTime',
			width : 132,
			text : T('Caption.Other.Create Time')
		}, {
			dataIndex : 'updateUserId',
			width : 76,
			text : T('Caption.Other.Update User')
		}, {
			dataIndex : 'updateTime',
			width : 132,
			text : T('Caption.Other.Update Time')
		} ];
	},

	getEntityColumns : function() {
		return [];
	},

	getEntityStore : function() {
		if (!this.entityStoreObj) {
			this.entityStoreObj = Ext.create(SF.task.get(this.taskType, 'entity.list.store.name'), {
//				buffered : true,
//				leadingBufferZone : 0
			});
		}

		return this.entityStoreObj;
	},

	getTaskStore : function() {
		if (!this.taskStoreObj)
			this.taskStoreObj = Ext.create('BAS.store.BasViewTaskListOut.list', {
//				buffered : true,
//				leadingBufferZone : 0
			});
		return this.taskStoreObj;
	},

	buildSupplement : function() {
		return {
			xtype : 'bas_base_sup',

			title : T('Caption.Task.Filter Conditions'),
			
			dockedItems : [ {
				xtype : 'bas_base_buttons',
				items : [ {
					xtype : 'label',
					minWidth : '',
					flex : 1
				}, 'View', 'Reset', {
					xtype : 'label',
					minWidth : '',
					flex : 1
				} ],
				layout : 'hbox'
			} ],
			
			items : [ this.buildSupplementTop(), {
				xtype : 'separator'
			}, {
				xtype : 'fieldset',
				title : T('Caption.Task.Entity Modification History Filter Condition'),
				cls : 'titleColorRed',
				defaults: {anchor: '100%'},
		        layout: 'anchor',
		        items : [{
					xtype : 'combobox',
					fieldLabel : T('Caption.Task.Task Status'),
					store : Ext.Array.map(['', 'created', 'done', 'submitted', 'rejected', 'approving', 'approved', 'released', 'canceled'], function(status) {
						return [status, status ? T('Caption.Task.Status.' + status) : ''];
					}),
					autoSelect : false,
					editable : false,
					name : 'task[status]',
					tpl : '<tpl for="."><div class="x-boundlist-item">{field2}&nbsp;</div></tpl>'
				}, {
					xtype : 'combobox',
					fieldLabel : T('Caption.Task.Request Type'),
					store : Ext.Array.map(['', 'create', 'update', 'delete', 'import', 'process'], function(type) {
						return [type, type ? T('Caption.Task.Request.' + type) : ''];
					}),
					autoSelect : false,
					editable : false,
					name : 'task[reqType]',
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
						title : T('Caption.Task.Submit User ID'),
						columns : [ {
							header : T('Caption.Other.User ID'),
							dataIndex : 'userId',
							flex : 1
						}, {
							header : T('Caption.Other.Description'),
							dataIndex : 'userDesc',
							flex : 2
						} ]
					},
					fields : [ {
						column : 'userId',
						name : 'task[submitUserId]',
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
					fromName : 'task[submitTimeFrom]',
					toName : 'task[submitTimeTo]'
				}]
			} ]
		};
	},

	buildSupplementTop : Ext.emptyFn
});