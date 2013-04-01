Ext.define('TES.view.SegmentedButtons', {
	extend : 'MES.view.form.BaseForm',
	title : 'SegmentedButtons',
	xtype : 'tes_segmentedbuttons',

	initComponent : function() {
		this.callParent();
	},

	buildForm : function() {
		return {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [Ext.create('Ext.ux.container.ButtonSegment', {
				cls : 'marginAll10',
				items : [{
					text : 'Paste'
				}, {
					xtype : 'splitbutton',
					text : 'Menu Button',
					menu : [{
						text : 'Menu Item 1'
					}]
				}, {
					xtype : 'splitbutton',
					text : 'Cut',
					menu : [{
						text : 'Cut Menu Item'
					}]
				}, {
					text : 'Copy'
				}, {
					text : 'Format'
				}]
			}), Ext.create('Ext.ux.container.ButtonSegment', {
				cls : 'marginAll10',
				style : 'margin-top:15px',
				defaults : {
					scale : 'medium'
				},
				items : [{
					text : 'Lorem'
				}, {
					text : 'Ipsum'
				}, {
					text : 'dolor'
				}]
			}), Ext.create('Ext.Panel', {
				cls : 'marginAll10',
				title : 'Segmented buttons in toolbar',
				width : 500,
				height : 250,
				style : 'margin-top:15px',
				bodyStyle : 'padding:10px',
				html : '',
				autoScroll : true,
				tbar : [{
					xtype : 'button',
					text : 'Add'
				}, {
					xtype : 'button',
					text : 'Remove'
				}, '->', {
					xtype : 'buttonsegment',
					items : [{
						xtype : 'splitbutton',
						text : 'Cut',
						menu : [{
							text : 'Cut Menu Item'
						}]
					}, {
						text : 'Copy'
					}, {
						text : 'Format'
					}]
				}]
			})]
		}
	}
});