Ext.define('Opc.controller.wip.LotStart', {
	extend : 'Opc.controller.BaseController',
	
	views : ['wip.LotStart'],
	
	refs : [ {
		selector : 'lotstart',
		ref : 'lotStart'
	}, {
		selector : 'lotstart #txtLotId',
		ref : 'lotid'
	}, {
		selector : 'lotstart #txtResult',
		ref : 'result'
	}, {
		selector : 'lotstart [name=weight]',
		ref : 'weightField'
	} ],
	
	init : function() {
		this.control({
			'lotstart' : {
				activate : this.onActivate,
				keychange : this.onKeyChange,
				btnClose : this.onBtnClose,
				btnStart : this.onBtnStart,
				btnConfirm : this.onBtnConfirm
			},
			'lotstart #txtLotId' : {
				specialkey : this.onSpecialkey
			},
			'lotstart #btnPrintLabel' : {
				click : this.onPrintLabel
			},
			'lotstart #btnReadScale' : {
				click : this.onReadScale
			}
		});
	},
	
	onActivate : function() {
		this.getLotid().focus();
	},
	
	onKeyChange : function(view, keys) {
		var form = view.getForm();
		
		form.reset();
		
		if(keys)
			form.setValues(keys);
	},
	
	onBtnStart : function(view) {
		SF.success('Success', 'Lot Start.');
		this.clearForm(view);
	},

	onSpecialkey : function(field, e) {
		if (e.getKey() == e.ENTER) {
			this.onPrintLabel();
//			if (field.getValue()) {
//				this.getResult().setValue(field.getValue());
//				field.setValue('');
//			}
		}
	},
	
	onPrintLabel : function() {
		var lotid = this.getLotid().getValue();
		
		var handler = function(response) {
			if(response.success) {
				SF.success('Barcode Print Success', response.data);
			}
		};

		SF.printer.print('^XA^FO100,100^BY3^B3N,N,100,Y,N^FD' + lotid + '^FS^XZ', handler);
	},
	
	onReadScale : function() {
		var self = this;
		var handler = function(response) {
			if(response.success) {
				SF.success('Scale Response Success', response.data);
				self.getWeightField().setValue(response.data);
			}
		};
		SF.scale.read('MFCSample.dll', 1, 1, handler);
	},
	
	onBtnConfirm : function() {
		SF.popup('Opc.view.wip.popup.CheckRuleSetup', {
			x : 'x',
			y : 'y'
		});
	} 
});