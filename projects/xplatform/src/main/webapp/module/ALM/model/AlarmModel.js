Ext.define('ALM.model.AlarmModel', {
	extend : 'Ext.data.Model',
	
	fields : [{
		name : 'alarmLevel',
		type : 'string'
	}, {
		name : 'alarmType',
		type : 'string'
	}, {
		name : 'alarmId',
		type : 'string'
	}, {
		name : 'alarmSubject',
		type : 'string'
	}, {
		name : 'alarmMsg',
		type : 'string'
	}, {
		name : 'alarmComment1',
		type : 'string'
	}, {
		name : 'alarmComment2',
		type : 'string'
	}, {
		name : 'alarmComment3',
		type : 'string'
	}, {
		name : 'alarmComment4',
		type : 'string'
	}, {
		name : 'alarmComment5',
		type : 'string'
	}, {
		name : 'lotId',
		type : 'string'
	}, {
		name : 'resId',
		type : 'string'
	}, {
		name : 'createTime',
		type : 'string'
	}, {
		name : 'sourceId1',
		type : 'string'
	}, {
		name : 'sourceDesc1',
		type : 'string'
	}, {
		name : 'sourceId2',
		type : 'string'
	}, {
		name : 'sourceDesc2',
		type : 'string'
	}, {
		name : 'sourceId3',
		type : 'string'
	}, {
		name : 'sourceDesc3',
		type : 'string'
	}, {
		name : 'fileId',
		type : 'string'
	},{
		name : 'confirmFlag',
		type : 'string'
	}]
});