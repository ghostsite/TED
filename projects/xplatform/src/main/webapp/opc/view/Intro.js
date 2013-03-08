Ext.define('Opc.view.Intro', {
	extend : 'Opc.view.BaseForm',

	xtype : 'intro',
	
	title : 'Welcome',

	layout : {
		align : 'stretch',
		type : 'vbox'
	},

	dockedItems : null,

	items : [ {
		xtype : 'container',
		cls : 'opcIntro',
		items : [ {
					html : '<div class="introSystemName">MESplus <span>Operator Center</span></div>'
				}, {
					itemId : 'toplevelmenus',
					html : [ '<div class="introMenu">', 
					         '<a class="menu1">lot list</a>', 
					         '<a class="menu2">notice</a>',
					         '<a class="menu3">setting</a>', 
					         '</div>' 
					       ]
				} ]
	} ]
});