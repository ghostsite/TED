/**
 * @class MES.view.form.CodeViewField **xtype : codeview ** GCM 및 특정 Table의
 *        코드검색을 위한 필드이다. 필드의 버튼을 클릭 하면 해당 정보를 팝업으로 표시하며 팝업의 code를 선택하면 필드에 값이
 *        적용된다. 또는 필드에 값을 입력 후 코드버튼을 클릭하면 입력한 검색어와 관련된 code를 팝업에 표시한다.
 * 
 * 코드뷰필드를 선언하기 전에 SmartFactory.codeview.register(코드뷰명,{각 속성 정의})을 선언하여 codeview의
 * 기본정보를 등록한다. 자주 사용하는 codeview는 각 모듈의 컨트롤러 onViewportRendered에 선언하여 사용한다.
 * **NOTE** SmartFactory.codeview.register() 필수 선언 항목 - gcmdefuse : true/false
 * 조회시 GCM에 선언되 칼럼명의 사용여무를 정의한다. default : true - viewType : 'gcm/table' 조회시 GCM
 * Table인지 특정 Table 조회인지를 설정한다.
 * 
 * 특정 Table의 코드뷰에 대한 예제이다.(등록시 title, table,selects, columns를 선언하였더라도 field선언시
 * 재선언하여 사용할 수 있다)
 * @example Ext.define('CodeViewTest',{ extend : 'Ext.panel.Panel', title :
 *          'Code View Test', initComponent : function() { this.callParent();
 * 
 * SmartFactory.codeview.register('Material', { viewType : 'table', title :
 * 'Select Material', selects : [ 'FACTORY', 'MAT_ID', 'MAT_VER', 'MAT_DESC' ],
 * table : 'MWIPMATDEF', columns : [ { header : 'Material', dataIndex :
 * 'MAT_ID', flex : 2 }, { header : 'Version', dataIndex : 'MAT_VER', flex : 1 }, {
 * header : T('Caption.Other.Description'), dataIndex : 'MAT_DESC', flex : 3 } ] }); }, items : [{
 * xtype : 'codeview', codeviewName : 'Material', bInitFilter: true, name :
 * 'MAT_ID', fieldLabel : 'Product ID', txtFieldName : [ 'MAT_ID', 'MAT_VER' ],
 * txtFieldFlex : [2,1], condition : [ { name : 'factory', value :
 * SmartFactory.login.factory } ] } ], renderTo : Ext.getBody() });
 * 
 * GCM Table의 코드뷰에 대한 예제이다.(등록시 title, table,selects, columns를 선언하였더라도 field선언시
 * 재선언하여 사용할 수 있다)
 * @example Ext.define('CodeViewTest',{ extend : 'Ext.panel.Panel', title :
 *          'Code View Test', initComponent : function() { this.callParent();
 * 
 * SmartFactory.codeview.register('MaterialType', { viewType : 'gcm', title :
 * 'Select Material Type', selects : [ 'FACTORY', 'GROUP_NAME', 'MODEL_DESC_S' ]
 * table : 'MATERIAL_GRP_2', //GCM의 Table 컬럼에 정의되어있는 Table명 columns : [ { header :
 * 'Material Type', dataIndex : 'GROUP_NAME', flex : 2 }, { header :
 * T('Caption.Other.Description'), dataIndex : 'MODEL_DESC_S', flex : 3 } ] }); }, items : [{
 * xtype : 'codeview', codeviewName : 'MaterialType', fieldLabel : 'MATERIAL
 * TYPE', txtFieldName : ['GROUP_NAME'], name : 'TEST_ID' }], renderTo :
 * Ext.getBody() });
 * 
 * GCM Table의 코드뷰에 대한 상세설정 예제이다. GCM Table 코드뷰는 register한번 등록된 coview를 여러 필드에서
 * 속성을 재선언하여 사용할 수 있다.
 * 
 * @example Ext.define('CodeViewTest',{ extend : 'Ext.panel.Panel', title :
 *          'Code View Test', initComponent : function() { this.callParent();
 * 
 * SmartFactory.codeview.register('gcmcodeview', { viewType : 'gcm' }); },
 * items : [{ xtype : 'codeview', codeviewName : 'gcmcodeview', title : 'Select
 * Material Type', selects : [ 'FACTORY', 'GROUP_NAME', 'MODEL_DESC_S' ] table :
 * 'MATERIAL_GRP_2', fieldLabel : 'MATERIAL TYPE', txtFieldName :
 * ['GROUP_NAME'], columns : [ { header : 'Material Type', dataIndex :
 * 'GROUP_NAME', flex : 2 }, { header : T('Caption.Other.Description'), dataIndex :
 * 'MODEL_DESC_S', flex : 3 } ], name : 'TEST_ID' },{ xtype : 'codeview',
 * codeviewName : 'gcmcodeview', title : 'Abnarmal Type', selects : [ 'FACTORY',
 * 'ABNO_CODE', 'DESC' ] table : 'ABNORMAL', fieldLabel : 'ABNORMAL',
 * txtFieldName : ['ABNORMAL'], columns : [ { header : 'ABNORMAL', dataIndex :
 * 'ABNO_CODE', flex : 2 }, { header : T('Caption.Other.Description'), dataIndex : 'DESC', flex :
 * 3 } ], name : 'ABNO_CODE'}], renderTo : Ext.getBody() });
 * 
 * GCM Table의 코드뷰에 대한 기본설정 예제이다.
 * 
 * @example Ext.define('CodeViewTest',{ extend : 'Ext.panel.Panel', title :
 *          'Code View Test', items : [{ xtype : 'codeview', codeviewName :
 *          'BaseCodeView', title : 'Select Test ID', table : 'TESTTABLE',
 *          fieldLabel : 'TEST ID', name : 'TEST_ID' } ], renderTo :
 *          Ext.getBody() });
 * @extends Ext.form.FieldContainer
 * @author Kyunghyang
 * 
 * @cfg {String} xtype 'codeview' items 속성 값으로 xtype : 'codeview'를 선언하여 사용한다.
 * @cfg {String} codeviewName SmartFactory.codeview.register등록시 선언명을 설정한다. 등록된
 *      codeview중 선언된 명으로 검색하여 설정값을 적용한다. //*
 * @cfg {Boolean} bInitFilter 필드의 값을 코드뷰의 조회조건 포함여부를 설정한다. default : true
 * @cfg {String} fieldLabel 화면에 표시되는 field의 라벨을 설정한다.
 * @cfg {String[]} txtFieldName 화면에 표시되는 field의 이름을 설정한다. 중복 선언이 제한되며 값에 대한 이벤트
 *      적용시 사용된다.
 * @cfg {Number[]} txtFieldFlex 화면에 표시되는 field가 차지하는 너비의 비율을 설정한다. field가 하나일
 *      경우는 [1]이 적용된다. default : [1]
 * @cfg {String} name codeview field의 이름을 설정한다. 조회이벤트시 사용되며 중복선언이 제한된다.
 * @cfg {String} table (override) 조회시 필요한 테이블명을 설정한다. codeview 등록 또는 field 선언시
 *      필수항목이다.
 * @cfg {String} title (override) codeview팝업의 제목을 설정한다. default : 'Code Select'
 * @cfg {String[]} selects (override) 조회시 필요한 컬럼명을 설정한다. default :
 *      ['KEY_1','DATA_1']
 * @cfg {Object[]} columns (override) 팝업의 grid의 컬럼속성을 설정한다. default : [{header :
 *      'ITEM',dataIndex : 'KEY_1',flex : 2}, {header : 'DESC',dataIndex :
 *      'DATA_1',flex : 3} ],
 * @cfg {String} refGcmCol 코드검색시 다른 필드의 값을 조회 조건에 추가하고자 할때 해당 컬럼명을 설정한다.
 * @cfg {String} refField 코드검색시 다른 필드의 값을 조회 조건에 추가하고자 할때 해당 필드의 name을 설정한다.
 * @cfg {Object[]} condition 코드뷰의 조회조건에 추가로 포함할 조건정보를 설정한다.
 */
