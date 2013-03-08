/**
 * @class BAS.view.common.AttributeStatus
 * @extexnd MES.view.form.BaseForm
 * @author MyeungKyu You
 */

/*
 * 2012-07-16 수정 - 김진호 supplement key 코드뷰에 select 이벤트 추가 supplement reset 버튼 클릭시
 * content 화면 초기화
 */
Ext.define('BAS.view.inquiry.AttributeStatus', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Menu.View Attribute Status'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	buttonsOpt : [ {
		itemId : 'btnExport',
		targetGrid : 'grdAttribute',
		url : 'service/basViewAttributeValueBrief.xls'
	}, {
		itemId : 'tbfill'
	} ],

	initComponent : function() {
		this.callParent();

		var self = this;
		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.sub('cdvAttrType').on('change', function(field, value) {
				var attrKey = supplement.down('#cdvAttrKey');
				var attrName = supplement.down('#cdvAttrName');

				attrName.setValue('');
				attrName.enable();

				var container = field.up();

				container.remove(attrKey, true);

				switch (value[0]) {

				case 'MATERIAL':
					attrKey = {
						fieldLabel : T('Caption.Other.Material'),
						codeviewName : 'TbMaterial',
						name : [ 'attrKey', 'attrVer' ]
					};
					break;
				case 'FACTORY':
					attrKey = {
						fieldLabel : T('Caption.Other.Factory'),
						codeviewName : 'TbFactory'
					};
					break;
				case 'FLOW':
					attrKey = {
						fieldLabel : T('Caption.Other.Flow'),
						codeviewName : 'TbFlow'
					};
					break;
				case 'OPER':
					attrKey = {
						fieldLabel : T('Caption.Other.Operation'),
						codeviewName : 'TbOperation'
					};
					break;
				case 'BOM':
					attrKey = {
						fieldLabel : T('Caption.Other.BOM Set ID'),
						codeviewName : 'TbBomSet',
						popupConfig : {
							viewConfig : {
								getRowClass : function(record, rowIndex, rowParams, store) {
									if (record.get('deleteFlag') == 'Y') {
										return 'textColorBlue';
									}
								}
							}
						}
					};

					break;
				case 'RESOURCE':
					attrKey = {
						fieldLabel : T('Caption.Other.Resource'),
						codeviewName : 'TbResource'
					};
					break;
				case 'CARRIER':
					attrKey = {
						fieldLabel : T('Caption.Other.Carrier'),
						codeviewName : 'TbCarrier'
					};
					break;
				case 'RESET':
					attrKey = {
						fieldLabel : T('Caption.Other.Key'),
						disabled : true
					};
					attrName.disable();
					break;
				default:
					attrKey = {
						xtype : 'textfield',
						fieldLabel : value[0] + ' ' + T('Caption.Other.Key'),
						enforceMaxLength : true,
						maxLength : 30,
						height : 46
					};
				}
				Ext.applyIf(attrKey, {
					itemId : 'cdvAttrKey',
					xtype : 'codeview',
					name : 'attrKey',
					allowBlank : false,
					height : 46,
					vtype : 'nospace',
					labelStyle : 'font-weight:bold'
				});
				attrKey = container.insert(1, attrKey);

				attrKey.on('select', function(record) {
					var data = supplement.getForm().getValues();
					self.reloadForm(data);
				});
			});

			supplement.on('supplementSelected', function(data) {
				self.reloadForm(data);
			});

			supplement.on('supplementReset', function() {
				var field = this.sub('cdvAttrType');
				field.fireEvent('change', field, [ 'RESET' ]);

				self.sub('txtType').setValue('');
				self.sub('txtKey').setValue('');
				self.sub('grdAttribute').attrLoad(null);
			});
		});
	},

	checkCondition : function(step, form, addParams) {
		switch (step) {
		case 'view':
			if (!Ext.String.trim(addParams.attrType)) {
				Ext.Msg.alert('Error', T('Message.ValidInput', {
					field1 : T('Caption.Other.Type')
				}));
				return false;
			} else if (!Ext.String.trim(addParams.attrKey)) {
				Ext.Msg.alert('Error', T('Message.ValidInput', {
					field1 : T('Caption.Other.Key')
				}));
				return false;
			}
			break;
		}
		return true;
	},

	reloadForm : function(data) {
		if (this.checkCondition('view', this, data) === false)
			return false;

		var grid = this.sub('grdAttribute');

		if (data.attrVer)
			data.attrKey = data.attrKey + " : " + data.attrVer;

		var params = {
			procstep : '1',
			attrType : data.attrType,
			attrKey : data.attrKey,
			attrFrom : data.attrFrom || 0,
			attrTo : data.attrTo || 100000
		};
		if (data.attrName)
			params.attrName = data.attrName;

		grid.attrLoad(params);
		this.sub('txtType').setValue(data.attrType);
		this.sub('txtKey').setValue(data.attrKey);
	},

	onBeforeExport : function(form, addParams, url) {
		var grid = this.sub('grdAttribute');
		if (!grid || !grid.lastParams)
			return false;
		
		var btnExport = this.getButtons().getItem('btnExport');
		btnExport.title = this.title+'-'+this.sub('txtType').getValue()+'-'+this.sub('txtKey').getValue();
		
		Ext.apply(addParams, grid.lastParams);
	},

	buildSupplement : function() {
		return {
			xtype : 'formsup',
			autoFormLoad : false,

			fields : [ {
				xtype : 'container',
				itemId : 'filters',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex : 1,
				defaults : {
					labelSeparator : '',
					labelAlign : 'top',
					vtype : 'nospace'
				},
				items : [ {
					xtype : 'codeview',
					fieldLabel : T('Caption.Other.Type'),
					allowBlank : false,
					labelStyle : 'font-weight:bold',
					itemId : 'cdvAttrType',
					codeviewName : 'AttributeType',
					name : 'attrType',
					height : 46
				}, {
					xtype : 'codeview',
					fieldLabel : T('Caption.Other.Key'),
					itemId : 'cdvAttrKey',
					labelStyle : 'font-weight:bold',
					disabled : true,
					height : 46
				}, {
					xtype : 'codeview',
					codeviewName : 'TbAttributeName',
					fieldLabel : T('Caption.Other.Name'),
					itemId : 'cdvAttrName',
					condition : [ {
						column : 'attrType',
						value : function(me) {
							var attrType = me.getSupplement().sub('cdvAttrType').getValue();
							if (Ext.isEmpty(attrType)) {
								Ext.Msg.alert('Error', T('Message.ValidInput', {
									field1 : T('Caption.Other.Type')
								}));
								return false;
							}
							return attrType;
						},
						scope : this
					} ],
					name : 'attrName',
					disabled : true,
					height : 46
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : T('Caption.Other.Sequence'),
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					height : 46,
					items : [ {
						xtype : 'numberfield',
						itemId : 'numAttrFrom',
						name : 'attrFrom',
						value : 0,
						minValue : 0,
						maxValue : 10000,
						flex : 1
					}, {
						xtype : 'label',
						text : '~',
						cls : 'marginR5'
					}, {
						xtype : 'numberfield',
						itemId : 'numAttrTo',
						name : 'attrTo',
						value : 10000,
						minValue : 0,
						maxValue : 10000,
						flex : 1
					} ]
				} ]
			} ]
		};
	},

	buildForm : function(main) {
		return [ {
			xtype : 'fieldcontainer',
			layout : 'anchor',
			defaults : {
				labelSeparator : '',
				labelWidth : 130,
				anchor : '100%'
			},
			items : [ {
				xtype : 'textfield',
				itemId : 'txtType',
				fieldLabel : T('Caption.Other.Type'),
				labelStyle : 'font-weight:bold',
				readOnly : true,
				submitValue : false
			}, {
				xtype : 'textfield',
				itemId : 'txtKey',
				fieldLabel : T('Caption.Other.Key'),
				labelStyle : 'font-weight:bold',
				readOnly : true,
				submitValue : false
			} ]
		}, {
			xtype : 'bas_attrgrid',
			itemId : 'grdAttribute',
			readOnly : true,
			flex : 1
		} ];
	}
});