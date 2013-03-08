Ext.define('MES.view.grid.RasViewResourceHistory', {
	extend : 'Ext.grid.Panel',

	requires : [ 'Ext.ux.grid.RowExpander' ],

	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},
//	title : T('Caption.Other.Resource History'),
	initComponent : function() {
		this.store = Ext.create('MES.store.RasViewResourceHistoryOut.histList');
		this.columns = this.columns||this.baseColumns();
		this.viewConfig = this.viewConfig || this.baseViewConfig();
//		this.bbar = Ext.create('Ext.PagingToolbar', {
//			store : this.store,
//			displayInfo : true,
//			cls : 'pagingToolbar',
//			displayMsg : 'Displaying topics {0} - {1} of {2}',
//			emptyMsg : "No topics to display"
//		}),
		this.callParent();
	},
	baseViewConfig : function(){
		return {
			getRowClass : function(record, rowIndex, rowParams, store) {
				if (record.get('histDelFlag') == 'Y') {
					return 'textColorRed';
				}
			}
		};
	},
	baseColumns : function(){
		return [ {
			header : T('Caption.Other.Seq'),
			dataIndex : 'histSeq',
			align : 'center',
			locked : true,
			width : 50
		}, {
			header : T('Caption.Other.Tran Time'),
			dataIndex : 'tranTime',
			locked : true,
			width : 140
		}, {
			header : T("Caption.Other.Event"),
			dataIndex : 'eventId'
		}, {
			header : T("Caption.Other.Up/Down Flag"),
			align : 'center',
			dataIndex : 'newUpDownFlag',
			renderer : function(value){
				if(value == 'D')
					return 'DOWN';
				else if(value == 'U')
					return 'UP';
				return value;
			}
		},  {
			header : T("Caption.Other.Primary Status"),
			dataIndex : 'newPriSts'
		}, {
			header : T("Caption.Other.Status") + 1,
			dataIndex : 'newSts1'
		}, {
			header : T("Caption.Other.Status") + 2,
			dataIndex : 'newSts2'
		}, {
			header : T("Caption.Other.Status") + 3,
			dataIndex : 'newSts3'
		}, {
			header : T("Caption.Other.Status") + 4,
			dataIndex : 'newSts4'
		}, {
			header : T("Caption.Other.Status") + 5,
			dataIndex : 'newSts5'
		}, {
			header : T("Caption.Other.Status") + 6,
			dataIndex : 'newSts6'
		}, {
			header : T("Caption.Other.Status") + 7,
			dataIndex : 'newSts7'
		}, {
			header : T("Caption.Other.Status") + 8,
			dataIndex : 'newSts8'
		}, {
			header : T("Caption.Other.Status") + 9,
			dataIndex : 'newSts9'
		}, {
			header : T("Caption.Other.Status") + 10,
			dataIndex : 'newSts10'
		}, {
			header : T("Caption.Other.Tran CMF") + 1,
			dataIndex : 'tranCmf1'
		}, {
			header : T("Caption.Other.Tran CMF") + 2,
			dataIndex : 'tranCmf2'
		}, {
			header : T("Caption.Other.Tran CMF") + 3,
			dataIndex : 'tranCmf3'
		}, {
			header : T("Caption.Other.Tran CMF") + 4,
			dataIndex : 'tranCmf4'
		}, {
			header : T("Caption.Other.Tran CMF") + 5,
			dataIndex : 'tranCmf5'
		}, {
			header : T("Caption.Other.Tran CMF") + 6,
			dataIndex : 'tranCmf6'
		}, {
			header : T("Caption.Other.Tran CMF") + 7,
			dataIndex : 'tranCmf7'
		}, {
			header : T("Caption.Other.Tran CMF") + 8,
			dataIndex : 'tranCmf8'
		}, {
			header : T("Caption.Other.Tran CMF") + 9,
			dataIndex : 'tranCmf9'
		}, {
			header : T("Caption.Other.Tran CMF") + 10,
			dataIndex : 'tranCmf10'
		}, {
			header : T("Caption.Other.Tran CMF") + 11,
			dataIndex : 'tranCmf11'
		}, {
			header : T("Caption.Other.Tran CMF") + 12,
			dataIndex : 'tranCmf12'
		}, {
			header : T("Caption.Other.Tran CMF") + 13,
			dataIndex : 'tranCmf13'
		}, {
			header : T("Caption.Other.Tran CMF") + 14,
			dataIndex : 'tranCmf14'
		}, {
			header : T("Caption.Other.Tran CMF") + 15,
			dataIndex : 'tranCmf15'
		}, {
			header : T("Caption.Other.Tran CMF") + 16,
			dataIndex : 'tranCmf16'
		}, {
			header : T("Caption.Other.Tran CMF") + 17,
			dataIndex : 'tranCmf17'
		}, {
			header : T("Caption.Other.Tran CMF") + 18,
			dataIndex : 'tranCmf18'
		}, {
			header : T("Caption.Other.Tran CMF") + 19,
			dataIndex : 'tranCmf19'
		}, {
			header : T("Caption.Other.Tran CMF") + 20,
			dataIndex : 'tranCmf20'
		}, {
			header : T("Caption.Other.Tran User ID"),
			dataIndex : 'tranUserId'
		}, {
			header : T("Caption.Other.Tran Comment"),
			dataIndex : 'tranComment',
			width : 140
		}, {
			header : T("Caption.Other.Hist Delete Flag"),
			dataIndex : 'histDelFlag'
		}, {
			header : T("Caption.Other.Hist Delete Time"),
			dataIndex : 'histDelTime',
			width : 140
		}, {
			header : T("Caption.Other.Hist Delete User ID"),
			dataIndex : 'histDelUserId'
		}, {
			header : T("Caption.Other.Hist Delete Comment"),
			dataIndex : 'histDelComment',
			width : 140
		} ];
	}
});