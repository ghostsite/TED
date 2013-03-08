Ext.define('MES.view.form.SupplementTabs', {
	extend : 'Ext.panel.Panel',

	alias : [ 'widget.tabssup', 'widget.mes_view_supplementtabs' ],

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();

		if (this.fields)
			this.add(this.fields);
		if (this.hiddenFields)
			this.add(this.hiddenFields);
		
		var self = this;

		this.tabPanel = this.add({
			xtype : 'tabpanel',
			itemId : 'supTabPanel',
			bodyCls : 'borderT borderRNone borderLNone borderBNone',
		    //plain: true,
			flex : 1
		});
		
		var tabs = [];
		
		if(Ext.typeOf(this.tabs) == 'object' && this.tabs != {}){
			tabs.push(this.tabs);
		}
		if(Ext.typeOf(this.tabs) == 'array'){
			tabs = this.tabs;
		}
		
		if(tabs.length>0){
			for(var i in tabs)
				this.tabPanel.add(tabs[i]);
			
			this.tabPanel.setActiveTab(0);
		}
		
		this.addEvents({
			"supplementSelected" : true
		});
	},

	getTabPanel : function(){
		return this.tabPanel;
	}
});