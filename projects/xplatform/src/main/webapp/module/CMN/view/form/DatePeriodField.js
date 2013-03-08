/**
 * @class CMN.view.form.DatePeriodField **xtype : dateperiod ** 일자별 기간 조회시 사용되는
 *        필드이다. 값을 변경시 숨겨져 있는 value 필드에 사용자 정의 포멧으로 변환되어 값이 적용됮다. 이벤트 및 호출자는 숨겨진
 *        필드의 name을 호출하여 사용한다. 기본적인 속성은 Date field와 동일하다.(fieldLabel, name등)
 *        **Note :** 입력된 값을 읽어올때 설정한 name으로 배열이 형태로 반환되며 name[0]은 시작일자, name[1]은
 *        종료일자를 가진다.
 * 
 * @example Ext.define('ConditionTest',{ extend : 'Ext.panel.Panel', title :
 *          'Condition Test', initComponent : function() { this.callParent(); },
 *          items : [ { xtype : 'dateperiod', fieldLabel : '생성일자', name :
 *          'create_date' } ], renderTo : Ext.getBody() });
 * 
 * @extends Ext.form.FieldContainer
 * @author Kyunghyang
 * 
 * @cfg {String} xtype 'dateperiod' items 속성 값으로 xtype : 'dateperiod'를 선언하여
 *      사용한다.
 * @cfg {String} format 화면에 표시되는 date 포멧을 설정한다. default : 'Y-m-d' (2012-01-01)
 * @cfg {String} valueFormat value 필드의 date 포멧을 설정한다. defalut : 'Ymd' (20120101)
 * @cfg {String} value 화면에 표시될때 기본 표시 일자를 설정한다.
 * @cfg {Boolean} vertical 필드의 정렬을 설정한다.
 */
