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
 */
Ext.define('MES.data.CodeViewRegister', {
	constructor : function() {
		SmartFactory.codeview.register('NoteBook', {
			type : 'gcm',
			table : 'common.Type',
			popupConfig : {
				title : T('Caption.Other.Owner Code'),
				columns : [{
					header : T('Caption.Other.Code'),
					dataIndex : 'code',
					flex : 1
				}, {
					header : T('Caption.Other.Description'),
					dataIndex : 'name',
					flex : 2
				}]
			},
			fields : [{
				column : 'code',
				flex : 1,
				maxLength : 10,
				enforceMaxLength : true
			}]
		});

		SmartFactory.codeview.register('BookType', {
			type : 'table', // pojo name ,from pojo package begin zhang
			table : 'common.Type',
			order : [{
				column : 'code',
				ascending : true
			}],
			condition : [{
				column : 'name',
				value : '散文',
				operator : '!='
			}],
			popupConfig : {
				title : T('Caption.Other.BookType'),
				columns : [{
					header : T('Caption.Other.Code'),
					dataIndex : 'code',
					flex : 1
				}, {
					header : T('Caption.Other.Desc'),
					dataIndex : 'name',
					flex : 2
				}]
			},
			fields : [{
				column : 'code',
				flex : 1,
				enforceMaxLength : true,
				maxLength : 20
			}, {
				column : 'name',
				flex : 1,
				// vtype : 'numbers',
				maxLength : 6,
				enforceMaxLength : true
			}]
		});

		//由于创建的store没有url，故只能再复制url到store
		var provinceStore = Ext.create('SYS.store.Attachment');
		provinceStore.getProxy().url = 'attachment/pagedAllAttachment';
		SmartFactory.codeview.register('Province', {
			type : 'service',
			store : provinceStore, 
			//url: 'attachment/pagedAllAttachment', //必须分页，要求的，在CodeViewPopup.js中。
			params : {
				code : 'beijing'
			},

			popupConfig : {
				title : T('Caption.Other.Province'),
				columns : [{
					header : '文件名',
					dataIndex : 'originName',
					flex : 2
				}, {
					header : '路径',
					dataIndex : 'filePath',
					flex : 1
				}]
				// optFlowFroup,optFlowOptionFlag
			},

			fields : [{
				column : 'originName',
				flex : 2,
				maxLength : 100, // check
				enforceMaxLength : true
				// ,
				// vtype : 'nospace'
			}, {
				column : 'filePath',
				flex : 1,
				maxLength : 6, // check
				enforceMaxLength : true
				// ,
				// vtype : 'numbers'
			}]
		});

		SmartFactory.codeview.register('Company', {
			type : 'sqlquery',
			params : function(me) {
				// var tableName = me.sub('cdvConstant').getValue(0);
				var sql = "SELECT code,name FROM type WHERE parent_id = 10232388 ORDER BY code";
				return {
					query : sql
				};
			},
			paramsScope : this,
			popupConfig : {
				columns : [{
					header : T('Caption.Other.Code'),
					dataIndex : 'code',
					flex : 1
				},{
					header : T('Caption.Other.Name'),
					dataIndex : 'name',
					flex : 1
				}]
			},
			fields : [{
				name : 'code',
				column : 'code',
				allowBlank : false,
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			},{
				name : 'name',
				column : 'name',
				allowBlank : false,
				maxLength : 20,
				enforceMaxLength : true,
				flex : 1
			}]
		});
	}
});