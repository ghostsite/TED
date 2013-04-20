/**
 * 필수 선언 항목 - type : 'gcm' / 'table' / 'service' - table : 'tableName' (type 이
 * gcm/table 일경우만) - store : 'storeName' / 'store class' (type 이 service일 경우만) -
 * popupConfig : "columns" : [{...}] 코드뷰 팝업의 grid의 기본 columns 속성 설정
 * 
 * [Naming Convention] CodeView Name : Class Name Style Reserved CodeView Name :
 * GCM, TABLE, SERVICE codeview의 field설정시 type는 사용할 수 없음. type는 등록시에만 필수 입력조건임.
 * 
 * @cfg {string} factory 검색의 기본 영역 설정 (기본값 : SmartFactory.login.factory 로그인한 현
 *      factory)
 * @cfg {string} table GCM 또는 DB의 테이블 이름
 * @cfg {string/object} store 특정 서비스를 이용시 store이름 또는 store object 를 설정
 * @cfg {array} order 정렬 옵션 설정 ("column" : "columnName", ascending : true/false)
 * @cfg {array} condition 검색 조건의 항목 설정 ("column" : "columnName" , value :
 *      "값"/function, scope : this, operator : "like")
 * @cfg {object/function} params store설정시 서버에 필요한 조건 항목 설정
 * @cfg {object} paramsScope params의 function 설정시 함수 실행 영역 설정 (기본은 codeview
 *      field임)
 * @cfg {object} popupConfig 팝업설정 (title, columns, hearders, keyCount 항목을 설정함)
 * @cfg {object} comboConfig 콤보필드 설정(displayField, valueField, displayTpl 등
 *      콤보필드에 필요한 항목설정)
 * @cfg {array} fields 화면에 표시할 코드뷰 필드 설정(column, flex)
 * 
 */
