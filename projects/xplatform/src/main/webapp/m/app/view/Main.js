Ext.define("MEStouch.view.Main", {
    extend: 'Ext.tab.Panel',
	xtype : 'main',
	
    config: {

        items: [
        {
            xtype: 'event',
            iconCls: 'compose'
        },
        {
            xtype: 'reshistory',
            iconCls: 'list'
        },
        {
            xtype: 'setting',
            iconCls: 'settings6'
        }
        ],
        tabBar: {
            docked: 'bottom'
        }

    }
});