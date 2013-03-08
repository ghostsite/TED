/**
 * @class BAS.view.setup.LotTextOptionTest 시스템 변수에 대한 옵션을 정의하고, 수정, 삭제하는 역활을 한다.
 * @extends WIP.view.common.AbstractEntitySetup
 * @author MyeungKyu You
 * 
 */

Ext.define('BAS.view.setup.LotTextOptionTest', {
	extend : 'MES.view.form.BaseForm',

	supplement : {
		xtype : 'mes_view_supplementform',
		title : 'Lot Information',

		items : [ {
			xtype : 'mes_view_tranlotfieldset'
		} ]
	},

	layout : {
		type : 'fit',
		align : 'stretch'
	},

	initComponent : function() {
		this.store = this.buildStore();
		this.items = [ {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},

			items : [ this.zmain ]
		} ];

		this.callParent();

		var self = this;
		this.on('afterrender', function() {
			/*
			 * Supplement에 대한 이벤트리스너 등록은 클라이언트 뷰의 afterrender 이벤트 발생 이후에 해야한다.
			 */
			self.getSupplement().on('supplementSelected', function(record) {
				self.store.load();
			});
		});
	},

	// TODO : lot store 구성필요
	buildStore : function() {
		var store = Ext.create('WIP.store.OperationStore');
		return store;
	},

	zmain : [
	// {
	// xtype : 'mes_view_tranlotfieldset',
	// vertical : false,
	// height : 54,
	// },
	{
		xtype : 'container',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		flex : 1,

		items : {
			xtype : 'textfield',
			fieldLabel : 'Lot ID',
			labelStyle : 'font-weight:bold',
			itemId : 'txtLotId',
			name : 'lotId'
		}
	} ]
});