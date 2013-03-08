Ext.define('MES.view.form.field.Decimalfield', {

	extend : 'Ext.form.field.Number',

	alias : 'widget.decimalfield',

	// TODO : maxvalue를 설정하고 change 이벤트를 이용하여 변경하였으나.. 차후 키이벤트에서 키입력 방지로 재 구현하도록
	// 해야함
	// enableKeyEvents : true,
	listeners : {
		// keypress : function(me, e) {
		// var charCode = String.fromCharCode(e.getCharCode());
		// e.stopEvent(); //keyevnt 시 key 입력방지
		// },
		change : function(me, newValue) {
			if (newValue > me.maxValue) {
				me.setValue(me.maxValue);
			}
		}
	},

	// setValue()
	valueToRaw : function(value) {
		var me = this, decimalSeparator = me.decimalSeparator;
		value = String(value).replace(decimalSeparator, '.');
		value = me.fixPrecisionString(value);
		value = String(value).replace('.', decimalSeparator);

		return value;
	},

	fixPrecisionString : function(value) {
		var me = this, nan = isNaN(value), precision = me.decimalPrecision;

		if (nan || !value) {
			return nan ? '' : value;
		} else if (!me.allowDecimals || precision <= 0) {
			precision = 0;
		}

		return Ext.Number.toFixed(parseFloat(value), precision);
	},

	beforeBlur : function() {
		var me = this, v = me.getRawValue();

		if (!Ext.isEmpty(v)) {
			me.setValue(v);
		}
	}

});