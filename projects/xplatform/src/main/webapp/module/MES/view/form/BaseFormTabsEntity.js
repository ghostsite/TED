Ext.define('MES.view.form.BaseFormTabsEntity', {
	extend : 'MES.view.form.BaseFormTabs',

	alternateClassName : 'SetupForm01',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();
	},

	buildForm : function() {
		this.callParent();

		var tabpnl = this.getTabPanel();

		var userTabs = [
		                this.buildGeneralTab(this),
		        		this.buildPropertiesTab(this),
		        		this.buildGroupSetupTab(this),
		        		this.buildAttributeSetupTab(this, 'update'),
		        		this.buildCustomFieldSetupTab(this),
		        		this.buildOtherTabs(this)
		        		];
		for ( var i = 0; i < userTabs.length; i++) {
			if (userTabs[i] instanceof Object)
				tabpnl.add(userTabs[i]);
		}
		tabpnl.setActiveTab(0);
	},
	
	buildGeneralTab : Ext.emptyFn,

	buildPropertiesTab : Ext.emptyFn,

	buildGroupSetupTab : function(main) {
		var groupDefaultTable = main.groupDefaultTable||'';
		var groupItemName = main.groupItemName||'';
		return {
			xtype : 'wip_view_groupsetup',
			title : T('Caption.Other.Group Setup'),
			itemId : 'tabGroupsetup',
			itemName : groupItemName,
			groupDefaultTable : groupDefaultTable,
			fieldNamePrefix : main.groupFieldNamePrefix,
			formLoadLock : main.getFormLoadLock(),
			cmfMaxCnt : 10
		};
	},

	buildAttributeSetupTab : function(main, attrLayout) {
		return {
			xtype : 'bas_attrgrid',
			title : T('Caption.Other.Attribute'),
			itemId : 'tabGridAttribute',
			attrType : main.attrType,
			attrLayout : attrLayout || 'update'
		};
	},

	buildCustomFieldSetupTab : function(main) {
		var cmfItemName = main.cmfItemName||'';
		return {
			xtype : 'wip_view_groupsetup',
			title : T('Caption.Other.Customized Field'),
			itemId : 'tabCmfsetup',
			useCodeView : true,
			itemName : cmfItemName,
			fieldNamePrefix : main.cmfFieldNamePrefix,
			formLoadLock : main.getFormLoadLock(),
			cmfMaxCnt : main.cmfMaxCnt
		};
	},

	buildOtherTabs : Ext.emptyFn
});
