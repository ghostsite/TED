Ext.define('CMN.view.common.MainMenu', {
	extend : 'Ext.toolbar.Toolbar',

	alias : 'widget.cmn.mainmenu',

	id : 'mainmenu',

	listeners : {
		render : function(comp, obj) {
			var store = Ext.getStore('CMN.store.MainMenuStore');
			/* 이미 로딩되어있을 수 있으므로, 먼저 로드를 한 번하고, 리스너를 연결한다. */
			this.reloadToolbarItems(store);
			store.on('load', this.reloadToolbarItems, this);
		}
	},

	reloadToolbarItems : function(store) {
		this.removeAll();

		var first_levels = (this.loadMenu(store.getRootNode()) || []);
		for ( var i = 0; i < first_levels.length; i++)
			this.add(first_levels[i]);
	},

	loadMenu : function(node) {
		var children = node.childNodes;

		if (!children || children.length < 1) {
			return undefined;
		}

		self_function = arguments.callee;

		var result = [];

		for ( var i = 0; i < children.length; i++) {
			var child = children[i];
			var menu = self_function(child);

			var obj = {
				text : child.get('text'),
				title : child.get('text'),
				icon : child.get('icon')//zhang added 20130423, top level menu icon
			};
			//if (child.get('separator') === 'Y') {
			if (child.get('separator')=='true') {//zhang modified this 20130423 Ext.typeOf(child.get('separator') =string
				result.push({
					xtype : 'menuseparator'
				});
			}

			if (menu) {
				obj.menu = {
					ignoreParentClicks : true,
					items : menu
				};
			} else {
				obj.viewModel = child.get('path');
				obj.itemId = child.get('code');
				obj.icon = child.get('icon');
				obj.handler = SmartFactory.doMenu;
			}
			result.push(obj);
		}

		return result;
	}
});