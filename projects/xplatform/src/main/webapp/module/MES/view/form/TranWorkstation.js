Ext.define('MES.view.form.TranWorkstation', {
	extend : 'Ext.view.View',

	height : 100,

	itemSelector : '.tranName',
	//overItemCls : 'bb-hover',
	
	// lotInfo 출력
	//TODO : server service 완료시 수정
	setWorkStation : function(record) {
		var store = this.store;
		//TODO 시연용 데이타 코드 입니다. 사용 후 삭제 바랍니다.
		// A : 미작업
		// B : 완료
		// C : 다음작업 or 현재.상태.....
		var data = [];
		if(record){
			var lastTranCode = record.get('lastTranCode');
			var lotStatus=record.get('lotStatus');

			if(lotStatus == 'WAIT'){
				switch(lastTranCode){
				case SF_TRAN_CODE_HOLD:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_RELEASE:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_REWORK:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Rework Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_SPLIT:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Split Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Merge Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_MERGE:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Split Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Rework Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Merge Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_END:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'B'
					}, {
						tranName : 'End Lot',
						tranStatus : 'C'
					} );
					break;
				default :
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				}
			}
			else if(lotStatus == 'PROC'){
				switch(lastTranCode){
				case SF_TRAN_CODE_START:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_HOLD:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_RELEASE:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'C'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_REWORK:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Rework Lot',
						tranStatus : 'C'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_SPLIT:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Split Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Merge Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_MERGE:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Split Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Merge Lot',
						tranStatus : 'C'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				case SF_TRAN_CODE_END:
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'B'
					}, {
						tranName : 'End Lot',
						tranStatus : 'C'
					} );
					break;
				default :
					data.push({
						tranName : 'Create Lot',
						tranStatus : 'B'
					}, {
						tranName : 'Start Lot',
						tranStatus : 'C'
					}, {
						tranName : 'Hold Lot',
						tranStatus : 'A'
					}, {
						tranName : 'Release Lot',
						tranStatus : 'A'
					}, {
						tranName : 'End Lot',
						tranStatus : 'A'
					} );
					break;
				}
			}
		}
		
		store.loadData(data);
	},

	//TODO : SPAN별 class적용 바랍니다.
	initComponent : function() {
		this.store = Ext.create('Ext.data.Store', {
			fields : [ 'tranName', 'tranStatus' ]
		});
		// tpl은 '로만 문자를 묶어야 출력된다.
		var tpl = '';
			
		tpl = new Ext.XTemplate('<div class="lotStatusFlow">',
			'<div class="legend"><span class="type1">Complete</span><span class="type2">Next</span><span class="type3">Intended</span></div>',
			'<tpl for=".">',
				'<tpl if="tranStatus==\'B\'"><span class="complete tranName">{tranName}</span></tpl>',
				'<tpl if="tranStatus==\'C\'"><div class="current tranName"><span><span class="iconArrow"></span>{tranName}</span></div></tpl>',
				'<tpl if="tranStatus==\'A\'"><span class="intended tranName">{tranName}</span></tpl>', 
				'<tpl if="xindex != xcount"><span class="downArrow"></span></tpl>',
			'</tpl>', '</div>');
		
		this.tpl = tpl;

		this.callParent();
		var self = this;
		
		this.on('itemclick',function(me, record, item, index){
			// item click 화면 링크 이동
			self.linkToFunction(record.data.tranName);
		});
	},
	linkToFunction : function(tranName){
		var assemblyName = '';
		var funcName = '';
		switch(tranName){
		case 'Create Lot':
			funcName = 'WWIP2001';
			assemblyName = 'WIP.view.transaction.CreateLot';
			break;
		case 'Start Lot':
			funcName = 'WWIP2002';
			assemblyName = 'WIP.view.transaction.StartLot';
			break;
		case 'Split Lot':
			funcName = 'WWIP2009';
			assemblyName = 'WIP.view.transaction.SplitLot';
			break;
		case 'Merge Lot':
			funcName = 'WWIP2008';
			assemblyName = 'WIP.view.transaction.MergeLot';
			break;
		case 'End Lot':
			funcName = 'WWIP2004';
			assemblyName = 'WIP.view.transaction.EndLot';
			break;
		case 'Hold Lot':
			funcName = 'WWIP2012';
			assemblyName = 'WIP.view.transaction.HoldLot';
			break;
		case 'Release Lot':
			funcName = 'WWIP2013';
			assemblyName = 'WIP.view.transaction.ReleaseLot';
			break;
		case 'Rework Lot':
			funcName = 'WWIP2007';
			assemblyName = 'WIP.view.transaction.ReworkLot';
			break;
		}
		if(funcName && assemblyName){
			SF.doMenu({
				viewModel : assemblyName
			});
		}
		// TODO : link시 기준값 재확인
	}
});