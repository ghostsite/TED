Ext.define('mixin.Logger', function() {
	
	var logger = Ext.create('Ext.util.Observable');
	logger.addEvents(
        'trace',
        'debug',
        'info',
        'warn',
        'error',
        'saveLog'
    );
	
	function trace(e) {
		logger.fireEvent('trace', e);
	}
	
	function debug() {
		var args = ['debug'];
		for(var i = 0;i < arguments.length;i++)
			args.push(arguments[i]);
		logger.fireEvent.apply(logger, args);
	}
	
	function info(code, params) {
		logger.fireEvent('info', code, params);
	}
	
	function warn(code, params, e) {
		logger.fireEvent('warn', code, params, e);
	}
	
	function error(code, params, e) {
		saveLogHistory('error', code, params, e);
		logger.fireEvent('error', code, params, e);
	}
	
	function saveLogHistory(level, code, params, e) {
		var store = Ext.getStore('CMN.store.LogStore');
		store.insert(0,{
			level : level,
			code : code,
			params : params,
			ex : e,
			issueDate : new Date()
		});
		logger.fireEvent('saveLog', store);
	}

	logger.on('trace', function(e) {
		var dt = Ext.Date.format(new Date(), 'Y-m-d h:i:s ');

		if(e instanceof Error) {
			Ext.log(dt, e.message + '\n', printStackTrace({
				e: e
			}).join('\n'));
		} else {
			Ext.log(dt, printStackTrace({
				e: e
			}).join('\n'));
		}
	});
	
	logger.on('debug', function() {
		var dt = Ext.Date.format(new Date(), 'Y-m-d h:i:s ');
		var msg = '';
		for(var i = 0;i < arguments.length - 1;i++) {
			msg += arguments[i];
		}
		Ext.log(dt, msg);
	});
	
	logger.on('info', function(code, params) {
		var msg = '[' + code + '] ' + T('Message.' + code, params);

		var dt = Ext.Date.format(new Date(), 'Y-m-d h:i:s ');
		Ext.log(dt, msg);
	});
	
	logger.on('error', function(code, params, e) {
		var msg = '[' + code + '] ' + T('Message.' + code, params);
		
		var dt = Ext.Date.format(new Date(), 'Y-m-d h:i:s ');
		
		Ext.log(dt, msg);
		
		if(e instanceof Error) {
			Ext.log(dt, e.message + '\n', printStackTrace({
				e: e
			}).join('\n'));
		} else if(e) {
			Ext.log(dt, printStackTrace({
				e: e
			}).join('\n'));
		}
	});
	
	logger.on('warn', function(code, params, e) {
		var msg = '[' + code + '] ' + T('Message.' + code, params);

		var dt = Ext.Date.format(new Date(), 'Y-m-d h:i:s ');

		Ext.log(dt, msg);
		
		if(e instanceof Error) {
			Ext.log(dt, e.message + '\n', printStackTrace({
				e: e
			}).join('\n'));
		} else if(e) {
			Ext.log(dt, printStackTrace({
				e: e
			}).join('\n'));
		}
	});
	
	Ext.Error.handle = function(err) {
		Ext.log('ErrorMessage : ', err.msg);
		Ext.log('SourceClass : ', err.sourceClass);
		Ext.log('SourceMethod : ', err.sourceMethod);

		var dt = Ext.Date.format(new Date(), 'Y-m-d h:i:s ');

		if(err.e) {
			Ext.log(dt, printStackTrace({
				e: err.e
			}).join('\n'));
		} else {
			Ext.log(dt, printStackTrace().join('\n'));
		}
	};
	
	return {
		trace : trace,
		error : error,
		warn : warn,
		info : info,
		debug : debug,
		logger : logger
	};
}());