function afterRender() {
	var labelPrint = Ext.getCmp('opc_labelprint');
	labelPrint.afterRenderFlash();
}

Ext.define('Opc.controller.wip.LabelPrint', {
	extend : 'Opc.controller.BaseController',

	views : [ 'wip.LabelPrint' ],

	refs : [ {
		selector : 'labelprint',
		ref : 'labelprint'
	}, {
		selector : 'labelprint #txtLotId',
		ref : 'lotid'
	}, {
		selector : 'labelprint #txtResult',
		ref : 'result'
	}, {
		selector : 'labelprint [name=weight]',
		ref : 'weightField'
	} ],

	init : function() {
		this.control({
			'labelprint' : {
				activate : this.onActivate,
				keychange : this.onKeyChange,
				btnPrint : this.onPrintLabel,
				btnReset : this.onReadScale,
				btnClose : this.onBtnClose
			},
			'labelprint #txtLotId' : {
				specialkey : this.onSpecialkey
			}
		});
	},

	onActivate : function() {
		var self = this;
		var currentLotId = SF.setting.get('current_lot_id') || '';
		if (Ext.isEmpty(currentLotId) == false) {
			this.getLotid().setValue(currentLotId);
		}

		if (Ext.isEmpty(currentLotId) === false) {
			this.loadLotInfo(currentLotId);
		}

		// flash callback 이벤트 함수등록
		this.getLabelprint().afterRenderFlash = function() {
			self.viewLabel();
		};

		this.getLotid().focus();
	},

	onKeyChange : function(view, keys) {
		var form = view.getForm();

		form.reset();

		if (keys)
			form.setValues(keys);
	},

	onSpecialkey : function(field, e) {
		if (e.getKey() == e.ENTER) {
			var lotid = this.getLotid().getValue();
			if (Ext.isEmpty(lotid) === false) {
				this.viewLabel();
				//this.loadLotInfo(lotid);
			}
		}

	},

	onPrintLabel : function() {
		SF.success('Success', 'Barcode printing was successful');
		// var lotid = this.getLotid().getValue();
		// SF.printer.print('^XA^FO100,100^BY3^B3N,N,100,Y,N^FD' + lotid +
		// '^FS^XZ');
	},

	onReadScale : function() {
		var self = this;
		var handler = function(response) {
			if (response.success) {
				SF.sound.success();
				Ext.log('Scale Response Success : ', response.data);
				self.getWeightField().setValue(response.data);
			} else {
				SF.sound.failure();
				Ext.log('Scale Response Failure : ', response.data);
			}
		};
		SF.scale.read('MFCSample.dll', 1, 1, handler);
	},

	viewLabel : function() {
		var self = this.getLabelprint();
//		Ext.Ajax.request({
//			url : 'service/lblViewLabel.json',
//			params : {
//				procstep : '1',
//				labelId : 'MiracomINC_01'
//			},
//			success : function(response) {
//				var result = Ext.JSON.decode(response.responseText);
//				if (result.success) {
//					var flaViewer = self.sub('flaViewer').swf ? self.sub('flaViewer').swf.dom : null;
//					if (flaViewer && flaViewer.setLabelXml) {
//						flaViewer.setLabelXml(result.designXml);
//					}
//				}
//			}
//		});
		
		
		Ext.Ajax.request({
			url : 'service/basSqlQuery.json',
			params : {
				procstep : '1',
				sql : 'select * from aaaaa'
			},
			success : function(response) {
				
			}
		});
		
		
		
	},

	loadLotInfo : function(lotId) {
		var store = this.getLabelprint().sub('viewLot').store;
		store.load({
			params : {
				lotId : lotId,
				procstep : '1'
			}
//			callback : function(records, operation, success) {
//				Ext.log('records', records, operation, success);
//			}
		});
	}
});