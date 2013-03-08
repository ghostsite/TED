Ext.define('Opc.controller.hinv.CheckIncomingRawMaterial', {
	extend : 'Opc.controller.BaseController',
	
	views : [ 'hinv.CheckIncomingRawMaterial' ],
	
	refs : [ {
		selector : 'hinv_check_incoming_raw_mat',
		ref : 'rawMatForm'
	}, {
		selector : 'hinv_check_incoming_raw_mat grid',
		ref : 'hwWoList'
	}, {
		selector : 'hinv_check_incoming_raw_mat [itemId=cdvStoreFlag]',
		ref : 'storeFlag'
	}, {
		selector : 'hinv_check_incoming_raw_mat [itemId=txtRawMatId]',
		ref : 'rawMatId'
	}, {
		selector : 'hinv_check_incoming_raw_mat [itemId=numWoQty]',
		ref : 'woQty'
	}, {
		selector : 'hinv_check_incoming_raw_mat [itemId=numRealQty]',
		ref : 'realQty'
	}, {
		selector : 'hinv_check_incoming_raw_mat [itemId=txtDifferQty]',
		ref : 'differQty'
	}, {
		selector : 'hinv_check_incoming_raw_mat [itemId=txtCheckFlag]',
		ref : 'checkFlag'
	} ],
	
	init : function() {
		this.control({
			'hinv_check_incoming_raw_mat' : {
				btnClose : this.onBtnClose
			},
			'hinv_check_incoming_raw_mat [itemId=cdvStoreFlag]' : {
				select : this.onSelectStoreFlag
			},
			'hinv_check_incoming_raw_mat grid' : {
				itemclick : this.onItemClick
			},
			'hinv_check_incoming_raw_mat [itemId=btnCheck]' : {
				click : this.onCheckBtnClick
			},
			'hinv_check_incoming_raw_mat [itemId=btnProcess]' : {
				click : this.onProcessBtnClick
			}
		});
	},
	
	onSelectStoreFlag : function(record) {
		this.getHwWoList().store.load({
			params : {
				procstep : '1'
				// TODO storeFlag : record['storeFlag']
			}
		});
	},
	
	onItemClick : function(me, record) {
		this.centerOrderId = record.get('orderId');
		this.oper = record.get('oper');
		this.getWoQty().setValue(record.get('qty'));
	},
	
	onCheckBtnClick : function() {
		if (!this.getRealQty().getValue()) {
			Ext.Msg.alert('Error', 'Real Qty is Empty.');
			return;
		}
		
		var differQty = this.getRealQty().getValue() - this.getWoQty().getValue();
		this.getDifferQty().setValue(differQty);
		
		if (differQty === 0) {
			this.getCheckFlag().setValue('B');
			this.getCheckFlag().addCls('textColorBlue');	// TODO cannot change the text font Color
		} else if (differQty > 0) {
			this.getCheckFlag().setValue('Y');
			this.getCheckFlag().addCls('textColorYellow');
		} else {
			this.getCheckFlag().setValue('R');
			this.getCheckFlag().addCls('textColorRed');
		}
	},
	
	onProcessBtnClick : function() {
		var url = 'service/HinvCheckIncomingRawMaterial.json';
		
		var formValues = this.getRawMatForm().getForm().getFieldValues();
		
		var params = {
			procstep : '1',
			storeFlag : formValues['storeFlag'],
			centerOrderId : this.centerOrderId,
//			oper : this.oper,
			rawMatId : formValues['rawMatId'],
			realQty : formValues['realQty'],
			differQty : formValues['differQty'],
			checkFlag : formValues['checkFlag']
		};
		
		if (this.checkCondition(this, params) === false)
			return false;
		
		SF.cf.callService({
			url : url,
			params : params,
			scope : this,
			showErrorMsg : true,
			showSuccessMsg : true,
			callback : function(response, success) {
				if (success) {
					SF.success('success');
					this.afterProcess(this.getRawMatForm());
				} else {
					SF.success('fail');
				}
			}
		});
	},
	
	checkCondition : function(form, params) {
		// TODO need to check oper
		/*
		if (!params['oper']) {
			Ext.Msg.alert('Error', 'Operation is Empty.');
			return;
		}
		*/
		if (!params['storeFlag']) {
			Ext.Msg.alert('Error', 'Store Flag is Empty.');
			form.getStoreFlag().focus();
			return false;
		}
		if (!params['centerOrderId']) {
			Ext.Msg.alert('Error', 'Center Order ID is Empty.');
			return;
		}
		if (!params['rawMatId']) {
			Ext.Msg.alert('Error', 'Raw Material ID is Empty.');
			form.getRawMatId().focus();
			return;
		}
		if (!params['realQty']) {
			Ext.Msg.alert('Error', 'Real Qty is Empty.');
			form.getRealQty().focus();
			return;
		}
		if (!params['differQty']) {
			Ext.Msg.alert('Error', 'Differente Qty is Empty.');
			form.getDifferQty().focus();
			return;
		}
		if (!params['checkFlag']) {
			Ext.Msg.alert('Error', 'Check Flag is Empty.');
			form.getCheckFlag().focus();
			return;
		}
		return true;
	},
	
	afterProcess : function(form) {
		SF.cf.clearFormFields(form);
		this.getRealQty().setValue();
		this.getWoQty().setValue();
		this.getDifferQty().setValue();
		this.getHwWoList().store.removeAll();
	}
});