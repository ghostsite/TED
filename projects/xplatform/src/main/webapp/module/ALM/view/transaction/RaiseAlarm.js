Ext.define('ALM.view.transaction.RaiseAlarm', {
	requires : [ 'ALM.model.AlmViewAlarmMsgOut' ],
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Menu.Raise Alarm'),
	alias : 'widget.alm_tran',
	formReader : {
		url : 'service/AlmViewAlarmMsg.json',
		model : 'ALM.model.AlmViewAlarmMsgOut'
	},

	buttonsOpt : [ {
		itemId : 'btnProcess',
		url : 'service/AlmRaiseAlarm.json',
		params : {
			procstep : '1'
		}
	} ],

	initComponent : function() {
		this.callParent();
		var self = this;

		this.on('afterrender', function() {

			// Material 코드뷰 변경시 Flow, Oper 값 자동 입력
			self.sub('cdvAlarm').on('select', function(record) {
				self.reloadForm(self);
			});
		});
	},

	reloadForm : function(self) {
		this.formLoad({
			procstep : '1',
			alarmId : self.sub('cdvAlarm').getValue()
		});
	},

	buildForm : function() {
		return [ {
			xtype : 'container',
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelWidth : 120
			},
			items : [ {
				xtype : 'container',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				defaults : {
					flex : 1,
					labelWidth : 120
				},
				items : [ {
					xtype : 'codeview',
					codeviewName : 'SERVICE',
					itemId : 'cdvAlarm',
					fieldLabel : T('Caption.Other.Alarm ID'),
					labelStyle : 'font-weight:bold',
					allowBlank : false,
					labelSepaator : '',
					popupConfig : {
						title : T('Caption.Other.Alarm ID'),
						columns : [ {
							header : T('Caption.Other.Alarm'),
							dataIndex : 'alarmId',
							flex : 2
						}, {
							header : T('Caption.Other.Description'),
							dataIndex : 'alarmDesc',
							flex : 2
						} ]
					},
					paramsScope : this,
					store : 'SEC.store.AlmViewAlarmMsgListOut.alarmList',
					params : {
						procstep : '1'
					},
					name : 'alarmId',
					fields : [ {
						column : 'alarmId',
						flex : 2
					} ]
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Set Clear Flag'),
					itemId : 'chkClearFlag',
					name : 'setClearFlag',
					cls : 'marginL10'
				} ]
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Lot ID'),
				itemId : 'txtLotId',
				cls : 'marginR5',
				name : 'lotId',
				anchor : '50%'
			}, {
				xtype : 'codeview',
				fieldLabel : T('Caption.Other.Resource ID'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				anchor : '50%',
				cls : 'marginR5',
				codeviewName : 'TbResource',
				name : 'resId'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Source ID 1'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				anchor : '50%',
				cls : 'marginR5',
				name : 'sourceId1'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Source Desc 1'),
				anchor : '50%',
				cls : 'marginR5',
				name : 'sourceDesc1'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Source ID 2'),
				anchor : '50%',
				cls : 'marginR5',
				name : 'sourceId2'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Source Desc 2'),
				anchor : '50%',
				cls : 'marginR5',
				name : 'sourceDesc2'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Source ID 3'),
				anchor : '50%',
				cls : 'marginR5',
				name : 'sourceId3'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Source Desc 3'),
				anchor : '50%',
				cls : 'marginR5',
				name : 'sourceDesc3'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Alarm Subject'),
				name : 'alarmSubject'
			}, {
				xtype : 'textareafield',
				fieldLabel : T('Caption.Other.Alarm Message'),
				name : 'alarmMsg',
				height : 80
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Comment 1'),
				name : 'alarmComment1'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Comment 2'),
				name : 'alarmComment2'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Comment 3'),
				name : 'alarmComment3'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Comment 4'),
				name : 'alarmComment4'
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Comment 5'),
				name : 'alarmComment5'
			} ]
		} ];
	}
});
