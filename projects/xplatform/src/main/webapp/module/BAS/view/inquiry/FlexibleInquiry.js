Ext.define('BAS.view.inquiry.FlexibleInquiry', {
	extend : 'MES.view.form.BaseFormTabs',

	title : T('Caption.Menu.View Flexible Inquiry'),

	initComponent : function() {
		this.callParent();
		this.self = this;
		//
		// var tabpnl = this.getTabPanel();
		// tabpnl.add(this.zinquirytab());
		// tabpnl.add(this.zsqltab());
		//
		// this.on('afterrender', function() {
		// var supplement = self.getSupplement();
		//
		// supplement.on('supplementSelected', function(data) {
		// self.reloadForm(data);
		// });
		// });
		// },
		//	
		// reloadForm : function(data){
		// var inquiryId = data.inquiryId || '';
		//		
		// var form = this.getForm();
	}
});