Ext.define("MEStouch.view.EventMore", {
    extend: 'Ext.form.Panel',
    requires: [
	    'Ext.TitleBar',
	    'Ext.dataview.List',
	    'Ext.form.Panel',
	    'Ext.field.Select',
	    'Ext.form.FieldSet',
	    'Ext.navigation.View',
	    'Ext.field.DatePicker',
		'Ext.field.Toggle',
	    'MEStouch.view.TimePickerField'
	],

    xtype: 'eventmore',

    config: {
        title: '추가정보 입력',
        items: [
        {
            xtype: 'selectfield',
            placeHolder: '이벤트 종류를 선택하세요',
            store: 'RasViewEventListOut',
            valueField: 'eventId',
            displayField: 'eventDesc',
            name: 'eventId',
			usePicker: false,
            label: '이벤트 종류'
        },
        {
            xtype: 'hiddenfield',
            name: 'procstep',
            value: 1
        },
        {
            xtype: 'hiddenfield',
            name: 'resId'
        },
        {
            xtype: 'hiddenfield',
            name: 'chgSts1'
        },
        {
            xtype: 'togglefield',
			itemId: 'billing',
            label: 'Billing 여부'
        },
        {
            xtype: 'hiddenfield',
            name: 'chgSts2'
        },
        {
            xtype: 'fieldset',
            title: '기여 시간 (종료 시 입력)',
            items: [{
                xtype: 'selectfield',
                placeHolder: '(기본) 1 Man/Day',
                value: 1,
                label: 'Man/Day',
                name: 'chgSts3',
                usePicker: false,
                options: [
                {
                    text: '0.2 M/D',
                    value: '0.2'
                },
                {
                    text: '0.4 M/D',
                    value: '0.4'
                },
                {
                    text: '0.5 M/D',
                    value: '0.5'
                },
                {
                    text: '0.6 M/D',
                    value: '0.6'
                },
                {
                    text: '0.8 M/D',
                    value: '0.8'
                },
                {
                    text: '1 M/D',
                    value: '1'
                }
                ]
            }]
        },
        {
            xtype: 'fieldset',
            items: [{
                xtype: 'togglefield',
                itemId: 'localtime',
                label: '시간 설정 여부',
                isField: false
            },
            {
                xtype: 'datepickerfield',
                itemId: 'date',
                placeHolder: '(기본) 오늘 일자',
                label: '발생 일자',
                disabled: true
            },
            {
                xtype: 'timepickerfield',
                itemId: 'time',
                placeHolder: '(기본) 현재 시간',
                label: '발생 시간',
                disabled: true
            },
            {
                xtype: 'hiddenfield',
                name: 'backTime',
                disabled: true
            }]
        },
        {
            xtype: 'container',
            docked: 'bottom',
            layout: {
                type: 'hbox'
            },
            cls: 'evenButtons',
            items: [
            {
                xtype: 'button',
                itemId: 'send',
                text: '전송',
                cls: 'marginR5 eventSend',
                flex: 1
            },
            {
                xtype: 'button',
                itemId: 'reset',
                text: '초기화',
                cls: 'eventReset',
                flex: 1
            }
            ]
        }]
    }
});