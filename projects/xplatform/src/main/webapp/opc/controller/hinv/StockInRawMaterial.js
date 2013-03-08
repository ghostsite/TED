Ext.define('Opc.controller.hinv.StockInRawMaterial', {
	extend : 'Opc.controller.BaseController',
	
	views : [ 'hinv.StockInRawMaterial' ],
	
	refs : [ {
		selector : 'hinv_stock_in_raw_material',
		ref : 'stockRawMatForm'
	}, {
		selector : 'hinv_stock_in_raw_material grid',
		ref : 'rawMatList'
	}, {
		selector : 'hinv_stock_in_raw_material [itemId=cdvCenterWoList]',
		ref : 'centerWoList'
	}, {
		selector : 'hinv_stock_in_raw_material [itemId=numSum]',
		ref : 'sum'
	} ],
	
	init : function() {
		this.control({
			'hinv_stock_in_raw_material' : {
				btnClose : this.onBtnClose
			},
			'hinv_stock_in_raw_material [itemId=cdvCenterWoList]' : {
				select : this.onSelectCenterWoList
			},
			'hinv_stock_in_raw_material [itemId=txtLotId]' : {
				specialkey : this.onSpecialkey
			},
			'hinv_stock_in_raw_material [itemId=btnProcess]' : {
				click : this.onProcessBtnClick
			}
		});
		
		this.lotSeq = 0;
	},
	
	onSelectCenterWoList : function(record) {
		var url = 'service/HinvViewInspectionResultOfRawMaterial.json';
		var params = {
			procstep : '2',
			centerOrderId : record.get('centerOrderId'),
			rawMatId : record.get('rawMatId')
		};
		
		SF.cf.callService({
			url : url,
			params : params,
			scope : this,
			callback : function(response, success) {
				if (success) {
					this.afterCodeviewSelect(this.getStockRawMatForm().getForm(), response.result.inspResultList[0]);
				}
			}
		});
	},
	
	afterCodeviewSelect : function(form, data) {
		this.clearForm();
		
		form.setValues({
			matId : data['matId'],
			storeFlag : data['storeFlag'],
			inspectQty : data['inspectQty'],
			goodQty : data['goodQty'],
			badQty : data['badQty'],
			sampleQty : data['sampleQty'],
			oper : data['oper'],
//			comment : data['comment'],	TODO NO COMMENT FIELD
			inspectResult : data['inspectResult']
		});
		
		this.rawMatId = data['rawMatId'];
		this.location = data['location'];
	},
	
	clearForm : function(form) {
		SF.cf.clearFormFields(form);
		this.getRawMatList().store.removeAll();
		this.rawMatId = '';
		this.location = '';
	},
	
	onSpecialkey : function(me, e) {
		if (e.getKey() == e.ENTER) {
			if (!this.beforeAddLot())
				return;
			
			this.lotSeq++;
			var lotId = me.getValue() + this.lotSeq;
			var gridStore = this.getRawMatList().store;
			gridStore.add({lotId : lotId, rawMatId : this.rawMatId, inQty : 10, location : this.location});
			this.doSummary(gridStore);
		}
	},
	
	beforeAddLot : function() {
		if (!this.getCenterWoList().getValue()) {
			Ext.Msg.alert('Error', 'Center Order ID is Empty.');
			this.getCenterWoList().focus();
			return false;
		}
		return true;
	},
	
	doSummary : function(store) {
		var sum = 0;
		Ext.Array.each(store.data.items, function(record, index) {
			sum += parseInt(record.get('inQty'));
		});
		this.getSum().setValue(sum);
	},
	
	onProcessBtnClick : function() {
		var url = 'service/HinvStockInRawMaterial.json';
		var params = this.addParams();
		
		if (this.checkCondition(params) === false)
			return;
		
		SF.cf.callService({
			url : url,
			params : params,
			scope : this,
			showErrorMsg : true,
			showSuccessMsg : true,
			callback : function(response, success) {
				if (success) {
					SF.success('success');
					this.clearForm();
				} else {
					SF.success('fail');
				}
			}
		});
	},
	
	addParams : function() {
		var grid = this.getRawMatList();
		grid.completeEdit();

		var storeFlag = this.getStockRawMatForm().getForm().getFieldValues()['storeFlag'];
		var rawMatList = [];
		var store = grid.store;
		Ext.Array.each(store.data.items, function(record, index) {
			var data = Ext.clone(record.data);
			data['storeFlag'] = storeFlag;
			rawMatList.push(data);
		});
		
		var params = {
			procstep : '1',
			rawMatList : rawMatList
		};
		
		return params;
	},
	
	checkCondition : function(params) {		
		var rawMatList = params['rawMatList'];
		for (var i in rawMatList) {
			var data = rawMatList[i];
			if (!data['storeFlag']) {
				Ext.Msg.alert('Error', 'Store Flag is Empty.');
				return false;
			}
			if (!data['lotId']) {
				Ext.Msg.alert('Error', 'Lot ID is Empty.');
				return false;
			}
			if (!data['rawMatId']) {
				Ext.Msg.alert('Error', 'Raw Material ID is Empty.');
				return false;
			}
			if (!data['inQty']) {
				Ext.Msg.alert('Error', data['lotId'] + '\'s Quantity is Empty.');
				return false;
			}
//			if (!data['location']) {
//				Ext.Msg.alert('Error', data['lotId'] + '\'s Location is Empty.');
//				return false;
//			}
			if (!data['rawmatCreateTime']) {
				Ext.Msg.alert('Error', data['lotId'] + '\'s Raw Material Creat Time is Empty.');
				return false;
			}
			if (!data['periodTime']) {
				Ext.Msg.alert('Error', data['lotId'] + '\'s Period Time is Empty.');
				return false;
			}
		}
		
		return true;
	}
});