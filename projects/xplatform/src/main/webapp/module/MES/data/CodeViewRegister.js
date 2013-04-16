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

		SmartFactory.codeview.register('GcmTableGroup', {
			type : 'gcm',
			factory : 'SYSTEM',
			table : SF_GCM_TABLE_GROUP,

			popupConfig : {
				title : T('Caption.Other.Table Group'),
				columns : [ {
					header : T('Caption.Other.Name'),
					dataIndex : 'key1',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20, // check
				enforceMaxLength : true,
				vtype : 'nospace',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ProgramList', {
			type : 'gcm',
			factory : 'SYSTEM',
			table : SF_SEC_PROGRAM_LIST,

			popupConfig : {
				title : T('Caption.Other.Program ID'),
				columns : [ {
					header : T('Caption.Other.Program ID'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('FunctionGroup', {
			type : 'gcm',
			factory : 'SYSTEM',
			table : SF_SEC_FUNCTION_GROUP,

			popupConfig : {
				title : T('Caption.Other.Function Group'),
				columns : [ {
					header : T('Caption.Other.Name'),
					dataIndex : 'key1'
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ReleaseCode', {
			type : 'gcm',
			table : SF_WIP_RELEASE_CODE,
			popupConfig : {
				title : T('Caption.Other.Release Code'),
				columns : [ {
					header : T('Caption.Other.Release Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('LotType', {
			type : 'gcm',
			table : SF_WIP_LOT_TYPE,
			popupConfig : {
				title : T('Caption.Other.Lot Type'),
				columns : [ {
					header : T('Caption.Other.Lot Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
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

		SmartFactory.codeview.register('OwnerCode', {
			type : 'gcm',
			table : SF_WIP_OWNER_CODE,
			popupConfig : {
				title : T('Caption.Other.Owner Code'),
				columns : [ {
					header : T('Caption.Other.Owner Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
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

		SmartFactory.codeview.register('HoldCode', {
			type : 'gcm',
			table : SF_WIP_HOLD_CODE,

			popupConfig : {
				title : T('Caption.Other.Hold Code'),
				columns : [ {
					header : T('Caption.Other.Hold Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('LossCode', {
			type : 'gcm',
			table : SF_WIP_LOSS_CODE,

			popupConfig : {
				title : T('Caption.Other.Loss Code'),
				columns : [ {
					header : T('Caption.Other.Loss Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('BonusCode', {
			type : 'gcm',
			table : SF_WIP_BONUS_CODE,

			popupConfig : {
				title : T('Caption.Other.Bonus Code'),
				columns : [ {
					header : T('Caption.Other.Bonus Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 30,
				enforceMaxLength : true,
				vtype : 'nospace',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('AttributeType', {
			type : 'gcm',
			table : SF_ATTR_TYPE_TABLE,

			popupConfig : {
				title : T('Caption.Other.Attribute Type'),
				columns : [ {
					header : T('Caption.Other.Attribute Type'),
					dataIndex : 'key1',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				vtype : 'nospace',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('MaterialType', {
			type : 'gcm',
			table : SF_WIP_MATERIAL_TYPE,

			popupConfig : {
				title : T('Caption.Other.Material Type'),
				columns : [ {
					header : T('Caption.Other.Material Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				vtype : 'nospace',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('MaterialPackType', {
			type : 'gcm',
			table : SF_WIP_MATERIAL_PACKTYPE,

			popupConfig : {
				title : T('Caption.Other.Pack Type'),
				columns : [ {
					header : T('Caption.Other.Pack Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 1,
				enforceMaxLength : true,
				vtype : 'nospace',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('FactoryType', {
			type : 'gcm',
			factory : 'SYSTEM',
			table : SF_SYS_FACTORY_TYPE,

			popupConfig : {
				title : T('Caption.Other.Factory Type'),
				columns : [ {
					header : T('Caption.Other.Factory Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 2,
				enforceMaxLength : true,
				vtype : 'nospace',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('Unit', {
			type : 'gcm',
			table : SF_WIP_UNIT_TABLE,

			popupConfig : {
				title : T('Caption.Other.Unit'),
				columns : [ {
					header : T('Caption.Other.Unit'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('EDCUnit', {
			type : 'gcm',
			table : SF_EDC_UNIT_TABLE,

			popupConfig : {
				title : T('Caption.Other.Unit'),
				columns : [ {
					header : T('Caption.Other.Unit'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
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

		SmartFactory.codeview.register('ResourceType', {
			type : 'gcm',
			table : SF_RAS_RES_TYPE,

			popupConfig : {
				title : T('Caption.Other.Resource Type'),
				columns : [ {
					header : T('Caption.Other.Resource Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('Area', {
			type : 'gcm',
			table : SF_RAS_AREA_CODE,

			popupConfig : {
				title : T('Caption.Other.Area'),
				columns : [ {
					header : T('Caption.Other.Area'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SubArea', {
			type : 'gcm',
			table : SF_RAS_SUBAREA_CODE,

			popupConfig : {
				title : T('Caption.Other.Sub Area'),
				columns : [ {
					header : T('Caption.Other.Area'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('CarrierType1', {
			type : 'gcm',
			table : SF_RAS_CRR_TYPE1,

			popupConfig : {
				title : T('Caption.Other.Carrier Type'),
				columns : [ {
					header : T('Caption.Other.Carrier Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('CarrierType2', {
			type : 'gcm',
			table : SF_RAS_CRR_TYPE2,

			popupConfig : {
				title : T('Caption.Other.Carrier Type'),
				columns : [ {
					header : T('Caption.Other.Carrier Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('CarrierType3', {
			type : 'gcm',
			table : SF_RAS_CRR_TYPE3,

			popupConfig : {
				title : T('Caption.Other.Carrier Type'),
				columns : [ {
					header : T('Caption.Other.Carrier Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SubresourceType', {
			type : 'gcm',
			table : SF_RAS_SUBRES_TYPE,

			popupConfig : {
				title : T('Caption.Other.Sub Resource Type'),
				columns : [ {
					header : T('Caption.Other.Sub Resource Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ChamberGroup', {
			type : 'gcm',
			table : SF_RAS_CHAMBER_GROUP,

			popupConfig : {
				title : T('Caption.Other.Chamber Group'),
				columns : [ {
					header : T('Caption.Other.Chamber Group'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('QueryType', {
			type : 'gcm',
			table : SF_SHEET_QUERY_TYPE,

			popupConfig : {
				title : T('Caption.Other.Query Type'),
				columns : [ {
					header : T('Caption.Other.Query Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('CheckType', {
			type : 'gcm',
			table : SF_SHEET_SHEET_TYPE,

			popupConfig : {
				title : T('Caption.Other.Check Type'),
				columns : [ {
					header : T('Caption.Other.Check Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ToolGroup', {
			type : 'gcm',
			table : SF_RAS_TOOL_GRP,

			popupConfig : {
				title : T('Caption.Other.Tool Group'),
				columns : [ {
					header : T('Caption.Other.Tool Group'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});
		
		SmartFactory.codeview.register('OperGroup', {
			type : 'gcm',
			table : SF_GCM_OPER_GRP + '1',

			popupConfig : {
				title : T('Caption.Other.Operation Group'),
				columns : [ {
					header : T('Caption.Other.Operation Group'),
					dataIndex : 'key1',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ToolGrade', {
			type : 'gcm',
			table : SF_RAS_TOOL_GRADE,

			popupConfig : {
				title : T('Caption.Other.Tool Grade'),
				columns : [ {
					header : T('Caption.Other.Tool Grade'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 1,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ToolStatus', {
			type : 'gcm',
			table : SF_RAS_TOOL_STATUS,

			popupConfig : {
				title : T('Caption.Other.Tool Status'),
				columns : [ {
					header : T('Caption.Other.Tool Status'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('WorkPosition', {
			type : 'gcm',
			table : SF_RAS_WORK_POSITION,

			popupConfig : {
				title : T('Caption.Other.Resource Type'),
				columns : [ {
					header : T('Caption.Other.Work Position'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ToolDefect', {
			type : 'gcm',
			table : SF_RAS_TOOL_DEFECT,

			popupConfig : {
				title : T('Caption.Other.Tool Defect'),
				columns : [ {
					header : T('Caption.Other.Defect Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('DataType', {
			type : 'gcm',
			table : SF_SHEET_DATA_TYPE,

			popupConfig : {
				title : T('Caption.Other.Data Type'),
				columns : [ {
					header : T('Caption.Other.Data Type'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ReworkCode', {
			type : 'gcm',
			table : SF_WIP_REWORK_CODE,
			popupConfig : {
				title : T('Caption.Other.Rework Code'),
				columns : [ {
					header : T('Caption.Other.Rework Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('TerminateCode', {
			type : 'gcm',
			table : SF_WIP_TERMINATE_CODE,

			popupConfig : {
				title : T('Caption.Other.Terminate Code'),
				columns : [ {
					header : T('Caption.Other.Terminate Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 12,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('RepairCode', {
			type : 'gcm',
			table : SF_WIP_REPAIR_CODE,

			popupConfig : {
				title : T('Caption.Other.Repair Code'),
				columns : [ {
					header : T('Caption.Other.Repair Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 10,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ResultCode', {
			type : 'gcm',
			table : SF_WIP_RESULT_CODE,

			popupConfig : {
				title : T('Caption.Other.Result Code'),
				columns : [ {
					header : T('Caption.Other.Result Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 10,
				flex : 1
			} ]
		});
		
		
		SmartFactory.codeview.register('RmaResultCode', {
			type : 'gcm',
			table : SF_RMA_RESULT_CODE,

			popupConfig : {
				title : T('Caption.Other.Result Code'),
				columns : [ {
					header : T('Caption.Other.Result Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 10,
				flex : 1
			} ]
		});
		
		
		

		SmartFactory.codeview.register('ActionCode', {
			type : 'gcm',
			table : SF_WIP_ACTION_CODE,

			popupConfig : {
				title : T('Caption.Other.Action Code'),
				columns : [ {
					header : T('Caption.Other.Action Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 10,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('RmaCreateCode', {
			type : 'gcm',
			table : SF_RMA_CREATE_CODE,

			popupConfig : {
				title : T('Caption.Other.Create Code'),
				columns : [ {
					header : T('Caption.Other.Create Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
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

		SmartFactory.codeview.register('CreateCode', {
			type : 'gcm',
			table : SF_WIP_CREATE_CODE,

			popupConfig : {
				title : T('Caption.Other.Create Code'),
				columns : [ {
					header : T('Caption.Other.Create Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SublotGrade', {
			type : 'gcm',
			table : SF_WIP_SUBLOT_GRADE,

			popupConfig : {
				title : T('Caption.Other.Sublot Grade'),
				columns : [ {
					header : T('Caption.Other.Grade'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				enforceMaxLength : true,
				maxLength : 1,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('CvCode', {
			type : 'gcm',
			table : SF_WIP_CV_CODE,

			popupConfig : {
				title : T('Caption.Other.Cv Code'),
				columns : [ {
					header : T('Caption.Other.Cv Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('ShipCode', {
			type : 'gcm',
			table : SF_WIP_SHIP_CODE,

			popupConfig : {
				title : T('Caption.Other.Ship Code'),
				columns : [ {
					header : T('Caption.Other.Code'),
					dataIndex : 'key1',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'data1',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'key1',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
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

		SmartFactory.codeview.register('TbResourceEvent', {
			type : 'table',
			table : 'MRASEVNDEF',
			popupConfig : {
				title : T('Caption.Other.Event'),
				columns : [ {
					header : T('Caption.Other.Event'),
					dataIndex : 'eventId',
					flex : 1
				}, {
					header : T('Caption.Other.Desc'),
					dataIndex : 'eventDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'eventId',
				flex : 1,
				enforceMaxLength : true,
				maxLength : 12
			} ]
		});
		SmartFactory.codeview.register('TbOperation', {
			type : 'table',
			table : 'MWIPOPRDEF',
			order : [ {
				column : 'oper',
				ascending : true
			} ],

			popupConfig : {
				title : T('Caption.Other.Operation'),
				columns : [ {
					header : T('Caption.Other.Operation'),
					dataIndex : 'oper',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'operDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'oper',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
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

		SmartFactory.codeview.register('TbGcmTable', {
			type : 'table',
			table : 'MGCMTBLDEF',

			popupConfig : {
				title : T('Caption.Other.Table Name'),
				columns : [ {
					header : T('Caption.Other.Table Name'),
					dataIndex : 'tableName',
					flex : 2
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'tableDesc',
					flex : 3
				} ]
			},

			fields : [ {
				column : 'tableName',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
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

		SmartFactory.codeview.register('TbBasInquiry', {
			type : 'table',
			table : 'MBASINQDEF',

			popupConfig : {
				title : T('Caption.Other.Inquiry ID'),
				columns : [ {
					header : T('Caption.Other.Inquiry ID'),
					dataIndex : 'inquiryId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'inquiryTitle',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'inquiryId',
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

		// ATTR_TYPE을 condition로 값을 주어야 함.
		SmartFactory.codeview.register('TbAttributeName', {
			type : 'table',
			table : 'MATRNAMDEF',

			popupConfig : {
				title : T('Caption.Other.Attribute Name'),
				columns : [ {
					header : T('Caption.Other.Attribute Name'),
					dataIndex : 'attrName',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'attrDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'attrName',
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

		SmartFactory.codeview.register('TbFactory', {
			type : 'table',
			table : 'MWIPFACDEF',
			order : [ {
				column : 'factory',
				ascending : true
			} ],
			popupConfig : {
				title : T('Caption.Other.Factory'),
				columns : [ {
					header : T('Caption.Other.Factory'),
					dataIndex : 'factory',
					flex : 1
				}, {
					header : T('Caption.Other.Desc'),
					dataIndex : 'facDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'factory',
				vtype : 'nospace',
				maxLength : 10, // check
				enforceMaxLength : true,
				flex : 1
			} ],
			factoryConditionEnabled : false
		});

		SmartFactory.codeview.register('TbResource', {
			type : 'table',
			table : 'MRASRESDEF',
			order : [ {
				column : 'resId',
				ascending : true
			} ],
			condition : [ {
				column : 'deleteFlag',
				value : ' '
			} ],
			popupConfig : {
				title : T('Caption.Other.Resource'),
				columns : [ {
					header : T('Caption.Other.Resource'),
					dataIndex : 'resId',
					flex : 1
				}, {
					header : T('Caption.Other.Desc'),
					dataIndex : 'resDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'resId',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('TbCarrier', {
			type : 'table',
			table : 'MRASCRRDEF',
			popupConfig : {
				title : T('Caption.Other.Carrier'),
				columns : [ {
					header : T('Caption.Other.Carrier'),
					dataIndex : 'crrId',
					flex : 1
				}, {
					header : T('Caption.Other.Desc'),
					dataIndex : 'crrDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'crrId',
				flex : 1,
				maxLength : 20,
				enforceMaxLength : true
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

		SmartFactory.codeview.register('SvFlow', {
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
					header : T('Caption.Other.Flow Desc'),
					dataIndex : 'flowDesc',
					flex : 3
				} ]
			},

			fields : [ {
				column : 'flow',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvCmfItem', {
			type : 'service',
			factory : SF.login.factory,
			store : 'WIP.store.WipViewFactoryCmfItemOut.dataTbl',
			popupConfig : {
				title : T('Caption.Other.CMF Item List'),
				columns : [ {
					header : T('Caption.Other.Prompt'),
					dataIndex : 'prompt',
					flex : 1
				}, {
					header : T('Caption.Other.Table Name'),
					dataIndex : 'tableName',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'prompt',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			}, {
				column : 'tableName',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvResourceGroup', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewResourceGroupListOut.resgList',
			params : {
				procstep : '1'
			},

			popupConfig : {
				title : T('Caption.Other.Resource Group'),
				columns : [ {
					header : T('Caption.Other.Resource Group'),
					dataIndex : 'resgId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'resgDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'resgId',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvCarrierGroup', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewCarrierGroupListOut.crrgrpList',
			params : {
				procstep : '1'
			},

			popupConfig : {
				title : T('Caption.Other.Carrier Group'),
				columns : [ {
					header : T('Caption.Other.Carrier Group'),
					dataIndex : 'crrGroup',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'crrGrpDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'crrGroup',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvColSet', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'EDC.store.EdcViewColSetListOut.ColSetList',
			params : {
				procstep : '3',
				lotOrResFlag : 'R',
				nextColSetId : ''
			},
			popupConfig : {
				title : T('Caption.Other.Col Set ID'),
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
				maxLength : 25,
				enforceMaxLength : true,
				flex : 1
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

		SmartFactory.codeview.register('SvToolByMFO', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'WIP.store.WipViewToolListByMfoOut.toolList',
			popupConfig : {
				title : T('Caption.Other.Tool'),
				columns : [ {
					header : T('Caption.Other.Tool ID'),
					dataIndex : 'toolId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'toolDesc',
					flex : 2
				}, {
					header : T('Caption.Other.Resource'),
					dataIndex : 'resId',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'toolId',
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

		SmartFactory.codeview.register('SvSubresEvent', {
			type : 'service',
			store : 'RAS.store.RasViewSubReseventListOut.EventList',

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
				maxLength : 12,
				enforceMaxLength : true,
				flex : 1
			} ]
		});
		
		SmartFactory.codeview.register('SvServiceName', {
			type : 'service',
			store : 'SVM.store.SvmViewServiceListOut.serviceList',

			popupConfig : {
				title : T('Caption.Other.Service Name'),
				columns : [ {
					header : T('Caption.Other.Service Name'),
					dataIndex : 'serviceName',
					flex : 1
				} ]
			},
			paramsScope : this,
			fields : [ {
				column : 'serviceName',
				maxLength : 100,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvResourceEvent', {
			type : 'service',
			store : 'RAS.store.RasViewReseventListOut.eventList',

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
			fields : [ {
				column : 'eventId',
				maxLength : 10,
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

		SmartFactory.codeview.register('SvCharacter', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'EDC.store.EdcViewCharacterListOut.charList',
			params : {
				procstep : '1'
			},
			popupConfig : {
				title : T('Caption.Other.Character ID'),
				columns : [ {
					header : T('Caption.Other.Character ID'),
					dataIndex : 'charId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'charDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'charId',
				maxLength : 25,
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
		

		SmartFactory.codeview.register('SvOperation', {
			type : 'service',
			store : 'WIP.store.WipViewOperationListOut.list',
			params : {
				procstep : '1',
				filter : '',
				matId : '',
				matVer : '',
				flow : '',
				secChkFlag : ' ' // false
			},
			popupConfig : {
				title : T('Caption.Other.Operation'),
				columns : [ {
					header : T('Caption.Other.Operation'),
					dataIndex : 'oper',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'operDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'oper',
				vtype : 'nospace',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
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

		SmartFactory.codeview.register('SvResource', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewResourceListOut.resList',
			params : {
				procstep : 1
			},
			// params : {procstep : 2} mat 정보로 검색시사용
			popupConfig : {
				title : T('Caption.Other.Resource'),
				columns : [ {
					header : T('Caption.Other.Resource'),
					dataIndex : 'resId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'resDesc',
					flex : 2
				}, {
					hidden : true,
					dataIndex : 'deleteFlag'
				} ]
			},
			fields : [ {
				column : 'resId',
				enforceMaxLength : true,
				maxLength : 20,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvPort', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewPortListOut.portList',
			params : {
				procstep : '1',
				resId : '',
				subresId : ''
			},
			popupConfig : {
				title : T('Caption.Other.Port'),
				columns : [ {
					header : T('Caption.Other.Port ID'),
					dataIndex : 'portId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'portDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'portId',
				enforceMaxLength : true,
				maxLength : 10,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvCarrier', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'RAS.store.RasViewCarrierListOut.crrList',
			params : {
				procstep : '1'
			},
			popupConfig : {
				title : T('Caption.Other.Carrier ID'),
				columns : [ {
					header : T('Caption.Other.Carrier ID'),
					dataIndex : 'crrId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'crrDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'crrId',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvStep', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'WIP.store.WipViewStepListOut.List',

			popupConfig : {
				title : T('Caption.Other.Step'),
				columns : [ {
					header : T('Caption.Other.Step'),
					dataIndex : 'step',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'stepDesc',
					flex : 1
				} ]
			},
			fields : [ {
				column : 'step',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvOption', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'WIP.store.WipViewMfoOptionPromptListOut.list',
			params : {
				procstep : '1'
			},
			popupConfig : {
				title : T('Caption.Other.Flow'),
				columns : [ {
					header : T('Caption.Other.Option Name'),
					dataIndex : 'optionName',
					flex : 2
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'optionDesc',
					flex : 1
				} ]
			},
			fields : [ {
				column : 'optionName',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvAttributeName', {
			type : 'service',
			store : 'BAS.store.BasViewAttributeNameListOut.NameList',
			popupConfig : {
				title : T('Caption.Other.Attribute Name'),
				columns : [ {
					header : T('Caption.Other.Attribute Name'),
					dataIndex : 'attrName',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'attrDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'attrName',
				maxLength : 100,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvReworkFlow', {
			type : 'service',
			store : 'RAS.store.WipViewReworkFlowListOut.List',
			popupConfig : {
				title : T('Caption.Other.Rework Flow'),
				columns : [ {
					header : T('Caption.Other.Rework Flow'),
					dataIndex : 'rwkFlow',
					flex : 2
				}, {
					header : T('Caption.Other.Rework Flow Seq'),
					dataIndex : 'rwkFlowSeqNum',
					flex : 1
				} ]
			},
			fields : [ {
				column : 'rwkFlow',
				flex : 2,
				maxLength : 20,
				enforceMaxLength : true,
				vtype : 'nospace'
			}, {
				column : 'rwkFlowSeqNum',
				flex : 1,
				maxLength : 2,
				enforceMaxLength : true,
				vtype : 'numbers'
			} ]
		});

		SmartFactory.codeview.register('SvReworkOperation', {
			type : 'service',
			store : 'WIP.store.WipViewReworkOperListOut.List',
			popupConfig : {
				title : T('Caption.Other.Rework Operation'),
				columns : [ {
					header : T('Caption.Other.Rework Operation'),
					dataIndex : 'rwkOper',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'rwkOperDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'rwkOper',
				vtype : 'nospace',
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvShipFactory', {
			type : 'service',
			params : {
				procstep : '1'
			},
			store : 'WIP.store.WipViewShipFactoryListOut.List',
			popupConfig : {
				title : T('Caption.Other.Ship Factory'),
				columns : [ {
					header : T('Caption.Other.Factory'),
					dataIndex : 'factoryTo',
					flex : 1
				}, {
					header : T('Caption.Other.Operation'),
					dataIndex : 'transitOper',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'factoryTo',
				maxLength : 10,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvTransferFactory', {
			type : 'service',
			store : 'WIP.store.WipViewMfoOptionValueOut.ValueList',
			popupConfig : {
				title : T('Caption.Other.Transfer Factory'),
				columns : [ {
					header : T('Caption.Other.Factory'),
					dataIndex : 'data1',
					flex : 1
				}, {
					header : T('Caption.Other.Flow'),
					dataIndex : 'data2',
					flex : 1
				}, {
					header : T('Caption.Other.Oper'),
					dataIndex : 'data3',
					flex : 1
				}, {
					header : T('Caption.Other.Override Flag'),
					dataIndex : 'key2',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'data1',
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvChartId', {
			type : 'service',
			store : 'SPC.store.SpcViewChartListOut.chartList',
			popupConfig : {
				title : T('Caption.Other.Chart ID'),
				columns : [ {
					header : T('Caption.Other.Chart ID'),
					dataIndex : 'chartId',
					flex : 1
				}, {
					header : T('Caption.Other.Graph Type'),
					dataIndex : 'graphType',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'chartDesc',
					flex : 1
				} ]
			},

			fields : [ {
				column : 'chartId',
				maxLength : 30,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvChartSetId', {
			type : 'service',
			store : 'SPC.store.SpcViewChartSetListOut.chartsetList',
			popupConfig : {
				title : T('Caption.Other.Chart Set ID'),
				columns : [ {
					header : T('Caption.Other.Chart Set ID'),
					dataIndex : 'chartSetId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'chartSetDesc',
					flex : 2
				} ]
			},

			fields : [ {
				column : 'chartSetId',
				maxLength : 30,
				enforceMaxLength : true,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvPrivilegeGroupUser', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'SEC.store.SecViewPrivilegeGroupUserListOut.list',
			params : {
				procstep : '1',
				nextPrvGrpId : ''
			},
			popupConfig : {
				title : T('Caption.Other.User ID'),
				columns : [ {
					header : T('Caption.Other.User ID'),
					dataIndex : 'userId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'userDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'userId',
				enforceMaxLength : true,
				maxLength : 10,
				flex : 1
			} ]
		});

		SmartFactory.codeview.register('SvUserList', {
			type : 'service',
			factory : SmartFactory.login.factory,
			store : 'SEC.store.SecViewUserListOut.List',
			params : {
				procstep : '1'
			},
			popupConfig : {
				title : T('Caption.Other.User ID'),
				columns : [ {
					header : T('Caption.Other.User ID'),
					dataIndex : 'userId',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'userDesc',
					flex : 2
				} ]
			},
			fields : [ {
				column : 'userId',
				enforceMaxLength : true,
				maxLength : 10,
				flex : 1
			} ]
		});
	}
});