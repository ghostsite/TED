Ext.define('SEC.view.setup.PrvUserSetup', {
	extend : 'MES.view.form.BaseFormComposite',
	
	title : T('Caption.Other.Privilege Group - User Relation Setup'),
	
	initComponent : function() {
		this.callParent();
		
		var self = this;
		
		this.on('afterrender', function() {
			self.setActiveTab('group');
		});
	},
	
	buildForms : function(self) {
		self.add(Ext.create('SEC.view.setup.PrvUserSetup.PrivilegeGroup', {
			itemId : 'group'
		}));
		self.add(Ext.create('SEC.view.setup.PrvUserSetup.User', {
			itemId : 'user'
		}));
	}
});