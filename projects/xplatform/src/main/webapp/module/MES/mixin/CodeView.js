/**
 * @class MES.mixin.CodeView
 * 코드뷰 팝업의 설정정보를 관리한다.
 * CodeViewfield 정의시 호출되며, 코드뷰버튼을 클릭하면 설정된 정보로 팝업을 생성하여 화면에 표시한다.
 * 자주 사용하는 codeview는 각 모듈의 컨트롤러 onViewportRendered에 선언하여 사용한다.
 * 
 *   @example
 *   //SmartFactory.codeview.register(코드뷰명,{각 속성 정의})
 *   //SmartFactory.codeview.show(코드뷰명, conditions, callback, client);
 *   //SmartFactory.codeview.get(코드뷰명)
 *   SmartFactory.codeview.register('MaterialType', {
 *		viewType : 'gcm', 
 *		title : 'Select Material Type',
 *		selects : [ 'FACTORY', 'GROUP_NAME', 'MODEL_DESC_S' ]
 *		table : 'MATERIAL_GRP_2', //GCM의 Table 컬럼에 정의되어있는 Table명
 *		columns : [ {
 *			header : 'Material Type',
 *			dataIndex : 'GROUP_NAME',
 *			flex : 2
 *		}, {
 *			header : T('Caption.Other.Description'),
 *			dataIndex : 'MODEL_DESC_S',
 *			flex : 3
 *		} ],
 *	 });
 *
 *
 * @cfg show 코드뷰 팝업을 표시한다.
 * @cfg register 코드뷰설정정보를 등록한다.
 * @cfg get 등록된 설정정보를 가져온다.
 * 
 * @author Kyunghyang
 */
Ext.define('MES.mixin.CodeView', function() {
	var registry = {};

	Ext.applyIf(registry, {
		'GCM' : {
			name : 'GCM',
			type : 'gcm',
			
			popupConfig : {
				title : T('Caption.Other.CodeView'),
				columns : [{
					header : T('Caption.Other.Name'),
					dataIndex : 'key1',
					flex : 1
				},{
					header : T('Caption.Other.Desc'),
					dataIndex : 'data1',
					flex : 2
				}]
			},
			fieldSearch : false,
			fields : [{
				column : 'key1',
				maxLength : 30,
				enforceMaxLength : true,
				flex : 1
			}]
		},
		'TABLE' : {
			name : 'TABLE',
			type : 'table',
			
			popupConfig : {
				title : T('Caption.Other.CodeView')	
			},
			fieldSearch : false			
		},
		'SERVICE' : {
			name : 'SERVICE',
			type : 'service',
			
			popupConfig : {
				title : T('Caption.Other.CodeView')
			},
			fieldSearch : false
		},
		'SQLQUERY' : {
			name : 'SQLQUERY',
			type : 'sqlquery',
			store : 'BAS.store.BasSqlQueryOut',
			popupConfig : {
				title : T('Caption.Other.CodeView')
			}
			//fieldSearch : true
		}
	});

	return {
		codeview : {
			show : function(fieldset, opt) {
				/*
				 * codeviewName, condition, selectedCallback are mandatory parameters
				 */
				var codeviewOpts = {}; //get codeview
				var codeviewReg = SmartFactory.codeview.get(fieldset.codeviewName);
				Ext.apply(codeviewOpts,fieldset);
				Ext.applyIf(codeviewOpts,codeviewReg);
				codeviewOpts.callback = fieldset.selectedCallback; //지정한 callback 함수
				codeviewOpts.fieldset = fieldset;
	
				if(codeviewOpts.popupConfig == undefined)
					throw new Error('codeviewOpts[popupConfig] should be configured.');
				
				var popupConfig = Ext.applyIf(codeviewOpts.popupConfig,codeviewReg.popupConfig);

				if (popupConfig.headers && popupConfig.headers.length>0){
					if(popupConfig.columns == undefined || popupConfig.keyCnt > 1){
						var cols = [];
						var keyMax = popupConfig.keyCnt || 1;
						for(var i = 0 ; i < popupConfig.headers.length ; i++){
							cols[i] = {
								header : popupConfig.headers[i],
								flex : 1
							};
							if(i<keyMax)
								cols[i].dataIndex = 'key'+(i+1);
							else
								cols[i].dataIndex = 'data'+(i+1-keyMax);
						}
						codeviewOpts.popupConfig.columns = cols;
					}
					else{
						for(var i in popupConfig.columns){
							var header = popupConfig.headers[i]||popupConfig.columns[i].header;
							popupConfig.columns[i].header = header;
						}
						codeviewOpts.popupConfig.columns = popupConfig.columns;
					}
				}
				if (fieldset.condition == undefined){
					codeviewOpts.condition = codeviewOpts.condition||[];
				}
				else{
					var conditions = Ext.clone(fieldset.condition);
					
					if(fieldset.condition.length>0){
						for(var i in fieldset.condition){
							var scope = fieldset.condition[i].scope || fieldset.scope || fieldset;
							if(Ext.typeOf(fieldset.condition[i].value) == 'function'){
								conditions[i].value = fieldset.condition[i].value(scope);
								if(conditions[i].value === false)
									return;
							}
							delete conditions[i].scope;
						}
					}
					codeviewOpts.condition = conditions;
				}
				
				for(var i in codeviewOpts.condition){
					delete codeviewOpts.condition[i].scope;
				}
				if(Ext.typeOf(fieldset.table) == 'function'){
					var scope = fieldset.tableScope || fieldset.scope || fieldset;
					var table = fieldset.table(scope, fieldset);
					if(table === false)
						return;
					codeviewOpts.table = table;
				}
				if(Ext.typeOf(fieldset.params) == 'function' ){
					var scope = fieldset.paramsScope || fieldset.scope || fieldset;
					var params = fieldset.params(scope, fieldset);
					if(params === false)
						return;
					codeviewOpts.params = params;
					codeviewOpts.store = fieldset.store || codeviewOpts.store || '';
				}
				
				if(opt === 'combo'){
					var comboConfig = codeviewOpts.comboConfig || {};
					
					comboConfig.displayField = comboConfig.displayField || codeviewOpts.displayField || 'key1';
					comboConfig.valueField = comboConfig.valueField || codeviewOpts.valueField || comboConfig.displayField;
					comboConfig.listTpl = comboConfig.listTpl || codeviewOpts.listTpl || '{'+comboConfig.displayField+'}';
					Ext.apply(codeviewOpts,comboConfig);
					return codeviewOpts;
				}
				if(opt === 'multi'){
					var codeview = Ext.create('MES.view.window.MultiCodeViewPopup', {
						codeviewOpts : codeviewOpts,
						inputValue : fieldset.getComponent(0).getValue()
					});
					codeview.show();
					return codeview;
				}
				//codeviewOpts 생성자로 view.CodeViewPopup 호출
				var codeview = Ext.create('MES.view.window.CodeViewPopup', {
					codeviewOpts : codeviewOpts
				});
				codeview.show();
				return codeview;
			},
			register : function(name, config) {
				if(!config || name == 'GCM' || name == 'TABLE' || name == 'SERVICE')
					return;
				Ext.applyIf(config,{
					name : name,
					type : 'table',
					fieldSearch : false,
					factory : SmartFactory.login.factory
				});
				registry[name] = config;
			},
			get : function(name) {
				name = name || 'GCM';
				return registry[name];
			},
			names : function() {
				var names = [];
				for(var name in registry) {
					names.push(name);
				}
				return names;
			}
		}
	};
}());