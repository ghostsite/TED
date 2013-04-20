Ext.define('TES.view.SwitchSegmentedButtons', {
	extend : 'MES.view.form.BaseForm',
	title : 'SwitchSegmentedButtons',
	xtype : 'tes_switchsegmentedbuttons',

	requires : [ 'Ext.ux.container.SwitchButtonSegment' ],

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
			items : [Ext.create('Ext.ux.container.SwitchButtonSegment', {
				style : 'margin-top:15px',
				cls: 'marginAll10',
				items : [{
					text : 'Lorem'
				}, {
					text : 'Ipsum'
				}, {
					text : 'dolor'
				}]
			}),

			Ext.create('Ext.ux.container.SwitchButtonSegment', {
				style : 'margin-top:15px',
				cls: 'marginAll10',
				activeItem : 1,
				defaults : {
					scale : 'medium'
				},
				items : [{
					text : 'Lorem'
				}, {
					text : 'Ipsum'
				}, {
					text : 'dolor'
				}],
				listeners : {
					change : function(btn, item) {
						alert(btn.text);
					},
					scope : this
				}
			})]
		}
	}
});