Ext.define('MES.data.CodeViewRegister', {
	constructor : function() {
		/* 기본 type : table */
		// factoryConditionEnabled : true/false
		// TABLE형식 정의시 앞단에 구분자 Tb를 입력 Ex) TbOperation
		// SERVICE형식 정의시 앞단에 구분자 Sv를 입력 Ex) SvOperation
		// GCM형식은 구분자 없음.
		// 해당 형식별 구분하여 작성해주세요!
		/** gcm 형식 정의 * */

		SmartFactory.codeview.register('OwnerCode', {
			type : 'gcm',
			//table : SF_WIP_OWNER_CODE, this should be parent_code for my Type zhang
			popupConfig : {
				title : T('Caption.Other.Owner Code'),
				columns : [ {
					header : T('Caption.Other.Owner Code'),
					dataIndex : 'code',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'name',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'key1',
				flex : 1,
				maxLength : 10,
				enforceMaxLength : true
			} ]
		});

		/** table 형식 정의 * */
		SmartFactory.codeview.register('TbSubresource', {
			type : 'table',
			table : 'MRASSRSDEF',
			order : [ {
				column : 'subresId',
				ascending : true
			} ],
			condition : [ {
				column : 'deleteFlag',
				value : ' '
			} ],
			popupConfig : {
				title : T('Caption.Other.Sub Resource'),
				columns : [ {
					header : T('Caption.Other.Sub Resource'),
					dataIndex : 'subresId',
					flex : 1
				}, {
					header : T('Caption.Other.Desc'),
					dataIndex : 'subresDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'subresId',
				flex : 1,
				enforceMaxLength : true,
				maxLength : 20
			} ]
		});


		SmartFactory.codeview.register('TbMaterial', {
			type : 'table',
			table : 'MWIPMATDEF',
			order : [ {
				column : 'matId',
				ascending : true
			} ],
			condition : [ {
				column : 'deleteFlag',
				value : 'Y',
				operator : '!='

			}, {
				column : 'deactiveFlag',
				value : 'Y',
				operator : '!='
			} ],
			popupConfig : {
				title : T('Caption.Other.Material'),
				columns : [ {
					header : T('Caption.Other.Material'),
					dataIndex : 'matId',
					flex : 2
				}, {
					header : T('Caption.Other.Version'),
					dataIndex : 'matVer',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'matDesc',
					flex : 3
				} ]
			},

			fields : [ {
				column : 'matId',
				flex : 2,
				maxLength : 30,
				enforceMaxLength : true
			}, {
				column : 'matVer',
				flex : 1,
				vtype : 'numbers',
				maxLength : 6,
				enforceMaxLength : true
			} ]
		});

		SmartFactory.codeview.register('TbSecGroup', {
			type : 'table',
			table : 'MSECGRPDEF',
			order : [ {
				column : 'secGrpId',
				ascending : true
			} ],

			popupConfig : {
				title : T('Caption.Other.Security Group'),
				columns : [ {
					header : T('Caption.Other.Security Group'),
					dataIndex : 'secGrpId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'secGrpDesc',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'secGrpId',
				flex : 1
			} ]
		});

		
		SmartFactory.codeview.register('TbFlow', {
			type : 'table',
			table : 'MWIPFLWDEF',
			order : [ {
				column : 'flow',
				ascending : true
			} ],

			popupConfig : {
				title : T('Caption.Other.Flow'),
				columns : [ {
					header : T('Caption.Other.Flow'),
					dataIndex : 'flow',
					flex : 1
				}, {
					header : T('Caption.Other.Flow Desc'),
					dataIndex : 'flowDesc',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'flow',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('TbBomSet', {
			type : 'table',
			table : 'MBOMSETDEF',

			condition : [ {
				column : 'deleteFlag',
				value : ' '
			} ],

			popupConfig : {
				title : T('Caption.Other.BOM Set ID'),
				columns : [ {
					header : T('Caption.Other.BOM Set ID'),
					dataIndex : 'bomSetId',
					flex : 1
				}, {
					dataIndex : 'deleteFlag',
					hidden : true
				} ],
				condition : [ {
					column : 'matOrOrdFlag',
					value : 'M'
				} ]
			},

			fields : [ {
				column : 'bomSetId',
				maxLength : 24,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		/** service 형식 정의 * */
		SmartFactory.codeview.register('SvFlowAndSeq', {
			type : 'service',
			store : 'WIP.store.WipViewFlowListOut.flowList',
			params : {
				procstep : '1',
				matId : '',
				matVer : ''
			},

			popupConfig : {
				title : T('Caption.Other.Flow'),
				columns : [ {
					header : T('Caption.Other.Flow'),
					dataIndex : 'flow',
					flex : 2
				}, {
					header : T('Caption.Other.Flow Seq'),
					dataIndex : 'flowSeqNum',
					flex : 1
				}, {
					header : T('Caption.Other.Flow Desc'),
					dataIndex : 'flowDesc',
					flex : 2
				} ]
			// optFlowFroup,optFlowOptionFlag
			},

			fields : [ {
				column : 'flow',
				flex : 2,
				maxLength : 20, // check
				enforceMaxLength : true,
				vtype : 'nospace'
			}, {
				column : 'flowSeqNum',
				flex : 1,
				maxLength : 6, // check
				enforceMaxLength : true,
				vtype : 'numbers'
			} ]
		});

		SmartFactory.codeview.register('SvCalendar', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'BAS.store.BasViewCalendarListOut.calendarList',
			popupConfig : {
				title : T('Caption.Other.Calendar ID'),
				columns : [ {
					header : T('Caption.Other.Calendar ID'),
					dataIndex : 'calendarId',
					flex : 1
				} ]
			},
			params : {
				procstep : '1',
				year : new Date().getFullYear(),
				calendarType : 'W'
			},
			fields : [ {
				column : 'calendarId',
				flex : 1,
				readOnly : true,
				value : SmartFactory.login.factory
			} ]
		});

		SmartFactory.codeview.register('SvTool', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewToolListOut.toolList',
			popupConfig : {
				title : T('Caption.Other.Tool'),
				columns : [ {
					header : T('Caption.Other.Tool'),
					dataIndex : 'toolId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'toolDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'toolId',
				maxLength : 30,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvToolType', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewToolTypeListOut.ttypeList',
			params : {
				procstep : '1',
				deleteFlag : 'N'
			},
			popupConfig : {
				title : T('Caption.Other.Tool Type'),
				columns : [ {
					header : T('Caption.Other.Tool Type'),
					dataIndex : 'toolType',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'toolTypeDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'toolType',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

	
		SmartFactory.codeview.register('SvSubresource', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewSubResourceListOut.SresList',

			popupConfig : {
				title : T('Caption.Other.Sub Resource'),
				columns : [ {
					header : T('Caption.Other.Sub Resource'),
					dataIndex : 'subresId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'subresDesc',
					flex : 2
				} ]
			},
			paramsScope : this,
			fields : [ {
				column : 'subresId',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		
		SmartFactory.codeview.register('SvEvent', {
			type : 'service',
			store : 'RAS.store.RasViewEventListOut.EventList',
			params : {
				procstep : '1'
			},
			popupConfig : {
				title : T('Caption.Other.Event ID'),
				columns : [ {
					header : T('Caption.Other.Event ID'),
					dataIndex : 'eventId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'eventDesc',
					flex : 2
				} ]
			},
			paramsScope : this,
			fields : [ {
				column : 'eventId',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvMaterial', {
			type : 'service',
			store : 'WIP.store.WipViewMaterialListOut.list',
			params : {
				nextMatVer : SmartFactory.MAX_INT,
				procstep : '1'
			},
			popupConfig : {
				title : T('Caption.Other.Material'),
				columns : [ {
					header : T('Caption.Other.Material'),
					dataIndex : 'matId',
					flex : 2
				}, {
					header : T('Caption.Other.Version'),
					dataIndex : 'matVer',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'matDesc',
					flex : 3
				} ]
			},
			fields : [ {
				column : 'matId',
				name : 'data1',
				flex : 2,
				maxLength : 30,
				enforceMaxLength : true
			}, {
				column : 'matVer',
				flex : 1,
				maxLength : 6,
				enforceMaxLength : true,
				vtype : 'numbers'
			} ]
		});
		

		SmartFactory.codeview.register('SvColSetByGroup', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.EdcViewColSetListByGroupOut.colSetList',
			params : {
				procstep : '1',
				lotOrResFlag : ' ',
				includeDelFlag : ' ',
				nextColSetId : ''
			},
			popupConfig : {
				title : T('Caption.Other.Col Set ID By Group'),
				columns : [ {
					header : T('Caption.Other.Col Set ID'),
					dataIndex : 'colSetId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'colSetDesc',
					flex : 1
				}, {
					dataIndex : 'deleteFlag',
					hidden : true
				} ]
			},
			fields : [ {
				column : 'colSetId',
				maxLength : 25, // check
				enforceMaxLength : true,
				vtype : 'nospace',
				flex : 1
			}, {
				column : 'colSetDesc',
				flex : 1,
				readOnly : true,
				submitValue : false
			} ]
		});

	}
});