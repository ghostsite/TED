Ext.define('Opc.view.wip.LotStart', {
    extend: 'Opc.view.BaseForm',

    xtype: 'lotstart',

    title: 'LotStart',
    
    cls : 'fontSizeB',
    
    layout : {
    	type : 'vbox',
    	align : 'stretch'
    },
    
	dockedItems : {
		xtype : 'base_buttons',
		items : [ '->', 'Start', 'Reset', 'Confirm', 'Close' ]
	},
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'txtLotId',
                            fieldLabel: 'Lot ID',
                            labelAlign: 'top',
                            name : 'lotId',
                            flex: 1
                        },
                        {
                            xtype: 'button',
                            itemId: 'btnPrintLabel',
                            margin: '24, 5, 0, 5',
                            width: 240,
                            text: 'Print Label'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    cls : 'marginT10',
                    items: [
                        {
                            xtype: 'textfield',
                            name : 'weight',
                            flex: 1,
                            fieldLabel: 'Weight',
                            labelAlign: 'top'
                        },
                        {
                            xtype: 'button',
                            itemId: 'btnReadScale',
                            margin: '24, 5, 0, 5',
                            width: 240,
                            text: 'Read Scale'
                        }
                    ]
                }, {
                	xtype : 'textarea',
                	fieldLabel : 'Barcode Print Command',
                    labelAlign: 'top',
                	flex : 1
                }
            ]
        });

        me.callParent(arguments);
    }

});