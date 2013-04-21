Ext.define('BUS.view.codeview.CodeViewShow', {
	extend : 'MES.view.form.BaseForm',
	xtype : 'bus_codeviewshow',

	title : T('Caption.Menu.BUS.view.codeview.CodeViewShow'),
	// layout : 'fit',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();
	},

	buildForm : function(me) {
		return [{
			xtype : 'codeview',
			fieldLabel : T('Caption.Other.NoteBook'),
			codeviewName : 'NoteBook',
			condition : [{
				column : 'code',
				value : 'macbookair'
			}, {
				column : 'name',
				value : function(from) {
					// var sup = from.getSupplement();
					// var value = sup.sub('cdvResId').getValue();
					// return value;
					return 'macbookair';
				},
				scope : this
			}],
			//disabledIcon : true,
			name : 'notebook',
			itemId : 'notebook'
		}, {
			xtype : 'codeview',
			fieldLabel : T('Caption.Other.BookType'),
			codeviewName : 'BookType',
			condition : [{
				column : 'name',
				value : '散文',
				operator : '='
			}],
			//disabledIcon : true,
			name : 'booktype',
			itemId : 'booktype',
			cls:'marginT5'
		}, {
			xtype : 'codeview',
			fieldLabel : T('Caption.Other.Province'),
			codeviewName : 'Province',
			//disabledIcon : true,
			name : 'province',
			itemId : 'province',
			cls:'marginT5'
		}, {
			xtype : 'codeview',
			fieldLabel : T('Caption.Other.Company'),
			codeviewName : 'Company',
			name : 'Company',
			itemId : 'Company',
			cls:'marginT5'
		}];
	}
});