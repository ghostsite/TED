/**
 * @class MES.view.form.BaseForm
 * @extends : 'Ext.form.Panel'
 * @author Kyunghyang
 * 
 * 기본 화면을 구성한다. 각 영역별 함수를 정의 하여 사용한다. 각 cfg를 설정하지 않으면 화면에 표시되지 않는다. (단, tab은
 * buildTabs의 배열에 추가하여 사용) ---------------------------------------------- |
 * buildBasicForm 설정영역 | ---------------------------------------------- |
 * buildUserForm 설정영역 | | | ---------------------------------------------- |
 * userTabs 추가영역 | | | ---------------------------------------------- | bottons
 * 영역 | ----------------------------------------------
 * 
 * @example //선언된 폼을 상속받아 사용한다. Ext.define('ExamplePage',{ extend :
 *          'MES.view.common.AbstractEntityForm',
 * 
 * buttonOption : { btnVersionup : true },
 * 
 * initComponent : function() { this.store =
 * Ext.create('WIP.store.MaterialStore'); // callParent()이전에 tab을 등록한다.
 * this.userTabs = [ this.buildGroupSetupTab(this) ]; this.callParent(); },
 * 
 * buildBasicForm : function(main){ return { xtype : 'container', itemId :
 * 'zbasic', layout : { type : 'vbox', align : 'stretch' }, items : [{ xtype :
 * 'textfield', fieldLabel : 'Material', itemId : 'matId' name : 'matId' flex :
 * 1 }, { xtype : 'textfield', fieldLabel : 'Material', itemId : 'matId' name :
 * 'matId' flex : 1 }] }; },
 * 
 * buildUserForm : function(main){ return { xtype : 'grid', title: 'List',
 * store: this.store, columns: [ { header: 'Name', dataIndex: 'name' }, {
 * header: 'Desc', dataIndex: 'desc', flex: 1 } ] }; },
 * 
 * buildGroupSetupTab : function(main) { return { xtype : 'wip_groupsetup',
 * title : 'Group Setup', itemId : 'groupsetup', itemName : main.groupItemName,
 * fieldNamePrefix : main.groupFieldNamePrefix, cmfMaxCnt : 10 }; },
 * //supplement 설정 또는 buildSupplement 에 함수 설정 supplement : { xtype :
 * 'mes_view_supplementgridform', items : [ xtype : 'fieldset', itemId :
 * 'filters', layout : 'anchor', defaults : { labelSeparator : '', anchor :
 * '100%' }, items : [{ xtype : 'textfield', fieldLabel : 'Operation', itemId :
 * 'oper_id', name : 'oper_id', flex : 1, cfgEvent : 'specialkey' }],
 * fiterItemId : ['oper_id'] ] } buildSupplement : function(){ return { xtype :
 * 'mes_supplement' // 설정 추가 } });
 * 
 * @cfg {string} supplement supplement 영역에 표시할 폼을 링크한다.(이미 만들어진 화면을 링시키 사용)
 * @cfg {function} buildSupplement supplement 영역에 표시할 폼을 설정한다.
 * @cfg {function} buildBasicForm 조회조건이나 기본 키가 되는 항목을 설정한다.
 * @cfg {function} buildUserForm 입력 필드 및 grid등의 상세 항목을 표시하기 위한 영역이다.
 * @cfg {array} userTabs 설정한 tab을 배열로 추가하여 설정한다. <tab추가시 설정예시> initComponent()
 *      함수 내에서 선언하며 this.callParent() 전에 선언한다.
 * 
 * initComponent : function() { this.userTabs = [this.buildGeneralTab(this)];
 * this.callParent(); }
 * 
 * @cfg {object} buttonOption mes_trx_buttonsr를 기본으로 상속받아 버튼의 사용유무를 설정한다.
 *      <VersionUp 버튼 사용시 설정 예시> define 선언시 초기 속성으로 정의한다.
 * 
 * buttonOption : { btnVersionup : true }
 */
