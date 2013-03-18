Ext.define('MES.view.grid.EdcViewCollectData', {
	extend : 'Ext.grid.Panel',
	itemId : 'grdColList',
	alias : 'widget.grdcollectdata',

	cls : 'navyGrid',

	columnLines : true,

	sortableColumns : false,
	enableColumnHide : false,
	enableColumnMove: false,
	
	colSetColumns : undefined,
	
	disableSelection: true,
	
	valueStartCol : 13,

	plugins : Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit : 1
	}),

	initComponent : function() {
		this.store = Ext.create('EDC.store.EdcViewAttachCharacterListOut.CharList');
		this.columns = this.getColSetColumns();
		this.callParent();

		this.addEvents({
			"afterFindColSetVersion" : true
		});

		var self = this;

		var storefields = this.store.model.prototype.fields;
		storefields.add({
			name : 'unitSeq',
			type : 'number'
		});

		storefields.add({
			name : 'derivedInfo',
			type : 'object'
		});

		// unit Null 체크
		storefields.add({
			name : 'unitNullFlag',
			type : 'string'
		});

		// unit Null 체크
		storefields.add({
			name : 'specOutMask',
			type : 'string'
		});

		for ( var i = 1; i <= 25; i++) {
			storefields.add({
				name : 'val' + i,
				setSourcetype : 'string'
			});
		}

		this.plugins[0].on('edit', function(editor, e, opts) {
			if (e.originalValue != e.value && e.colIdx >= self.valueStartCol) {
				self.setSourceValue(e.grid.store);
			}
		});

		this.plugins[0].on('beforeedit', function(editor, e, opts) {
			var className = e.row.cells[e.colIdx].className;
			if (className.indexOf('cellReadOnly') > -1) {
				return false;
			}
		});
	},
	/**
	 * 사용방법
	 * form requires에 MES.view.grid.EdcViewCollectData 추가후 xtype 설정 또는 
	 * Ext.create('MES.view.grid.EdcViewCollectData'); 사용
	 * xtype : grdcollectdata
	 * 
	 * colSetId 를 입력후 조회시 setInParams() 설정 후 setCollectionData()호출
	 * if (colSetId) {
	 * 		self.grdColList.setInParams({
	 * 				procstep : '1',
	 * 				colSetId : colSetId,
	 * 				eventId : eventId,
	 * 				includeUnitId : 'Y',
	 * 				resId : resId,
	 * 				lotOrResFlag : 'R'
	 * 			});
	 * 		self.grdColList.setCollectionData();
	 * 	} else {
	 * 		self.sub('txtColSet').setValue('');
	 * 		self.sub('txtColSetVersion').setValue('');
	 * 		self.grdColList.clearCollectionData();
	 * 	}
	 * 
	 * process 이벤트 실행시 실행조건 확인 및 데이터 가져오기
	 * if (this.grdColList.checkCondition() === false) 
	 * params.collectResData.charList = self.grdColList.getCollectionData();
	 * 
	 * ResourceEvent의 resultManagement함수 참조
	 */
	//필수 설정 : 데이터 조회시 조건값 설정
	setInParams : function(params) {
		// lotId, matId, matVer, flow, oper, eventId, colSetId, lotOrResFlag
		this.parmas = Ext.clone(params);
		this.includeUnitId = params.includeUnitId;
		delete this.parmas.includeUnitId;
	},
	//필수 : 화면 표시
	setCollectionData : function() {
		var colSetParams = this.getInParams();
		var colSet = this.findColSetVersion(colSetParams);
		this.fireEvent("afterFindColSetVersion", colSet);
		if (colSet.success == false) {
			return false;
		}

		var derivedParams = {
			procStep : '1',
			colSetId : colSet.colSetId,
			colSetVersion : colSet.colSetVersion || '',
			lotId : colSetParams.lotOrResFlag == 'L' ? colSetParams.lotId : '',
			resId : colSetParams.lotOrResFlag != 'L' ? colSetParams.resId : ''
		};
		var derivedInfo = this.getDerivedInfo(derivedParams);
		if (derivedInfo.success == false) {
			return false;
		}

		var charListParams = {
			procStep : '5',
			colSetId : colSet.colSetId || '',
			colSetVersion : colSet.colSetVersion || '',
			lotId : colSetParams.lotId || ''
		};
		var charData = this.viewAttachCharacterList(charListParams);
		if (charData.success == false) {
			return false;
		}

		this.clearCollectionData();

		// column
		this.setColSetColumns(charData.charList);

		// data
		this.loadCharList(charData.charList, derivedInfo);

		// calculateValue
		this.setSourceValue(this.store);
	},
	//필수 : 상위단 이벤트 호출시 값가져오기 
	getCollectionData : function() {
		var charItem = {};
		var charList = [];
		var unitList = [];

		this.store.each(function(record, index) {
			var charId = record.get('charId');
			var unitSeq = record.get('unitSeq');
			var unitId = record.get('unitId');
			var valueCount = record.get('valueCount');

			if (unitSeq == 1) {
				if (index != 0) {
					charItem = {};
					unitList = [];
				}
				charItem.charId = charId;
			}

			var unitItem = {};
			unitItem.unitId = unitId;
			unitItem.unitSeqNum = unitSeq;
			var valueList = [];
			for ( var i = 1; i <= valueCount; i++) {
				var valueItem = {};
				var val = record.get('val' + i);
				valueItem.value = val;
				valueList.push(valueItem);
			}
			unitItem.valueList = valueList;
			unitList.push(unitItem);

			// charList에 charItem 추가
			if (unitSeq == 1) {
				charItem.unitList = unitList;
				charList.push(charItem);
			}

		});

		return charList;
	},
	//필수 : resultManagement시 호출됨 
	// lock 설정후 호출함.
	confirmSpecOutData : function(charList, lock) {
		var popConfig = {
			charList : charList,
			lock : lock
		};
		var ruleCheckResultPopup = Ext.create('MES.view.window.RuleCheckResultPopup', popConfig);
		ruleCheckResultPopup.show();

		return ruleCheckResultPopup;
	},

	//옵션 : 화면 데이터 지우기 호출
	clearCollectionData : function() {
		this.store.removeAll();
		var defColumns = this.getColSetColumns();
		this.reconfigure(null, defColumns);
	},
	//옵션 : 상위단 이벤트 호출시 - 호출 및 설정
	checkCondition : function() {
		if (this.store.getCount() == 0) {
			Ext.Msg.alert('Error', T('Message.107'));
			return false;
		}

		var bCheck = true;
		this.store.each(function(record) {
			// charter check
			var charId = record.get('charId');
			if (Ext.isEmpty(charId)) {
				Ext.Msg.alert('Error', T('Message.ValidInput',{
					field1 : T('Caption.Other.Character')
				}));
				bCheck = false;
				return false;
			}

			var optInputFlag = record.get('optInputFlag');
			if (optInputFlag != 'Y') {
				var unitId = record.get('unitId');
				var unitNullFlag = record.get('unitNullFlag') || '';
				// defUnitFlag == 'E' null 체크
				if (Ext.isEmpty(unitId) && unitNullFlag != 'Y') {
					Ext.Msg.alert('Error', T('Message.ValidInput',{
						field1 : T('Caption.Other.Unit ID')
					}));
					bCheck = false;
					return false;
				}

				var valueCount = record.get('valueCount');
				var valueType = record.get('valueType');
				for ( var i = 1; i <= valueCount; i++) {
					var val = record.get('val' + i);
					if (Ext.isEmpty(val)) {
						Ext.Msg.alert('Error', T('Message.ValidInput',{
							field1 : T('Caption.Other.Value')
						}));
						bCheck = false;
						break;
					}

					if (valueType == 'N') {
						if (SF.cf.checkNumeric(val) === false) {
							Ext.Msg.alert('Error', T('Message.116'));
							bCheck = false;
							break;
						}
					}
				}
				if (bCheck === false) {
					return false;
				}
			}
		});

		return bCheck;
	},
	//옵션 : verseion 및 id 값 가져오기
	findColSetVersion : function(params) {
		var response = Ext.Ajax.request({
			async : false,
			url : 'service/EdcFindColSetVersion.json',
			params : params
		});

		return Ext.JSON.decode(response.responseText);
	},

	/* 화면 구성및 내부 사용함수들.... */
	setSourceValue : function(store) {
		var self = this;
		// value column 데이타 edit가 일어나면 derivedParamFlag == 'Y'인 컬럼 계산
		store.each(function(record) {
			if (record.get('derivedParamFlag') == 'Y') {
				var derivedInfo = record.get('derivedInfo');
				var formulaList = derivedInfo.formulaList;
				var charValues = self.getCurrentValue(store);
				var formulas = [];
				var b_calc = true;

				Ext.Array.each(formulaList, function(data) {
					var formula = Ext.clone(data);
					var valueType = formula.valueType;
					var calcType = formula.calcType;
					var useCharId = formula.useCharId;
					var useUnitSeq = formula.useUnitSeq;

					if (valueType == 'CC') {
						var cahrValue = self.getCharValue(charValues, useCharId, useUnitSeq);
						if (calcType && calcType == 'OV') {
							var useValueSeq = formula.useValueSeq;
							if (useValueSeq <= cahrValue.seq) {
								if (useValueSeq == 0) {
									formula.value = cahrValue.values[0];
								} else {
									formula.value = cahrValue.values[useValueSeq - 1];
								}
							}
						} else {
							var dMaxValue = 0;
							var dMinValue = 0;
							var dSum = 0;
							var dValue = 0;
							var valueCount = 0;

							Ext.Array.each(cahrValue.values, function(v) {
								if (SF.cf.checkNumeric(v)) {
									var cv = parseFloat(v);

									valueCount++;

									dValue = cv;
									dSum += dValue;

									if (valueCount == 1) {
										dMaxValue = dValue;
										dMinValue = dValue;
									}

									if (dMaxValue < dValue) {
										dMaxValue = dValue;
									}
									if (dMinValue > dValue) {
										dMinValue = dValue;
									}
								}
							});
							
							//valueCount가 1보다 작으면 종료
							if(valueCount < 1){
								b_calc = false;
								return false;
							}

							switch (calcType) {
							case 'AV':
								formula.value = dSum / valueCount;
								break;
							case 'SM':
								formula.value = dSum;
								break;
							case 'MN':
								formula.value = dMaxValue;
								break;
							case 'MX':
								formula.value = dMinValue;
								break;
							case 'VC':
								formula.value = valueCount;
								break;
							}
						}
					}

					formulas.push(formula);
				});
				
				//계산
				if(b_calc === true){
					self.calculateValue(formulas, record);
				}
			}
		});
	},

	getCurrentValue : function(store) {
		var charValues = [];
		store.each(function(record) {
			var id = record.get('charId');
			var seq = record.get('unitSeq');
			var values = [];
			var valueCount = record.get('valueCount');
			for ( var i = 1; i <= valueCount; i++) {
				var val = record.get('val' + i);
				values.push(val);
			}

			charValues.push({
				id : id,
				seq : seq,
				values : values
			});
		});

		return charValues;
	},

	getCharValue : function(charValues, useCharId, useUnitSeq) {
		var result = '';
		Ext.Array.each(charValues, function(cValue) {
			if (cValue.id == useCharId && cValue.seq == useUnitSeq) {
				result = cValue;
				return false;
			}
		});

		return result;
	},

	calculateValue : function(formulas, record) {
		var sql = "SELECT TO_CHAR(TO_NUMBER(";
		var derivedParameter = record.get('derivedParameter').split('|');
		var valueCount = record.get('valueCount');
		var formulaIndex = 0;
		
		Ext.Array.each(derivedParameter, function(derived, index) {
			if (derived[0] == '@') {
				derived = derived.substr(1);
			}
			if (derived[0] == '#') {
				var formula = formulas[formulaIndex];
				formulaIndex++;
				var valueType = formula.valueType;
				switch (valueType) {
				case 'CC':
				case 'OC':
				case 'CV':
				case 'LS':
				case 'LA':
					var fValue = formula.value || 0;
					sql += fValue;
					break;
				case "OT":
				case "LB":
				case "RB":
					sql += derived.substr(1);
					break;
				}
			} else {
				sql += derived;
			}
		});
		sql += ")) FROM DUAL";
		
		console.log('sql', sql);

		var result = this.basSqlQuery(sql);
		if (result.success) {
			var rows = result.rows;
			if (rows.length > 0) {
				if (rows[0].cols.length > 0) {
					var rValue = rows[0].cols[0].data;
					var n = parseFloat(rValue).toString();
					for ( var i = 1; i <= valueCount; i++) {
						record.set('val' + i, n);
					}
				}
			}
		}
	},

	basSqlQuery : function(sql) {
		var response = Ext.Ajax.request({
			async : false,
			url : 'service/basSqlQuery.json',
			params : {
				procstep : '1',
				sql : sql
			}
		});

		return Ext.JSON.decode(response.responseText);
	},

	loadCharList : function(charList, derivedInfo) {
		var records = [];
		Ext.Array.each(charList, function(data) {
			var unitCount = data.unitCount;
			for ( var i = 1; i <= unitCount; i++) {
				var seq = i;
				var spce = SF.cf.getSpecInfo(data.upperSpecLimit, data.lowerSpecLimit, data.targetValue);
				var record = Ext.clone(data);
				record.unitSeq = seq;
				record.specInfo = spce;

				// charId에 맞는 derivedInfo 정보를 추가
				if (record.derivedParamFlag == 'Y') {
					Ext.Array.each(derivedInfo.charList, function(data) {
						if (data.charId == record.charId) {
							record.derivedInfo = data;
						}
					});
				}

				records.push(record);
			}
		});

		this.store.loadData(records);
	},

	drawSpecOutMask : function(charList) {

		if (!charList) {
			return;
		}

		var iRow = 0;
		Ext.Array.each(charList, function(data1) {
			var charId = data1.charId;
			var unitList = data1.unitList;
			Ext.Array.each(unitList, function(data2) {
				var unitSeq = data2.unitSeqNum;
				var specOutMask = data2.specOutMask;
				var record = this.store.getAt(iRow);
				if (record.get('charId') == charId && record.get('unitSeq') == unitSeq) {
					record.set('specOutMask', specOutMask);
				}
				iRow++;
			}, this);
		}, this);
	},

	viewAttachCharacterList : function(params) {
		params.includeUnitId = this.includeUnitId || '';
		var response = Ext.Ajax.request({
			async : false,
			url : 'service/EdcViewAttachCharacterList.json',
			params : params
		});
		return Ext.JSON.decode(response.responseText);
	},

	getDerivedInfo : function(params) {
		var response = Ext.Ajax.request({
			async : false,
			url : 'service/EdcViewDerivedCharacterList.json',
			params : params
		});
		return Ext.JSON.decode(response.responseText);
	},

	getInParams : function() {
		return this.parmas;
	},

	setColSetColumns : function(charList) {
		// unitId Column
		var unitIdColumn = {
			header : T('Caption.Other.Unit ID'),
			dataIndex : 'unitId',
			editor : {
				xtype : 'textfield',
				selectOnFocus : true
			},
			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
				var tdCls = '';
				var unitValue = value;
				var unitList = record.get('unitList') || [];
				var defUnitFlag = record.get('defUnitFlag') || '';
				var defUnitOvrFlag = record.get('defUnitOvrFlag') || '';
				var unitSeq = record.get('unitSeq') || 0;
				var unitTbl = record.get('unitTbl') || '';
				var unit = record.get('unit') || '';

				// Unit ID Cell Lock
				if (unitList.length < 1) {
					if (defUnitFlag == 'C') {
						tdCls = 'cellReadOnly cellGray';
						// CHARACTER
						if (unit == '') {
							record.set('unitId', '*');
							unitValue = '*';
						}
					} else if (defUnitFlag == 'E') {
						record.set('unitNullFlag', 'Y');
					}
				} else {
					if (defUnitFlag == 'Y') {
						var ut = unitList[unitSeq - 1];
						if (defUnitOvrFlag == 'Y') {
							if (Ext.isEmpty(value) && ut.nullFlag != 'Y') {
								record.set('unitId', ut.defUnitId);
								unitValue = ut.defUnitId;
							} else {
								tdCls = 'fontWeightBold';
							}
						} else {
							if (ut.nullFlag != 'Y') {
								record.set('unitId', ut.defUnitId);
								unitValue = ut.defUnitId;
							}
							tdCls = 'cellReadOnly cellGray';
						}

						if (ut.nullFlag == 'Y') {
							record.set('unitNullFlag', 'Y');
						}
					}
				}

				if ((defUnitFlag == 'Y' && defUnitOvrFlag == 'Y' && unitTbl != '') || (defUnitFlag == '' && unitTbl != '')) {
					tdCls += ' cellReadOnly';
				}

				metaData.tdCls = tdCls;

				return unitValue;
			}
		};

		// unit Gcm Column
		var unitGcmColumn = {
			xtype : 'codeviewcolumn',
			dataIndex : 'unitTbl',
			targetColumn : [ 'unitId' ],
			disabledIcon : function(record) {
				// derivedParamFlag == 'Y'면 table 컬럼이 활성화 되지 않는다.
				if (record.get('derivedParamFlag') == 'Y') {
					return false;
				}
				return true;
			}
		};

		// default + unit Column + unit Gcm Column
		var defColumns = this.getColSetColumns();
		defColumns.push(unitIdColumn);
		defColumns.push(unitGcmColumn);

		// default + unit Column + unit Gcm Column + Value Column
		var valueColCnt = this.getValueColCount(charList);
		for ( var i = 1; i <= valueColCnt; i++) {
			defColumns.push({
				header : i,
				tdCls : 'fontWeightBold',
				dataIndex : 'val' + i,
				width : 70,
				editor : {
					xtype : 'textfield',
					selectOnFocus : true
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store) {
					var tdCls = '';
					var style = '';
					var valueType = record.get('valueType');
					var derivedParamFlag = record.get('derivedParamFlag');
					var valueTbl = record.get('valueTbl') || '';
					var defValue = record.get('defValue') || '';
					var valueCnt = record.get('valueCount') || '';
					var specOutMask = record.get('specOutMask') || '';

					// Number, Ascii Cell 체크
					if (valueType == 'N') {
						style = 'text-align: right';
					} else {
						style = 'text-align: left';
					}

					if (derivedParamFlag == 'Y') {
						tdCls = 'cellReadOnly cellBlue';
					} else {
						tdCls = '';
					}

					var vc = parseInt(this.columns[colIndex].text);
					// Default Value Setting
					if (Ext.isEmpty(value)) {
						record.set('val' + vc, defValue);
						value = defValue;
					}
					if (valueTbl) {
						tdCls = 'cellReadOnly';
					}

					// valueCount 보다 값이큰 valueColum 처리
					if (valueCnt < vc) {
						tdCls = 'cellReadOnly cellGray';
					}

					if (specOutMask) {
						var specOut = specOutMask[vc - 1];
						if (specOut == '1' || specOut == '4' || specOut == '5') {
							tdCls += 'cellRed';
						} else if (specOut == '2' || specOut == '3') {
							// TODO cellYellow로 변경필요
							tdCls += 'cellOrange';
						}
					}

					metaData.style = style;
					metaData.tdCls = tdCls;

					return value;
				}
			});

			defColumns.push({
				xtype : 'codeviewcolumn',
				dataIndex : 'valueTbl',
				targetColumn : [ 'val' + i ]
			});
		}

		defColumns.push({
			hidden : true,
			dataIndex : 'derivedInfo'
		});
		
		//TODO stack size -> columns 갯수가 많아지면(1000개 이상?) 오류가 발생(splice(0,1))
		this.reconfigure(null, defColumns);
	},

	getValueColCount : function(charList) {
		var valueColCnt = 0;
		Ext.Array.each(charList, function(data) {
			var valueCnt = data.valueCount;
			if (valueCnt > valueColCnt) {
				valueColCnt = valueCnt;
			}
		});

		return valueColCnt;
	},

	getColSetColumns : function() {
		return [ {
			header : T('Caption.Other.Character'),
			dataIndex : 'charId',
			width : 120,
			tdCls : 'cellGray',
		// locked : true
		}, {
			header : T('Caption.Other.Character Desc'),
			dataIndex : 'charDesc',
			tdCls : 'cellGray',
			width : 200
		}, {
			header : T('Caption.Other.Spec'),
			dataIndex : 'specInfo',
			tdCls : 'cellGray',
			width : 120
		}, {
			header : 'Opt Input',
			dataIndex : 'optInputFlag',
			hidden : true
		}, {
			header : T('Caption.Other.Value Type'),
			dataIndex : 'valueType',
			tdCls : 'cellGray',
			align : 'center',
			width : 70
		}, {
			header : 'Default Unit Flag',
			dataIndex : 'valueCount',
			hidden : true
		}, {
			header : 'Default Unit Over Flag',
			dataIndex : 'defUnitOvrFlag',
			hidden : true
		}, {
			header : 'Default Value',
			dataIndex : 'defValue',
			hidden : true
		}, {
			header : 'Unit Table',
			dataIndex : 'unitTbl',
			hidden : true
		}, {
			header : 'Value Table',
			dataIndex : 'valueTbl',
			hidden : true
		}, {
			header : T('Caption.Other.Unit Seq'),
			dataIndex : 'unitSeq',
			tdCls : 'cellGray',
			align : 'center',
			width : 70
		} ];
	}
});