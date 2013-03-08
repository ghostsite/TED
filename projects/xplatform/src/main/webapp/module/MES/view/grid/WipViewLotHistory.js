Ext.define('MES.view.grid.WipViewLotHistory', {
	extend : 'Ext.grid.Panel',

	requires : [ 'Ext.ux.grid.RowExpander' ],

	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},
	// title : T('Caption.Other.Lot History'),
	initComponent : function() {
		this.store = Ext.create('MES.store.WipViewLotHistoryOut.list');
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
		return [ {
			header : T('Caption.Other.Seq'),
			dataIndex : 'histSeq',
			align : 'center',
			locked : true,
			width : 50
		}, {
			header : T('Caption.Other.Tran Code'),
			dataIndex : 'tranCode',
			locked : true
		}, {
			header : T('Caption.Other.Tran Time'),
			dataIndex : 'tranTime',
			locked : true,
			width : 140
		}, {
			header : T("Caption.Other.Factory"),
			dataIndex : 'factory'
		}, {
			header : T("Caption.Other.Mat ID"),
			dataIndex : 'matId'
		}, {
			header : T("Caption.Other.Mat Ver"),
			align : 'center',
			dataIndex : 'matVer'
		}, {
			header : T("Caption.Other.Flow"),
			dataIndex : 'flow'
		}, {
			header : T("Caption.Other.Flow Seq"),
			align : 'center',
			dataIndex : 'flowSeqNum'
		}, {
			header : T("Caption.Other.Oper"),
			dataIndex : 'oper'
		}, {
			header : T("Caption.Other.Qty 1"),
			align : 'right',
			dataIndex : 'qty1'
		}, {
			header : T("Caption.Other.Qty 2"),
			align : 'right',
			dataIndex : 'qty2'
		}, {
			header : T("Caption.Other.Qty 3"),
			align : 'right',
			dataIndex : 'qty3'
		}, {
			header : T("Caption.Other.Carrier ID"),
			dataIndex : 'crrId'
		}, {
			header : T("Caption.Other.Lot Type"),
			dataIndex : 'lotType'
		}, {
			header : T("Caption.Other.Owner Code"),
			dataIndex : 'ownerCode'
		}, {
			header : T("Caption.Other.Create Code"),
			dataIndex : 'createCode'
		}, {
			header : T("Caption.Other.Create Time"),
			dataIndex : 'createTime'
		}, {
			header : T("Caption.Other.Lot Priority"),
			align : 'center',
			dataIndex : 'lotPriority'
		}, {
			header : T("Caption.Other.Lot Status"),
			dataIndex : 'lotStatus'
		}, {
			header : T("Caption.Other.Lot Del Time"),
			dataIndex : 'lotDelTime'
		}, {
			header : T("Caption.Other.Hold Flag"),
			align : 'center',
			dataIndex : 'holdFlag'
		}, {
			header : T("Caption.Other.Hold Code"),
			dataIndex : 'holdCode'
		}, {
			header : T("Caption.Other.Hold Prev Group"),
			dataIndex : 'holdPrvGrpId'
		}, {
			header : T("Caption.Other.Oper In Qty 1"),
			align : 'right',
			dataIndex : 'operInQty1'
		}, {
			header : T("Caption.Other.Oper In Qty 2"),
			align : 'right',
			dataIndex : 'operInQty2'
		}, {
			header : T("Caption.Other.Oper In Qty 3"),
			align : 'right',
			dataIndex : 'operInQty3'
		}, {
			header : T("Caption.Other.Create Qty 1"),
			align : 'right',
			dataIndex : 'createQty1'
		}, {
			header : T("Caption.Other.Create Qty 2"),
			align : 'right',
			dataIndex : 'createQty2'
		}, {
			header : T("Caption.Other.Create Qty 3"),
			align : 'right',
			dataIndex : 'createQty3'
		}, {
			header : T("Caption.Other.Start Qty 1"),
			align : 'right',
			dataIndex : 'startQty1'
		}, {
			header : T("Caption.Other.Start Qty 2"),
			align : 'right',
			dataIndex : 'startQty2'
		}, {
			header : T("Caption.Other.Start Qty 3"),
			align : 'right',
			dataIndex : 'startQty3'
		}, {
			header : T("Caption.Other.Inv Flag"),
			dataIndex : 'invFlag'
		}, {
			header : T("Caption.Other.Transit Flag"),
			align : 'center',
			dataIndex : 'transitFlag'
		}, {
			header : T("Caption.Other.Unit Exist Flag"),
			align : 'center',
			dataIndex : 'unitExistFlag'
		}, {
			header : T("Caption.Other.Inv Unit"),
			dataIndex : 'invUnit'
		}, {
			header : T("Caption.Other.Rework Flag"),
			align : 'center',
			dataIndex : 'rwkFlag'
		}, {
			header : T("Caption.Other.Rework Code"),
			dataIndex : 'rwkCode'
		}, {
			header : T("Caption.Other.Rework Count"),
			align : 'center',
			dataIndex : 'rwkCount'
		}, {
			header : T("Caption.Other.Rework Return Flow"),
			dataIndex : 'rwkRetFlow',
			width : 130
		}, {
			header : T("Caption.Other.Rework Return Flow Seq"),
			align : 'center',
			dataIndex : 'rwkRetFlowSeqNum',
			width : 130
		}, {
			header : T("Caption.Other.Rework Return Oper"),
			dataIndex : 'rwkRetOper'
		}, {
			header : T("Caption.Other.Rework End Flow"),
			dataIndex : 'rwkEndFlow',
			width : 130
		}, {
			header : T("Caption.Other.Rework End Flow Seq"),
			align : 'center',
			dataIndex : 'rwkEndFlowSeqNum',
			width : 150
		}, {
			header : T("Caption.Other.Rework End Oper"),
			dataIndex : 'rwkEndOper',
			width : 130
		}, {
			header : T("Caption.Other.Rework Ret Clear Flag"),
			align : 'center',
			dataIndex : 'rwkRetClearFlag',
			width : 130
		}, {
			header : T("Caption.Other.Rework Time"),
			dataIndex : 'rwkTime',
			width : 130
		}, {
			header : T("Caption.Other.NSTD Flag"),
			align : 'center',
			dataIndex : 'nstdFlag'
		}, {
			header : T("Caption.Other.NSTD Return Flow"),
			dataIndex : 'nstdRetFlow',
			width : 130
		}, {
			header : T("Caption.Other.NSTD Return Flow Seq"),
			align : 'center',
			dataIndex : 'nstdRetFlowSeqNum',
			width : 160
		}, {
			header : T("Caption.Other.NSTD Return Oper"),
			dataIndex : 'nstdRetOper',
			width : 130
		}, {
			header : T("Caption.Other.NSTD Time"),
			dataIndex : 'nstdTime',
			width : 130
		}, {
			header : T("Caption.Other.Repair Flag"),
			align : 'center',
			dataIndex : 'repFlag'
		}, {
			header : T("Caption.Other.Repair Return Oper"),
			dataIndex : 'repRetOper'
		}, {
			header : T("Caption.Other.Store Return Flow"),
			dataIndex : 'strRetFlow',
			width : 130
		}, {
			header : T("Caption.Other.Store Return Flow Seq"),
			align : 'center',
			dataIndex : 'strRetFlowSeqNum',
			width : 130
		}, {
			header : T("Caption.Other.Store Return Oper"),
			dataIndex : 'strRetOper'
		}, {
			header : T("Caption.Other.Start Flag"),
			align : 'center',
			dataIndex : 'startFlag'
		}, {
			header : T("Caption.Other.Start Time"),
			dataIndex : 'startTime',
			width : 130
		}, {
			header : T("Caption.Other.Start Resource ID"),
			dataIndex : 'startResId'
		}, {
			header : T("Caption.Other.End Flag"),
			align : 'center',
			dataIndex : 'endFlag'
		}, {
			header : T("Caption.Other.End Time"),
			dataIndex : 'endTime',
			width : 130
		}, {
			header : T("Caption.Other.End Resource ID"),
			dataIndex : 'endResId'
		}, {
			header : T("Caption.Other.Sample Flag"),
			align : 'center',
			dataIndex : 'sampleFlag'
		}, {
			header : T("Caption.Other.Sample Wait Flag"),
			align : 'center',
			dataIndex : 'sampleWaitFlag'
		}, {
			header : T("Caption.Other.Sample Result"),
			dataIndex : 'sampleResult'
		}, {
			header : T("Caption.Other.From To Flag"),
			align : 'center',
			dataIndex : 'fromToFlag'
		}, {
			header : T("Caption.Other.From To Lot ID"),
			dataIndex : 'fromToLotId'
		}, {
			header : T("Caption.Other.From To Mat ID"),
			dataIndex : 'fromToMatId'
		}, {
			header : T("Caption.Other.From To Mat Ver"),
			align : 'center',
			dataIndex : 'fromToMarVer'
		}, {
			header : T("Caption.Other.From To Flow"),
			dataIndex : 'fromToFlow'
		}, {
			header : T("Caption.Other.From To Flow Seq"),
			align : 'center',
			dataIndex : 'fromToFlowSeqNum'
		}, {
			header : T("Caption.Other.From To Oper"),
			dataIndex : 'fromToOper'
		}, {
			header : T("Caption.Other.From To Qty 1"),
			dataIndex : 'fromToQty1'
		}, {
			header : T("Caption.Other.From To Qty 2"),
			dataIndex : 'fromToQty2'
		}, {
			header : T("Caption.Other.From To Qty 3"),
			dataIndex : 'fromToQty3'
		}, {
			header : T("Caption.Other.From To Hist Seq"),
			align : 'center',
			dataIndex : 'fromToHistSeq'
		}, {
			header : T("Caption.Other.Ship Code"),
			dataIndex : 'shipCode'
		}, {
			header : T("Caption.Other.Ship Time"),
			dataIndex : 'shipTime',
			width : 130
		}, {
			header : T("Caption.Other.Original Due Time"),
			dataIndex : 'orgDueTime',
			width : 130
		}, {
			header : T("Caption.Other.Scheduled Due Time"),
			dataIndex : 'schDueTime',
			width : 130
		}, {
			header : T("Caption.Other.Factory In Time"),
			dataIndex : 'facInTime',
			width : 130
		}, {
			header : T("Caption.Other.Flow In Time"),
			dataIndex : 'flowInTime',
			width : 130
		}, {
			header : T("Caption.Other.Oper In Time"),
			dataIndex : 'operInTime',
			width : 130
		}, {
			header : T("Caption.Other.Reserve Res ID"),
			dataIndex : 'reserveResId'
		}, {
			header : T("Caption.Other.Port"),
			dataIndex : 'portId'
		}, {
			header : T("Caption.Other.Batch ID"),
			dataIndex : 'batchId'
		}, {
			header : T("Caption.Other.Batch Seq"),
			dataIndex : 'batchSeq'
		}, {
			header : T("Caption.Other.Order ID"),
			dataIndex : 'orderId'
		}, {
			header : T("Caption.Other.Add Order ID") + 1,
			dataIndex : 'addOrderId1'
		}, {
			header : T("Caption.Other.Add Order ID") + 2,
			dataIndex : 'addOrderId2'
		}, {
			header : T("Caption.Other.Add Order ID") + 3,
			dataIndex : 'addOrderId3'
		}, {
			header : T("Caption.Other.Lot Location") + 1,
			dataIndex : 'lotLocation1'
		}, {
			header : T("Caption.Other.Lot Location") + 2,
			dataIndex : 'lotLocation2'
		}, {
			header : T("Caption.Other.Lot Location") + 3,
			dataIndex : 'lotLocation3'
		}, {
			header : T("Caption.Other.Lot CMF 1"),
			dataIndex : 'lotCmf1'
		}, {
			header : T("Caption.Other.Lot CMF 2"),
			dataIndex : 'lotCmf2'
		}, {
			header : T("Caption.Other.Lot CMF 3"),
			dataIndex : 'lotCmf3'
		}, {
			header : T("Caption.Other.Lot CMF 4"),
			dataIndex : 'lotCmf4'
		}, {
			header : T("Caption.Other.Lot CMF 5"),
			dataIndex : 'lotCmf5'
		}, {
			header : T("Caption.Other.Lot CMF 6"),
			dataIndex : 'lotCmf6'
		}, {
			header : T("Caption.Other.Lot CMF 7"),
			dataIndex : 'lotCmf7'
		}, {
			header : T("Caption.Other.Lot CMF 8"),
			dataIndex : 'lotCmf8'
		}, {
			header : T("Caption.Other.Lot CMF 9"),
			dataIndex : 'lotCmf9'
		}, {
			header : T("Caption.Other.Lot CMF 10"),
			dataIndex : 'lotCmf10'
		}, {
			header : T("Caption.Other.Lot CMF 11"),
			dataIndex : 'lotCmf11'
		}, {
			header : T("Caption.Other.Lot CMF 12"),
			dataIndex : 'lotCmf12'
		}, {
			header : T("Caption.Other.Lot CMF 13"),
			dataIndex : 'lotCmf13'
		}, {
			header : T("Caption.Other.Lot CMF 14"),
			dataIndex : 'lotCmf14'
		}, {
			header : T("Caption.Other.Lot CMF 15"),
			dataIndex : 'lotCmf15'
		}, {
			header : T("Caption.Other.Lot CMF 16"),
			dataIndex : 'lotCmf16'
		}, {
			header : T("Caption.Other.Lot CMF 17"),
			dataIndex : 'lotCmf17'
		}, {
			header : T("Caption.Other.Lot CMF 18"),
			dataIndex : 'lotCmf18'
		}, {
			header : T("Caption.Other.Lot CMF 19"),
			dataIndex : 'lotCmf19'
		}, {
			header : T("Caption.Other.Lot CMF 20"),
			dataIndex : 'lotCmf20'
		}, {
			header : T("Caption.Other.Lot Delete Flag"),
			dataIndex : 'lotDelFlag'
		}, {
			header : T("Caption.Other.Lot Delete Code"),
			dataIndex : 'lotDelCode'
		}, {
			header : T("Caption.Other.BOM Set ID"),
			dataIndex : 'bomSetId'
		}, {
			header : T("Caption.Other.BOM Set Version"),
			align : 'center',
			dataIndex : 'bomSetVersion'
		}, {
			header : T("Caption.Other.BOM Active Hist Seq"),
			align : 'center',
			dataIndex : 'bomActiveHistSeq'
		}, {
			header : T("Caption.Other.BOM Hist Seq"),
			align : 'center',
			dataIndex : 'bomHistSeq'
		}, {
			header : T("Caption.Other.Critical Resource ID"),
			dataIndex : 'criticalResId'
		}, {
			header : T("Caption.Other.Critical Resource Group ID"),
			dataIndex : 'criticalResGroupId'
		}, {
			header : T("Caption.Other.Save Resource ID") + 1,
			dataIndex : 'saveResId1'
		}, {
			header : T("Caption.Other.Save Resource ID") + 2,
			dataIndex : 'saveResId2'
		}, {
			header : T("Caption.Other.Sub Resource ID"),
			dataIndex : 'subresId'
		}, {
			header : T("Caption.Other.Lot Group ID") + 1,
			dataIndex : 'lotGroupId1'
		}, {
			header : T("Caption.Other.Lot Group ID") + 2,
			dataIndex : 'lotGroupId2'
		}, {
			header : T("Caption.Other.Lot Group ID") + 3,
			dataIndex : 'lotGroupId3'
		}, {
			header : T("Caption.Other.Yield 1"),
			align : 'right',
			dataIndex : 'yield1'
		}, {
			header : T("Caption.Other.Yield 2"),
			align : 'right',
			dataIndex : 'yield2'
		}, {
			header : T("Caption.Other.Yield 3"),
			align : 'right',
			dataIndex : 'yield3'
		}, {
			header : T("Caption.Other.Good Qty"),
			align : 'right',
			dataIndex : 'goodQty'
		}, {
			header : T("Caption.Other.Resv Field 1"),
			dataIndex : 'resvField1'
		}, {
			header : T("Caption.Other.Resv Field 2"),
			dataIndex : 'resvField2'
		}, {
			header : T("Caption.Other.Resv Field 3"),
			dataIndex : 'resvField3'
		}, {
			header : T("Caption.Other.Resv Field 4"),
			dataIndex : 'resvField4'
		}, {
			header : T("Caption.Other.Resv Field 5"),
			dataIndex : 'resvField5'
		}, {
			header : T("Caption.Other.Resv Flag 1"),
			dataIndex : 'resvFlag1'
		}, {
			header : T("Caption.Other.Resv Flag 2"),
			dataIndex : 'resvFlag2'
		}, {
			header : T("Caption.Other.Resv Flag 3"),
			dataIndex : 'resvFlag3'
		}, {
			header : T("Caption.Other.Resv Flag 4"),
			dataIndex : 'resvFlag4'
		}, {
			header : T("Caption.Other.Resv Flag 5"),
			dataIndex : 'resvFlag5'
		}, {
			header : T("Caption.Other.Old Factory"),
			dataIndex : 'oldFactory'
		}, {
			header : T("Caption.Other.Old Mat ID"),
			dataIndex : 'oldMatId'
		}, {
			header : T("Caption.Other.Old Mat Ver"),
			align : 'center',
			dataIndex : 'oldMatVer'
		}, {
			header : T("Caption.Other.Old Flow"),
			dataIndex : 'oldFlow'
		}, {
			header : T("Caption.Other.Old Flow Seq"),
			align : 'center',
			dataIndex : 'oldFlowSeqNum'
		}, {
			header : T("Caption.Other.Old Oper"),
			dataIndex : 'oldOper'
		}, {
			header : T("Caption.Other.Old Qty 1"),
			dataIndex : 'oldQty1'
		}, {
			header : T("Caption.Other.Old Qty 2"),
			dataIndex : 'oldQty2'
		}, {
			header : T("Caption.Other.Old Qty 3"),
			dataIndex : 'oldQty3'
		}, {
			header : T("Caption.Other.Old Hist Seq"),
			align : 'center',
			dataIndex : 'oldHistSeq'
		}, {
			header : T("Caption.Other.Old Lot Type"),
			dataIndex : 'oldLotType'
		}, {
			header : T("Caption.Other.Old Owner Code"),
			dataIndex : 'oldOwnerCode'
		}, {
			header : T("Caption.Other.Old Create Code"),
			dataIndex : 'oldCreateCode'
		}, {
			header : T("Caption.Other.Old Fac In Time"),
			dataIndex : 'oldFacInTime',
			width : 130
		}, {
			header : T("Caption.Other.Old Flow In Time"),
			dataIndex : 'oldFlowInTime',
			width : 130
		}, {
			header : T("Caption.Other.Old Oper In Time"),
			dataIndex : 'oldOperInTime',
			width : 130
		}, {
			header : T("Caption.Other.Tran CMF 1"),
			dataIndex : 'tranCmf1'
		}, {
			header : T("Caption.Other.Tran CMF 2"),
			dataIndex : 'tranCmf2'
		}, {
			header : T("Caption.Other.Tran CMF 3"),
			dataIndex : 'tranCmf3'
		}, {
			header : T("Caption.Other.Tran CMF 4"),
			dataIndex : 'tranCmf4'
		}, {
			header : T("Caption.Other.Tran CMF 5"),
			dataIndex : 'tranCmf5'
		}, {
			header : T("Caption.Other.Tran CMF 6"),
			dataIndex : 'tranCmf6'
		}, {
			header : T("Caption.Other.Tran CMF 7"),
			dataIndex : 'tranCmf7'
		}, {
			header : T("Caption.Other.Tran CMF 8"),
			dataIndex : 'tranCmf8'
		}, {
			header : T("Caption.Other.Tran CMF 9"),
			dataIndex : 'tranCmf9'
		}, {
			header : T("Caption.Other.Tran CMF 10"),
			dataIndex : 'tranCmf10'
		}, {
			header : T("Caption.Other.Tran CMF 11"),
			dataIndex : 'tranCmf11'
		}, {
			header : T("Caption.Other.Tran CMF 12"),
			dataIndex : 'tranCmf12'
		}, {
			header : T("Caption.Other.Tran CMF 13"),
			dataIndex : 'tranCmf13'
		}, {
			header : T("Caption.Other.Tran CMF 14"),
			dataIndex : 'tranCmf14'
		}, {
			header : T("Caption.Other.Tran CMF 15"),
			dataIndex : 'tranCmf15'
		}, {
			header : T("Caption.Other.Tran CMF 16"),
			dataIndex : 'tranCmf16'
		}, {
			header : T("Caption.Other.Tran CMF 17"),
			dataIndex : 'tranCmf17'
		}, {
			header : T("Caption.Other.Tran CMF 18"),
			dataIndex : 'tranCmf18'
		}, {
			header : T("Caption.Other.Tran CMF 19"),
			dataIndex : 'tranCmf19'
		}, {
			header : T("Caption.Other.Tran CMF 20"),
			dataIndex : 'tranCmf20'
		}, {
			header : T("Caption.Other.Tran User Id"),
			dataIndex : 'tranUserId'
		}, {
			header : T("Caption.Other.Tran Comment"),
			dataIndex : 'tranComment'
		}, {
			header : T("Caption.Other.Prev Active Hist Seq"),
			align : 'center',
			dataIndex : 'prevActiveHistSeq'
		}, {
			header : T("Caption.Other.Multi Tr Key"),
			dataIndex : 'multiTrKey'
		}, {
			header : T("Caption.Other.Multi Tr Seq"),
			align : 'center',
			dataIndex : 'multiTrSeq',
			width : 130
		}, {
			header : T("Caption.Other.Hist Delete Flag"),
			align : 'center',
			dataIndex : 'histDelFlag'
		}, {
			header : T("Caption.Other.Hist Delete Time"),
			dataIndex : 'histDelTime',
			width : 130
		}, {
			header : T("Caption.Other.Hist Delete User ID"),
			dataIndex : 'histDelUserId'
		}, {
			header : T("Caption.Other.Hist Delete Comment"),
			dataIndex : 'histDelComment',
			width : 130
		}, {
			header : T("Caption.Other.Sys Tran Time"),
			dataIndex : 'sysTranTime',
			width : 130
		} ];
	}
});