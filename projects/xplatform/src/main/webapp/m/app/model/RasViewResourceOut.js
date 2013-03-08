Ext.define('MEStouch.model.RasViewResourceOut', {
	extend : 'Ext.data.Model',
	config : {
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
				name : 'resId',
				type : 'string'
			}, {
				name : 'resDesc',
				type : 'string'
			}, {
				name : 'resType',
				type : 'string'
			}, {
				name : 'resGrp1',
				type : 'string'
			}, {
				name : 'resGrp2',
				type : 'string'
			}, {
				name : 'resGrp3',
				type : 'string'
			}, {
				name : 'resGrp4',
				type : 'string'
			}, {
				name : 'resGrp5',
				type : 'string'
			}, {
				name : 'resGrp6',
				type : 'string'
			}, {
				name : 'resGrp7',
				type : 'string'
			}, {
				name : 'resGrp8',
				type : 'string'
			}, {
				name : 'resGrp9',
				type : 'string'
			}, {
				name : 'resGrp10',
				type : 'string'
			}, {
				name : 'resCmf1',
				type : 'string'
			}, {
				name : 'resCmf2',
				type : 'string'
			}, {
				name : 'resCmf3',
				type : 'string'
			}, {
				name : 'resCmf4',
				type : 'string'
			}, {
				name : 'resCmf5',
				type : 'string'
			}, {
				name : 'resCmf6',
				type : 'string'
			}, {
				name : 'resCmf7',
				type : 'string'
			}, {
				name : 'resCmf8',
				type : 'string'
			}, {
				name : 'resCmf9',
				type : 'string'
			}, {
				name : 'resCmf10',
				type : 'string'
			}, {
				name : 'resCmf11',
				type : 'string'
			}, {
				name : 'resCmf12',
				type : 'string'
			}, {
				name : 'resCmf13',
				type : 'string'
			}, {
				name : 'resCmf14',
				type : 'string'
			}, {
				name : 'resCmf15',
				type : 'string'
			}, {
				name : 'resCmf16',
				type : 'string'
			}, {
				name : 'resCmf17',
				type : 'string'
			}, {
				name : 'resCmf18',
				type : 'string'
			}, {
				name : 'resCmf19',
				type : 'string'
			}, {
				name : 'resCmf20',
				type : 'string'
			}, {
				name : 'useFacPrtFlag',
				type : 'string'
			}, {
				name : 'resStsPrt1',
				type : 'string'
			}, {
				name : 'resStsPrt2',
				type : 'string'
			}, {
				name : 'resStsPrt3',
				type : 'string'
			}, {
				name : 'resStsPrt4',
				type : 'string'
			}, {
				name : 'resStsPrt5',
				type : 'string'
			}, {
				name : 'resStsPrt6',
				type : 'string'
			}, {
				name : 'resStsPrt7',
				type : 'string'
			}, {
				name : 'resStsPrt8',
				type : 'string'
			}, {
				name : 'resStsPrt9',
				type : 'string'
			}, {
				name : 'resStsPrt10',
				type : 'string'
			}, {
				name : 'areaId',
				type : 'string'
			}, {
				name : 'subAreaId',
				type : 'string'
			}, {
				name : 'resLocation',
				type : 'string'
			}, {
				name : 'procRule',
				type : 'string'
			}, {
				name : 'maxProcCount',
				type : 'number'
			}, {
				name : 'batchCond1',
				type : 'string'
			}, {
				name : 'batchCond2',
				type : 'string'
			}, {
				name : 'pmSchEnableFlag',
				type : 'string'
			}, {
				name : 'unitBaseStFlag',
				type : 'string'
			}, {
				name : 'secChkFlag',
				type : 'string'
			}, {
				name : 'autoGatherAlarm',
				type : 'string'
			}, {
				name : 'deleteFlag',
				type : 'string'
			}, {
				name : 'deleteUserId',
				type : 'string'
			}, {
				name : 'deleteTime',
				type : 'date',
				dateFormat : 'YmdHis'
			}, {
				name : 'createUserId',
				type : 'string'
			}, {
				name : 'createTime',
				type : 'date',
				dateFormat : 'YmdHis'
			}, {
				name : 'updateUserId',
				type : 'string'
			}, {
				name : 'updateTime',
				type : 'date',
				dateFormat : 'YmdHis'
			}, {
				name : 'resUpDownFlag',
				type : 'string'
			}, {
				name : 'resPriSts',
				type : 'string'
			}, {
				name : 'resSts1',
				type : 'string'
			}, {
				name : 'resSts2',
				type : 'string'
			}, {
				name : 'resSts3',
				type : 'string'
			}, {
				name : 'resSts4',
				type : 'string'
			}, {
				name : 'resSts5',
				type : 'string'
			}, {
				name : 'resSts6',
				type : 'string'
			}, {
				name : 'resSts7',
				type : 'string'
			}, {
				name : 'resSts8',
				type : 'string'
			}, {
				name : 'resSts9',
				type : 'string'
			}, {
				name : 'resSts10',
				type : 'string'
			}, {
				name : 'resCtrlMode',
				type : 'string'
			}, {
				name : 'resProcMode',
				type : 'string'
			}, {
				name : 'lastRecipeId',
				type : 'string'
			}, {
				name : 'procCount',
				type : 'number'
			}, {
				name : 'lastStartTime',
				type : 'date',
				dateFormat : 'YmdHis'
			}, {
				name : 'lastEndTime',
				type : 'date',
				dateFormat : 'YmdHis'
			}, {
				name : 'lastDownTime',
				type : 'date',
				dateFormat : 'YmdHis'
			}, {
				name : 'lastDownHistSeq',
				type : 'number'
			}, {
				name : 'lastEventId',
				type : 'string'
			}, {
				name : 'lastEventTime',
				type : 'date',
				dateFormat : 'YmdHis'
			}, {
				name : 'lastActiveHistSeq',
				type : 'number'
			}, {
				name : 'lastHistSeq',
				type : 'number'
			} ]
	}
});