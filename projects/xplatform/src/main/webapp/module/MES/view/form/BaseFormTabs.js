Ext.define('MES.view.form.BaseFormTabs', {
	extend : 'MES.view.form.BaseForm',

	alternateClassName : 'BaseFormTabs',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.plugins = [Ext.create('MES.plugin.WidgetAclPlugin') ];
		this.callParent();
	},

	getTabPanel : function() {
		return this.tabPanel;
	},

	buildForm : function() {
		this.callParent();

		if (this.buildTopPart != Ext.emptyFn)
			this.add(this.buildTopPart(this));

		this.tabPanel = this.add({
			xtype : 'tabpanel',
			itemId : 'baseTabPanel',
			autoScroll : true, // 내용이 많아지면 scroll이 표시
			flex : 1,
			bodyCls : 'scrollXHidden'// scroll 중 가로 스크롤 감춤
		});
	},

	buildTopPart : Ext.emptyFn
});