/**
 * @class CMN.view.form.DateTimeField **xtype : datetimex ** Date field와 Time
 *        field 를 함께 적용한 필드이다. 값을 변경시 숨겨져 있는 value 필드에 사용자 정의 포멧으로 변환되어 값이 적용됮다.
 *        이벤트 및 호출자는 숨겨진 필드의 name을 호출하여 사용한다. 기본적인 속성은 Data, Time field와
 *        동일하다.(fieldLabel, name등)
 * 
 * @example Ext.define('ConditionTest',{ extend : 'Ext.panel.Panel', title :
 *          'Condition Test', initComponent : function() { this.callParent(); },
 *          items : [ { xtype : 'datetimex', fieldLabel : 'START', name :
 *          'start_date', type : 'datetime' } ], renderTo : Ext.getBody() });
 * 
 * @extends Ext.form.FieldContainer
 * @author Kyunghyang
 * 
 * @cfg {String} xtype 'dateperiod' items 속성 값으로 xtype : 'dateperiod'를 선언하여
 *      사용한다.
 * @cfg {String} type date/time/datetime 3가지 type에 따라 화면에 적용된다.
 * @cfg {String} dateFormat 화면에 표시되는 date 포멧을 설정한다. default : 'Y-m-d'
 *      (2012-01-01)
 * @cfg {String} timeFormat 화면에 표시되는 time 포멧을 설정한다. default : 'H-i' (01:01)
 * @cfg {String} valueDateFormat value 필드의 date 포멧을 설정한다. defalut : 'Ymd'
 *      (20120101)
 * @cfg {String} valueTimeFormat value 필드의 time 포멧을 설정한다. default : 'Hi' (0101)
 * @cfg {String} defaultValue 화면에 표시될때 기본 표시 일자를 설정한다.
 */
Ext.define('CMN.view.form.DateTimeField', {
	extend : 'Ext.form.FieldContainer',
	alias : 'widget.datetimex',

	cls : 'hboxLine',

	layout : {
		type : 'hbox',
		align : 'top'
	},
	labelWidth : 100,
	fieldWidth : 250,

	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},
	initComponent : function() {
		this.width = this.width || (this.labelWidth + this.fieldWidth + 8);
		if (this.timeFormat && !this.valueTimeFormat) {
			var re = new RegExp("\:|\-|\\s|\,\.\\/", "gi");
			this.valueTimeFormat = this.timeFormat.replace(re, "");
		}

		this.items = this.buildItems();

		this.callParent();
		var self = this;
		this.down('#valueField').on('change', function(me, value) {
			self.setValue(value);
		});
	},

	/* 설정한 type에 따른 필드 생성 */
	buildItems : function() {
		var fieldId = 'valueField';
		var valueDateFormat = this.getValueDateFormat();
		var valueTimeFormat = this.getValueTimeFormat();
		var submitValueDate = this.submitValueDate == true ? true : false;
		var submitValue = this.submitValue == false ? false : true;
		var allowBlank = this.allowBlank == false ? false : true;
		return [ {
			xtype : 'textfield',
			hidden : true,
			name : this.name,
			itemId : fieldId,
			submitValue : submitValue,
			allowBlank : allowBlank, // default : true
			value : this.getDefaultValue()
		}, {
			listeners : {
				change : function(field, newValue, oldValue) {
					var container = this.up('fieldcontainer');
					var valueField = container.getComponent(fieldId);
					var timeField = container.getComponent('time' + fieldId);
					var timeVal = '';
					var valueString = '';
					if (newValue && field.validate()) {
						valueString = Ext.Date.format(newValue, valueDateFormat);
					}

					timeVal = timeField.getValue();
					if (!timeVal || valueString == '')
						timeVal = '';
					else
						timeVal = Ext.Date.format(timeVal, valueTimeFormat);

					valueField.setRawValue(valueString + timeVal);
					valueField.lastValue = valueString + timeVal;
				}
			},
			xtype : 'datefield',
			format : this.getDateFormat(),
			name : this.name + '_date',
			value : this.defaultValue,
			itemId : 'date' + fieldId,
			submitValue : submitValueDate, // default : false
			allowBlank : allowBlank, // default : true
			flex : 5
		}, {
			listeners : {
				change : function(field, newValue, oldValue) {
					var container = this.up('fieldcontainer');
					var valueField = container.getComponent(fieldId);
					var dateField = container.getComponent('date' + fieldId);
					var dateVal = '';
					var valueString = '';

					if (newValue && field.validate()) {
						valueString = Ext.Date.format(newValue, valueTimeFormat);
					}
					if (dateField) {
						dateVal = dateField.getValue();
						if (!dateVal)
							return;
						dateVal = Ext.Date.format(dateVal, valueDateFormat);
						valueField.setRawValue(dateVal + valueString);
						valueField.lastValue = dateVal + valueString;
					} else {
						valueField.setRawValue(valueString);
						valueField.lastValue = valueString;
					}
				}
			},
			xtype : 'timefield',
			cls : 'marginL3',
			format : this.getTimeFormat(),
			name : this.name + '_time',
			value : this.defaultValue,
			itemId : 'time' + fieldId,
			submitValue : submitValueDate, // default : false
			allowBlank : allowBlank, // default : true
			flex : 4
		} ];
	},

	setValue : function(value) {
		var datetime = value || '';

		if (Ext.typeOf(datetime) == 'string' && datetime != '') {
			datetime = new Date(Number(value.substr(0, 4)), Number(value.substr(4, 2)) - 1, Number(value.substr(6, 2)), Number(value.substr(8, 2)),
					Number(value.substr(10, 2)), Number(value.substr(12, 2)));
		}

		// TODO 2012-08-29 김진호 form 데이타 로드시 dirty = false 설정하기 위해 resetOriginalValue
		// 함수호출
		var dateField = this.down('#datevalueField');
		var timeField = this.down('#timevalueField');
		if (dateField) {
			dateField.setValue(datetime);
			dateField.resetOriginalValue();
		}
		if (timeField) {
			timeField.setValue(datetime);
			timeField.resetOriginalValue();
		}
	},
	getValue : function() {
		var value = this.down('#valueField').getValue();
		return value;
	},
	/*
	 * 초기값을 data 와 time을 분리하여 설정된 포멧으로 변경 후 각 필드에 적용한다.
	 */
	getDefaultValue : function() {
		var valueFormat = this.getValueDateFormat() + this.getValueTimeFormat();
		if (this.defaultValue) {
			if (this.type == 'date') {
				valueFormat = this.getValueDateFormat();
			} else if (this.type == 'time') {
				valueFormat = this.getValueTimeFormat();
			}
			return Ext.Date.format(this.defaultValue, valueFormat);
		}
		return '';
	},
	/* value date의 포멧설정 */
	getValueDateFormat : function() {
		if (this.valueDateFormat)
			return this.valueDateFormat;
		return 'Ymd'; // 99991231
	},
	/* value time의 포멧 설정 */
	getValueTimeFormat : function() {
		if (this.valueTimeFormat)
			return this.valueTimeFormat;
		return 'Hi'; // 2301
	},
	/* date 필드의 포멧설정 */
	getDateFormat : function() {
		if (this.dateFormat)
			return this.dateFormat;
		return 'Y-m-d';// 9999-12-31
	},
	/* time 필드의 포멧설정 */
	getTimeFormat : function() {
		if (this.timeFormat)
			return this.timeFormat;
		return 'H:i'; // 23:01
	}
});