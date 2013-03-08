/**
 * @class Opc.mixin.ElectronicScale
 * 
 */
Ext.define('Opc.mixin.ElectronicScale', {
	constructor : function(config) {
		return {
			scale : {
				read : function(dll, port, unit, handler) {
					var obj = {
						dllPath : 'ElectronicScale.dll',
						className : 'ElectronicScale.ElectronicScale',
						functionName : 'ReadWeight',
						parameters : {
							dllPath : dll,
							port : port,
							unit : unit
						}
					};
					SF.agent.request(obj, handler, this);
				}
			}
		};
	}
});
