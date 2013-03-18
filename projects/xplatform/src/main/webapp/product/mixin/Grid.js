Ext.define('mixin.Grid', function() {
	//그리드에 선택된 records 대상 그리드에 추가
	function attachRecords(sendGrid, receiveGrid, pkey){
		var sendRecords = sendGrid.getSelectionModel().getSelection();
		sendRecords = sortDesc(sendRecords);
		var receiveRecord = receiveGrid.getSelectionModel().getLastFocused();
		var receiveStore = receiveGrid.getStore();
		var focusRecords = [];
		var insertIndex = receiveStore.getCount() - 1;
		
		//index 결정
		if(receiveRecord){
			insertIndex = receiveStore.indexOf(receiveRecord);
		}
		
		//데이타 추가
		Ext.Array.each(sendRecords, function(record) {
			var findRecord = receiveStore.findRecord(pkey, record.get(pkey), 0, false, false, true);
			
			if (findRecord) {
				// 중복0 : focus record 설정
				focusRecords.push(findRecord);
			} else {
				// 중복X : record 등록(record 추가하면 참조 형태가 되므로 data 형태를 추가한다.)
				receiveStore.insert(insertIndex, record.data);
			}
		});
		
		//그리드 새로고침(record index 새로고침)
		refresh(grid, focusRecords, true);
	}
	
	//그리드에 선택된 records 삭제
	function detachRecords(grid, pkey){
		var store = grid.getStore();
		var selectRecords = grid.getSelectionModel().getSelection();
		
		Ext.Array.each(selectRecords, function(record) {
			//record 삭제
			store.remove(record);
		});
		
		//그리드 새로고침(record index 새로고침)
		refresh(grid, focusRecords, true);
	}
	
	//그리드에 선택된 행 순서를 위로 변경
	function upSeq(grid, seqField){
		var store = grid.getStore();
		var records = store.data.items;
		var selModel = grid.getSelectionModel();
		var selectRecords = selModel.getSelection();
		selectRecords = sortAsc(selectRecords); //오름차순 정렬
		var focusRecords = [];
		
		var iNext = 0;
		var iListIndex = 0;
		
		Ext.Array.each(selectRecords, function(record){
			iListIndex = store.indexOf(record);
			
			//index 한단계 위에 행과 데이타 변경
			if(iListIndex > iNext){
				var data1 = Ext.clone(record.data);
				var data2 = Ext.clone(records[iListIndex - 1].data);
				
				record.data = data2;
				records[iListIndex - 1].data = data1;
				
				//데이타 변경 작업후에 focus 지정할 행 설정
				focusRecords.push(records[iListIndex - 1]);
			}else{
				focusRecords.push(record);
			}
			
			//index와 inext가 같으면 기준값 재 설정(multiSelect 일 경우 사용됨) 
			if(iListIndex == iNext){
				iNext++;
			}
		});
		
		
		//그리드 새로고침
		var bRefresh = seqField ? true : false;
		refresh(grid, focusRecords, bRefresh, seqField);
	}
	
	//그리드에 선택된 행 순서를 아래로 변경
	function downSeq(grid, seqField){
		var store = grid.getStore();
		var records = store.data.items;
		var selModel = grid.getSelectionModel();
		var selectRecords = selModel.getSelection();
		selectRecords = sortDesc(selectRecords);
		var focusRecords = [];
		
		var iNext = store.getCount() - 1; 
		var iListIndex = 0;
		
		Ext.Array.each(selectRecords, function(record){
			iListIndex = store.indexOf(record);
			
			if(iListIndex < iNext){
				
				var data1 = Ext.clone(record.data);
				var data2 = Ext.clone(records[iListIndex + 1].data);
				
				record.data = data2;
				records[iListIndex + 1].data = data1;
				
				focusRecords.push(records[iListIndex + 1]);
			}else{
				focusRecords.push(record);
			}
			
			if(iListIndex == iNext){
				iNext--;
			}
		});
		
		//그리드 새로고침
		var bRefresh = seqField ? true : false;
		refresh(grid, focusRecords, bRefresh, seqField);
	}
	
	//새로고침(record index 재정의)
	function refresh(grid, records, bRefreshIndx, seqField){
		var store = grid.getStore();
		
		//index 새로고침
		if(bRefreshIndx === true){
			Ext.Array.each(store.data.items, function(record, index){
				record.index = index;
				if(seqField){
					record.set(seqField, index + 1);
				}
				record.commit();
			});
		}
		
		//그리드 view 새로고침
		grid.getView().refresh();
		
		//select 설정
		if (records && records.length > 0) {
			grid.getSelectionModel().select(records);
		}
	}
	
	//records 오름차순 정렬
	function sortAsc(records, key){
		return Ext.Array.sort(records, function(record1, record2) {
			
			var data1 = key ? record1.get(key) : record1.index;
			var data2 = key ? record2.get(key) : record2.index;

			if (data1 > data2) {
				return 1;
			} else if (data1 < data2) {
				return -1;
			} else {
				return 0;
			}
		});
	}
	
	//records 내림차순 정렬
	function sortDesc(records, key){
		return  Ext.Array.sort(records, function(record1, record2) {
			
			var data1 = key ? record1.get(key) : record1.index;
			var data2 = key ? record2.get(key) : record2.index;
			
			if (data1 > data2) {
				return -1;
			} else if (data1 < data2) {
				return 1;
			} else {
				return 0;
			}
		});
	}
	
	return {
		grid : {
			attachRecords : attachRecords,
			detachRecords : detachRecords,
			upSeq : upSeq,
			downSeq : downSeq,
			refresh : refresh,
			records : {
				sortAsc : sortAsc,
				sortDesc : sortDesc
			}
		}
	};
});