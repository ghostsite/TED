/**
 * @class BAS.view.inquiry.AttributeDetail
 * @extends Ext.window.Window
 * @author MyeungKyu You
 * 
 */
Ext.define('BAS.view.inquiry.AttributeDetail', {
	extend : 'Ext.window.Window',

	requires : [ 'BAS.model.BasViewAttributeOut' ],

	title : T('Caption.Other.View Attribute Detail Value'),
	width : 620,
	modal : true,
	layout : 'fit',

	initComponent : function() {
		this.items = this.buildItems();
		this.callParent();

		var self = this;

		var form = this.sub('formdetail').getForm();
		form.reader = Ext.create('Ext.data.reader.Json', {
			model : 'BAS.model.BasViewAttributeOut'
		});

		form.trackResetOnLoad = true;

		var params = this.params || {};
		Ext.applyIf(params, {
			procstep : '1',
			attrType : '',
			attrKey : '',
			attrName : ''
		});

		this.on('afterrender', function() {
			this.formLoad(params);
		});

		this.sub('btnClose').on('click', function() {
			self.onBtnClose();
		});
	},

	formLoad : function(params) {
		var form = this.sub('formdetail').getForm();
		form.load({
			params : params,
			url : 'service/BasViewAttribute.json',
			method : 'GET',
			scope : this
		});

		this.sub('txtAttrKey').setValue(params.attrKey);
		this.sub('txtAttrType').setValue(params.attrType);
	},
	onBtnClose : function() {
		this.close();
	},

	buildItems : function(){
		var colWidth = 300;
		return {
			xtype : 'form',
			layout : 'anchor',
			itemId : 'formdetail',
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
					labelWidth : 140,
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
					fieldLabel : T('Caption.Other.Attribute Name'),
					itemId : 'txtAttrName',
					name : 'attrName',
					width : colWidth*2,
					colspan : 2
				}, {
					xtype : 'textarea',
					autoScroll : true,
					fieldLabel : T('Caption.Other.Attribute Value'),
					itemId : 'txtAttrArea',
					name : 'attrValue',
					width : colWidth*2,
					colspan : 2
				}, {
					fieldLabel : T('Caption.Other.Key History Seq'),
					itemId : 'txtKeyHistSeq',
					name : 'keyHistSeq'
				}, {
					fieldLabel : T('Caption.Other.Last Active History Seq'),
					itemId : 'txtLastActHistSeq',
					name : 'lastActiveHistSeq'
				}, {
					fieldLabel : T('Caption.Other.Last History Seq'),
					itemId : 'txtLastHistSeq',
					name : 'lastHistSeq'
				}, {
					fieldLabel : T('Caption.Other.Last Transaction Time'),
					itemId : 'txtLastTranTime',
					name : 'lastTranTime'
				} ]
			},
			buttons : [ {
				text : T('Caption.Button.Close'),
				itemId : 'btnClose'
			} ]
		};
	}
});