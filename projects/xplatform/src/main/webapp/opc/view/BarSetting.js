Ext.define('Opc.view.BarSetting', {
	extend : 'Ext.panel.Panel',

	xtype : 'barsetting',

	layout : 'fit',

	bodyPadding : 20,
	title : 'BarSetting',

	cls : 'fontSizeB',

	initComponent : function() {
		this.items = [ {
			xtype : 'dataview',
			cls : 'menuSetting',
			store : Ext.create('Ext.data.Store', {
				fields : ['caption', 'cls', 'itemId'],
				data : [{
					caption : 'Start Lot111',
					cls : 'startlot',
					itemId : 'startLot'
				}, {
					caption : 'Move In',
					cls : 'moveIn',
					itemId : 'moveIn'
				}, {
					caption : 'Move Out',
					cls : 'moveOut'
				}, {
					caption : 'Lot Info',
					cls : 'lotInfo'
				}, {
					caption : 'Label',
					cls : 'labelPrint'
				}, {
					caption : 'End Lot',
					cls : 'endLot'
				}, {
					caption : 'Hold',
					cls : 'hold'
				}, {
					caption : 'Release',
					cls : 'release'
				}, {
					caption : 'collect Date',
					cls : 'collectDate'
				}]
			}),
			itemSelector: 'button',
			overItemCls : 'tx-hover',
			tpl : [ '<tpl for=".">', 
				        '<div class="tx refusal" itemId="{itemId}">',
				        	'<span class="{cls}"></span>',
				        	'{caption}', 
				        	'<span class="desc">description message..</span>',
						'</div>', 
					'</tpl>' ]
		} ];
		
		this.callParent();
	}

});