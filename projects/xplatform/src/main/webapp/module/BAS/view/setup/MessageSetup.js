/**
 * @class (BAS.view.setup.MessageSetup) 메시지를 정의하는 역할을 수행하며, 사용자는 메시지를
 *        Create/Update/Delete 할 수 있다. 메시지는 3가지 언어로 정의될 수 있으며, Message 의 분류를 위해
 *        Message Group 을 사용한다.
 * @extends MES.view.form.BaseForm
 * @author Kyunghyang, Seungho Kuk
 * 
 * @cfg
 * 
 */

Ext.define('BAS.view.setup.MessageSetup', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Other.Message Setup'),

	requires : [ 'BAS.model.BasViewMessageOut' ],

	formReader : {
		url : 'service/basViewMessage.json',
		model : 'BAS.model.BasViewMessageOut'
	},

	buttonsOpt : [ {
		itemId : 'btnCreate',
		url : 'service/basUpdateMessage.json'
	}, {
		itemId : 'btnUpdate',
		url : 'service/basUpdateMessage.json'
	}, {
		itemId : 'btnDelete',
		url : 'service/basUpdateMessage.json',
		confirm : {
			fields : {
				field1 : 'msgId'
			}
		}
	} ],

	initComponent : function() {
		this.items = this.zmessage;
		this.callParent();

		var self = this;

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.sub('cmbMsgGroup').store.load({
				params : {
					procstep : '1'
				},
				callback : function(records, operation, success) {
					if (success) {
						if (records.length != 0) {
							var msgGrp = records[0].data.msgGrp;
							supplement.sub('cmbMsgGroup').setValue(msgGrp);
						}
					}
				}
			});

			supplement.sub('cmbMsgGroup').on('change', function(field, value) {
				supplement.refreshGrid(true, 0);
			});

			supplement.on('supplementSelected', function(record) {
				self.setKeys({
					msgId : record.get('msgId')
				});
			});
		});
		
		this.on('keychange', function(view, keys) {
			if(!keys)
				return;

			self.reloadForm(keys);
		});
	},

	onAfterCreate : function(form, action, success) {
		if (success) {
			var msgId = form.getValues().msgId;
			var select = {
				column : 'msgId',
				value : msgId
			};

			this.getSupplement().refreshGrid(true, select);

			this.setKeys({
				msgId : msgId
			});
		}
	},

	onAfterUpdate : function(form, action, success) {
		if (success) {
			var msgId = form.getValues().msgId;
			var select = {
				column : 'msgId',
				value : msgId
			};

			this.getSupplement().refreshGrid(true, select);

			this.reloadForm({
				msgId : msgId
			});
		}
	},

	onAfterDelete : function(form, action, success) {
		if (success) {
			this.getSupplement().refreshGrid(true);

			this.getForm().getFields().each(function(f) {
				f.setValue(null);
			});
		}
	},

	checkCondition : function(step, form, addParams) {
		// msgID, msgGrp, msg1 빈값은 allowblank 체크
		return true;
	},

	reloadForm : function(record) {
		this.formLoad({
			procstep : '1',
			msgId : record.msgId
		});
	},

	buildSupplement : function() {
		return {
			xtype : 'gridsup',
			
			title : T('Caption.Other.Message Setup'),
			
			autoFormLoad : false,
			
			fields : [ {
				xtype : 'container',
				itemId : 'filters',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				height : 26,
				defaults : {
					labelSeparator : '',
					labelAlign : 'left'
				},
				items : [ {
					xtype : 'combobox',
					fieldLabel : T('Caption.Other.Message Group'),
					allowBlank : false,
					editable : false,
					labelStyle : 'font-weight:bold',
					itemId : 'cmbMsgGroup',
					name : 'msgGrp',
					store : Ext.create('BAS.store.BasViewMessageGroupListOut.MsgGrp', {
						params : {
							procstep : '1'
						}
					}),
					displayField : 'msgGrp',
					valueField : 'msgGrp',
					queryMode : 'local',
					flex : 1
				} ]
			} ],

			// grid의 message description 는 procstep를 1로 주면 language에 맞추어 가주어 오기
			// 때문에 MPGV.gcLanguage를 할 필요가 없다
			grid : {
				searchField : 'msgId',
				columnLines : true,
				autoRefresh : false, // Grid 가 Refresh 되는 시점을 설정
				store : Ext.create('BAS.store.BasViewMessageListOut.MsgList'),
				columns : [ {
					header : T('Caption.Other.Message ID'),
					flex : 1,
					dataIndex : 'msgId'
				}, {
					header : T('Caption.Other.Message'),
					flex : 1,
					dataIndex : 'msg'
				} ]
			}
		};
	},

	buildHiddenForm : function() {
		return {
			xtype : 'hidden',
			itemId : 'txtMsgGrp',
			name : 'msgGrp'
		};
	},

	// 국제화는 MES 모듈에서 사용하며 없는 부분은 각각의 모듈에 국제화를 추가한다.
	buildForm : function() {
		return [ {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Message ID'),
			labelStyle : 'font-weight:bold',
			maxLength : 10,
			enforceMaxLength : true,
			allowBlank : false,
			itemId : 'txtMsgId',
			labelWidth : 120,
			name : 'msgId'
		}, {
			xtype : 'separator'
		}, {
			xtype : 'textareafield',
			fieldLabel : T('Caption.Other.Message 1'),
			labelStyle : 'font-weight:bold',
			allowBlank : false,
			labelWidth : 120,
			maxLength : 200,
			enforceMaxLength : true,
			itemId : 'txtareaMsg1',
			name : 'msg1',
			height : 80,
			cls : 'marginT10'
		}, {
			xtype : 'textareafield',
			fieldLabel : T('Caption.Other.Message 2'),
			labelWidth : 120,
			maxLength : 200,
			enforceMaxLength : true,
			itemId : 'txtareaMsg2',
			name : 'msg2',
			height : 80
		}, {
			xtype : 'textareafield',
			fieldLabel : T('Caption.Other.Message 3'),
			labelWidth : 120,
			maxLength : 200,
			enforceMaxLength : true,
			itemId : 'txtareaMsg3',
			name : 'msg3',
			height : 80
		}, {
			xtype : 'userstamp'
		} ];
	}
});
