/**
 * @class BAS.view.inquiry.AttributeDetailHistory
 * @extends Ext.window.Window
 * @author MyeungKyu You
 * 
 */
Ext.define('BAS.view.inquiry.AttributeDetailHistory', {
	extend : 'Ext.window.Window',

	title : T('Caption.Other.View Attribute Detail History'),
	width : 620,
	modal : true,
	layout : 'fit',

	initComponent : function() {
		this.items = this.buildItems();
		this.callParent();
		var self = this;

		this.sub('detailHisForm').getForm().trackResetOnLoad = true;

		if (this.record != '')
			this.sub('detailHisForm').loadRecord(this.record);

		this.sub('btnClose').on('click', function() {
			self.onBtnClose();
		});
	},

	onBtnClose : function() {
		this.close();
	},

	buildItems : function(){
		var colWidth = 300;
		return [ {
			xtype : 'form',
			itemId : 'detailHisForm',
			layout : 'anchor',
			items : {
				xtype : 'container',
				layout : {
					type : 'table',
					columns : 2
				},
				cls : 'paddingAll5',
				defaults : {
					xtype : 'textfield',
					labelSeparator : '',
					labelWidth : 130,
					submitValue : false,
					readOnly : true,
					width : colWidth
				},
				items : [ {
					fieldLabel : T('Caption.Other.Attribute Key'),
					itemId : 'txtAttrKey',
					name : 'attrKey'
				}, {
					fieldLabel : T('Caption.Other.Attribute Type'),
					itemId : 'txtAttrType',
					name : 'attrType'
				}, {
					fieldLabel : T('Caption.Other.History Seq'),
					itemId : 'txtHistSeq',
					name : 'histSeq'
				}, {
					fieldLabel : T('Caption.Other.Transaction Time'),
					itemId : 'txtTranTime',
					name : 'tranTime'
				}, {
					fieldLabel : T('Caption.Other.Attribute Name'),
					itemId : 'txtAttrName',
					name : 'attrName',
					width : colWidth*2,
					colspan : 2
				}, {
					xtype : 'textarea',
					// grow : true,
					autoScroll : true,
					fieldLabel : T('Caption.Other.Old Attribute Value'),
					itemId : 'txtAttrOldValue',
					name : 'attrOldValue',
					width : colWidth*2,
					colspan : 2
				}, {
					xtype : 'textarea',
					// grow : true,
					autoScroll : true,
					fieldLabel : T('Caption.Other.New Attribute Value'),
					itemId : 'txtAttrNewValue',
					name : 'attrNewValue',
					width : colWidth*2,
					colspan : 2
				} ]
			},
			buttons : [ {
				text : T('Caption.Button.Close'),
				itemId : 'btnClose'
			} ]
		} ];
	}
});
