/**
 * @class CMN.mixin.Vtypes
 * 
 */
Ext.define('CMN.mixin.Vtypes', {
	constructor: function(config) {
		Ext.apply(Ext.form.VTypes, {
			nospace : function(val, field) {
				var rTypes = /^[a-zA-Z0-9_-]+$/;
				return rTypes.test(val);
			},
			// The error text to display
			nospaceText : T('Validator.nospace'),
			numbers : function(val, field){
				var rTypes = /^[0-9]+$/;
				return rTypes.test(val);
			},
			numbersText :  T('Validator.numbers'),
			numbersMask : /^[0-9]+$/,
			
			//float type
			floats : function(val, field){
				var rTypes = /^([0-9]*||[0-9]*\.[0-9]*)$/;
				return rTypes.test(val);
			},
			floatsText :  T('Validator.floats'),
			
			//excel
			xls : function(val, field) {
		        var fileName = /^.*\.(xlsx|xls)$/i;
		        return fileName.test(val);
		    },
		    xlsText : "File must be Microsoft Excel",
		    
		    //ip
		    iPAddress:  function(v) {
		        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
		    },
		    iPAddressText: 'Must be a numeric IP address',
		    iPAddressMask: /[\d\.]/i
		});
		
		return;
	}
});
