/**
 * 控件：CMN.view.common.ViewLogInfo|btnClosec
 */
Ext.define('SYS.view.urlresource.UrlResourceManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_urlresource',
	requires : ['SYS.model.UrlResource'],
	title : T('Caption.Menu.SYS.view.urlresource.UrlResourceManage'),

	addBtnUrlDelete : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '删除',
			itemId : 'btnUrlDelete',
			disabled : true
		};
	},

	addBtnUrlUpdate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '变更',
			itemId : 'btnUrlUpdate',
			disabled : true
		}
	},

	addBtnUrlCreate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '创建',
			itemId : 'btnUrlCreate'
		}
	},

	addBtnUrlClear : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '清空',
			itemId : 'btnUrlClear'
		}
	},

	initComponent : function() {
		this.callParent();

		var basebuttons = this.getButtons();
		basebuttons.insert(1, this.addBtnUrlDelete());
		basebuttons.insert(1, this.addBtnUrlUpdate());
		basebuttons.insert(1, this.addBtnUrlCreate());
		basebuttons.insert(1, this.addBtnUrlClear());

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function(me) {
		var urlStore = Ext.create('SYS.store.UrlResource');
		urlStore.getProxy().url = 'urlresource/pagedUrlResourceList';
		var params = {
			start : 0,
			limit : SF.page.pageSize
		}

		urlStore.load({
			params : params
		});

		return {
			xtype : 'container',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'end'
				},
				cls : 'marginR10',
				items : [{
					xtype : 'grid',
					title : 'URL',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'urlGridId',
					forceFit : true,
					flex : 1,
					minHeight : 370,
					store : urlStore,
					columns : [{
						header : 'URL名称',
						dataIndex : 'name',
						flex : 1
					}, {
						header : 'URL代码',
						dataIndex : 'code',
						flex : 1
					}],
					bbar : SF.getContextBbar(urlStore)
				}, {
					xtype : 'form',
					border : false,
					itemId : 'urlFormId',
					cls : 'marginT7',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					bodyCls : 'paddingAll10',
					flex : 1,
					defaults : {
						labelWidth : 100
					},
					items : [{
						xtype : 'hidden',
						name : 'id'
					}, {
						xtype : 'textfield',
						fieldLabel : 'URL值',
						name : 'code'
					}, {
						xtype : 'textfield',
						fieldLabel : 'URL名称 ',
						name : 'name'
					}, {
						xtype : 'container',
						layout : {
							type : 'hbox',
							align : 'stretch'
						},
						defaults : {
							labelWidth : 100
						},
						items : [{
							xtype : 'numberfield',
							fieldLabel : '序号',
							name : 'idx',
							minValue : 0,
							cls : 'marginR10',
							flex : 3
						}]
					}, {
						flex : 1,
						xtype : 'container',
						layout : 'hbox',
						cls : 'marginR10',
						items : [{
							xtype : 'checkbox',
							fieldLabel : '权限',
							boxLabel : '执行',
							name : 'canExecute'
						}]
					}]
				}]
			}]
		};
	}
});