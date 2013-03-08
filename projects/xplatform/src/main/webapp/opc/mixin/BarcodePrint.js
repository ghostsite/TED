/**
 * @class Opc.mixin.BarcodePrint
 * 
 */
Ext.define('Opc.mixin.BarcodePrint', {
	constructor : function(config) {
		return {
			printer : {
				print : function(message, handler, scope) {
					var obj = {
						dllPath : 'LabelPrinter.dll',
						className : 'LabelPrinter.Printer',
						functionName : 'Print',
						parameters : {
							printerName : message.printerName || '',
							printerPort : message.printerPort || '',
							code : message.code || '',
							copy : message.copy || '',
							imageData : message.imageData || ''
						}
					};

					if (SF.agent.state() == 'open') {
						SF.agent.request(obj, handler, scope);
					} else {
						handler({
							msgCode : 'close',
							msg : 'close agent',
							success : false
						});
					}
				},

				getPrinterList : function(handler, scope) {
					var obj = {
						dllPath : 'LabelPrinter.dll',
						className : 'LabelPrinter.Printer',
						functionName : 'GetPrinterList',
						parameters : {}
					};

					if (SF.agent.state() == 'open') {
						SF.agent.request(obj, handler, scope);
					} else {
						handler({
							msgCode : 'close',
							msg : 'close agent',
							success : false
						});
					}
				}
			}
		};
	}
});