Ext.define('MES.view.form.field.MultiCodeViewField', {
	extend : 'Ext.form.FieldContainer',

	alias : 'widget.multicodeview',

	componentCls : 'codeView',

	layout : {
		type : 'hbox',
		align : 'top'
	},
	defaults : {
		margins : '0 3 0 0'
	},
	labelWidth : 100,
	fieldWidth : 150,
	width : this.labelWidth+this.fieldWidth+5,
	separator : ',',
	constructor : function(config) {
		var configs = config || {};
		this.callParent([ configs ]);
	},

	initComponent : function() {
		this.width = this.width||(this.labelWidth + this.fieldWidth +5);
		this.callParent();
		
		var self = this;
		
		if(this.alignIcon){
			if(this.alignIcon == 'left'){
				this.add(this.buildSerach());
				this.add(this.buildTxtfield());
			}
			else if(Ext.typeOf(this.alignIcon) == 'number' && this.alignIcon > 0){
				this.add(this.buildTxtfield(this.alignIcon));
			}
		}
		else{
			this.add(this.buildTxtfield());
			this.add(this.buildSerach());
		}
		
		this.addEvents(
				/**
				 * EVENT : 'clickicon' 
				 * 필드의 팝업아이콘 클릭시 이벤트 처리
				 *  - fieldSet : {object}FieldContainer (코드뷰 전체)
				 */
				'clickicon',
				
				/**
				 * EVENT : 'select' 
				 * 팝업의 값 선택시 이벤트 처리
				 *  - record : {object} 선택된 grid의 record
				 */
				'select',
				
				/**
				 * EVENT : 'change' 
				 * 값 선택및 setValue로 인한 값 변경시 이벤트 처리
				 *  - fieldSet : {object}FieldContainer (코드뷰 전체)
				 *  - newValue[n...] : {array} 새로 입력된 값들 ( 필드 수만큼 배열로 반환)
				 *  - oldValue[n...] : {array} 이전값들 (필드 수만큼 배열로 반환)
				 *  - opt : {string} 'selected'(코드뷰팝업의 list선택시)/'setvalue'(setValue함수로 값변경시)
				 */
				'change',
				
				/**
				 * EVENT : 'chagnetext'
				 * 코드뷰 내 필드에서 값 변경시 이벤트 처리
				 *  - textfield : {object} textField (필드)
				 *  - newValue : 새로 입력된 값
				 *  - oldValue : 이전값
				 *  - opt(index) : {number} 필드의 순번 
				 */
				'changetext',
				
				/**
				 * EVENT : 'specialkey'
				 * 코드뷰 내 필드에서 Enter 키 입력시 이벤트 처리  
				 * 기본 Enter 키입력시 팝업창이 보여지며 diabledEnter 속성정보가 true일 경우만 발생함 
				 *  - fieldSet : {object}FieldContainer (코드뷰 전체)
				 *  - e : key정보
				 */
				'specialkey',
				
				/**
				 * EVENT : 'disabledicon'
				 * 코드뷰 버튼아이콘 활성화/비활성화 이벤트 처리
				 *  - state : {boolean} true/false
				 */
				'disabledicon',
				
				/**
				 * EVENT : 'disabledfield'
				 * 코드뷰 내의 필드를 활성화/비활성화 이벤트 처리
				 * 단, 코브뷰 전체가 활성화일 경우에 발생함.
				 *  - state : {boolean} true/false
				 *  - index : {number} 필드순번
				 */
				'disabledfield'
				);
		
		this.on('disable',function(){
			self.sub('btnCodeView').setDisabled(true);
		});
		this.on('enable',function(){
			self.sub('btnCodeView').setDisabled(false);
		});
		this.on('show',function(){
			self.sub('btnCodeView').setVisible(true);
		});
		this.on('hide',function(){
			self.sub('btnCodeView').setVisible(false);
		});
		this.on('disabledicon',function(state){
			self.sub('btnCodeView').setDisabled(state);
		});
		this.on('disabledfield',function(state,index){
			var field = self.getField(index);
			if(field)
				field.setDisabled(state);
		});
	},
	
	/*fieldcontatiner setDisabled 재정의함수임*/
	setDisabled : function(disabled, opt) {
		/* opt가 없으면 코드뷰 전체 비/활성화*/
		if(opt == null){
			return this[disabled ? 'disable': 'enable']();
		}
		/* 코드뷰 전체가 활성화일 경우 이벤트 실행 제한 */
		else if(this.isDisabled() == true){
			return false;
		}
		/* 코드뷰 아이콘버튼만 비/활성화 (단, 코드뷰 전체가 활성화일경우에만 변경 가능)	 */
		else if(opt == 'icon'){
			this.fireEvent('disabledicon', disabled);
		}
		/* 코드뷰 특정 필드 비/활성화 (단, 코드뷰 전체가 활성화일경우에만 변경 가능) */
		else if(Ext.typeOf(opt) =='number' && opt < this.fields.length && opt > -1){
			this.fireEvent('disabledfield', disabled, opt);
		}
		else{
			Ext.log('error(setDisabled) : [opt]' );
		}
    },
	setReadOnly : function(readOnly, opt){
		/* opt가 없으면 코드뷰 전체 비/활성화*/
		if(!opt){
			for(var i in this.fields){
				var cmp = this.sub(this.fields[i].itemId);
				if(cmp.setReadOnly){
					cmp.setReadOnly(readOnly);
				}
			}
			this.fireEvent('disabledicon', readOnly);
		}
		else{
			if(opt == 'icon'){
				this.fireEvent('disabledicon', readOnly);
			}
			else if(Ext.typeOf(opt) =='number' && opt < this.fields.length && opt > -1){
				var cmp = this.sub(this.fields[opt].itemId);
				if(cmp && cmp.setReadOnly){
					cmp.setReadOnly(readOnly);
				}
			}
		}
	},

	/* field를 정의한다. */
	buildTxtfield : function(alignIcon) {
		var codeviewOpts = SF.codeview.get(this.codeviewName)||{};
		var submitValue = this.submitValue == false?false:true;
		var fieldCount = this.fieldCount||1; 
		var fields = Ext.clone(this.fields||codeviewOpts.fields || []);
		
		var field = Ext.clone(fields[0]||{});
		
		var name = [], value = [];
		
		if(this.name != undefined){
			if(Ext.typeOf(this.name) == 'string'){
				name = [this.name];
			}
			else if(Ext.typeOf(this.name) == 'array'){
				name = Ext.clone(this.name);
			}
		}	
		
		if(this.value != undefined){
			if(Ext.typeOf(this.value) == 'string'){
				value = [this.value];
			}
			else if(Ext.typeOf(this.value) == 'array'){
				value = Ext.clone(this.value);
			}
		}	
		
		if(fields.length == 0){
			var popupConfig = this.popupConfig || {};
			Ext.applyIf(popupConfig,codeviewOpts.popupConfig);
			if(popupConfig.columns) {
				var dataIndex = popupConfig.columns[0].dataIndex;
				field = {
					column : dataIndex,
					flex : 1
				};
			}
		}
		var items = [];
		var index = 0;
		field.vtype = '';
		Ext.applyIf(field,{
			xtype : 'textfield',
			listeners : {
				specialkey : function(textfield, e) {
					var fieldset = textfield.up('fieldcontainer');
					/* 필드에 키입력시 이벤트 발생 */
					fieldset.fireEvent('specialkey', textfield, e );	
					if (e.getKey() != e.ENTER)							
						return;
					if(textfield.disabledEnter !== true){
						SF.codeview.show(fieldset, 'multi');	
					}
				},
				change : function(textfield,newValue,oldValue, opt){
					var fieldset = textfield.up('fieldcontainer');
					/*필드값이 변경될 경우 changetext 이벤트 발생*/
					fieldset.fireEvent('changetext', textfield, newValue, oldValue, textfield.fieldIndex);	
				}
			},
			flex : 1
		});

		for(var i =0 ; i < fieldCount; i++){
			if(alignIcon == i){
				index++;
				items[i] =  this.buildSerach();
			}
			items[index] = Ext.clone(field);
			items[index].itemId = this.itemId+'_'+i;
			items[index].fieldIndex = i;
			if(field.width){
				delete items[index].flex;
			}
			if(name[i]||name[0])
				items[index].name = name[i]||name[0];
			if(value[i])
				items[index].value = value[i];
			
			if(this.submitValue != undefined && items[index].submitValue == undefined)
				items[index].submitValue = submitValue;
			if(this.disabledEnter != undefined && items[index].disabledEnter == undefined)
				items[index].disabledEnter = this.disabledEnter;
			if(this.readOnly != undefined && items[index].readOnly == undefined)
				items[index].readOnly = this.readOnly;
			if(this.allowBlank != undefined && items[index].allowBlank == undefined)
				items[index].allowBlank = this.allowBlank;
			if(this.blankText != undefined && items[index].blankText == undefined)
				items[index].blankText = this.blankText;
			index++;
		}
		this.fields = fields;

		if(alignIcon > items.length){
			items.push(this.buildSerach());
		}
		
		return items;
	},

	/* [...]버튼을 정의하고 클릭시 코브뷰 팝업을 호출한다. */
	buildSerach : function() {
		var disabled = this.disabledIcon||this.disabled||false;
		var hiddenIcon = this.hiddenIcon||this.hidden||false;
		return {
			xtype : 'button',
			itemId : 'btnCodeView',
			iconCls : 'btnCodeView',
			disabled : disabled,
			hidden : hiddenIcon,
			handler : function() {
				var fieldset = this.up('fieldcontainer');
				SF.codeview.show(fieldset, 'multi');	
				fieldset.fireEvent('clickicon',fieldset);
			}
		};
	},

	/* 코드뷰에서 선택시 해당 코드값을 필드에 표시한다. */
	selectedCallback : function(fieldset, records) {
		var separator = fieldset.separator;
		var field = fieldset.getComponent( fieldset.itemId+'_0');
		var oldVal = field.getValue();
		var newVal = '';
		var values = [];
		for(var i  in records){
			if(records[i]){
				values.push(records[i].get(field.column));
			}
		}
		newVal = values.join(separator);
		if (oldVal !=newVal) {
			field.setValue(newVal);
			fieldset.fireEvent('change', fieldset, newVal, oldVal, 'selected' );
		}
		fieldset.fireEvent('select', records);
	},
	
	getField : function(index){
		var i = index||0;
		
		var fieldId = this.itemId+'_'+i;
		var field = this.getComponent(fieldId);
		return field;
	},
	
	setValue : function(newVal) {
		var fieldId = this.itemId+'_0';
		var field = this.getComponent(fieldId);
		var oldVal = field.getValue();
		if(oldVal !== newVal){
			field.setRawValue(newVal);	
			this.fireEvent('change', this, newVal, oldVal, 'setvalue');
		}
	},

	getValue : function() {
		var fieldId = this.itemId+'_0';
		var value = this.sub(fieldId).getValue();
		return value;
	},

	getSubmitValue : function() {
		var fieldId = this.itemId+'_0';
		var submitValue = this.getComponent(fieldId).getSubmitValue();
		return submitValue;
	},
	
	isValid : function() {
		var field = this.getComponent(this.itemId+'_0');
		return field.isValid();
	}
});

