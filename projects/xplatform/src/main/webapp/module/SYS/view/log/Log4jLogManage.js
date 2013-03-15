// 右边的GridPanel
Ext.define('SYS.view.log.Log4jLogManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_log4jlog',
	requires : ['SYS.model.Log4jLog', 'Ext.ux.ProgressBarPager', 'Ext.ux.grid.RowExpander'],

	title : T('Caption.Menu.SYS.view.log.Log4jLogManage'),
	// layout : 'fit',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	buttonsOpt : [{
		itemId : 'btnDelete',
		disabled : true,
		url : 'log4jlog/deleteLog4jLog',
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
			items : [{
				xtype : 'combo',
				allowBlank : false,
				store : Ext.create('Ext.data.ArrayStore', {
					fields : ['type', 'typeName'],
					data : [[null, '所有'], [1, '日志'], [2, '业务'], [3, '异常']]
				}),
				displayField : 'typeName',
				valueField : 'type',
				// typeAhead : false,
				// forceSelection : true,
				triggerAction : 'all',
				fieldLabel : '选择类型',
				// selectOnFocus : true,
				name : 'type',
				itemId : 'type',
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
		var store = Ext.create('SYS.store.Log4jLog');
		store.getProxy().url = 'log4jlog/query';
		return {
			xtype : 'grid',
			cls : 'navyGrid',
			stripeRows : true,
			autoScroll : true,
			itemId : 'gridmap',
			flex : 1,
			selModel : Ext.create('Ext.selection.RowModel', {
				mode : 'SINGLE',// SINGLE, SIMPLE, MULTI
				listeners : {
					'selectionchange' : function(model, selected, eOpts) {
						me.fireEvent('gridselectionchange', model, selected, eOpts);
					}
				}
			}),
			store : store,
			columns : [{
				header : '日期',
				dataIndex : 'createTime',
				width : 140,
				renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
			}, {
				header : '类型',
				width : 50,
				dataIndex : 'type',
				renderer : function(val) {
					if (val == '3') {
						return '<span style="color:red;">' + '异常' + '</span>';
					} else if (val == '2') {
						return '<span style="color:blue;">' + '业务' + '</span>';
					} else if (val == '1') {
						return '<span style="color:green;">' + '日志' + '</span>';
					} else {
						return val;
					}
				}
			}, {
				flex : 1,
				dataIndex : 'msg',
				renderer : function(val) {
					return val;
				}
			}],
			plugins : [{
				ptype : 'rowexpander',
				rowBodyTpl : ['<p><b>详细:</b> {msg}</p>']
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