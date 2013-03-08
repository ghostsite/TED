/*
 * Class Name : FieldSetup
 */
Ext.define('BAS.view.setup.VendorSetup', {
	extend : 'BAS.view.common.TaskSetupForm',
	
	xtype : 'bas_vendor_setup',
	
	requires : ['BAS.model.BasViewDataOut'],
	
	title : T('Caption.Menu.Vendor Setup'),

	/*
	 * 기준 정보 변경은 MGCMLAGDAT 테이블을 사용한다.
	 * MES 기본 기능에서는 한 GCM 테이블의 Data를 한 번에 처리하지만,
	 * 승인처리를 위해서는 추가로 여러 레코드를 입력해서 상신하는 기능이 필요하다.  
	 */
	documentConfig : {
		factory : SF.login.factory,
		userId : SF.login.id,
		formModel : 'BAS.store.BasViewDataOut',
		viewServiceName : 'BasViewData',  
		reqServiceName : 'BasUpdateData',
		impServiceName : 'BasUpdateDataList',
		importParams : {
			procstep : 'U',
			factory : SF.login.factory,
			tableName : 'VENDOR_TBL'
		},
		entityType : 'VENDOR_TBL',
		procstep : '1',
		key1 : 'factory',
		key2 : 'tableName', // GCM Table 이름 ==> 'FIELD_TBL'
		key3 : 'key1'  // GCM Table Data Key1
	},

	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	},
	buildDocumentForm : function(me){
		return [{
			xtype : 'textfield',
			hidden : true,
			itemId : 'txtProcstep',
			allowBlank : false,
			name : 'procstep'
		},{
			xtype : 'textfield',
			fieldLabel : 'Table Name',
			labelStyle : 'font-weight:bold',
			allowBlank : false,
			readOnly : true,
			maxLength : 30,
			enforceMaxLength : true,
			itemId : 'txtTableName',
			name : 'tableName'
		},{
			xtype : 'textfield',
			fieldLabel : 'Vendor ID',
			labelStyle : 'font-weight:bold',
			allowBlank : false,
			readOnly : true,
			maxLength : 30,
			enforceMaxLength : true,
			itemId : 'txtVendorId',
			name : 'key1'
		},{
			xtype : 'textfield',
			fieldLabel : 'Vendor Name',
			maxLength : 100,
			enforceMaxLength : true,
			itemId : 'txtVendorName',
			name : 'data1'
		},{
			xtype : 'textfield',
			fieldLabel : 'Description',
			maxLength : 100,
			enforceMaxLength : true,
			itemId : 'txtDesc',
			name : 'data2'
		},{
			xtype : 'textfield',
			fieldLabel : 'Country',
			maxLength : 100,
			enforceMaxLength : true,
			itemId : 'txtCountry',
			name : 'data3'
		}];
	}
});