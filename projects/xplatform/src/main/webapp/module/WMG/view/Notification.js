Ext.define('WMG.view.Notification', {
	extend : 'Ext.panel.Panel',
	plugins : [Ext.create('CMN.plugin.Supplement')],

	alias : 'widget.wmg_notification',

	uses : ['Ext.ux.grid.RowExpander', 'Ext.ux.PagingToolbarResizer'],

	title : T('Caption.Other.Notification'),

	layout : 'fit',

	supplement : {
		xtype : 'form',
		bodyCls : 'paddingAll5',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		defaults : {
			labelWidth : 45
		},
		items : [{
			cls : 'marginT5',
			xtype : 'textfield',
			fieldLabel : '标题',
			name : 'title'
		}, {
			cls : 'marginT5',
			xtype : 'textfield',
			fieldLabel : '周期',
			name : 'period'
		}, {
			cls : 'marginT5',
			xtype : 'textarea',
			fieldLabel : '内容',
			height : 200,
			name : 'message'
		}, {
			cls : 'marginT5',
			xtype : 'combobox',
			fieldLabel : '类型',
			store : Ext.create('Ext.data.ArrayStore', {
				fields : ['code', 'value'],
				data : [[1, '1级'], [2, '2级'], [3, '3级'], [4, '4级'], [5, '5级']]
			}),
			valueField : 'code',
			displayField : 'value',
			name : 'severity',
			allowBlank : false,
			triggerAction : 'all',
			fieldLabel : '程度',
			itemId : 'severity',
			editable : false,
			value : 1,
			queryMode : 'local',
			selectOnTab : true,
			lazyRender : true
		}, {
			cls : 'marginT5',
			xtype : 'checkbox',
			fieldLabel : '确认否',
			boxLabel : '确认',
			name : 'confirm'
		}],
		buttons : [{
			text : '保存',
			handler : function(button) {
				SF.cf.callServiceForm({
					checkFormValid : true,
					form : button.up('form'),
					url : 'notification/save',
					callback : function(action, success) {
						if (success) {
							Ext.ComponentQuery.query('wmg_notification')[0].down('grid').getStore().loadPage(1);
							SF.alertInfo('信息','添加成功!');
							
							//走cometd
							console.log(action)
							SF.communicator.notice({
								title:action.result.title,
								message:action.result.message
							});
						} else {
							SF.alertError('错误', Ext.decode(action.response.responseText).msg);
						}
					},
					scope : this
				});
			}
		}, '->']
	},

	initComponent : function() {
		var self = this;
		this.items = [self.buildNoticeList(self)];
		this.callParent();
	},

	buildNoticeList : function(self) {
		var store = Ext.create('WMG.store.Notification');
		store.getProxy().url = 'notification/query';
		return {
			xtype : 'grid',
			store : store,
			itemId : 'grid',
			columns : [{
				header : '标题',
				dataIndex : 'title',
				flex : 1,
				renderer : function(v, meta, record) {
					var clazz = record.get('confirm') ? 'confirmed' : 'unconfirmed';
					return '<div class="' + clazz + '">' + v + '</div>';
				}
			}, {
				header : '期间',
				dataIndex : 'period',
				align : 'center',
				width : 200
			}, {
				header : '作者',
				dataIndex : 'writer',
				align : 'center'
			}, {
				header : '紧急程度',
				dataIndex : 'severity',
				align : 'center',
				renderer : function(v) {
					var severity = parseInt(v);
					var dom = '';
					for (var i = 0; i < severity; i++)
						dom += '<span class="star"></span>';
					return dom;
				}
			}],
			flex : 1,
			buttons : [{
				text : '刷新',
				handler : function(button) {
					store.loadPage(1);
				}
			}],
			plugins : [{ // 注意，这个rowexpander最好不要跟previcw插件一起使用
				ptype : 'rowexpander',
				rowBodyTpl : ['<p><b>详细:</b> {message}</p>']
			}],
			bbar : SF.getContextBbar(store)
		};
	}
});