Ext.define('MEStouch.view.TimePickerField', {
    extend:'Ext.field.DatePicker',
    xtype:'timepickerfield',

    requires:['MEStouch.view.TimePicker'],

    config:{
        dateFormat:'H:i', //Default format show time only
        picker:true
    },


    /**
     * @override
     * @param value
     * Source copied, small modification
     */
    applyValue:function (value) {
        if (!Ext.isDate(value) && !Ext.isObject(value)) {
            value = null;
        }

        // Begin modified section
        if (Ext.isObject(value)) {
            var date = new Date(),
                year = value.year || date.getFullYear(), // Defaults to current year if year was not supplied etc..
                month = value.month || date.getMonth(),
                day = value.day || date.getDate();


            value = new Date(year, month, day, value.hours, value.minutes); //Added hour and minutes
        }
        // End modfied section!
        return value;
    },


    applyPicker:function (picker) {
        picker = Ext.factory(picker, 'MEStouch.view.TimePicker');
        picker.setHidden(true); // Do not show picker on creeation
        Ext.Viewport.add(picker);
        return picker;
    },


    updatePicker:function (picker) {
        picker.on({
            scope:this,
            change:'onPickerChange',
            hide:'onPickerHide'
        });
		if(this.getValue())
        	picker.setValue(this.getValue());
        return picker;
    }
});