Ext.define('SEC.view.setup.PrivilegeSetup', {
	extend : 'MES.view.form.BaseFormComposite',
	
	title : T('Caption.Other.Privilege Setup'),
	
	initComponent : function() {
		this.callParent();
		
		var self = this;
		
		this.on('afterrender', function() {
			self.setActiveTab('group');
		});
	},
	
	buildForms : function(self) {
		self.add(Ext.create('SEC.view.setup.PrivilegeSetup.PrivilegeGroup', {
			itemId : 'group'
		}));
		self.add(Ext.create('SEC.view.setup.PrivilegeSetup.PrivilegeType', {
			itemId : 'setup'
		}));
	}
});