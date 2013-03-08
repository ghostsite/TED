Ext.define('Opc.controller.hinv.RawMaterialReturn', {
	extend : 'Opc.controller.BaseController',
	
	views : [ 'hinv.RawMaterialReturn' ],
	
	refs : [ {
		selector : 'hinv_raw_material_return',
		ref : 'panel'
	} ],
	
	init : function() {
		this.control({
			'hinv_raw_material_return' : {
				btnClose : this.onBtnClose
			},

			'hinv_raw_material_return textfield[itemId=lotId]' : {
				keypress : this.onInputLotId
			},

			'hinv_raw_material_return button[itemId=btnProcess]' : {
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
		var url = 'service/HinvRawMaterialReturn.json';
		var panel = this.getPanel();
		var lotId = panel.sub('lotId').getValue();
		var rawMatId = panel.sub('rawMatId').getValue();
		var oper = panel.sub('oper').getValue();
		var location = panel.sub('location').getValue();
		var storeFlag = panel.sub('storeFlag').getValue();
		var supplierId = panel.sub('supplierId').getValue();
		var rawmatCreateTime = panel.sub('rawmatCreateTime').getValue();
		var returnQty = panel.sub('returnQty').getValue();
		var params = {
			procstep:'1',
			lotId : lotId,
			rawMatId : rawMatId,
			oper : oper,
			location : location,
			storeFlag : storeFlag,
			supplierId : supplierId,
			rawmatCreateTime : rawmatCreateTime,
			returnQty : returnQty
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