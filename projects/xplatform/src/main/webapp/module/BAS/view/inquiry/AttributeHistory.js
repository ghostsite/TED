/**
 * @class BAS.view.inquiry.AttributeHistory
 * @extends Ext.form.Panel
 * @author MyeungKyu You
 * 
 */

/*
 * 2012-07-16 수정 - 김진호 supplement key 코드뷰에 select 이벤트 추가 화면에 this.params가 넘어올경우
 * 처리부부분을 변수(params -> opt), 이벤트(afterrender -> show) 변경하였다.
 * longLengthAttrValueFlag == Y인 record 데이타만 detail 보기 가능 supplement reset 버튼
 * 클릭시 content 화면 초기화
 */

Ext.define('BAS.view.inquiry.AttributeHistory', {
	extend : 'MES.view.form.BaseForm',

	title : T('Caption.Menu.View Attribute History'),

	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	itemId : 'WBAS3002',
	
	buttonsOpt : [ {
		itemId : 'btnExport',
		targetGrid : 'grdAttributeHis',
		url : 'service/basViewAttributeHistoryList.xls'
	}, {
		itemId : 'tbfill'
	} ],
	
	initComponent : function() {

		this.store = Ext.create('BAS.store.BasViewAttributeHistoryListOut.histList', {
			params : {
				procstep : '1'
			}
		});

		this.callParent();

		var self = this;

		this.on('afterrender', function() {
			var supplement = self.getSupplement();

			supplement.sub('cdvAttrType').on('change', function(field, value) {
				self.changeCdvAttrKey(value[0]);
			});

			supplement.on('supplementSelected', function(data) {
				delete data.procstep;
				self.setKeys(data);
			});

			supplement.on('supplementReset', function() {
				var field = this.sub('cdvAttrType');
				field.fireEvent('change', field, [ 'RESET' ]);
				self.sub('txtType').setValue('');
				self.sub('txtKey').setValue('');
				self.sub('grdAttributeHis').store.removeAll();
			});
		});

		this.on('keychange', function(view, keys) {
			if (!keys)
				return;

			var data = Ext.clone(keys);
			var supplement = self.supplement;

			if (data.attrType == 'MATERIAL' && !data.attrKey) {
				var arrAttrKey = data.attrKey.split(':');
				data.attrKey = arrAttrKey.length > 0 ? arrAttrKey[0].trim() : '';
				data.attrVer = arrAttrKey.length > 1 ? arrAttrKey[1].trim() : '';
			}

			var cdvAttrKey = supplement.down('#cdvAttrKey');
			if (cdvAttrKey.disabled == true) {
				self.changeCdvAttrKey(data.attrType);
			}
			var form = supplement.getForm().setValues(data);
			var values = form.getValues();

			this.reloadForm(values);
		});

		var grid = this.sub('grdAttributeHis');
		grid.on('select', function(sm, record) {
			if (record) {
				// longLengthAttrValueFlag는 value값이 100바이트 이상이면 Y이다.
				if (record.get('longLengthAttrValueFlag') == 'Y') {
					self.sub('btnDetail').enable();
				} else {
					self.sub('btnDetail').disable();
				}
			}
		});

		var basebuttons = this.sub('basebuttons');
		basebuttons.addItem(1, this.zbtnDetail);

		basebuttons.sub('btnDetail').on('click', function() {
			var selModel = self.sub('grdAttributeHis').getSelectionModel();
			var record = selModel.selected.getAt(0);
			if (record) {
				self.onBtnDetail(record);
			}

		});

	},

	changeCdvAttrKey : function(attrType) {
		var supplement = this.supplement;
		var cdvAttrKey = supplement.down('#cdvAttrKey');
		var container = cdvAttrKey.up();

		container.remove(cdvAttrKey, true);

		var newCdvAttrKey = this.getAttrKeyField(attrType);

		newCdvAttrKey = container.insert(1, newCdvAttrKey);

		newCdvAttrKey.on('specialkey', function(me, e) {
			if (e.getKey() == e.ENTER) {
				supplement.onBtnView();
			}
		});

		newCdvAttrKey.on('select', function(record) {
			supplement.onBtnView();
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
		var grid = this.sub('grdAttributeHis');
		/*
		 * data는 keys 파라미터 오브젝트이므로, 이 내부에서 변질시켜서는 안된다.
		 */
		var key = data.attrKey;

		if (data.attrVer)
			key = data.attrKey + " : " + data.attrVer;

		var params = {
			procstep : '1',
			includeDelHist : data.includeDelHist,
			fromTranTime : data.fromTranTime,
			toTranTime : data.toTranTime,
			attrKey : key,
			attrType : data.attrType
		};
		// ShiftDate 계산 및 적용(fromTime~toTime)
		var fromTranTime = Ext.Date.parse(params.fromTranTime, "Ymd");
		var toTranTime = Ext.Date.parse(params.toTranTime, "Ymd");
		params.fromTranTime = SF.cf.fromShiftDate(fromTranTime);
		params.toTranTime = SF.cf.toShiftDate(toTranTime);

		grid.store.sort('tranTime', 'DESC');

		grid.store.load({
			params : params,
			callback : function(records, operation, success) {
				if (!success || !records)
					return;

				grid.lastParams = params; // Export시 필요한 params값 저장
			},
			scope : this
		});

		grid.attrKey = key;
		this.sub('txtType').setValue(data.attrType);
		this.sub('txtKey').setValue(key);

		// history 버튼으로 넘어왔을경우 opt를 사용하고 reloadForm을 한후 메모리상에서 해제한다.
		if (this.opt) {
			this.opt = null;
		}
	},

	getAttrKeyField : function(typeValue, setValue) {
		var attrKey = {};
		var value = setValue || '';

		switch (typeValue) {
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

			break;

		default:
			attrKey = {
				xtype : 'textfield',
				fieldLabel : typeValue + ' ' + T('Caption.Other.Key'),
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
			labelStyle : 'font-weight:bold',
			value : value
		});

		return attrKey;
	},

	onBeforeExport : function(form, addParams, url) {
		var grid = this.sub('grdAttributeHis');
		if (!grid || !grid.lastParams)
			return false;
		
		var btnExport = this.getButtons().getItem('btnExport');
		btnExport.title = this.title+'-'+this.sub('txtType').getValue()+'-'+this.sub('txtKey').getValue();
		
		Ext.apply(addParams, grid.lastParams);
	},
	
	onBtnDetail : function(record) {
		var win = Ext.create('BAS.view.inquiry.AttributeDetailHistory', {
			record : record
		});

		win.show();
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
					labelAlign : 'top'
				},
				items : [ {
					xtype : 'codeview',
					fieldLabel : T('Caption.Other.Type'),
					allowBlank : false,
					labelStyle : 'font-weight:bold',
					itemId : 'cdvAttrType',
					codeviewName : 'AttributeType',
					fields : [ {
						name : 'attrType',
						enforceMaxLength : true,
						value : '',
						maxLength : 20,
						column : 'key1'
					} ],
					height : 46
				}, {
					xtype : 'codeview',
					fieldLabel : T('Caption.Other.Key'),
					itemId : 'cdvAttrKey',
					labelStyle : 'font-weight:bold',
					allowBlank : false,
					disabled : true,
					height : 46
				}, {
					xtype : 'dateperiod',
					fieldLabel : T('Caption.Other.Period'),
					labelStyle : 'font-weight:bold',
					allowBlank : false,
					cls : 'marginT3',
					height : 46,
					itemId : 'period',
					defaultValue : Ext.Date.add(new Date(), Ext.Date.DAY, 0),
					period : '1m', // number정의 : 일단위 , 일단위 :'-30d'/-10,
					// 월단위:'-2m', 년단위:'-1y'
					fromName : 'fromTranTime',
					toName : 'toTranTime',
					layout : 'hbox'
				}, {
					xtype : 'checkbox',
					boxLabel : T('Caption.Other.Include Delete History'),
					itemId : 'chkDelHist',
					name : 'includeDelHist',
					inputValue : 'Y',
					cls : 'marginT5',
					uncheckedValue : ' '
				} ]
			} ]
		};
	},

	buildForm : function() {
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
			xtype : 'grid',
			itemId : 'grdAttributeHis',
			cls : 'navyGrid',
			flex : 1,
			autoScroll : true,
			columnLines : true,
			store : this.store,
			features : Ext.create('Ext.grid.feature.Grouping', {
				groupHeaderTpl : 'Seq : {name}'
			}),
			viewConfig : {
				getRowClass : function(record, rowIndex, rowParams, store) {
					if (record.get('histDelFlag') == 'Y') {
						return 'textColorRed';
					}
				}
			},
			columns : [ {
				text : T('Caption.Other.Seq'),
				dataIndex : 'histSeq',
				align : 'center',
				width : 50,
				renderer : function(value, metaData, record, rowIdx, colIdx, store) {
					metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special ' + '';
					return value;
				}
			}, {
				text : T('Caption.Other.Attribute Name'),
				dataIndex : 'attrName',
				width : 140
			}, {
				text : T('Caption.Other.Old Value'),
				dataIndex : 'attrOldValue',
				width : 100
			}, {
				text : T('Caption.Other.New Value'),
				dataIndex : 'attrNewValue',
				width : 100
			}, {
				text : T('Caption.Other.Null'),
				dataIndex : 'nullFlag',
				align : 'center',
				width : 100
			}, {
				text : T('Caption.Other.Tran Time'),
				dataIndex : 'tranTime',
				width : 140
			}, {
				text : T('Caption.Other.System Tran Time'),
				dataIndex : 'sysTranTime',
				width : 140
			}, {
				text : T('Caption.Other.Hist Seq'),
				dataIndex : 'keyHistSeq',
				align : 'center',
				width : 90
			}, {
				text : T('Caption.Other.Prev Active Hist Seq'),
				dataIndex : 'prevActiveHistSeq',
				align : 'center',
				width : 90
			}, {
				text : T('Caption.Other.Hist Start Seq'),
				dataIndex : 'histStartSeq',
				align : 'center',
				width : 90
			}, {
				text : T('Caption.Other.Hist Delete Flag'),
				dataIndex : 'histDelFlag',
				width : 90
			}, {
				text : T('Caption.Other.Hist Delete Time'),
				dataIndex : 'histDelTime',
				width : 140
			}, {
				text : T('Caption.Other.Hist Delete User ID'),
				dataIndex : 'histDelUserId',
				width : 140
			}, {
				text : T('Caption.Other.Hist Delete Comment'),
				dataIndex : 'histDelComment',
				width : 140
			}, {
				type : 'hidden',
				dataIndex : 'longLengthAttrValueFlag',
				width : 0
			} ]
		} ];
	},

	zbtnDetail : {
		xtype : 'button',
		text : T('Caption.Button.Detail'),
		disabled : true,
		itemId : 'btnDetail'
	},

	zbtnGroup : {
		xtype : 'button',
		text : 'Grouping',
		enableToggle : true,
		pressed : true,
		itemId : 'btnGroup'
	}
});