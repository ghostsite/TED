Ext.define('SYS.view.namerule.NameRuleManage', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'admin_namerule',
	requires : ['SYS.model.NameRule','SYS.model.NameRuleItem', 'SYS.model.NameRulePrefix', 'SYS.model.NameRuleUserDef', 'SYS.model.NameRuleDateTime', 'SYS.model.NameRuleSequence'],
	title : T('Caption.Menu.SYS.view.namerule.NameRuleManage'),

	addBtnNameRuleGenerate : function() { // 生成最终的code
		var me = this;
		return {
			xtype : 'button',
			text : '生成',
			itemId : 'btnNameRuleGenerate',
			disabled : true
		};
	},

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

	addBtnNameRuleItemDelete : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '删除',
			itemId : 'btnNameRuleItemDelete',
			disabled : true
		};
	},

	addBtnNameRuleItemUpdate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '变更',
			itemId : 'btnNameRuleItemUpdate',
			disabled : true
		}
	},

	addBtnNameRuleItemCreate : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '创建',
			disabled : true,
			itemId : 'btnNameRuleItemCreate'
		}
	},

	addBtnNameRuleItemClear : function() {
		var me = this;
		return {
			xtype : 'button',
			text : '清空',
			disabled : true,
			itemId : 'btnNameRuleItemClear'
		}
	},

	initComponent : function() {
		this.callParent();

		var basebuttons = this.getButtons();
		basebuttons.insert(1, this.addBtnNameRuleItemDelete());
		basebuttons.insert(1, this.addBtnNameRuleItemUpdate());
		basebuttons.insert(1, this.addBtnNameRuleItemCreate());
		basebuttons.insert(1, this.addBtnNameRuleItemClear());

		basebuttons.insert(0, this.addBtnNameRuleGenerate());
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

		var nameRuleItemStore = Ext.create('SYS.store.NameRuleItem');
		nameRuleItemStore.getProxy().url = 'namerule/getNameRuleItemListByRuleId';

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
					}]
				}, {
					xtype : 'form',
					border : false,
					itemId : 'nameRuleFormId',
					cls : 'marginT5',
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
						name : 'code',
						itemId: 'code'
					}, {
						xtype : 'textfield',
						labelWidth : 70,
						fieldLabel : '名称 ',
						name : 'name',
						itemId : 'name'
					}, {
						xtype : 'textarea',
						fieldLabel : '备注',
						labelWidth : 70,
						height: 40,
						name : 'remark'
					}]
				}]
			}, {
				xtype : 'container',
				flex : 2,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'end'
				},
				items : [{
					xtype : 'grid',
					title : '项目',
					cls : 'navyGrid',
					stripeRows : true,
					autoScroll : true,
					itemId : 'nameRuleItemGridId',
					forceFit : true,
					minHeight : 370,
					store : nameRuleItemStore,
					columns : [{
						header : '序号',
						dataIndex : 'idx',
						flex : 1
					}, {
						header : '类型',
						dataIndex : 'category',
						renderer: function(val){
							if(val =='prefix'){
								return '固定前缀';
							}else if(val =='userdef'){
								return '用户定义';
							}if(val =='datetime'){
								return '日期';
							}if(val =='sequence'){
								return '序列';
							}
						},
						flex : 2
					}, {
						header : '前缀',
						dataIndex : 'prefix',
						flex : 2
					}, {
						header : '日期格式',
						dataIndex : 'dateFormat',
						flex : 2
					}, {
						header : '序列格式',
						dataIndex : 'seqFormat',
						flex : 2
					}, {
						header : '初始值',
						dataIndex : 'initValue',
						flex : 1
					}, {
						header : '当前值',
						dataIndex : 'currentValue',
						flex : 1
					}, {
						header : '步长',
						dataIndex : 'step',
						flex : 1
					}]
				}, {
					xtype : 'form',
					border : false,
					cls : 'marginT5',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					itemId : 'nameRuleItemFormId',
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
							itemId : 'idx',
							cls : 'marginR7',
							flex : 1
						}, {
							xtype : 'combobox',
							fieldLabel : '类型',
							labelWidth : 60,
							store : Ext.create('Ext.data.ArrayStore', {
								fields : ['code', 'value'],
								data : [['prefix', '固定前缀'], ['datetime', '日期'], ['userdef', '用户定义'], ['sequence', '序列']]
							}),
							valueField : 'code',
							displayField : 'value',
							name : 'category',
							allowBlank : false,
							triggerAction : 'all',
							fieldLabel : '选择类型',
							itemId : 'category',
							editable : false,
							value : 'userdef',
							queryMode : 'local',
							selectOnTab : true,
							lazyRender : true,
							flex : 1,
							listeners : {
								//select : function(combo, records) {
									//me.fireEvent('categoryChanged', combo, records);
								//},
								change : function(combo, newValue, oldValue) {
									me.fireEvent('categoryChanged', combo, newValue, oldValue);
								}
							}
						}]
					}, {
						xtype : 'fieldcontainer',
						layout : 'card',
						anchor : '50%',
						itemId : 'itemDetail',
						cls : 'marginT5',
						items : [{
							xtype : 'textfield',
							fieldLabel : '前缀',
							name : 'prefix',
							labelWidth : 60
						}, {
							xtype : 'textfield',
							fieldLabel : '格式',
							name : 'dateFormat',
							labelWidth : 60
						}, {
							xtype : 'container',
							layout :  'fit',
							items : [{
								xtype : 'container',
								layout : {
									type : 'hbox',
									align : 'stretch'
								},
								items : [{
									xtype : 'textfield',
									fieldLabel : '格式 ',
									cls : 'marginR7',
									labelWidth : 60,
									name : 'seqFormat',
									flex : 1
								}, {
									xtype : 'numberfield',
									fieldLabel : '步长',
									labelWidth : 60,
									name : 'step',
									minValue : 1,
									flex : 1
								}]
							}, {
								xtype : 'container',
								layout : {
									type : 'hbox',
									align : 'stretch'
								},
								cls : 'marginT5',
								items : [{
									xtype : 'numberfield',
									fieldLabel : '初始值 ',
									labelWidth : 60,
									cls : 'marginR7',
									name : 'initValue',
									minValue : 1,
									flex : 1
								}, {
									xtype : 'numberfield',
									fieldLabel : '当前值',
									labelWidth : 60,
									name : 'currentValue',
									minValue : 1,
									flex : 1
								}]
							}]
						}]
					}]
				}]
			}]
		};
	}
});