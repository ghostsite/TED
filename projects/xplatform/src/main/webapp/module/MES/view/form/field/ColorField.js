//TODO 작업중 입니다.
//hex가 CC로 시작하는 color값은 배경이 투명색이라고 안됨

Ext.define('MES.view.form.field.ColorField', {
	extend : 'Ext.form.field.Trigger',

	alias : 'widget.colorfield',

	editable : false,

	onTriggerClick : function(event) {
		this.fireEvent('triggerclick', event);
	},

	// 32비트 hex값을 32bit argb값으로 변환하여 반환한다.
	getValue : function() {
		var argb = SF.cf.hexToArgb(this.value);
		// Ext.log('getValue',argb);
		return argb;
	},

	getFontColor : function() {
		return this.fonColor;
	},
	
	setValue : function(color) {
		if (color) {

			// Ext.log('setValue',color);

			// 서버에서 넘어오는 32비트 argb값은 tohex로 변환한다.
			if (Ext.typeOf(color) == 'number') {
				color = '#' + SF.cf.argbToHex(color);
			}

			// 배경색에 밝기에 따라서 글씨의 색상을 변경한다.
			var c = Ext.draw.Color.fromString(color);
			var fontColor = '';
			if (c.getHSL()[2] < 0.5) {
				fontColor = '#FFFFFF'; // 흰색
			} else {
				fontColor = '#000000'; // 검정
			}
			
			// backColor 적용
			this.setFieldStyle('background-color: ' + color + '; background-image: none; color : ' + fontColor + ';');
		} else {
			// backColor 적용
			this.setFieldStyle('background-color: #FFFFFF; background-image: none;');
		}

		// color value 적용
		Ext.form.field.Trigger.superclass.setValue.call(this, color);
	},

	initComponent : function() {
		var config = {}, me = this;

		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent(arguments);

		me.on('triggerclick', function(event) {

			var colourMenu = Ext.create('Ext.menu.ColorPicker', {
				listeners : {
					select : function(picker, color) {
						me.setValue('#' + color);
					}
				}
			});

			colourMenu.showAt(event.getXY());

		}, this);
	}
});