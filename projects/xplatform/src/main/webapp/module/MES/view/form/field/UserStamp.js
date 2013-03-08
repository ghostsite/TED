Ext.define('MES.view.form.field.UserStamp', {
	extend : 'Ext.container.Container',
	alias : 'widget.userstamp',

	componentCls : 'userStamp',

	initComponent : function() {
		var defaults = {
			xtype : 'textfield',
			labelSeparator : '',
			labelWidth : 120,
			submitValue : false,
			readOnly : true
		};

		if (this.fieldDefaults != undefined) {
			defaults = Ext.Object.merge(defaults, this.fieldDefaults);
		}

		this.showOption = this.showOption || {};

		var createId = this.zcreateid();
		var createTime = this.zcreatetime();
		var updateId = this.zupdateid();
		var updateTime = this.zupdatetime();
		var deleteId = this.zdeleteid();
		var deleteTime = this.zdeletetime();
		var releaseId = this.zreleaseid();
		var releaseTime = this.zreleasetime();
		var zcreate = {};
		var zupdate = {};
		var zdelete = {};
		var zrelease = {};

		if (this.showOption.layout == 'anchor') {

			// defaults.anchor = '100%';

			createId.fieldLabel = T('Caption.Other.Create User');
			createTime.fieldLabel = T('Caption.Other.Create Time');
			updateId.fieldLabel = T('Caption.Other.Update User');
			updateTime.fieldLabel = T('Caption.Other.Update Time');
			deleteId.fieldLabel = T('Caption.Other.Delete User');
			deleteTime.fieldLabel = T('Caption.Other.Delete Time');
			releaseId.fieldLabel = T('Caption.Other.Release User');
			releaseTime.fieldLabel = T('Caption.Other.Release Time');

			zcreate = {
				xtype : 'container',
				layout : 'anchor',
				defaults : defaults,
				items : [ createId, createTime ]
			};

			zupdate = {
				xtype : 'container',
				layout : 'anchor',
				defaults : defaults,
				items : [ updateId, updateTime ]
			};

			zdelete = {
				xtype : 'container',
				layout : 'anchor',
				defaults : defaults,
				items : [ deleteId, deleteTime ]
			};

			zrelease = {
				xtype : 'container',
				layout : 'anchor',
				defaults : defaults,
				items : [ releaseId, releaseTime ]
			};
		} else {

			defaults.flex = 1;

			createId.fieldLabel = T('Caption.Other.Create User/Time');
			createTime.cls = 'marginL5';
			updateId.fieldLabel = T('Caption.Other.Update User/Time');
			updateTime.cls = 'marginL5';
			deleteId.fieldLabel = T('Caption.Other.Delete User/Time');
			deleteTime.cls = 'marginL5';
			releaseId.fieldLabel = T('Caption.Other.Release User/Time');
			releaseTime.cls = 'marginL5';

			zcreate = {
				xtype : 'container',
				layout : 'hbox',
				defaults : defaults,
				items : [ createId, createTime ]
			};

			zupdate = {
				xtype : 'container',
				layout : 'hbox',
				defaults : defaults,
				items : [ updateId, updateTime ]
			};

			zdelete = {
				xtype : 'container',
				layout : 'hbox',
				defaults : defaults,
				items : [ deleteId, deleteTime ]
			};

			zrelease = {
				xtype : 'container',
				layout : 'hbox',
				defaults : defaults,
				items : [ releaseId, releaseTime ]
			};
		}

		switch (this.showOption.display) {
		case 'CUD':
			// Create, Update, Delete
			this.items = [ zcreate, zupdate, zdelete ];
			break;
		case 'CUR':
			// Create, Update, Delete
			this.items = [ zcreate, zupdate, zrelease ];
			break;
		default:
			// Create, Update
			this.items = [ zcreate, zupdate ];
			break;
		}

		this.callParent();
	},

	zcreateid : function() {
		return {
			xtype : 'textfield',
			name : 'createUserId'
		};
	},

	zcreatetime : function() {
		return {
			xtype : 'textfield',
			name : 'createTime'
		};
	},

	zupdateid : function() {
		return {
			xtype : 'textfield',
			name : 'updateUserId'
		};
	},

	zupdatetime : function() {
		return {
			xtype : 'textfield',
			name : 'updateTime'
		};
	},

	zdeleteid : function() {
		return {
			xtype : 'textfield',
			name : 'deleteUserId'
		};
	},

	zdeletetime : function() {
		return {
			xtype : 'textfield',
			name : 'deleteTime'
		};
	},

	zreleaseid : function() {
		return {
			xtype : 'textfield',
			name : 'releaseUserId'
		};
	},

	zreleasetime : function() {
		return {
			xtype : 'textfield',
			name : 'releaseTime'
		};
	}
});