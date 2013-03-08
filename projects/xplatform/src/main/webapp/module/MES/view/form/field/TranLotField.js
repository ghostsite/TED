Ext.define('MES.view.form.field.TranLotField', {
	extend : 'Ext.container.Container',
	alias : 'widget.tranlotfield',

	layout : 'anchor',

	defaults : {
		anchor : '100%'
	},

	initComponent : function() {
		this.callParent();
		if (this.type == 'sublot')
			this.add(this.buildSublotItems());
		else
			this.add(this.buildLotItems());
	},

	buildLotItems : function() {
		return [ {
			xtype : 'fieldcontainer',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'textfield',
				itemId : 'txtTranLotId',
				labelWidth : 140,
				name : 'lotId',
				maxLength : 25,
				enforceMaxLength : true,
				enableKeyEvents : true,
				fieldLabel : T('Caption.Other.Lot ID'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				cls : 'marginR5',
				maxWidth : 400,
				width : '40%'
			}, {
				cls : 'borderAllNone',
				// maxWidth : 50, // 
				flex : 1
			}, {
				xtype : 'trantimefield',
				labelWidth : 100,
				maxWidth : 400,
				width : '59%'
			} ]
		}, {
			xtype : 'textfield',
			fieldLabel : T('Caption.Other.Description'),
			itemId : 'txtLotDesc',
			name : 'lotDesc',
			flex : 1,
			labelWidth : 140,
			submitValue : false,
			readOnly : true
		} ];
	},
	buildSublotItems : function() {
		return [ {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			items : [ {
				xtype : 'textfield',
				itemId : 'txtTranSublotId',
				name : 'sublotId',
				maxLength : 25,
				enforceMaxLength : true,
				enableKeyEvents : true,
				fieldLabel : T('Caption.Other.Sublot ID'),
				labelStyle : 'font-weight:bold',
				allowBlank : false,
				minWidth : 300
			}, {
				cls : 'borderAllNone',
				flex : 1
			}, {
				xtype : 'trantimefield'
			} ]
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Lot ID'),
				itemId : 'txtTranLotId',
				name : 'lotId',
				minWidth : 300,
				readOnly : true
			}, {
				cls : 'borderAllNone',
				flex : 1
			}, {
				xtype : 'textfield',
				fieldLabel : T('Caption.Other.Slot No'),
				itemId : 'txtSlotNo',
				name : 'slotNo',
				flex : 1,
				readOnly : true
			} ]
		} ];
	}
});