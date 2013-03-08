Ext.define('MES.model.ConvertWipViewSubOut', {
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
		name : 'total',
		type : 'number'
	}, {
		name : 'fileinfo',
		type : 'auto'
	}, {
		name : 'lotId',
		type : 'string'
	}, {
		name : 'factory',
		type : 'string'
	}, {
		name : 'matInfo',
		type : 'string',
		convert: function(value, record) {
            return record.get('matId') + ' (' + record.get('matVer') + ') : ' + record.get('matDesc');
        }
	}, {
		name : 'matId',
		type : 'string'
	}, {
		name : 'matVer',
		type : 'number'
	}, {
		name : 'matDesc',
		type : 'string'
	}, {
		name : 'flowInfo',
		type : 'string',
		convert: function(value, record) {
            return record.get('flow') + ' (' + record.get('flowSeqNum') + ') : ' + record.get('flowDesc');
        }
	}, {
		name : 'flow',
		type : 'string'
	}, {
		name : 'flowSeqNum',
		type : 'number'
	}, {
		name : 'flowDesc',
		type : 'string'
	}, {
		name : 'operInfo',
		type : 'string',
		convert: function(value, record) {
            return record.get('oper') + ' : ' + record.get('operDesc');
        }
	}, {
		name : 'oper',
		type : 'string'
	}, {
		name : 'operDesc',
		type : 'string'
	}, {
		name : 'slotNo',
		type : 'number'
	}, {
		name : 'qtyInfo',
		type : 'string',
		convert: function(value, record) {
			return record.get('qty2') + '/' + record.get('qty3');
		}
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
		name : 'ownerCode',
		type : 'string'
	}, {
		name : 'createCode',
		type : 'string'
	}, {
		name : 'sublotStatus',
		type : 'string'
	}, {
		name : 'sublotType',
		type : 'string'
	}, {
		name : 'holdInfo',
		type : 'string',
		convert: function(value, record) {
			value = record.get('holdFlag');
			if(value != ''){
				return value + " : " + record.get('holdCode');
			}
			return value;
		}
	}, {
		name : 'holdFlag',
		tyep : 'string'
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
		convert: function(value, record) {
			return record.get('operInQty2') + '/' + record.get('operInQty3');
		}
	}, {
		name : 'operInQty2',
		type : 'number'
	}, {
		name : 'operInQty3',
		type : 'number'
	}, {
		name : 'createQtyInfo',
		type : 'string',
		convert: function(value, record) {
			return record.get('createQty2') + '/' + record.get('createQty3');
		}
	}, {
		name : 'createQty2',
		type : 'number'
	}, {
		name : 'createQty3',
		type : 'number'
	}, {
		name : 'startQtyInfo',
		type : 'string',
		convert: function(value, record) {
			return record.get('startQty2') + '/' + record.get('startQty3');
		}
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
		convert: function(value, record) {
			value = record.get('rwkFlag');
			if(value != ''){
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
		convert: function(value, record) {
			value = record.get('rwkRetFlow');
			if(value != ''){
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
		convert: function(value, record) {
			value = record.get('rwkEndFlow');
			if(value != ''){
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
		name : 'nstdFlag',
		type : 'string'
	}, {
		name : 'nstdRetFlowInfo',
		type : 'string',
		convert: function(value, record) {
			value = record.get('nstdRetFlow');
			if(value != ''){
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
		name : 'reserveResId',
		type : 'string'
	}, {
		name : 'portId',
		type : 'string'
	}, {
		name : 'sublotLocation1',
		type : 'string'
	}, {
		name : 'sublotLocation2',
		type : 'string'
	}, {
		name : 'sublotLocation3',
		type : 'string'
	}, {
		name : 'sublotCmf1',
		type : 'string'
	}, {
		name : 'sublotCmf2',
		type : 'string'
	}, {
		name : 'sublotCmf3',
		type : 'string'
	}, {
		name : 'sublotCmf4',
		type : 'string'
	}, {
		name : 'sublotCmf5',
		type : 'string'
	}, {
		name : 'sublotCmf6',
		type : 'string'
	}, {
		name : 'sublotCmf7',
		type : 'string'
	}, {
		name : 'sublotCmf8',
		type : 'string'
	}, {
		name : 'sublotCmf9',
		type : 'string'
	}, {
		name : 'sublotCmf10',
		type : 'string'
	}, {
		name : 'sublotCmf11',
		type : 'string'
	}, {
		name : 'sublotCmf12',
		type : 'string'
	}, {
		name : 'sublotCmf13',
		type : 'string'
	}, {
		name : 'sublotCmf14',
		type : 'string'
	}, {
		name : 'sublotCmf15',
		type : 'string'
	}, {
		name : 'sublotCmf16',
		type : 'string'
	}, {
		name : 'sublotCmf17',
		type : 'string'
	}, {
		name : 'sublotCmf18',
		type : 'string'
	}, {
		name : 'sublotCmf19',
		type : 'string'
	}, {
		name : 'sublotCmf20',
		type : 'string'
	}, {
		name : 'sublotDelFlag',
		type : 'string'
	}, {
		name : 'sublotDelCode',
		type : 'string'
	}, {
		name : 'sublotDelTime',
		type : 'date',
		dateFormat : 'YmdHis'
	}, {
		name : 'grade',
		type : 'string'
	}, {
		name : 'gradeCode',
		type : 'string'
	}, {
		name : 'cellGrade',
		type : 'string'
	}, {
		name : 'lotBase',
		type : 'string'
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
	} ]
});