Ext.define('MES.view.form.BaseForm', {
	extend : 'Ext.form.Panel',

	alternateClassName : 'BaseForm',

	mixins : {
		deeplink : 'mixin.DeepLink'
	},
	
	requires : [ 'mixin.DeepLink', 'CMN.plugin.Supplement' ],

	bodyCls : 'paddingAll10',

	layout : 'anchor',
	
	frame: false,//zhang added 

	defaults : {
		anchor : '100%',
		labelSeparator : ''
	},
	autoScroll : true,

	dockedItems : {
		xtype : 'mes_view_basebuttons',
		itemId : 'basebuttons'
	},

	constructor: function(config) {
		var me = this;
		config = config ||{};
		me.callParent([config]);
	},
	
	initComponent : function() {
		this.plugins = [ Ext.create('CMN.plugin.Supplement'),Ext.create('MES.plugin.WidgetAclPlugin') ];

		if (this.buildSupplement != Ext.emptyFn) {
			this.supplement = this.buildSupplement();
		}
		/* callParent 이전에 버튼 옵션 설정 */
		this.secControlList = this.secControlList||{};
		if (this.buttonsOpt) {
			this.dockedItems.buttonsOpt = Ext.clone(this.buttonsOpt);
			this.dockedItems.ctrlList = this.ctrlList;
			this.dockedItems.secControlList = this.secControlList;
			this.dockedItems.secChecked = this.secChecked;
		} else {
			this.dockedItems.buttonsOpt = {};
		}
		this.callParent();
		
		this.formLoadLock = SF.createLock();
		if (this.buildForm != Ext.emptyFn) {
			var rtn = this.buildForm(this);
			if (rtn) {
				this.add(rtn);
			}
		}
		if (this.buildHiddenForm != Ext.emptyFn)
			this.add(this.buildHiddenForm(this));

		/* form control button 권한 설정 */
		//form에 추가한 버튼 권한 설
		var formButtons = this.query('[xtype=button][disabled=false][userConfig=undefined]');
		if(this.secChecked){
			for(var i in formButtons){
				var itemId = formButtons[i].itemId;
				if(itemId != 'btnCodeView' && this.isControlDisabled(itemId)){
					formButtons[i].setDisabled(true);
				}
			}
		}
		
		SF.cf.getExportForm();
		
		/* form 설정 */
		var form = this.getForm();
		// form reader 설정
		if (this.formReader)
			form.reader = Ext.create('Ext.data.reader.Json', this.formReader);

		// form payload 설정 : load, submit (default : false)
		if (this.payload !== undefined)
			form.payload = this.payload;

		form.trackResetOnLoad = true;

		/* basebuttons 버튼 이벤트 설정 */
		var basebuttons = this.down('#basebuttons');

		// 2012-08-10 basebuttons 이벤트 주석(김진호)
		// MESController에서 이벤트 공통처리로 변경
		if (basebuttons) {
			// basebuttons의 대상 폼 설정
			basebuttons.setClientForm(form);
			basebuttons.setBaseFormPanel(this);
		}

		// TODO : client util 관련 사용제한..
		//this.funcName = this.funcName || this.itemId;

		//this.getSecCmpList(this);
		//this.getSecControl(this);
	},
	isControlDisabled : function(itemId){
		//권한 여부  ture(사용), false(사용금지), null(무시) 
		var disabled = false;
		
		if(itemId && this.secChecked === true){
			if(this.secControlList[itemId] == ''){
				disabled = true;
			}
			else if(this.useBlackList === 'Y' && this.secControlList[itemId] !== 'Y'){
				disabled = true;
			}
		}
		
		return disabled;
	},
	//2012-09-13 App.js에 Ext.ajax 메시지박스 공용처리되서 수정(showSuccessMsg, showFailureMsg)
	_formLoad : function(params, showMsg) {
		var me = this;
		this.onBeforeFormLoad(me, params);
		
		var showSuccessMsg = false;
		var showFailureMsg = true;
		
		if(Ext.typeOf(showMsg) == 'boolean'){
			showSuccessMsg = showMsg;
			showFailureMsg = showMsg;
		}else if(Ext.typeOf(showMsg) == 'object'){
			if(showMsg && showMsg.showSuccessMsg != undefined){
				showSuccessMsg = showMsg.showSuccessMsg;
			}
			if(showMsg && showMsg.showFailureMsg != undefined){
				showFailureMsg = showMsg.showFailureMsg;
			}
		}
		
		this.getForm().load({
			params : params,
			success : this.onAfterFormLoad,
			failure : this.onAfterFormLoad,
			url : this.getLoadUrl(),
			method : this.getLoadMethod(),
			showSuccessMsg : showSuccessMsg,
			showFailureMsg : showFailureMsg,
			scope : this
		});
	},
	
	formLoad : function(params, showMsg) {
		/*
		 * FormLoadLock은 FormLoad를 하기전에 필요한 선행조건을 완료했을 때까지, 폼로드를 지연시키기 위해서 사용된다. 
		 * 예를 들면, 폼을 서버의 정보로 부터 구성해야하는 경우, 폼 구성을 완료할 때까지 폼데이타로드를 지연시키는 것이다.  
		 */
		this.formLoadLock.ready(this._formLoad, this, [params, showMsg]);
	},

	getLoadUrl : function() {
		if (this.formReader)
			return this.formReader.url;
	},

	getLoadMethod : function() {
		if (this.formReader)
			return this.formReader.method || 'GET';
	},

	getButtons : function() {
		return this.down('#basebuttons');
	},

//	getSecCmpList : function(self) {
//		var cmpList = self.query('button');
//		var ctrlCmpList = [];
//		for ( var i in cmpList) {
//			if (cmpList[i].xtype == 'button' && cmpList[i].itemId && cmpList[i].itemId.length > 3 && cmpList[i].itemId.substring(0, 3) == 'btn'
//					&& cmpList[i].itemId != 'btnCodeView') {
//				ctrlCmpList.push(cmpList[i]);
//				cmpList[i].on('enable', function(me) {
//					if (!self.ctrlList)
//						return;
//					if (self.ctrlList[me.itemId] != undefined && self.ctrlList[me.itemId] != 'Y') {
//						me.setDisabled(true);
//					}
//				});
//			}
//		}
//		self.ctrlCmpList = ctrlCmpList;
//	},

//	setSecControl : function(self) {
//		var cmpList = self.ctrlCmpList || [];
//		for ( var i in cmpList) {
//			var itemId = cmpList[i].itemId;
//			if (self.ctrlList[itemId] != undefined && self.ctrlList[itemId] != 'Y') {
//				cmpList[i].setDisabled(true);
//			}
//		}
//	},
//	
//	getSecControl : function(self) {
//		if (!self.funcName)
//			return;
//		var params = {
//			programId : SF.login.programId,
//			funcName : this.funcName
//		};
//		var service = 'secViewFunctionDetail';
//		var successFn = function(self, response) {
//			self.ctrlList = {};
//			if (response.result.success != true)
//				return;
//
//			for ( var i = 1; i <= 10; i++) {
//				var ctlName = response.result['ctlName' + i];
//				if (ctlName)
//					self.ctrlList[ctlName] = response.result['ctlEnFlag' + i] || ''; // 'Y'
//																						// or
//																						// other
//			}
//			self.setSecControl(self);
//		};
//		
//		Ext.Ajax.request({
//			showFailureMsg : false,
//			url : 'service/' + service + '.json',
//			method : 'GET',
//			params : params,
//			success : function(response, opts) {
//				var result = Ext.JSON.decode(response.responseText);
//				response.result = result || {};
//				response.params = response.request.options.params || {};
//
//				if (result.success !== true && result.msgcode != 'SEC-0008') {
//					SF.msgRtn('failure', result);
//				}
//				
//				if (Ext.typeOf(successFn) == 'function')
//					successFn(self, response);
//			},
//			scope : self
//		});
//	},
	
	getFormLoadLock : function() {
		return this.formLoadLock;
	},

	/* before params : form, addParams, url */
	onBeforeFormLoad : Ext.emptyFn,
	onBeforeCreate : Ext.emptyFn,
	onBeforeUpdate : Ext.emptyFn,
	onBeforeDelete : Ext.emptyFn,
	onBeforeUndelete : Ext.emptyFn,
	onBeforeVersionUp : Ext.emptyFn,
	onBeforeProcess : Ext.emptyFn,
	onBeforeRelease : Ext.emptyFn,
	onBeforeClose : Ext.emptyFn,
	onBeforeExport : Ext.emptyFn,

	/* after params : form, action, success */
	onAfterFormLoad : Ext.emptyFn,
	onAfterCreate : Ext.emptyFn,
	onAfterUpdate : Ext.emptyFn,
	onAfterDelete : Ext.emptyFn,
	onAfterUndelete : Ext.emptyFn,
	onAfterVersionUp : Ext.emptyFn,
	onAfterView : Ext.emptyFn,
	onAfterProcess : Ext.emptyFn,
	onAfterRelease : Ext.emptyFn,
	onAfterRefresh : Ext.emptyFn,

	// onAfterClose로 정의하지않는다.(이유 : BaseFormComposite에서 override해서 사용중)
	onClose : function() {
		this.close();
	},

	/* 이벤트 버튼 실행전 필드 검사 */
	checkCondition : Ext.emptyFn,

	buildSupplement : Ext.emptyFn,
	buildForm : Ext.emptyFn,
	buildHiddenForm : Ext.emptyFn
});