Ext.define('mixin.Helper', function() {
	// todo to implement all below:
	function getContextBbar(store) {
		// 每页显示条数下拉选择框
		var pagesize_combo = Ext.create('Ext.form.field.ComboBox', {
			name : 'pagesize',
			triggerAction : 'all',
			queryMode : 'local',
			store : Ext.create('Ext.data.ArrayStore',
					{
						fields : [ 'value', 'text' ],
						data : [ [ 10, '10条/页' ], [ 20, '20条/页' ],
								[ 50, '50条/页' ], [ 100, '100条/页' ],
								[ 250, '250条/页' ], [ 500, '500条/页' ] ]
					}),
			valueField : 'value',
			displayField : 'text',
			value : '20',
			editable : false,
			width : 85
		});
		var number = parseInt(pagesize_combo.getValue());
		// 改变每页显示条数reload数据
		pagesize_combo.on("select", function(comboBox) {
			bbar.pageSize = parseInt(comboBox.getValue());
			number = parseInt(comboBox.getValue());
			store.reload({
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});
		});
		// 分页工具栏
		var bbar = Ext.create('Ext.toolbar.Paging', {
			dock : 'bottom',
			pageSize : 5,
			store : store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			plugins : Ext.create('Ext.ux.ProgressBarPager'), // 分页进度条
			emptyMsg : "没有符合条件的记录",
			items : [ '-', pagesize_combo ]
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
				callback: function(){
					node.expand();
    			}
			});
		} else {
			store.load({
				node : node,
				callback: function(){
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
		for ( var i = 0; i < records.length; i++) {
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
		for ( var i = 0; i < count; i++) {
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
		setCheckedCascade : setCheckedCascade
	};
}());
