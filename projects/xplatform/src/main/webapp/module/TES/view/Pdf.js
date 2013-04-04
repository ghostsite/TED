Ext.define('TES.view.Pdf', {
	extend : 'MES.view.form.BaseForm',
	title : 'Pdf',
	xtype : 'tes_pdf',

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