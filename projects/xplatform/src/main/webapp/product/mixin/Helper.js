Ext.define('mixin.Helper', function() {
	// 分页工具栏
	function getContextBbar(store, options) {
		//plugins : Ext.create('Ext.ux.ProgressBarPager'), // 分页进度条,这个进度条用不了，不知道为啥。
		var bbar =  Ext.create('Ext.toolbar.Paging',{
			dock : 'bottom',
            pageSize: 20,
            store: store,
            displayInfo: true,
            displayMsg : '显示{0}条到{1}条,共{2}条',
            emptyMsg : "没有符合条件的记录",
            plugins : [Ext.create('Ext.ux.PagingToolbarResizer', options)]
        });
    
		return bbar;
	}

	// if operation =='delete'or 'remove' or update then refresh
	// parentNode, else
	// refresh node, 简化为：如果refreshParent = true, then refresh parent
	var refreshTreeNode = function(node, store, refreshParent) {
		if (refreshParent && node.parentNode) {
			store.load({
				node : node.parentNode,
				callback : function() {
					node.expand();
				}
			});
		} else {
			store.load({
				node : node,
				callback : function() {
					node.expand();
				}
			});
		}
	}

	/**
	 * get select record in grid panel
	 */
	var getSelectedRecordFromGrid = function(grid) { // matterBaseGridPanel
		var sm = grid.getSelectionModel();
		var selected = sm.getSelection();
		if (selected.length == 0) {
			return false;
		}
		var record = selected[0].data;
		return record;
	}

	/**
	 * 获得一个grid被选择的record's id, return id
	 */
	var getSelectedIdFromGrid = function(grid) { // matterBaseGridPanel
		var r = getSelectedRecordFromGrid(grid);
		if (r != false) {
			return r.id;
		}
	}

	/**
	 * 获得一个grid被选择的record's id, return id
	 */
	var getSelectedValueFromGrid = function(grid, key) { // matterBaseGridPanel
		var r = getSelectedRecordFromGrid(grid);
		if (r != false) {
			return r[key];
		}
	}

	/**
	 * 获得一个grid被选择的record's id, return array
	 */
	var getSelectedIdArrayFromGrid = function(grid, idkey) {
		var params = [];
		var records = grid.getSelectionModel().getSelection();
		idkey = idkey || 'id';
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			var id = record.get(idkey);
			params.push(id);// 'matterBaseIds=' +
		}
		return params;
	}

	/**
	 * 获得一个grid被所有的record's id, return array
	 */
	var getAllIdArrayFromGrid = function(grid) {
		var params = [];
		var count = grid.getStore().getCount();
		var data = grid.getStore().data;
		for (var i = 0; i < count; i++) {
			var id = data.items[i].get('id');
			params.push(id);
		}
		return params;
	}

	/**
	 * 获得一个treepanel被选择的record's id, return id
	 */
	var getSelectedIdFromTree = function(grid, key) {
		var sm = grid.getSelectionModel();
		var node = sm.getSelectedNode();
		if (!node) {
			return false;
		}
		return node.attributes[key];
	}

	var clearForm = function(form) {
		if (form instanceof Ext.form.Panel) {
			form.getForm().getFields().each(function(f) {
				f.setValue(null);
			});
		}
		if (form instanceof Ext.form.Basic) {
			form.getFields().each(function(f) {
				f.setValue(null);
			});
		}
	}

	// 循环set checked in tree node
	var setCheckedCascade = function(node, checked) {
		node.expand();
		node.set('checked', checked);
		node.eachChild(function(child) {
			setCheckedCascade(child, checked);
		});
	}

	var alertInfo = function(title, msg) {
		Ext.Msg.alert({
			title : title,
			icon : Ext.MessageBox.INFO,
			msg : msg,
			buttons : Ext.Msg.OK
		});
	}

	var alertWarn = function(title, msg) {
		Ext.Msg.alert({
			title : title,
			icon : Ext.MessageBox.WARNING,
			msg : msg,
			buttons : Ext.Msg.OK
		});
	}

	var alertQuestion = function(title, msg) {
		Ext.Msg.alert({
			title : title,
			icon : Ext.MessageBox.QUESTION,
			msg : msg,
			buttons : Ext.Msg.OK
		});
	}

	var alertError = function(title, msg) {
		Ext.Msg.alert({
			title : title,
			icon : Ext.MessageBox.ERROR,
			msg : msg,
			buttons : Ext.Msg.OK
		});
	}
	
	//zhang added this methods
	var isFitLayout = function(){
		var content_area = Ext.getCmp('content');
		return 'Ext.layout.container.Fit' === getCenterXType(content_area);
	}
	
	var isCardLayout = function(){
		var content_area = Ext.getCmp('content');
		return (!isTabLayout(content_area) && 'Ext.layout.container.Card' === getCenterXType(content_area));
	}
	
	var isTabLayout = function(){
		var content_area = Ext.getCmp('content');
		return content_area.setActiveTab;
	}
	
	var getCenterXType = function(content_area){
		return Ext.ClassManager.getName(content_area.getLayout());
	}
	
	var hasController = function(menu){
		if(menu.viewModel === 'CMN.view.common.ViewLogInfo'){
			return false;
		}
		return true;
	}
	
	return {
		getContextBbar : getContextBbar,
		getSelectedIdFromTree : getSelectedIdFromTree,
		getAllIdArrayFromGrid : getAllIdArrayFromGrid,
		getSelectedIdArrayFromGrid : getSelectedIdArrayFromGrid,
		getSelectedValueFromGrid : getSelectedValueFromGrid,
		refreshTreeNode : refreshTreeNode,
		getSelectedRecordFromGrid : getSelectedRecordFromGrid,
		getSelectedIdFromGrid : getSelectedIdFromGrid,
		clearForm : clearForm,
		setCheckedCascade : setCheckedCascade,
		alertInfo : alertInfo,
		alertWarn : alertWarn,
		alertQuestion : alertQuestion,
		alertError : alertError,
		hasController : hasController,
		isFitLayout : isFitLayout,
		isCardLayout: isCardLayout,
		isTabLayout : isTabLayout
	};
}());
