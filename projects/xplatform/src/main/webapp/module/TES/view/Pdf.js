Ext.define('TES.view.Pdf', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.TES.view.Pdf'),
	xtype : 'tes_pdf',

	requires : ['Ext.ux.panel.PDF'],
	
	initComponent : function() {
		this.callParent();
	},

	buildForm : function() {
		return Ext.create('Ext.ux.panel.PDF', {
			title : 'PDF Panel',
			width : 489,
			height : 633,
			pageScale : 0.75, // Initial scaling of the PDF. 1 = 100%
			src : 'resources/data/tes/shiro.pdf'
		});
	}
});