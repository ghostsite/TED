Ext.define('BAS.controller.field.FieldList', {
	extend : 'BAS.controller.task.EntityList',
	
	requires : ['BAS.view.field.FieldList'],

	stores : [],
	models : [],
	views : [ 'BAS.view.field.FieldList' ],

	init : function() {
		this.callParent();

		this.control({
			'hbas_field_list' : {
				btnClose : this.onBtnClose,
				taskview : this.onTaskView,
				keychange : this.onKeyChange,
				entityedit : this.onEntityEdit,
				entitydelete : this.onEntityDelete,
				btnAddNew : this.onBtnAddNew,
				entityview : this.onEntityView,
				btnImport : this.onBtnImport,
				btnExport : this.onBtnExport,
				sup_btnView : this.onSupBtnView,
				sup_btnReset : this.onSupBtnReset,
				activate : this.onActivate
			}
		});
	},
	
	complementParams : function() {
		return {
			'tableName' : 'MST_FIELD'
		};
	}
});