Ext.define('CMN.view.form.DatePeriodField', {
	extend : 'Ext.form.FieldContainer',

	alias : 'widget.dateperiod',

	defaults : {
		anchor : '100%'
	},

	labelWidth : 130,

	fieldWidth : 150,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	constructor : function(config) {
		var configs = config || {};
		configs.labelWidth = configs.labelWidth || this.labelWidth;
		configs.fieldWidth = configs.fieldWidth || this.fieldWidth;
		if (configs.vertical || configs.layout == 'hbox') {
			configs.layout = 'hbox';
			configs.fieldWidth = configs.fieldWidth * 2 + 10;
		}
		if (configs.defaultValue) {
			var interval = 'd', period = 0;
			if (Ext.typeOf(configs.period) == 'string') {
				interval = configs.period.match(/[Y|M|D]/gi)[0] || 'd';
				period = configs.period.match(/\-+[0-9]*|[0-9]*/i) || 0;
			} else
				period = configs.period || 0;
			period = Number(period) * (-1);
			switch (interval.toLowerCase()) {
			case 'y':
				configs.fromValue = Ext.Date.add(configs.defaultValue, Ext.Date.YEAR, period);
				break;
			case 'm':
				configs.fromValue = Ext.Date.add(configs.defaultValue, Ext.Date.MONTH, period);
				break;
			default:
				configs.fromValue = Ext.Date.add(configs.defaultValue, Ext.Date.DAY, period);
				break;
			}

			configs.toValue = configs.defaultValue;
		}
		
		this.callParent([ configs ]);
	},

	initComponent : function() {
		this.width = this.width || (this.labelWidth + this.fieldWidth + 5);

		if(this.fieldLabel)
			this.fieldLabel = this.fieldLabel + ' (From ~ To)';
		this.items = this.buildItems();
		this.callParent();
		var self = this;

		// this.addEvent(
		// /**
		// * EVENT : 'select'
		// * 일자 선택시
		// * - fieldSet : {object}FieldContainer (전체)
		// * - newValue[n...] : {array} 새로 입력된 값들 ( 필드 수만큼 배열로 반환)
		// * - oldValue[n...] : {array} 이전값들 (필드 수만큼 배열로 반환)
		// * - index : {number} 변경된 date의 index (0: from, 1 : to)
		// */
		// 'select',
		// /**
		// * EVENT : 'change'
		// * 값 선택및 setValue로 인한 값 변경시 이벤트 처리
		// * - fieldSet : {object}FieldContainer (전체)
		// * - newValue[n...] : {array} 새로 입력된 값들 ( 필드 수만큼 배열로 반환)
		// * - oldValue[n...] : {array} 이전값들 (필드 수만큼 배열로 반환)
		// * - index : {number} 변경된 date의 index (0: from, 1 : to)
		// */
		// 'change',
		// /**
		// * EVENT : 'specialkey'
		// * 필드에서 Enter 키 입력시 이벤트 처리
		// * - fieldSet : {object}FieldContainer (전체)
		// * - e : key정보
		// */
		// 'specialkey'
		// );
		this.down('#valueFieldfrom').on('change', function(me, value) {
			self.setValue(value, 0);
		});
		this.down('#valueFieldto').on('change', function(me, value) {
			self.setValue(value, 1);
		});
	},

	buildItems : function() {
		var fieldId = 'valueField';
		var items = [];
		var fromName = this.fromName || this.name;
		items.push({
			cls : 'hboxLine',
			layout : {
				type : 'hbox',
				align : 'top'
			},
			xtype : 'fieldcontainer',
			items : this.buildField(fieldId, 'from', fromName),
			flex : 1
		});
		if (this.vertical || this.layout == 'hbox')
			items.push({
				xtype : 'component',
				width : 10,
				html : '~'
			});
		var toName = this.toName || this.name;
		items.push({
			cls : 'hboxLine',
			layout : {
				type : 'hbox',
				align : 'top'
			},

			xtype : 'fieldcontainer',
			items : this.buildField(fieldId, 'to', toName),
			flex : 1
		});

		return items;
	},

	buildField : function(fieldId, pos, name) {
		var self = this;
		var valueFormat = this.getValueFormat();
		var submitValue = this.submitValue == false ? false : true;
		var submitValueDate = this.submitValueDate == true ? true : false;
		var allowBlank = this.allowBlank == false ? false : true;
		var value = this.defaultValue || '';
		if (pos == 'from') {
			value = this.fromValue || '';
		}
		if (pos == 'to') {
			value = this.toValue || '';
		}
		return [ {
			xtype : 'textfield',
			hidden : true,
			name : name,
			submitValue : submitValue,
			allowBlank : allowBlank, // default : true
			itemId : fieldId + pos,
			value : self.getDefaultValue(pos)
		}, {
			listeners : {
				select : function(field, value, eOpts) {
					self.fireEvent('select', self, value, pos);
				},
				specialkey : function(field, e) {
					/* 필드에 키입력시 이벤트 발생 */
					self.fireEvent('specialkey', self, e);
				},
				change : function(field, newValue, oldValue) {
					var valueField = self.down('#' + fieldId + pos);
					valueString = Ext.Date.format(newValue, valueFormat);

					valueField.setRawValue(valueString);
					valueField.lastValue = valueString;
					/* 필드값이 변경될 경우 change 이벤트 발생 */
					self.fireEvent('change', self, newValue, oldValue, pos);
				}
			},
			validator : function(value){
				var fromField = self.down('#date' + fieldId + 'from');
				var toField = self.down('#date' + fieldId + 'to');
				
				var fromValue = Ext.Date.format(fromField.getValue(),self.getFormat());
				var toValue = Ext.Date.format(toField.getValue(),self.getFormat());
				
				if(!value || fromValue > toValue){
					return T('Message.ValidError');
				}
				fromField.clearInvalid();
				toField.clearInvalid();
				return true;
			},
			xtype : 'datefield',
			submitValue : submitValueDate, // default : false
			allowBlank : allowBlank, // default : true
			format : this.getFormat(),
			name : name + '_date',
			value : value,
			itemId : 'date' + fieldId + pos,
			emptyText : pos + ' date',
			flex : 1
		} ];
	},
	// comp : index or pos(from,to)
	// dateType : boolean (true : return to date type, false : return to string)
	getValue : function(comp, dateType) {
		if (comp == 0 || comp == 'from')
			comp = 'valueFieldfrom';
		else if (comp == 1 || comp == 'to')
			comp = 'valueFieldto';
		else
			return '';

		if (dateType === true) {
			comp = 'date' + comp;
		}
		var value = this.down('#' + comp).getValue();
		return value;
	},

	getValues : function() {
		var values = [];
		values.push(this.down('#valueFieldfrom').getValue());
		values.push(this.down('#valueFieldto').getValue());
		return values;
	},

	getDefaultValue : function(pos) {
		var value = this.defaultValue || '';
		if (this.defaultValue) {
			if (pos == 'from')
				value = this.fromValue;
			else if (pos == 'to')
				value = this.toValue;
			return Ext.Date.format(value, this.getValueFormat());
		}
		return value;
	},

	getValueFormat : function() {
		if (this.valueFormat)
			return this.valueFormat;
		return 'Ymd'; // 2301
	},

	getFormat : function() {
		if (this.format)
			return this.format;
		return 'Y-m-d';// 9999-12-31
	},

	setValue : function(newValue, index) {
		var pos = 'from';
		if (index == 1 || index == 'to')
			pos = 'to';

		var datetime = newValue || '';
		if (Ext.typeOf(datetime) == 'string' && datetime != '') {
			datetime = new Date(Number(newValue.substr(0, 4)), Number(newValue.substr(4, 2)) - 1, Number(newValue.substr(6, 2)));
		}
		var dateField = this.down('#datevalueField' + pos);
		if (dateField) {
			dateField.setValue(datetime);
		}
	},

	setValues : function(values) {
		if (Ext.typeOf(values) != 'array' && values != '')
			return;
		else if (Ext.typeOf(values) == 'array' && values.length == 0)
			return;

		for ( var i = 0; i < 2; i++) {
			var value = values[i] || '';
			this.setValue(value, i);
		}
	}
});