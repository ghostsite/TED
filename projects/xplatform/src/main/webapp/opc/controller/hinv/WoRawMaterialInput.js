Ext.define('Opc.controller.hinv.WoRawMaterialInput', {
	extend : 'Opc.controller.BaseController',

	views : [ 'hinv.WoRawMaterialInput' ],

	refs : [ {
		selector : 'hinv_wo_raw_material_input',
		ref : 'panel'
	} ],

	init : function() {
		this.control({
			'hinv_wo_raw_material_input' : {
				btnClose : this.onBtnClose
			},
			'hinv_wo_raw_material_input textfield[itemId=lotId]' : {
				keypress : this.onInputLotId
			},

			'hinv_wo_raw_material_input button[itemId=btnProcess]' : {
				click : this.onProcessBtnClick
			}
		});
	},

	onInputLotId : function(textfield, e, eOpts) {
		if (e.keyCode == 13) {
			var url = 'service/HinvViewInvLot.json';
			var panel = textfield.up('panel');
			var lotId = panel.sub('lotId').getValue();
			var params = {
				procstep : '1',
				lotId : lotId
			};

			if (this.checkCondition(this.getPanel(), params) === false)
				return false;

			SF.cf.callService({
				url : url,
				params : params,
				scope : this,
				showErrorMsg : true,
				callback : function(response, success) {
					panel.sub('rawMatId').setValue('1112');
					panel.sub('oper').setValue('1112');
					panel.sub('location').setValue('1112');
					panel.sub('storeFlag').setValue('1112');
					panel.sub('supplierId').setValue('1112');
					panel.sub('rawmatCreateTime').setValue('20110202020405');
					panel.sub('needQty').setValue('1112');
					panel.sub('remainQty').setValue('1112');
				}
			});
		}
	},
	
	checkCondition : function(panel, params) {
		if (!params['lotId']) {
			Ext.Msg.alert('Error', 'Lot NO is Empty.');
			panel.sub('lotId').focus();
			return false;
		}
		return true;
	},
	
	onProcessBtnClick : function() {
		var url = 'service/HinvWoRawMaterialInput.json';
		var panel = this.getPanel();
		var emsOrderId = panel.sub('emsOrderId').getValue();
		var matModel = panel.sub('matModel').getValue();
		var matId = panel.sub('matId').getValue();
		var orderQty = panel.sub('orderQty').getValue();
		var lotId = panel.sub('lotId').getValue();
		var rawMatId = panel.sub('rawMatId').getValue();
		var oper = panel.sub('oper').getValue();
		var location = panel.sub('location').getValue();
		var storeFlag = panel.sub('storeFlag').getValue();
		var supplierId = panel.sub('supplierId').getValue();
		var rawmatCreateTime = panel.sub('rawmatCreateTime').getValue();
		var needQty = panel.sub('needQty').getValue();
		var inputQty = panel.sub('inputQty').getValue();
		var remainQty = panel.sub('remainQty').getValue();
		var params = {
			procstep:'1',
			emsOrderId : emsOrderId,
			matModel : matModel,
			matId : matId,
			orderQty : orderQty,
			lotId : lotId,
			rawMatId : rawMatId,
			oper : oper,
			location : location,
			storeFlag : storeFlag,
			supplierId : supplierId,
			rawmatCreateTime : rawmatCreateTime,
			needQty : needQty,
			inputQty : inputQty,
			remainQty : remainQty
		};

		if (this.checkCondition(this.getPanel(), params) === false)
			return false;

		SF.cf.callService({
			url : url,
			params : params,
			scope : this,
			showErrorMsg : true,
			callback : function(response, success) {
				if (success) {
					Ext.Msg.alert('INFO', 'OK.');
					this.afterProcess(this.getPanel());
				}
			}
		});
	},

	afterProcess : function(panel) {
		SF.cf.clearFormFields(panel);
	}
});