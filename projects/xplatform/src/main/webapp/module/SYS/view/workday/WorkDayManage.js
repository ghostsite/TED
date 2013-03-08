// 右边的GridPanel
Ext.define('SYS.view.workday.WorkDayManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_workday',
	requires : ['SYS.model.WorkDay', 'Ext.ux.ProgressBarPager'],
	title : T('Caption.Menu.SYS.view.workday.WorkDayManage'),
	// layout : 'fit',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	buttonsOpt : [{
		itemId : 'btnDelete',
		disabled : true,
		url : 'workday/deleteWorkDay',
		confirm : {
			msg : T('Message.Sure Delete Data?')
		}
	}],

	initComponent : function() {
		this.callParent();

		this.on('afterrender', function() {
		});
	},

	buildSupplement : function() {
		return {
			xtype : 'bas_base_sup',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			defaults : {
				labelWidth : 100
			},
			dockedItems : [{
				xtype : 'bas_base_buttons',
				items : ['View', 'Reset', 'Generate']
			}],
			items : [{
				xtype : 'combo',
				allowBlank : false,
				store : Ext.create('Ext.data.ArrayStore', {
					fields : ['workDay', 'workDayName'],
					data : [[null, '所有'], [true, '工作日'], [false, '休息日']]
				}),
				displayField : 'workDayName',
				valueField : 'workDay',
				// typeAhead : false,
				// forceSelection : true,
				triggerAction : 'all',
				fieldLabel : '选择类型',
				// selectOnFocus : true,
				name : 'workDay',
				itemId : 'workDay',
				editable : false,
				queryMode : 'local',
				selectOnTab : true,
				lazyRender : true
			}, {
				xtype : 'datefield',
				fieldLabel : '日期从',
				format : 'Y-m-d',
				itemId : 'from',
				name : 'from'
			}, {
				xtype : 'datefield',
				fieldLabel : '日期到',
				format : 'Y-m-d',
				itemId : 'to',
				name : 'to'
			}]
		};
	},

	buildForm : function(me) {
		var store = Ext.create('SYS.store.WorkDay');
		store.getProxy().url = 'workday/query';
		return {
			xtype : 'grid',
			cls : 'navyGrid',
			stripeRows : true,
			autoScroll : true,
			itemId : 'gridmap',
			flex : 1,
			selModel : Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SIMPLE',
				listeners : {
					'selectionchange' : function(model, selected, eOpts) {
						me.fireEvent('gridselectionchange', model, selected, eOpts);
					}
				}
			}),
			store : store,
			columns : [{
				xtype : 'rownumberer'
			}, {
				header : '日期',
				dataIndex : 'dayDate',
				flex : 1,
				renderer : Ext.util.Format.dateRenderer('Y-m-d')
			}, {
				header : '星期',
				flex : 1,
				dataIndex : 'weekDay',
				renderer : function(val) {
					// return val;
					if (val == '7') {
						return '<span style="color:green;">' + '星期日' + '</span>';
					} else if (val == '1') {
						return '<span style="color:black;">' + '星期一' + '</span>';
					} else if (val == '2') {
						return '<span style="color:black;">' + '星期二' + '</span>';
					} else if (val == '3') {
						return '<span style="color:black;">' + '星期三' + '</span>';
					} else if (val == '4') {
						return '<span style="color:black;">' + '星期四' + '</span>';
					} else if (val == '5') {
						return '<span style="color:black;">' + '星期五' + '</span>';
					} else if (val == '6') {
						return '<span style="color:green;">' + '星期六' + '</span>';
					}
					return val;
				}
			}, {
				header : '类型',
				flex : 1,
				dataIndex : 'workDay',
				renderer : function(val) {
					if (val == true) {
						return '<span style="color:red;">' + '工作日' + '</span>';
					} else if (val == false) {
						return '<span style="color:green;">' + '休息日' + '</span>';
					}
					return val;
				}
			}, {
				xtype : 'actioncolumn',
				items : [{
					icon : 'image/icon/yes.gif',
					tooltip : '非工作日',
					handler : function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						Ext.Ajax.request({
							url : 'workday/setWorkDay',
							method : 'POST',
							params : {
								id : rec.get('id'),
								workDay : false
							},
							success : function(response, opts) {
								Ext.Msg.alert("消息", "更新成功!");
								grid.getStore().reload();
							}
						});
					}
				}, {
					icon : 'image/icon/delete.gif', // ,iconCls:
					// 'icon-user-add',不好用
					tooltip : '工作日',
					handler : function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						Ext.Ajax.request({
							url : 'workday/setWorkDay',
							method : 'POST',
							params : {
								id : rec.get('id'),
								workDay : true
							},
							success : function() {
								Ext.Msg.alert("消息", "更新成功!");
								grid.getStore().reload();
							}
						});
					}
				}]
			}],
			dockedItems : [{
				xtype : 'pagingtoolbar',
				store : store,
				displayInfo : true,
				dock : 'bottom'
			}]
		}
	}
});