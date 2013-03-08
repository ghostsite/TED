Ext.define('MES.view.grid.EdcViewResourceData', {
	extend : 'Ext.grid.Panel',

	requires : [ 'Ext.ux.grid.RowExpander' ],

	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},
	// title : 'EDC '+T('Caption.Other.Resource List'),
	initComponent : function() {
		this.store = Ext.create('MES.store.EdcViewResourceDataOut.dataList');
		this.columns = this.columns || this.baseColumns();
		this.viewConfig = this.viewConfig || this.baseViewConfig();
		// this.bbar = Ext.create('Ext.PagingToolbar', {
		// store : this.store,
		// displayInfo : true,
		// cls : 'pagingToolbar',
		// displayMsg : 'Displaying topics {0} - {1} of {2}',
		// emptyMsg : "No topics to display"
		// }),
		this.callParent();
	},
	baseViewConfig : function() {
		return {
			getRowClass : function(record, rowIndex, rowParams, store) {
				if (record.get('histDelFlag') == 'Y') {
					return 'textColorRed';
				}
			}
		};
	},
	baseColumns : function() {
		var valueCols = [];
		for ( var i = 1; i < 25; i++) {
			valueCols.push({
				header : i,
				align : 'center',
				dataIndex : 'value' + i || ''
			});
		}

		return [ {
			xtype : 'rownumberer',
			header : T('Caption.Other.Seq'),
			align : 'center',
			locked : true,
			width : 50
		}, {
			dataIndex : "factory",
			header : T("Caption.Other.Factory")
		}, {
			dataIndex : "resId",
			header : T("Caption.Other.Resource")
		}, {
			dataIndex : "histSeq",
			header : T("Caption.Other.Hist Seq")
		}, {
			dataIndex : "hisDelFlag",
			header : T("Caption.Other.Hist Del Flag")
		}, {
			dataIndex : "colSetId",
			header : T("Caption.Other.Collection Set ID")
		}, {
			dataIndex : "colSetVersion",
			align : 'center',
			header : T("Caption.Other.Version")
		}, {
			dataIndex : "charSeqNum",
			align : 'center',
			header : T("Caption.Other.Character Seq")
		}, {
			dataIndex : "charId",
			header : T("Caption.Other.Character")
		}, {
			dataIndex : "charDesc",
			header : T("Caption.Other.Character Desc"),
			width : 140
		}, {
			header : T("Caption.Other.Spec"),
			align : 'center',
			renderer : function(val, p, record) {
				var data = record.data;
				var usl = data.upperSpecLimit;
				var lsl = data.lowerSpecLimit;
				var target = data.targetValue;

				if (!target) {
					if (usl && lsl)
						return lsl + ' ~ ' + usl;
				} else if (usl && lsl && target) {
					if (Ext.isNumeric(usl) && Ext.isNumeric(lsl) && Ext.isNumeric(target) && Number(usl) + Number(lsl) == target * 2) {
						return target + ' +/- ' + (Number(usl) - Number(target));
					} else {
						return lsl + ' ~ ' + target + ' ~ ' + usl;
					}
				} else if (usl) {
					if (Ext.isNumeric(usl))
						return target + ' + ' + (Number(usl) - Number(target));
					else
						return target + ' ~ ' + usl;
				} else if (lsl) {
					if (Ext.isNumeric(lsl))
						return target + ' - ' + (Number(target) - Number(lsl));
					else
						return lsl + ' ~ ' + target;
				}
			}
		}, {
			dataIndex : "unitSeqNum",
			align : 'center',
			header : T("Caption.Other.Unit Seq")
		}, {
			dataIndex : "unitId",
			align : 'center',
			header : T("Caption.Other.Unit")
		}, {
			dataIndex : "valueSeqNum",
			align : 'center',
			header : T("Caption.Other.Value Seq")
		}, {
			dataIndex : "valueType",
			align : 'center',
			header : T("Caption.Other.Value Type")
		}, {
			dataIndex : "valueCount",
			align : 'center',
			header : T("Caption.Other.Value Count"),
			align : 'center'
		}, {
			header : T("Caption.Other.Value"),
			columns : valueCols
		}, {
			dataIndex : "specOutMask",
			header : T("Caption.Other.Spec Out Mask"),
			width : 140
		}, {
			dataIndex : "updateUserId",
			header : T("Caption.Other.Update User ID")
		}, {
			dataIndex : "updateTime",
			header : T("Caption.Other.Update Time"),
			width : 140
		} ];
	}
});