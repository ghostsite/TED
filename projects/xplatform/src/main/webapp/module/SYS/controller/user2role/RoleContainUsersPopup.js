Ext.define('SYS.controller.user2role.RoleContainUsersPopup', {
	extend : 'BAS.controller.PopupController',

	refs : [{
		selector : 'admin_rolecontainuserspopup',
		ref : 'form'
	}, {
		selector : 'admin_rolecontainuserspopup grid',
		ref : 'grid'
	}],

	init : function() {
		this.control({
			'admin_rolecontainuserspopup' : {
				afterrender : this.onViewportRendered,
				btnDelete : this.onBtnDelete,
				btnSave : this.onBtnSave,
				btnClose : this.onBtnClose,
				keychange : this.onKeyChange
			},
			'admin_rolecontainuserspopup grid' : {
				selectionchange : this.onSelectionchange
			}
		});
	},

	onViewportRendered : function() {
		this.initDragDrop();
	},

	onSelectionchange : function(model, selected, eOpts) {
		var flag = selected.length > 0 ? true : false;
		var removeButton = this.getForm().sub('btnDelete');
		if (flag) {
			removeButton.enable();
		} else {
			removeButton.disable();
		}
	},

	initDragDrop : function() {
		var gridPanel = this.getGrid();
		new Ext.dd.DropTarget(gridPanel.el, {
			ddGroup : 'firstGridDDGroup',
			notifyDrop : function(ddSource, e, data) {
				var records = ddSource.dragData.records;
				Ext.each(records, function(record) {
					if (gridPanel.getStore().getById(record.get('id'))) {
					} else {
						gridPanel.getStore().add(records);
					}
				})
				return true
			}
		});
	},

	onBtnClose : function(view) {
		view.close();
	},

	onKeyChange : function(view, keys) {// 区分shi新增还是修改
		var view = this.getForm();
		this.targetControl = keys.targetControl;
		this.targetForm = keys.targetForm;
		this.formData = keys.formData;

		this.getForm().setTitle('\'' + this.formData.roleName + '\'角色下的用户');
		this.getGrid().store.load({
			params : {
				roleId : this.formData.roleId
			}
		});
	},

	onBtnSave : function() {
		var params = ['roleId=' + this.formData.roleId];
		var count = this.getGrid().getStore().getCount();
		var data = this.getGrid().getStore().data;
		for (var i = 0; i < count; i++) {
			var record = data.items[i].raw;
			var id = record.id;
			params.push('userIds=' + id);
		}
		Ext.Ajax.request({
			method : 'POST',
			url : 'role/saveRoleHasUsers',
			params : params.join('&'),
			success : function(request) {
				Ext.Msg.alert("信息", "保存成功!");
			},
			failure : function() {
				Ext.Msg.alert("网络出现错误!");
			}
		});
	},

	onBtnDelete : function() {
		var records = this.getGrid().getSelectionModel().getSelection();
		this.getGrid().getStore().remove(records);
	}

});