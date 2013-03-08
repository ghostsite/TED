Ext.define('MES.model.ConvertWipViewLotOut', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'statusvalue',
		type : 'string'
	}, {
		name : 'msgcate',
		type : 'string'
	}, {
		name : 'msgcode',
		type : 'string'
	}, {
		name : 'msg',
		type : 'string'
	}, {
		name : 'fieldmsg',
		type : 'auto'
	}, {
		name : 'lotId',
		type : 'string'
	}, {
		name : 'lotDesc',
		type : 'string'
	}, {
		name : 'factory',
		type : 'string'
	}, {
		name : 'matId',
		type : 'string'
	}, {
		name : 'matInfo',
		type : 'string',
		convert : function(value, record) {
			return record.get('matId') + ' (' + record.get('matVer') + ') : ' + record.get('matDesc');
		}
	}, {
		name : 'matVer',
		type : 'number'
	}, {
		name : 'matDesc',
		type : 'string'
	}, {
		name : 'flow',
		type : 'string'
	}, {
		name : 'flowInfo',
		type : 'string',
		convert : function(value, record) {
			return record.get('flow') + ' (' + record.get('flowSeqNum') + ') : ' + record.get('flowDesc');
		}
	}, {
		name : 'flowSeqNum',
		type : 'number'
	}, {
		name : 'flowDesc',
		type : 'string'
	}, {
		name : 'oper',
		type : 'string'
	}, {
		name : 'operInfo',
		type : 'string',
		convert : function(value, record) {
			return record.get('oper') + ' : ' + record.get('operDesc');
		}
	}, {
		name : 'operDesc',
		type : 'string'
	}, {
		name : 'qtyInfo',
		type : 'string',
		convert : function(value, record) {
			return record.get('qty1') + '/' + record.get('qty2') + '/' + record.get('qty3');
		}
	}, {
		name : 'qty1',
		type : 'number'
	}, {
		name : 'qty2',
		type : 'number'
	}, {
		name : 'qty3',
		type : 'number'
	}, {
		name : 'crrId',
		type : 'string'
	}, {
		name : 'lotType',
		type : 'string'
	}, {
		name : 'ownerCode',
		type : 'string'
	}, {
		name : 'createCode',
		type : 'string'
	}, {
		name : 'lotPriority',
		type : 'string'
	}, {
		name : 'lotPriorityInfo',
		type : 'string',
		convert : function(value, record) {
			var retValue = '';
			var lotPriority = record.get('lotPriority');
			switch (lotPriority) {
			case '9':
				retValue = "HIGH" + '(' + lotPriority + ')';
				break;
			case '8':
				retValue = "MID HIGH" + '(' + lotPriority + ')';
				break;
			case '7':
				retValue = "MID HIGH" + '(' + lotPriority + ')';
				break;
			case '6':
				retValue = "MID HIGH" + '(' + lotPriority + ')';
				break;
			case '5':
				retValue = "NORMAL" + '(' + lotPriority + ')';
				break;
			case '4':
				retValue = "MID LOW" + '(' + lotPriority + ')';
				break;
			case '3':
				retValue = "MID LOW" + '(' + lotPriority + ')';
				break;
			case '2':
				retValue = "MID LOW" + '(' + lotPriority + ')';
				break;
			case '1':
				retValue = "LOW" + '(' + lotPriority + ')';
				break;
			}

			return retValue;
		}
	}, {
		name : 'lotStatus',
		type : 'string'
	}, {
		name : 'holdFlag',
		tyep : 'string'
	}, {
		name : 'holdInfo',
		type : 'string',
		convert : function(value, record) {
			value = record.get('holdFlag');
			if (value != '') {
				return value + " : " + record.get('holdCode');
			}
			return value;
		}
	}, {
		name : 'holdCode',
		type : 'string'
	}, {
		name : 'holdPassword',
		type : 'string'
	}, {
		name : 'holdPrvGrpId',
		type : 'string'
	}, {
		name : 'operInQtyInfo',
		type : 'string',
		convert : function(value, record) {
			return record.get('operInQty1') + '/' + record.get('operInQty2') + '/' + record.get('operInQty3');
		}
	}, {
		name : 'operInQty1',
		type : 'number'
	}, {
		name : 'operInQty2',
		type : 'number'
	}, {
		name : 'operInQty3',
		type : 'number'
	}, {
		name : 'createQtyInfo',
		type : 'string',
		convert : function(value, record) {
			return record.get('createQty1') + '/' + record.get('createQty2') + '/' + record.get('createQty3');
		}
	}, {
		name : 'createQty1',
		type : 'number'
	}, {
		name : 'createQty2',
		type : 'number'
	}, {
		name : 'createQty3',
		type : 'number'
	}, {
		name : 'startQtyInfo',
		type : 'string',
		convert : function(value, record) {
			return record.get('startQty1') + '/' + record.get('startQty2') + '/' + record.get('startQty3');
		}
	}, {
		name : 'startQty1',
		type : 'number'
	}, {
		name : 'startQty2',
		type : 'number'
	}, {
		name : 'startQty3',
		type : 'number'
	}, {
		name : 'invFlag',
		type : 'string'
	}, {
		name : 'transitFlag',
		type : 'string'
	}, {
		name : 'unitExistFlag',
		type : 'string'
	}, {
		name : 'invUnit',
		type : 'string'
	}, {
		name : 'rwkInfo',
		type : 'string',
		convert : function(value, record) {
			value = record.get('rwkFlag');
			if (value != '') {
				return value + " : " + record.get('rwkCode');
			}
			return value;
		}
	}, {
		name : 'rwkFlag',
		type : 'string'
	}, {
		name : 'rwkCode',
		type : 'string'
	}, {
		name : 'rwkCount',
		type : 'number'
	}, {
		name : 'rwkDepth',
		type : 'number'
	}, {
		name : 'rwkStopOper',
		type : 'string'
	}, {
		name : 'rwkRetFlowInfo',
		type : 'string',
		convert : function(value, record) {
			value = record.get('rwkRetFlow');
			if (value != '') {
				return value + "(" + record.get('rwkRetFlowSeqNum') + ")";
			}
			return value;
		}
	}, {
		name : 'rwkRetFlow',
		type : 'string'
	}, {
		name : 'rwkRetFlowSeqNum',
		type : 'number'
	}, {
		name : 'rwkRetOper',
		type : 'string'
	}, {
		name : 'rwkEndFlowInfo',
		type : 'string',
		convert : function(value, record) {
			value = record.get('rwkEndFlow');
			if (value != '') {
				return value + "(" + record.get('rwkEndFlowSeqNum') + ")";
			}
			return value;
		}
	}, {
		name : 'rwkEndFlow',
		type : 'string'
	}, {
		name : 'rwkEndFlowSeqNum',
		type : 'number'
	}, {
		name : 'rwkEndOper',
		type : 'string'
	}, {
		name : 'rwkRetClearFlag',
		type : 'string'
	}, {
		name : 'rwkTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'localReworkFlag',
		type : 'string'
	}, {
		name : 'rwkFromFlow',
		type : 'string'
	}, {
		name : 'rwkFromFlowSeqNum',
		type : 'number'
	}, {
		name : 'rwkFromOper',
		type : 'string'
	}, {
		name : 'nstdFlag',
		type : 'string'
	}, {
		name : 'nstdRetFlowInfo',
		type : 'string',
		convert : function(value, record) {
			value = record.get('nstdRetFlow');
			if (value != '') {
				return value + "(" + record.get('nstdRetFlowSeqNum') + ")";
			}
			return value;
		}
	}, {
		name : 'nstdRetFlow',
		type : 'string'
	}, {
		name : 'nstdRetFlowSeqNum',
		type : 'number'
	}, {
		name : 'nstdRetOper',
		type : 'string'
	}, {
		name : 'nstdTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'repFlag',
		type : 'string'
	}, {
		name : 'repRetOper',
		type : 'string'
	}, {
		name : 'strRetFlow',
		type : 'string'
	}, {
		name : 'strRetFlowSeqNum',
		type : 'number'
	}, {
		name : 'strRetOper',
		type : 'string'
	}, {
		name : 'startFlag',
		type : 'string'
	}, {
		name : 'startTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'startResId',
		type : 'string'
	}, {
		name : 'endFlag',
		type : 'string'
	}, {
		name : 'endTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'endResId',
		type : 'string'
	}, {
		name : 'sampleFlag',
		type : 'string'
	}, {
		name : 'sampleWaitFlag',
		type : 'string'
	}, {
		name : 'sampleResult',
		type : 'string'
	}, {
		name : 'fromToFlag',
		type : 'string'
	}, {
		name : 'fromToLotId',
		type : 'string'
	}, {
		name : 'shipCode',
		type : 'string'
	}, {
		name : 'shipTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'orgDueTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'schDueTime',
		type : 'date',
		dateFormat : 'YmdHis',
		convert : function(value) {
			if (value.length >= 8) {
				var ymd = value.substr(0, 8);
				var schDueTime = Ext.Date.parse(ymd, "Ymd");
				// "yyyy-MM-dd" Format
				return Ext.Date.format(schDueTime, 'Y-m-d');
			}
			return value;
		}
	}, {
		name : 'createTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'facInTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'flowInTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'operInTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'reserveResId',
		type : 'string'
	}, {
		name : 'batchId',
		type : 'string'
	}, {
		name : 'batchSeq',
		type : 'number'
	}, {
		name : 'orderId',
		type : 'string'
	}, {
		name : 'addOrderId1',
		type : 'string'
	}, {
		name : 'addOrderId2',
		type : 'string'
	}, {
		name : 'addOrderId3',
		type : 'string'
	}, {
		name : 'lotLocation1',
		type : 'string'
	}, {
		name : 'lotLocation2',
		type : 'string'
	}, {
		name : 'lotLocation3',
		type : 'string'
	}, {
		name : 'lotCmf1',
		type : 'string'
	}, {
		name : 'lotCmf2',
		type : 'string'
	}, {
		name : 'lotCmf3',
		type : 'string'
	}, {
		name : 'lotCmf4',
		type : 'string'
	}, {
		name : 'lotCmf5',
		type : 'string'
	}, {
		name : 'lotCmf6',
		type : 'string'
	}, {
		name : 'lotCmf7',
		type : 'string'
	}, {
		name : 'lotCmf8',
		type : 'string'
	}, {
		name : 'lotCmf9',
		type : 'string'
	}, {
		name : 'lotCmf10',
		type : 'string'
	}, {
		name : 'lotCmf11',
		type : 'string'
	}, {
		name : 'lotCmf12',
		type : 'string'
	}, {
		name : 'lotCmf13',
		type : 'string'
	}, {
		name : 'lotCmf14',
		type : 'string'
	}, {
		name : 'lotCmf15',
		type : 'string'
	}, {
		name : 'lotCmf16',
		type : 'string'
	}, {
		name : 'lotCmf17',
		type : 'string'
	}, {
		name : 'lotCmf18',
		type : 'string'
	}, {
		name : 'lotCmf19',
		type : 'string'
	}, {
		name : 'lotCmf20',
		type : 'string'
	}, {
		name : 'lotDelFlag',
		type : 'string'
	}, {
		name : 'lotDelCode',
		type : 'string'
	}, {
		name : 'lotDelTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'bomSetId',
		type : 'string'
	}, {
		name : 'bomSetVersion',
		type : 'number'
	}, {
		name : 'bomActiveHistSeq',
		type : 'number'
	}, {
		name : 'bomHistSeq',
		type : 'number'
	}, {
		name : 'lastTranCode',
		type : 'string'
	}, {
		name : 'lastTranTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'lastComment',
		type : 'string'
	}, {
		name : 'lastActiveHistSeq',
		type : 'number'
	}, {
		name : 'lastHistSeq',
		type : 'number'
	}, {
		name : 'criticalResId',
		type : 'string'
	}, {
		name : 'criticalResGroupId',
		type : 'string'
	}, {
		name : 'saveResId1',
		type : 'string'
	}, {
		name : 'saveResId2',
		type : 'string'
	}, {
		name : 'subresId',
		type : 'string'
	}, {
		name : 'lotGroupId1',
		type : 'string'
	}, {
		name : 'lotGroupId2',
		type : 'string'
	}, {
		name : 'lotGroupId3',
		type : 'string'
	}, {
		name : 'portId',
		type : 'string'
	}, {
		name : 'sublotCount',
		type : 'number'
	}, {
		name : 'yield1',
		type : 'number'
	}, {
		name : 'yield2',
		type : 'number'
	}, {
		name : 'yield3',
		type : 'number'
	}, {
		name : 'goodQty',
		type : 'number'
	}, {
		name : 'resvField1',
		type : 'string'
	}, {
		name : 'resvField2',
		type : 'string'
	}, {
		name : 'resvField3',
		type : 'string'
	}, {
		name : 'resvField4',
		type : 'string'
	}, {
		name : 'resvField5',
		type : 'string'
	}, {
		name : 'resvFlag1',
		type : 'string'
	}, {
		name : 'resvFlag2',
		type : 'string'
	}, {
		name : 'resvFlag3',
		type : 'string'
	}, {
		name : 'resvFlag4',
		type : 'string'
	}, {
		name : 'resvFlag5',
		type : 'string'
	}, {
		name : 'startResList',
		type : 'auto'
	}, {
		name : 'endResList',
		type : 'auto'
	}, {
		name : 'crrList',
		type : 'auto'
	} ]
});