Ext.define('TES.view.ReturnStock', {
	extend : 'MES.view.form.BaseForm',
	title : T('Caption.Menu.Return Stock'), // 瓿犼皾 氚橅拡 雿办澊韮�鞛呹碃

	xtype : 'hdms_return_stock',

	layout : 'fit',

	initComponent : function() {
		this.items = [ this.buildForm() ];
		this.callParent();
	},

	buildForm : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel');
		var self = this;
		return {
			xtype : 'container',
			itemId : 'formId',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'codeview',
				fieldLabel : 'Return Order',
				labelWidth : 120,
				itemId : 'centerOrderId',
				codeviewName : 'SQLQUERY',
				params : {
					sql : 'select loginname,password from users'
				},
				paramsScope : self,
				popupConfig : {
					columns : [ {
						header : T('Caption.Other.Column'),
						dataIndex : 'loginName',
						flex : 1
					}, {
						header : T('Caption.Other.Column'),
						dataIndex : 'password',
						flex : 1
					} ]
				},
				fields : [ {
					name : 'centerOrderId',
					column : 'loginName',
					allowBlank : false,
					maxLength : 20,
					submitValue : true,
					enforceMaxLength : true,
					flex : 1
				} ]
			}, {
				xtype : 'codeview',
				codeviewName : 'SERVICE',
				itemId : 'dayDateId',
				labelSeparator : '',
				allowBlank : false,
				flex : 1,
				popupConfig : {
					title : T('Caption.Other.weekDay'),
					columns : [ {
						header : T('Caption.Other.weekDay'),
						dataIndex : 'weekDay',
						flex : 1
					}, {
						header : T('Caption.Other.dayDate'),
						dataIndex : 'dayDate',
						flex : 1
					} ]
				},
				paramsScope : this,
				store : 'SYS.store.WorkDayStore',
				params : {
					start : 0,
					from:'',
					to:'',
					limit : 10
				},
				name : 'dayDate',
				fields : [ {
					column : 'dayDate',
					maxLength : 20,
					enforceMaxLength : true
				} ]
			} ]
		};
	}
});