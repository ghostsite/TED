Ext.define("MEStouch.view.Event", {
    extend: 'Ext.navigation.View',
    requires: [
    'Ext.TitleBar',
    'Ext.dataview.List',
    'Ext.form.Panel',
    'Ext.field.Select',
    'Ext.form.FieldSet',
    'Ext.navigation.View',
	'Ext.field.Toggle',
    'MEStouch.view.TimePickerField'],

    xtype: 'event',

    config: {
        items: [{
            xtype: 'formpanel',
            title: '기본정보',
            itemId: 'eventForm',
            items: [{
                xtype: 'fieldset',
                layout: 'hbox',
				cls : 'singleLine',
				items: [{
					xtype: 'textfield',
					itemId: 'resource',
					label: '설비이름',
					placeHolder: '설비 아이디를 선택하세요',
					flex: 1,
					disabled: true
				},	
				{
					xtype: 'hiddenfield',
					name: 'resId'
				},
				{
					xtype: 'button',
					itemId: 'resourcelist',
					cls: 'btnSearch',
					width: 35
				}]
            },
            {
                xtype: 'hiddenfield',
                itemId: 'event',
                name: 'eventId'
            },
            {
                xtype: 'hiddenfield',
                name: 'procstep',
                value: 1
            },
            {
                xtype: 'hiddenfield',
                itemId: 'billing',
                name: 'chgSts2'
            },
            {
                xtype: 'hiddenfield',
                itemId: 'manday',
                name: 'chgSts3',
                value: 1
            },
            {
                xtype: 'fieldset',
                title: '마지막 이벤트 정보',
                items: [
                {
                    xtype: 'textfield',
                    label: '이벤트',
                    itemId: 'lastEvent',
                    placeHolder: '마지막 이력정보가 없습니다',
                    disabled: true
                },
                {
                    xtype: 'textfield',
                    label: '시간',
                    itemId: 'lastTime',
                    disabled: true
                }
                ]
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
                    itemId: 'start',
                    text: '정비 시작',
                    flex: 1
                },
                {
                    xtype: 'button',
                    itemId: 'end',
                    text: '정비 완료',
                    cls: 'marginRL5 eventEnd',
                    flex: 1
                },
                {
                    xtype: 'button',
                    itemId: 'more',
                    text: '기타',
                    cls: 'eventMore',
                    flex: 1
                }
                ]
            }]
        }]
    }

});