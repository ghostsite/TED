Ext.define('SYS.view.namerule.NameRuleManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_namerule',
	requires : ['SYS.model.NameRule', 'SYS.model.NameRuleDefine'],
	title : T('Caption.Menu.SYS.view.namerule.NameRuleManage'),

	addBtnNameRuleDelete : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '删除',
			itemId : 'btnNameRuleDelete',
			disabled : true
		};
	},

	addBtnNameRuleUpdate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '变更',
			itemId : 'btnNameRuleUpdate',
			disabled : true
		}
	},

	addBtnNameRuleCreate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '创建',
			itemId : 'btnNameRuleCreate'
		}
	},

	addBtnNameRuleClear : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '清空',
			itemId : 'btnNameRuleClear'
		}
	},

	addBtnNameRuleDefineDelete : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '删除',
			itemId : 'btnNameRuleDefineDelete',
			disabled : true
		};
	},

	addBtnNameRuleDefineUpdate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '变更',
			itemId : 'btnNameRuleDefineUpdate',
			disabled : true
		}
	},

	addBtnNameRuleDefineCreate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '创建',
			disabled : true,
			itemId : 'btnNameRuleDefineCreate'
		}
	},

	addBtnNameRuleDefineClear : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '清空',
			disabled : true,
			itemId : 'btnNameRuleDefineClear'
		}
	},

	initComponent : function() {
		this.callParent();

		var basebuttons = this.getButtons();
		basebuttons.insert(1, this.addBtnNameRuleDefineDelete());
		basebuttons.insert(1, this.addBtnNameRuleDefineUpdate());
		basebuttons.insert(1, this.addBtnNameRuleDefineCreate());
		basebuttons.insert(1, this.addBtnNameRuleDefineClear());

		basebuttons.insert(0, this.addBtnNameRuleDelete());
		basebuttons.insert(0, this.addBtnNameRuleUpdate());
		basebuttons.insert(0, this.addBtnNameRuleCreate());
		basebuttons.insert(0, this.addBtnNameRuleClear());

		var self = this;
		this.on('afterrender', function() {
			var sup = self.getSupplement();
		});
	},

	buildForm : function(me) {
		var nameRuleStore = Ext.create('SYS.store.NameRule');
		nameRuleStore.getProxy().url = 'namerule/getNameRuleList';
		nameRuleStore.load();

		var nameRuleDefineStore = Ext.create('SYS.store.NameRuleDefine');
		nameRuleDefineStore.getProxy().url = 'namerule/getNameRuleDefineListByRuleId';

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
					title : 'NameRule',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'nameRuleGridId',
					forceFit : true,
					flex : 1,
					minHeight : 370,
					store : nameRuleStore,
					columns : [{
						header : 'NameRule名称',
						dataIndex : 'name',
						flex : 1
					}, {
						header : 'NameRule代码',
						dataIndex : 'code',
						flex : 1
					}],
					bbar : SF.getContextBbar(nameRuleStore)
				}, {
					xtype : 'form',
					border : false,
					itemId : 'nameRuleFormId',
					cls : 'marginT7',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					bodyCls : 'paddingAll10',
					flex : 1,
					items : [{
						xtype : 'hidden',
						name : 'id'
					}, {
						xtype : 'textfield',
						fieldLabel : '代码',
						labelWidth : 70,
						name : 'code'
					}, {
						xtype : 'textfield',
						labelWidth : 70,
						fieldLabel : '名称 ',
						name : 'name'
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
					title : '定义',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'nameRuleDefineGridId',
					forceFit : true,
					minHeight : 370,
					store : nameRuleDefineStore,
					columns : [{
						header : '序号',
						dataIndex : 'idx',
						flex : 1
					}, {
						header : '名称',
						dataIndex : 'name',
						flex : 1
					}, {
						header : '长度',
						dataIndex : 'length',
						flex : 1
					}, {
						header : '类型',
						dataIndex : 'genType',
						flex : 1
					}, {
						header : '值',
						dataIndex : 'value',
						flex : 1
					}, {
						header : '步长',
						dataIndex : 'step',
						flex : 1
					}]
				}, {
					xtype : 'form',
					border : false,
					cls : 'marginT7',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					itemId : 'nameRuleDefineFormId',
					bodyCls : 'paddingAll10',
					flex : 1,
					items : [{
						xtype : 'hidden',
						name : 'id'
					}, {
						xtype : 'hidden',
						name : 'rule.id',
						itemId : 'rule.id'
					}, {
						xtype : 'container',
						layout : {
							type : 'hbox',
							align : 'stretch'
						},
						items : [{
							xtype : 'numberfield',
							fieldLabel : '序号',
							minValue : 1,
							labelWidth : 60,
							name : 'idx',
							cls:'marginR7',
							flex : 1
						}, {
							xtype : 'numberfield',
							fieldLabel : '长度 ',
							labelWidth : 60,
							name : 'length',
							flex: 1,
							minValue : 1
						}]
					}, {
						xtype : 'container',
						cls:'marginT5',
						layout : {
							type : 'hbox',
							align : 'stretch'
						},
						items : [{
							xtype : 'combobox',
							fieldLabel : '类型',
							labelWidth : 60,
							store : Ext.create('Ext.data.ArrayStore', {
								fields : ['code', 'value'],
								data : [['prefix', '固定前缀'], ['calendar', '日期'], ['userdefine', '用户定义'], ['sequence', '序列']]
							}),
							valueField : 'code',
							displayField : 'value',
							name : 'genType',
							allowBlank : false,
							triggerAction : 'all',
							fieldLabel : '选择类型',
							itemId : 'genType',
							editable : false,
							queryMode : 'local',
							selectOnTab : true,
							lazyRender : true,
							cls:'marginR7',
							flex: 1
						}, {
							xtype : 'numberfield',
							fieldLabel : '步长',
							labelWidth : 60,
							name : 'step',
							minValue : 1,
							flex: 1
						}]
					}, {
						xtype : 'textfield',
						cls:'marginT5',
						fieldLabel : '名称 ',
						labelWidth : 60,
						name : 'name'
					}, {
						xtype : 'textfield',
						cls:'marginT5',
						fieldLabel : '值 ',
						labelWidth : 60,
						name : 'value'
					}]
				}]
			}]
		};
	}
});