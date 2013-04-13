Ext.define('MES.mixin.CommonFunction', function() { //this file has been change by zhang ,such as Async to Sync

	/* date형식을 받아서 설정한 포멧형식의 stirng으로 반환,this file changed by zhang */
	function toStandardTime(date, format) {

		if (Ext.typeOf(date) != 'date') {
			return '';
		}

		switch (format) {
		case SF_CONVERT_DATE_FORMAT: {
			return Ext.Date.format(date, 'Ymd'); // "yyyyMMdd" Format
			break;
		}
		case SF_CONVERT_HYPHENDATE_FORMAT: {
			return Ext.Date.format(date, 'Y-m-d'); // "yyyy-MM-dd" Format
			break;
		}
		case SF_CONVERT_SLASHDATE_FORMAT: {
			return Ext.Date.format(date, 'Y/m/d'); // "yyyy/MM/dd" Format
			break;
		}
		case SF_CONVERT_NODAYDATE_FORMAT: {
			return Ext.Date.format(date, 'Ym'); // "yyyyMM Format for monthly
			// report
			break;
		}
		case SF_CONVERT_TIME_FORMAT: {
			return Ext.Date.format(date, 'His'); // "HHmmss" Format
			break;
		}
		case SF_CONVERT_DATETIME_FORMAT: {
			return Ext.Date.format(date, 'Ymdhis'); // "yyyyMMddHHmmss" Format
			break;
		}
		case SF_CONVERT_YEAR_FORMAT: {
			return Ext.Date.format(date, 'Y'); // "yyyy" Format
			break;
		}
		case SF_CONVERT_MONTH_FORMAT: {
			return Ext.Date.format(date, 'm'); // "MM" Format
			break;
		}
		case SF_CONVERT_HYPHENDATETIME_FORMAT: {
			return Ext.Date.format(date, 'Y-m-d H:i:s'); // "yyyy-MM-dd
			// HH:mm:ss" Format
			break;
		}
		}
	}

	// TODO :
	function convertDate(str) {
		var convertStr = '';
		if (str) {

			if (dt) {
				convertStr = Ext.Date.format(dt, "Y-m-d H:i:s");
			}
		}

		return convertStr;
	}

	// GetProcTime()
	// - Get Sum Queue Time, Process Time and Queue Time + Process Time
	// Return Value
	// - Boolean : True or False
	// Arguments
	// - ByVal Material As String : Material ID
	// - ByVal Flow As String : Flow
	// - ByVal Oper As String : Operation
	// - ByVal Qty As Double : Unit1 Qty
	// - ByRef SumQueueTime As Double : Sum Queue Time
	// - ByRef SumProcTime As Double : Sum Process Time
	// - ByRef SumQueueProcTime As Double : Sum Queue Time + Process Time
	//
	function getProcTime(matId, matVer, flow, flowSeq, oper, qty) {
		var result = null;
		Ext.Ajax.request({
			url : 'service/WipViewProctime.json',
			method : 'GET',
			async : false,
			params : {
				procstep : '1',
				factory : SF.login.factory,
				userId : SF.login.id,
				matId : matId,
				matVer : matVer,
				flow : flow,
				flowSeqNum : flowSeq,
				oper : oper,
				qty : qty
			},
			success : function(response, opts) {
				result = Ext.JSON.decode(response.responseText);
			}
		});
		return result;
	}

	function getSecControl(funcName) {
		var rtnResponse = callServiceSync({
			url : 'service/secViewFunctionDetail.json',
			params : {
				procstep : '1',
				programId : SF.login.programId,
				funcName : funcName
			}
		});
		return rtnResponse;
	}
	// except : { itemId : itemId }
	// bResetOriginal : dirty 정보를 false 상태로 유지
	function clearFormFields(form, except, bResetOriginal) {
		if (!form)
			return false;
		var fields = new Ext.util.MixedCollection();
		fields.addAll(form.query('[isFormField]'));
		fields.each(function(f) {
			var itemId = f.getItemId();
			if (!except || !except[itemId]) {
				// TODO xtype에 따른 초기화는 필요에 따라 추가한다.
				// var value = '';
				// if (f.xtype == 'numberfield' || f.xtype == 'decimalfield') {
				// value = f.minValue ? f.minValue : 0;
				// }
				f.setValue(null);
				if (bResetOriginal !== false) {
					f.resetOriginalValue();
				}
				f.clearInvalid();
			}
		});
	}

	function getExportParams(title, grid, params) {
		function getExportColumns(grid) {
			var t = [];
			if (!grid)
				return [];
			function text(col, arr) {
				var length = col.length || 0;
				var maxCnt = 0;
				if (col && length > 0) {
					for ( var i = 0, length = col.length; i < length; i++) {
						if (col[i].hidden != true && col[i].exported != false) {
							if (col[i].xtype == 'rownumberer' || col[i].dataIndex || (col[i].items.getCount && col[i].items.getCount() > 0)) {
								var item = [];
								var e = {};
								if (col[i].header || col[i].text) {
									var header = col[i].header || col[i].text;
									if (header == '&#160') {
										// &nbsp는 ' '로 header 표시
										e['header'] = '  ';
									} else {
										e['header'] = header;
									}
								}
								if (col[i].dataIndex)
									e['dataIndex'] = col[i].dataIndex;
								if (col[i].width)
									e['width'] = col[i].width;
								if (col[i].xtype && col[i].xtype == 'rownumberer')
									e['xtype'] = col[i].xtype;
								if (col[i].items.getCount() > 0) {
									text(col[i].items.items, item);
									e['columns'] = item;
								}
								arr.push(e);
							}
						}
					}
				}
				return maxCnt;
			}
			if (grid.lockedGrid) {
				text(grid.lockedGrid.columns, t);
			}
			if (grid.normalGrid) {
				text(grid.normalGrid.columns, t);
			}

			if (t.length == 0) {
				text(grid.columns, t);
			}
			return t;
		}
		;
		params = params || {};
		if (grid) {
			params['export'] = {
				title : title || '',
				columns : getExportColumns(grid)
			};
		}

		for ( var key in params) {
			if (Ext.typeOf(params[key]) === 'object' || Ext.typeOf(params[key]) === 'array') {
				params[key] = Ext.JSON.encode(params[key]);
			}
		}
		return params;
	}

	function hexToArgb(h) {
		if (h) {
			h = (h.charAt(0) == "#") ? h.substring(1, 7) : h;
			var x = parseInt(h, 16);
			// var r = (x >> 16) % 255;
			// var g = (x >> 8) % 255;
			// var b = x % 255;
			// var a = 255 - Math.min(r, g, b);
			var a = 255; // alpha는 단색이므로 255로 고정한다.

			return (a << 24) + x;
		}
	}

	function argbToHex(i) {
		var x = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];
		var s = "";

		s += x[(i >> 20) & 0xF];
		s += x[(i >> 16) & 0xF];
		s += x[(i >> 12) & 0xF];
		s += x[(i >> 8) & 0xF];
		s += x[(i >> 4) & 0xF];
		s += x[i & 0xF];

		return s;
	}
	function checkTranAlarmRelation(config) {
		if (!config || !config.form || !config.params)
			return false;

		var form = config.form;
		var params = config.params;
		var lockAlarm = config.lockAlarm || SF.createLock();

		if (lockAlarm.count < 1)
			lockAlarm.lock();

		form.isAlarmList = false;
		var rtnResponse = callServiceSync({
			url : 'service/almCheckConfirmMessage.json',
			params : {
				procstep : '1',
				fileReturnType : 'FILEINFO',
				lotId : params.lotId || '',
				tranPoint : params.tranPoint || '',
				resId : params.resId || '',
				eventId : params.eventId || ''
			}
		});
		if (!rtnResponse || !rtnResponse.result || !rtnResponse.result.success) {
			form.checkAlarm = false;
			form.lockAlarm.release();
			return false;
		} else {
			var result = rtnResponse.result;
			if (!result.alarmList || result.alarmList.length < 1) {
				form.checkAlarm = true;
				lockAlarm.release();
				return true;
			}

			var popupFlag = false;
			for ( var i in result.alarmList) {
				if (result.alarmList[i].needConfirmFlag == 'Y') {
					popupFlag = true;
					break;
				}
			}

			if (popupFlag) {
				var popConfig = {
					lockAlarm : lockAlarm,
					targetForm : form,
					infoData : config.params || {},
					result : result
				};
				var tranAlarm = Ext.create('MES.view.window.ConfirmTranAlarm', popConfig);
				tranAlarm.show();
			} else {
				form.isAlarmList = true;
				form.checkAlarm = true;
				lockAlarm.release();
				return true;
			}
		}
	}
	// checkAlarmCount()
	// - tray알람정보와 web storage에 데이터를 set하는 function
	function checkAlarmCount() {
		var alarmStore = Ext.getStore('ALM.store.AlarmStore');
		var count = 0;
		var storageData = [];
		// confirmFlag 확인안한 alarm들 갯수 체크
		Ext.Array.each(alarmStore.data.items, function(item) {
			if (item.data.confirmFlag != 'Y')
				count++;
		});
		// alm_tray_carousel data초기화
		Ext.getCmp('alm_tray_carousel').setData([]);
		Ext.getCmp('alm_tray_count').setText(count); // tray 카운트 셋
		if (count == 0) { // 확인안한 알람이 없으면 원래되로
			Ext.getCmp('alm_tray_carousel').setWidth(22);
			Ext.getCmp('alm_tray_count').setVisible(false);
		} else {
			var data = [];

			Ext.getCmp('alm_tray_carousel').setWidth(300);

			Ext.Array.each(alarmStore.data.items, function(item) {
				var date = Ext.Date.parse(item.data.createTime, 'YmdHis');
				if (item.data.confirmFlag != 'Y') {
					data.push({
						time : Ext.Date.format(date, 'H:i'),
						text : item.data.alarmMsg
					});
				}
			});
			Ext.getCmp('alm_tray_carousel').setData(data);
			Ext.getCmp('alm_tray_count').setVisible(true);
		}

		Ext.Array.each(alarmStore.data.items, function(item) {
			storageData.push(item.data);
		});
		SmartFactory.setting.set('alarm', null);
		SmartFactory.setting.set('alarm', storageData);
	};

	function callService(config) {
		if (!config || typeof config != 'object')
			return false;
		if (!config.params || !config.url)
			return false;
		var rtnResponse = false;
		var scope = config.scope || '';
		var async = config.async !== false ? true : false;
		var params = Ext.applyIf(config.params,{
			pageSize : config.pageSize||1000,
			pageIndex : 0
		});
		
		var request = {
				url : config.url,
				method : config.method || 'POST',
				async : async,
				scope : config.scope,
				showSuccessMsg : config.showSuccessMsg,
				showFailureMsg : config.showFailureMsg,
				callback : function(options, success, response) {
					/*mixin/Ajax/ onComplete에서 decode결과를 responseObj로 넘겨줌*/
					response.result = response.responseObj||Ext.JSON.decode(response.responseText) || {};
					response.params = config.params;
					if (response.result.success !== true) {
						success = false;
					}
					// 반환할 결과값
					rtnResponse = response;
					rtnResponse.success = success;
					if (typeof config.callback == 'function') {
						config.callback.call(scope, response, success);
					}
				}
			};
		if(request.method == 'POST')
			request.jsonData = params;
		else
			request.params = params;
		
		Ext.Ajax.request(request);
		return rtnResponse;
	}

	function callServiceSync(config) { //zhang changed this from Async to Sync
		if (!config || typeof config != 'object')
			return false;
		if (!config.params || !config.url)
			return false;
		var rtnResponse = false;
		var scope = config.scope || '';
		var params = Ext.applyIf(config.params,{
			pageSize : config.pageSize||1000,
			pageIndex : 0
		});
		
		var request = {
				url : config.url,
				method : config.method || 'POST',
				showSuccessMsg : config.showSuccessMsg,
				showFailureMsg : config.showFailureMsg,
				async : false,
				callback : function(options, success, response) {
					/*mixin/Ajax/ onComplete에서 decode결과를 responseObj로 넘겨줌*/
					response.result = response.responseObj||Ext.JSON.decode(response.responseText) || {};
					response.params = response.request.options.params;
					if (response.result.success !== true) {
						success = false;
					}
					// 반환할 결과값
					rtnResponse = response;
					rtnResponse.success = success;

					if (typeof config.callback == 'function') {
						config.callback.call(scope, response, success);
					}
				}
			};
		if(request.method == 'POST')
			request.jsonData = params;
		else
			request.params = params;
		Ext.Ajax.request(request);
		return rtnResponse;
	}

	function callServiceForm(config) {//zhang changed
		if (!config || typeof config != 'object')
			return false;
		if (!config.form  || !config.url)
			return false; //zhang changed

		var scope = config.scope || '';
		var params = config.params || {};
		var form = config.form.isValid? config.form: config.form.getForm();
		var validResult = true;
		if(config.checkFormValid){
			validResult = form.isValid();
		}
		if(validResult){
			form.submit({
				params : params,
				url : config.url,
				scope : scope,
				showSuccessMsg : config.showSuccessMsg,
				showFailureMsg : config.showFailureMsg,
				success : function(form, action) {
					if (typeof config.callback == 'function') {
						config.callback.call(scope, action, action.result.success);
					}
				},
				failure : function(form, action) {
					if (typeof config.callback == 'function') {
						config.callback.call(scope, action, false);
					}
				}
			});
		}
	}
	
	/* date형식을 받아서 shift time을 추가하여 stirng형식으로 반환 */
	function toShiftDate(date) {
		var sDate = '';
		var dt = date;

		if (Ext.typeOf(dt) == 'string' && dt.length == 8) {
			dt = new Date(Number(date.substr(0, 4)), Number(date.substr(4, 2)) - 1, Number(date.substr(6, 2)));
		} else if (Ext.typeOf(dt) != 'date') {
			return sDate;
		}

		if (SF.gv.gShiftInfor.bVariableShift == false) {
			if (SF.gv.gShiftInfor.cShift1DayFlag == 'T') {
				dt = Ext.Date.add(dt, Ext.Date.DAY, 1);
			}
		} else {
			dt = Ext.Date.add(dt, Ext.Date.DAY, 1);
		}

		sDate = Ext.Date.format(dt, 'Ymd');
		sDate = sDate + SF.gv.gShiftInfor.sShift1StartTime;

		return sDate;
	}
	/* date형식을 받아서 shift time을 추가하여 stirng형식으로 반환 */
	function fromShiftDate(date) {
		var sDate = '';
		var dt = date;

		if (Ext.typeOf(dt) == 'string' && dt.length == 8) {
			dt = new Date(Number(date.substr(0, 4)), Number(date.substr(4, 2)) - 1, Number(date.substr(6, 2)));
		} else if (Ext.typeOf(dt) != 'date') {
			return sDate;
		}

		if (SF.gv.gShiftInfor.bVariableShift == false) {
			if (SF.gv.gShiftInfor.cShift1DayFlag == 'P') {
				dt = Ext.Date.add(dt, Ext.Date.DAY, -1);
			}
		}

		sDate = Ext.Date.format(dt, 'Ymd');
		sDate = sDate + SF.gv.gShiftInfor.sShift1StartTime;

		return sDate;
	}

	function cutStr(str, limit) {
		var result = [];
		var len = str.length;
		var byteCount = 0;
		var byteStart = 0;

		for ( var i = 0; i < len; i++) {
			byteCount += chr_byte(str.charAt(i));
			if (byteCount == limit - 1) {
				if (chr_byte(str.charAt(i + 1)) == 2) {
					result.push(str.substring(byteStart, i + 1));
					byteStart = i + 1;
				} else {
					result.push(str.substring(byteStart, i + 2));
					byteStart = i + 2;
					i++;
				}
				byteCount = 0;
			} else if (byteCount == limit) {
				result.push(str.substring(byteStart, i + 1));
				byteStart = i + 1;
				byteCount = 0;
			}
		}

		if (result.length == 0) {
			result.push(str);
		} else {
			var remainderStr = str.substring(byteStart, len);
			if (remainderStr.length > 0) {
				result.push(remainderStr);
			}
		}

		return result;
	}

	function chr_byte(chr) {
		if (escape(chr).length > 4) {
			return 2; // 2byte 문자(한글 등등..)
		} else {
			return 1; // 1byte 문자(영문 등등..)
		}
	}

	function checkNumeric(value) {
		if (isNaN(parseFloat(value))) {
			return false;
		} else {
			return true;
		}
	}

	function setRuleDescription(sRuleType) {
		var sDesc = '';
		switch (sRuleType) {
		case 'A':
			sDesc = "Out of Spec (OOS)";
			break;
		case 'B':
			sDesc = "1 point beyond 3 sigma (OOC)";
			break;
		case 'C':
			sDesc = "8 consecutive points same side of average";
			break;
		case 'D':
			sDesc = "14 consecutive points increasing or decreasing";
			break;
		case 'E':
			sDesc = "2 out of 3 consecutive points beyond 2 sigma";
			break;
		case 'F':
			sDesc = "4 out of 5 consecutive points beyond 1 sigma";
			break;
		case 'G':
			sDesc = "15 consecutive points between plus 1 sigma and minus 1 sigma";
			break;
		case 'H':
			sDesc = "8 consecutive points beyond plus 1 sigma and minus 1 sigma";
			break;
		case 'S':
			sDesc = "Out of Spec. Limit (OOS)";
			break;
		case 'W':
			sDesc = "Out of Warning Limit (OOW)";
			break;
		default:
			sDesc = "";
			break;
		}
		return sDesc;
	}

	// parameter : 상위제한, 하위제한, 기본값
	function getSpecInfo(upperSpecLimit, lowerSpecLimit, targetValue) {
		var sSpec = ' ';
		var sUSL = upperSpecLimit ? upperSpecLimit.trim() : '';
		var sLSL = lowerSpecLimit ? lowerSpecLimit.trim() : '';
		var sTarget = targetValue ? targetValue.trim() : '';

		if (sUSL == "" && sLSL == "") {
			if (sTarget != "") {
				sSpec += sTarget;
			}
		} else {
			if (sTarget != "") {
				if (sUSL != "" && sLSL != "") {
					if (SF.cf.checkNumeric(sTarget) && SF.cf.checkNumeric(sUSL) && SF.cf.checkNumeric(sLSL)) {
						if (parseFloat(sUSL) - parseFloat(sTarget) == parseFloat(sTarget) - parseFloat(sLSL)) {
							var v = parseFloat(sUSL) - parseFloat(sTarget);
							v = Ext.Number.toFixed(v, 3);
							sSpec += sTarget + " +/- " + v.toString();
						} else {
							sSpec += sLSL + " ~ " + sTarget + " ~ " + sUSL;
						}
					} else {
						sSpec += sLSL + " ~ " + sTarget + " ~ " + sUSL;
					}
				} else {
					if (sUSL != "") {
						if (SF.cf.checkNumeric(sUSL)) {
							var v = parseFloat(sUSL) - parseFloat(sTarget);
							v = Ext.Number.toFixed(v, 3);
							sSpec += sTarget + " + " + v.toString();
						} else {
							sSpec += sTarget + " ~ " + sUSL;
						}
					} else if (sLSL != "") {
						if (SF.cf.checkNumeric(sLSL)) {
							var v = parseFloat(sTarget) - parseFloat(sLSL);
							v = Ext.Number.toFixed(v, 3);
							sSpec += sTarget + " - " + v.toString();
						} else {
							sSpec += sLSL + " ~ " + sTarget;
						}
					}
				}
			} else {
				sSpec += sLSL + " ~ " + sUSL;
			}
		}

		return sSpec;
	}

	// 2012.11.02 KKH
	function isValidTab(form, showMsg, tabFlag) {
		var fields = form.query('[isFormField]');
		function findTab(tab) {
			if (tab) {
				tab.show();
				var tabUp = tab.up('[tab]');
				if (tabUp) {
					return findTab(tabUp);
				}
			}
			return tab;
		}
		;
		var validFlag = true;
		for ( var i in fields) {
			var f = fields[i];
			validFlag = f.isValid();

			if (!validFlag) {
				if (tabFlag === false) {
					break;
				} else {
					findTab(f.up('[tab]'));
					if (showMsg)
						Ext.Msg.alert('Error', T('Message.108'));
					break;
				}
			}
		}
		return validFlag;
	}

	function isValid(form) {
		return isValidTab(form, false, false);
	}

	/**
	 * Format values like:
	 * 
	 * 10000 -> 10,000
	 * 
	 * 145222.20 -> 145,22.20
	 * 
	 */
	function formatNumber(v, opts) {
		opts = opts || {};
		var sign = opts.s || '';// 숫자 앞자리 지정문자
		var allowDecimals = true; // Precision 표시 여부

		var centesimalSeparator = opts.cs || ','; // 문자구분 표시 문자열
		var centesimalPrecision = opts.cp || 3; // 문자구분 표시 자릿수

		var decimalSeparator = '.'; // 소수점 표시 문자열(고정)
		var decimalPrecision = opts.dp || 3; // 소수점 표시 자릿수

		if (decimalPrecision <= 0) {
			allowDecimals = false;
		}

		// centesimalSeparator 지정한 문자를 공백으로 초기화 한다.
		v = v.replace(new RegExp(Ext.escapeRe(centesimalSeparator), 'gi'), '');

		// 소수점 자릿수 부분을 분리한다.
		v = v.split(decimalSeparator);
		// 정수 : partInt[], 소수 : partDec[]
		var partInt = v[0] || '0', partDec = v[1] || '';

		// decimalPrecision 설정이 0이 아니면 소수점 자릿수를 표시한다.
		if (allowDecimals === true) {
			// 지정한 decimalPrecision 자릿수 보다 작으면 0을 추가한다.
			while (partDec.length < decimalPrecision) {
				partDec += '0';
			}

			// 지정한 decimalPrecision 자릿수 보다 크면 자릿수만큼 자른다.
			if (partDec.length > decimalPrecision) {
				partDec = partDec.substr(0, decimalPrecision);
			}
		}

		// 정수 앞자리가 0이면 한자리씩 미뤄서 0이 아닌수로 만든다.
		partInt = partInt.split('');
		while (partInt.length && partInt[0] === '0') {
			partInt.shift();
		}
		partInt = partInt.join('') || '0';

		// centesimalPrecision 지정한 자릿수마다 centesimalSeparator 구분자를 추가한다.
		partInt = partInt.split('');
		var i = partInt.length;
		while ((i -= centesimalPrecision) > 0) {
			partInt[i - 1] += centesimalSeparator;
		}

		// 정수와 실수부분을 합친다.
		v = sign + partInt.join('') + (allowDecimals === true ? decimalSeparator + partDec : '');

		return v;
	}
	
	function getExportForm(id){
		var form = null;
		
		id = id||'export';
		
		var body = Ext.getBody();
		
		if(!body.getById('_exportFrame')){
			body.createChild({
				tag : 'iframe',
				cls : 'x-hidden',
				id : '_'+id+'Frame',
				name : '_'+id+'Frame'
			});
		}
		
		if(!body.getById('_exportForm')){
			form = body.createChild({
				tag : 'form',
				cls : 'x-hidden',
				id : '_'+id+'Form',
				target : '_'+id+'Frame'
			});
		}
		else{
			form = body.getById('_exportForm');
		}
		
		return form;
	}
	
	function toObjNameCamelCase(obj,sp){
		if(!obj && obj == {})
			return;
		var newObj = {};
		for(var n in obj){
			var n1 = toCamelCase(n,sp);
			newObj[n1] = obj[n];
		}
		return newObj;
	}
	
	// 2012.10.16 KKH
	function toCamelCase(str, sp) {
		if (!str)
			return;
		opt = opt || '_';
		var regexp = new RegExp('\\' + opt + 'w*[^' + opt + ']', 'gi');
		var chgStr = str.toLowerCase();

		while (true) {
			var $var = regexp.exec(chgStr);
			if (!$var)
				break;
			chgStr = chgStr.replace($var[0], $var[0].charAt(1).toUpperCase());
		}

		return chgStr;
	}
	
	
	function toObjNameUnderscoreCase(obj,sp){
		if(!obj && obj == {})
			return;
		var newObj = {};
		for(var n in obj){
			var n1 = toUnderscoreCase(n,sp);
			newObj[n1] = obj[n];
		}
		return newObj;
	}
	
	function toUnderscoreCase(str, sp){
		if(!src)
			return '';
		sp = sp||'_';
		return src.replace(/[A-Z](\w)/g, function(x, c) {
			if(x)
				return sp+x;
			return x;
		}).toUpperCase();
	}
	
	function isControlDisabled(itemId, view){
		//권한 여부  ture(사용), false(사용금지), null(무시) 
		var disabled = false;
		
		if(itemId && view.secChecked === true){
			if(view.secControlList[itemId] == ''){
				disabled = true;
			}
			else if(view.useBlackList === 'Y' && view.secControlList[itemId] !== 'Y'){
				disabled = true;
			}
		}
		
		return disabled;
	}
	
	return {
		cf : {
			toStandardTime : toStandardTime,
			getProcTime : getProcTime,
			getExportParams : getExportParams,
			getSecControl : getSecControl,
			clearFormFields : clearFormFields,
			hexToArgb : hexToArgb,
			argbToHex : argbToHex,
			checkTranAlarmRelation : checkTranAlarmRelation,
			checkAlarmCount : checkAlarmCount,
			callService : callService,
			callServiceSync : callServiceSync,
			callServiceForm : callServiceForm,
			toShiftDate : toShiftDate,
			fromShiftDate : fromShiftDate,
			cutStr : cutStr,
			checkNumeric : checkNumeric,
			setRuleDescription : setRuleDescription,
			getSpecInfo : getSpecInfo,
			toCamelCase : toCamelCase,
			isValidTab : isValidTab,
			isValid : isValid,
			formatNumber : formatNumber,
			getExportForm : getExportForm,
			toUnderscoreCase : toUnderscoreCase,
			toObjNameUnderscoreCase : toObjNameUnderscoreCase,
			toObjNameCamelCase : toObjNameCamelCase,
			isControlDisabled : isControlDisabled
		}
	};
}());