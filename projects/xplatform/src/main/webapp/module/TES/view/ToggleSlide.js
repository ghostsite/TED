Ext.define('TES.view.ToggleSlide', {
	extend : 'MES.view.form.BaseForm',
	title : 'ToggleSlide',
	xtype : 'tes_toggleslide',

	initComponent : function() {
		this.callParent();
	},

	buildForm : function() {
		return {
			xtype : 'container',
			layout : {
				type : 'vbox'
			},
			items : [new Ext.ux.ToggleSlide(), new Ext.ux.ToggleSlide({
				cls : 'marginT10',
				onText : 'Long Label Text',
				offText : 'Short'
			}), new Ext.ux.ToggleSlide({
				cls : 'marginT10',
				onText : 'M',
				offText : 'F'
			}), new Ext.ux.ToggleSlide({
				cls : 'marginT10',
				resizeHandle : false,
				state : true
			}), {
				xtype : 'toggleslide',
				cls : 'marginT10',
				onText : 'y',
				height:100,
				offText : 'n'
			}]
		}
	}
});