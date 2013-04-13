Ext.define('SYS.view.pageresource.PageResourceManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_pageresource',
	requires : ['SYS.model.PageResource', 'SYS.model.WidgetResource'],
	title : T('Caption.Menu.SYS.view.pageresource.PageResourceManage'),

	addBtnPageDelete : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '删除',
			itemId : 'btnPageDelete',
			disabled : true
		};
	},

	addBtnPageUpdate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '变更',
			itemId : 'btnPageUpdate',
			disabled : true
		}
	},

	addBtnPageCreate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '创建',
			itemId : 'btnPageCreate'
		}
	},

	addBtnPageClear : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '清空',
			itemId : 'btnPageClear'
		}
	},

	addBtnWidgetDelete : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '删除',
			itemId : 'btnWidgetDelete',
			disabled : true
		};
	},

	addBtnWidgetUpdate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '变更',
			itemId : 'btnWidgetUpdate',
			disabled : true
		}
	},

	addBtnWidgetCreate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '创建',
			disabled : true,
			itemId : 'btnWidgetCreate'
		}
	},

	addBtnWidgetClear : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '清空',
			disabled : true,
			itemId : 'btnWidgetClear'
		}
	},

	initComponent : function() {
		this.callParent();

		var basebuttons = this.getButtons();
		basebuttons.insert(1, this.addBtnWidgetDelete());
		basebuttons.insert(1, this.addBtnWidgetUpdate());
		basebuttons.insert(1, this.addBtnWidgetCreate());
		basebuttons.insert(1, this.addBtnWidgetClear());

		basebuttons.insert(0, this.addBtnPageDelete());
		basebuttons.insert(0, this.addBtnPageUpdate());
		basebuttons.insert(0, this.addBtnPageCreate());
		basebuttons.insert(0, this.addBtnPageClear());

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function(me) {
		var pageStore = Ext.create('SYS.store.PageResource');
		pageStore.getProxy().url = 'pageresource/pagedPageResourceList';
		var params = {
			start : 0,
			limit : SF.page.pageSize
		}

		pageStore.load({
			params : params
		});

		var widgetStore = Ext.create('SYS.store.WidgetResource');
		widgetStore.getProxy().url = 'widgetresource/getWidgetResourceListByPageId';

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
					title : '页面',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'pageGridId',
					forceFit : true,
					flex : 1,
					minHeight : 370,
					store : pageStore,
					columns : [{
						header : '页面代码',
						dataIndex : 'name',
						flex : 1
					}, {
						header : '页面名称',
						dataIndex : 'code',
						flex : 1
					}],
					bbar : SF.getContextBbar(pageStore)
				}, {
					xtype : 'form',
					border : false,
					itemId : 'pageFormId',
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
						fieldLabel : '菜单值',
						name : 'code'
					}, {
						xtype : 'textfield',
						fieldLabel : '菜单名称 ',
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
							flex : 1
						}, {
							xtype : 'checkbox',
							//fieldLabel : 'Controller',
							boxLabel : '有Controller',
							name : 'hasController',
							flex : 1
						}]
					}, {
						flex : 1,
						xtype : 'container',
						layout : 'hbox',
						cls : 'marginR10',
						items : [{
							xtype : 'checkbox',
							fieldLabel : '权限',
							boxLabel : '查看',
							name : 'canView'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							boxLabel : '新增',
							cls : 'marginRL10',
							name : 'canAdd'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							boxLabel : '更新',
							cls : 'marginRL10',
							name : 'canUpdate'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							cls : 'marginRL10',
							boxLabel : '删除',
							name : 'canDelete'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							cls : 'marginRL10',
							boxLabel : '只读',
							name : 'canReadOnly'
						}]
					}]
				}]
			}, {
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'end'
				},
				items : [{
					xtype : 'grid',
					title : '控件',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'widgetGridId',
					forceFit : true,
					minHeight : 370,
					store : widgetStore,
					columns : [{
						header : '控件代码',
						dataIndex : 'name',
						flex : 1
					}, {
						header : '控件名称',
						dataIndex : 'code',
						flex : 1
					}]
				}, {
					xtype : 'form',
					border : false,
					cls : 'marginT7',
					itemId : 'widgetFormId',
					flex : 1,
					items : [{
						xtype : 'hidden',
						name : 'id'
					}, {
						xtype : 'hidden',
						name : 'page.id',
						itemId : 'page.id'
					}, {
						xtype : 'textfield',
						fieldLabel : '菜单值',
						name : 'code'
					}, {
						xtype : 'textfield',
						fieldLabel : '菜单名称 ',
						name : 'name'
					}, {
						xtype : 'numberfield',
						fieldLabel : '序号',
						name : 'idx',
						minValue : 0,
						flex : 1
					}, {
						flex : 1,
						xtype : 'container',
						layout : 'hbox',
						cls : 'marginR10',
						items : [{
							xtype : 'checkbox',
							fieldLabel : '权限',
							boxLabel : '查看',
							name : 'canView'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							boxLabel : '新增',
							cls : 'marginRL10',
							name : 'canAdd'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							boxLabel : '更新',
							cls : 'marginRL10',
							name : 'canUpdate'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							cls : 'marginRL10',
							boxLabel : '删除',
							name : 'canDelete'
						}, {
							xtype : 'checkbox',
							fieldLabel : '',
							cls : 'marginRL10',
							boxLabel : '只读',
							name : 'canReadOnly'
						}]
					}]
				}]
			}]
		};
	}
});