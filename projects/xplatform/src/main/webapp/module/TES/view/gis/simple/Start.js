/**
 * The main application viewport, which displays the whole application
 * @extends Ext.Viewport
 */
Ext.define('TES.view.gis.simple.Start', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.TES.view.gis.simple.Start'),
	xtype : 'tes_gissimple',
	
    layout: 'fit',

    requires: [
        'Ext.layout.container.Border',
        'Ext.resizer.Splitter',
        'TES.view.gis.simple.Header',
        'TES.view.gis.simple.Map',
        'TES.view.gis.simple.summit.Chart',
        'TES.view.gis.simple.summit.Grid'
    ],

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            items: [{
                xtype: 'panel',
                border: false,
                layout: 'border',
                dockedItems: [
                    Ext.create('TES.view.gis.simple.Header')
                ],
                items: [{
                    xtype: 'cf_mappanel'
                }, {
                    xtype: 'panel',
                    region: 'center',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        Ext.create('TES.view.gis.simple.summit.Grid'),
                        {xtype: 'splitter'},
                        Ext.create('TES.view.gis.simple.summit.Chart')
                    ]
                }]
            }]
        });

        me.callParent(arguments);
    }
});
