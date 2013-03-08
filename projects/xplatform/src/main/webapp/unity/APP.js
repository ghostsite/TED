/*
Copyright(c) 2012 Miracom, Inc.
*/
/*
 * TODO 이 Mixin은 MES 모듈로 이동하여야 한다.
 */
Ext.define('mixin.Constant', {
	ruleDesc : function(type){
		var desc = '';
		switch(type){
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
		}
		return desc;
	},
	
	MAX_INT : Math.pow(2, 31) - 1, //C# max_int 2147483647이므로 -1
	
	stepCreate : 'I',
	stepUpdate : 'U',
	stepDelete : 'D',
	stepConfirm : 'F',
	stepDeleteForce : 'X',
	stepCopy : 'C',
	stepUndelete : 'R',
	stepApproval : 'A',
	stepRelease : 'E',
	stepCancelApproval : 'P',
	stepScrap : 'S',
	stepReturn : 'N',
	stepRegenerate : 'G',
	stepVersionUp : 'V',
	stepTerminate : 'M',
	stepTran : 'T',
	
	failStatus : '1',
	warnStatus : '2',
	trblStatus : '3',
	successStatus : '0',

	cmf : {
        //CMF
		flow : "CMF_FLOW",
        material : "CMF_MATERIAL",
        operation : "CMF_OPER",
        step : "CMF_STEP",
        character : "CMF_CHARACTER",
        resource : "CMF_RESOURCE",
        colSet : "CMF_COL_SET",
        user : "CMF_USER",
        bomSet : "CMF_BOM_SET",
        recipe : "CMF_RECIPE",
        inspSet : "CMF_INSP_SET",
        chartSet : "CMF_CHART_SET",
        chart : "CMF_CHART",
        
        port : "CMF_PORT",
        carrier : "CMF_CARRIER",
        subresource : "CMF_SUBRESOURCE",
        order : "CMF_ORDER",
        part : "CMF_PART",
        label : "CMF_LABEL",
        queuetime : "CMF_QUEUETIME",
        service : "CMF_SERVICE",
        inputOperValue : "CMF_INPUT_OPER_VALUE",
        sproc : "CMF_SPROC",
        inspItem : "CMF_INSP_ITEM",
        
        lot : "CMF_LOT",
        sublot : "CMF_SUBLOT",
        
        trnAdapt : "CMF_TRN_ADAPT",
        trnBonus : "CMF_TRN_BONUS",
        trnLoss : "CMF_TRN_LOSS",
        trnCreate : "CMF_TRN_CREATE",
        trnStart : "CMF_TRN_START",
        trnEnd : "CMF_TRN_END",
        trnMove : "CMF_TRN_MOVE",
        trnSkip : "CMF_TRN_SKIP",
        trnRework : "CMF_TRN_REWORK",
        trnRepair : "CMF_TRN_REPAIR",
        trnRepairEnd : "CMF_TRN_REPAIR_END",
        trnLocalRepair : "CMF_TRN_LOCAL_REPAIR",
        trnSplit : "CMF_TRN_SPLIT",
        trnCombine : "CMF_TRN_COMBINE",
        trnMerge : "CMF_TRN_MERGE",
        trnHold : "CMF_TRN_HOLD",
        trnRelease : "CMF_TRN_RELEASE",
        trnShip : "CMF_TRN_SHIP",
        trnRecieve : "CMF_TRN_RECEIVE",
        trnAssembly : "CMF_TRN_ASSEMBLY",
        trnDisassemble : "CMF_TRN_DISASSEMBLE",
        trnReplace : "CMF_TRN_REPLACE",
        trnLotedc : "CMF_TRN_LOTEDC",
        trnEvent : "CMF_TRN_EVENT",
        trnTrouble : "CMF_TRN_TROUBLE",
        trnRmaOpen : "CMF_TRN_RMA_OPEN",
        trnRmaClose : "CMF_TRN_RMA_CLOSE",
        trnSort : "CMF_TRN_SORT",
        trnStore : "CMF_TRN_STORE",
        trnUnstore : "CMF_TRN_UNSTORE",
        trnTerminate : "CMF_TRN_TERMINATE",
        trnChangeCmf : "CMF_TRN_CHANGE_CMF",
        trnReserve : "CMF_TRN_RESERVE",
        trnUnreserve : "CMF_TRN_UNRESERVE",
        trnScribe : "CMF_TRN_SCRIBE",
        trnCv : "CMF_TRN_CV",
        trnRegenerate : "CMF_TRN_REGENERATE",
        trnStartStep : "CMF_TRN_START_STEP",
        trnEndStep : "CMF_TRN_END_STEP",

        //change port status
        trnChangePort : "CMF_TRN_CHANGE_PORT",
        trnCollectDft : "CMF_TRN_COLLECT_DFT",
        TrnCleanDft : "CMF_TRN_CLEAN_DFT",
        
        //Inventory CMF
        trnInInv : "CMF_TRN_IN_INV",
        trnOutInv : "CMF_TRN_OUT_INV",
        trnTransInv : "CMF_TRN_TRANS_INV",
        trnConvToLot : "CMF_TRN_CONV_TO_LOT",
        trnConvToInv : "CMF_TRN_CONV_TO_INV",
        trnConsume : "CMF_TRN_CONSUME",
        trnScrap : "CMF_TRN_SCRAP",
        
        trnQcmBatch : "CMF_TRN_QCM_BATCH",
        trnQcmResult : "CMF_TRN_QCM_RESULT",
        trnQcmFinal : "CMF_TRN_QCM_FINAL",
        trnQcmMerge : "CMF_TRN_QCM_MERGE",
        trnQcmSplit : "CMF_TRN_QCM_SPLIT",


        ruleRelation : "CMF_RULE_RELATION",
        ruleSeqKey : "CMF_RULE_SEQ_KEY"
    },
    /* CMF GROUP */
    grp : {
        //Group
        flow : "GRP_FLOW",
        material : "GRP_MATERIAL",
        operation : "GRP_OPER",
        step : "GRP_STEP",        
        character : "GRP_CHARACTER",
        resource : "GRP_RESOURCE",
        colSet : "GRP_COL_SET",
        user : "GRP_USER",
        event : "GRP_EVENT",
        bomSet : "GRP_BOM_SET",
        recipe : "GRP_RECIPE",
        inspSet : "GRP_INSP_SET",
        chart : "GRP_CHART",
        chartSet : "GRP_CHART_SET"
	},
	/*GCM Group Table*/
	gcmGrp : {
		 //System GCM Table
        messageGroup : "MESSAGE_GROUP",
        
      //Flow Group Table 1~10
        flow : "FLOW_GRP_",
      //Material Group Table 1~10
        material : "MATERIAL_GRP_",
      //Operation Group Table 1~10
        operation : "OPER_GRP_",
      //Step Group Table 1~10
        step : "STEP_GRP_",
      //Character Group Table 1~10
        char : "CHAR_GRP_",
      //Resource Group Table 1~10
        resource : "RES_GRP_",
      //Collection Set Group Table 1~10
        colSet : "COL_GRP_",
      //User Group Table 1~10
        user : "USER_GRP_",
      //Event Group Table 1~10
        event : "EVN_GRP_",
      //BOM Set Group Table 1~10
        bomSet : "BOM_GRP_",
        //Recipe Group Table 1~10
        recipe : "RECIPE_GRP_",
        //Inspection Set Group Table 1~10
        inspSet : "INSP_SET_GRP_",
        //SPC Chart Group Table 1~10
        chart : "CHT_GRP_",
        //SPC Chart Group Table 1~10
        chartSet : "CHTSET_GRP_"
	},
	/*TRAN CODE*/
	tranCode : {
		lotEdc : "LOTEDC"
	}
	
});
Ext.define('mixin.ExtOverride', function() {
	Ext.Container.implement({
		sub : function(id) {
			if (!this.subitems)
				this.subitems = {};
			if (!this.subitems[id])
				this.subitems[id] = this.down('[itemId=' + id + ']');
			return this.subitems[id];
		}
	});

	/*
	 Ext.data.store의 load를 override 기존 store load에는 remoteFilter,remoteSort,remoteGroup 항목이 options로 추가되어 있지 않기 때문에 
	 override하여 추가한다.
	 */
	Ext.override(Ext.data.Store, {
		load : function(options) {
			var me = this;

			options = options || {};

			if (Ext.isFunction(options)) {
				options = {
					callback : options
				};
			}
			
			//2012-07-25 김진호
			//serverFilter 추가
			Ext.applyIf(options, {
				groupers : me.groupers.items,
				page : me.currentPage,
				start : (me.currentPage - 1) * me.pageSize,
				limit : me.pageSize,
				addRecords : false,
				remoteFilter : me.remoteFilter,
				remoteSort : me.remoteSort,
				remoteGroup : me.remoteGroup
			});

			return me.callParent([ options ]);
		}
	});

	Ext.override(Ext.form.action.Submit, {
		doSubmit : function() {
			var formEl, ajaxOptions = Ext.apply(this.createCallback(), {
				url : this.getUrl(),
				method : this.getMethod(),
				headers : this.headers
			});

			this.form.payload = this.form.payload || {};

			// For uploads we need to create an actual form that contains the file upload fields,
			// and pass that to the ajax call so it can do its iframe-based submit method.
			if (this.form.hasUpload()) {
				formEl = ajaxOptions.form = this.buildForm();
				ajaxOptions.isUpload = true;
			} else {
				var params = this.getParams();
				Ext.applyIf(params, {
					language : SmartFactory.login.language
				});

				if (this.form.payload.submit != undefined && this.form.payload.submit === true) {
					//payload 방식의 form submit
					ajaxOptions.jsonData = params;
				} else {

					for ( var key in params) {
						if (Ext.typeOf(params[key]) === 'object' || Ext.typeOf(params[key]) === 'array') {
							params[key] = Ext.JSON.encode(params[key]);
						}
					}
					//일반 방식의 form submit 
					ajaxOptions.params = params;
				}
			}

			Ext.Ajax.request(ajaxOptions);

			if (formEl) {
				Ext.removeNode(formEl);
			}
		}
	});

	Ext.override(Ext.form.action.Load, {
		run : function() {

			this.form.payload = this.form.payload || {};
			var params = this.getParams();
			Ext.applyIf(params, {
				language : SmartFactory.login.language || '1'
			});
			if (this.form.payload.load != undefined && this.form.payload.load === true) {
				Ext.Ajax.request(Ext.apply(this.createCallback(), {
					method : this.getMethod(),
					url : this.getUrl(),
					headers : this.headers,
					jsonData : params
				}));
			} else {
				Ext.Ajax.request(Ext.apply(this.createCallback(), {
					method : this.getMethod(),
					url : this.getUrl(),
					headers : this.headers,
					params : params
				}));
			}

		}
	});
	
	//Ext.form.field.Base의 labelSeparator의 기본값을 ':' -> '' 변경했다
	Ext.override(Ext.form.field.Base, {
		labelSeparator : ''
	});

	//Ext.form.field.Base의 labelSeparator의 기본값을 ':' -> '' 변경했다
	Ext.override(Ext.form.FieldContainer, {
		labelSeparator : ''
	});
	
	//javascript date format 재정의하여 원하는 format 형식으로 출력한다. (자리이동~?)
	Date.prototype.toString = function() {
		return Ext.Date.format(this, T('Format.datetime'));
	};

	/*
	 * Browser History 기능을 위한 부분임.
	 * 아래와 같이 수정하는 이유는, History에 넣은 후에 다시 동작하지 않도록 하기 위해서임.
	 * (원래 구성에서는 doMenu 시에 두 번 동작하게 됨. History에 추가하는 경우는 change 이벤트를 발생시키지 않도록 하기 위해서임.)
	 */
	Ext.apply(Ext.util.History, {
		suppressChange : false,
		add : function(token, preventDup, suppressChange) {
			var me = this;
			this.suppressChange = suppressChange ? true : false;
			if (preventDup !== false) {
				if (me.getToken() === token) {
					return true;
				}
			}
			if (me.oldIEMode) {
				return me.updateIFrame(token);
			} else {
				window.top.location.hash = token;
				return true;
			}
		},
		handleStateChange : function(token) {
			this.currentToken = token;
			// only fire "change" event if suppressChange is false
			if (!this.suppressChange) {
				this.fireEvent('change', token);
			}
			// now just reset the suppressChange flag
			this.suppressChange = false;
		}
	});
	
	//flash component Adobe provides a tool called(install/version up) 경로수정
	Ext.flash.Component.EXPRESS_INSTALL_URL = 'swf/expressInstall.swf';
	
	return {};
}());
Ext.define('mixin.LocalSetting', function() {
	Ext.define('mixin.LocalSetting.Model', {
	    extend: 'Ext.data.Model',
        fields: [{
			name : 'id',
			type : 'string'
		}, {
			name : 'value',
			type : 'auto'
		}],
        proxy: {
            type: 'localstorage',
            id  : 'smartfactory-settings'
        }
	});

	var store = Ext.create('Ext.data.Store', {
		model : 'mixin.LocalSetting.Model',
		autoSync : true
	});
	
	function getSettingsObject(filterFn) {
		var obj = {};
		
		if(filterFn) {
			store.each(function(record) {
				var id = record.get('id');
				var value = record.get('value');
				if(filterFn(id, value))
					obj[id] = value;
			});
		} else {
			store.each(function(record) {
				obj[record.get('id')] = record.get('value');
			});
		}

		return obj;
	}
	
	function getLocalSetting(name) {
		var record = store.getById(name);
		if(record)
			return record.get('value');
		else
			return undefined;
	}
	
	function setLocalSetting(name, value) {
		var record = store.getById(name);

		if(!record) {
			var set = Ext.create('mixin.LocalSetting.Model', {
				id : name,
				value : undefined
			});
			store.add(set);
			record = store.getById(name);
		}
		
		var old = record;

		record.set('value', value);
		record.commit();
		
		return old;
	}
	
	Ext.define('mixin.LocalSetting.Inner', {
		mixins: {
			observable : 'Ext.util.Observable'
		},
		
		constructor: function (config) {
	        this.mixins.observable.constructor.call(this, config);
	    },
	
		set : function(id, val) {
			var old = setLocalSetting(id, val);
			this.fireEvent(id, val, old);
		},
		
		get : function(id) {
			return getLocalSetting(id);
		},
		
		all : function(filterFn) {
			return getSettingsObject(filterFn);
		}
	});
	
	try {
		store.load();
	} catch(e) {
		SF.error('SYS-E006', {}, e);
		/* 잘못된 형식의 local cache인 경우 로컬스토리지를 클리어시킴 */
		store.getProxy().clear();
		store.load();
	}

	return {
		setting : Ext.create('mixin.LocalSetting.Inner')
	};
}());

Ext.define('mixin.Mixin', {
	mixin : function(clazz, config) {
		try {
			switch (typeof (clazz)) {
			case 'string':
				Ext.apply(SmartFactory, Ext.create(clazz, config));
				return;
			case 'object':
				Ext.apply(SmartFactory, clazz);
			}
		} catch (e) {
			SF.error('SYS-E005', {
				clazz : clazz
			}, e);
		}
	}
});
Ext.define('mixin.AutoExpire', function() {
	var MINIMUM_TTL = 10;

	var refreshHandler;
	var timeoutHandler;

	var expireTTL = 0;
	var timer;
	
	function timerHandler() {
		var now = Ext.Date.now();
		var diff = (getLastUpdateTime() + expireTTL * 1000) - now;
		if(diff <= 0) {
			if(timeoutHandler)
				timeoutHandler.call(null);
			stop();
		} else {
			timer = setTimeout(timerHandler, diff);
		}
	}
	
	function getLastUpdateTime() {
		return parseInt(Ext.util.Cookies.get('last-update-time') || '0');
	}
	
	/* TODO LastUpdateTime을 세션변수에 저장하는 방법으로 변경해야 한다. */
	function refresh() {
		var now = Ext.Date.now();
		/* 10초 이내에 반복적으로 발생한 refresh 이벤트는 처리하지 않는다. */
		if(now > getLastUpdateTime() + 10000) {
			Ext.util.Cookies.set('last-update-time', now);
			if(refreshHandler)
				refreshHandler.call(null);
		}
	}
	
	function start(ttl) {
		refresh();

		/* 
		 * Ajax 요청시와 Browser 에서 <=, => 으로 이동하는 경우에 자동 Refresh 하도록 함.  
		 * 그 밖에 경우에는 SF.autoexpire.refresh() 메쏘드를 해당 조건시 호출하면 된다.
		 * 예를 들어, 사용자가 Content Area의 TAB을 바꿔가는 액션을 하는 경우에도, LastUpdateTime을 Refresh 하고 싶은 경우 등이다.
		 */ 
		Ext.util.History.on('change', refresh);
		Ext.Ajax.on('beforerequest', refresh);
		
		/* TTL(Time To Live)은 초단위로 설정하며, 숫자형이어야 한다. 그리고, 최소한 MINIMUM_TTL초 이상으로 설정되어야 한다. */
		if(ttl && (typeof(ttl) === 'number') && ttl >= MINIMUM_TTL) {
			expireTTL = ttl;
			timer = setTimeout(timerHandler, ttl * 1000);
		}
	}
	
	function stop() {
		Ext.util.History.un('change', refresh);
		Ext.Ajax.un('beforerequest', refresh);
		
		expireTTL = 0;
		if(timer)
			clearTimeout(timer);
		timer = undefined;
	}
	
	function on(event, handler) {
		switch(event) {
		case 'refresh' :
			refreshHandler = handler;
			break;
		case 'timeout' :
			timeoutHandler = handler;
			break;
		default :
			Ext.log('Undefined event for AutoExpire : ', event);
		}
	}
	
	if(typeof(AUTOEXPIRE_TTL) === 'number') {
		on('timeout', function() {
			document.location.href = typeof(LOGOUT_URL) === 'undefined' ? 'logout' : LOGOUT_URL;
		});
		
		start(AUTOEXPIRE_TTL);
	}

	return {
		autoexpire : {
			start : start,
			stop : stop,
			refresh : refresh,
			on : on
		}
	};
}());
Ext.define('mixin.Msg', function(){
	var msgCt;

	function createBox(t, s) {
		return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
	}
	
	function showMessage(t, s) {
		if (!msgCt) {
			msgCt = Ext.core.DomHelper.insertFirst(document.body, {
				id : 'msg-div'
			}, true);
		}
		var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
		var m = Ext.core.DomHelper.append(msgCt, createBox(t, s), true);
		m.hide();
		m.slideIn('t').ghost("t", {
			delay : 1000,
			remove : true
		});
		SF.sound.notice();
	}
	
	/*
	 * TODO 아래 msgBox와 msgRtn은 MES 모듈의 mixin으로 이동해야 한다.
	 */
	function msgBox(title, msg, btnStyle,focus,fn, scope, value){
		var box = Ext.create('MES.view.window.MessagePopup');
		box.showMessage(title, msg, btnStyle,focus,fn, scope, value);
	}

	function msgRtn(title, rtnMsg, btnStyle,focus,fn, scope, value){
		var box = Ext.create('MES.view.window.MessagePopup');
		box.showRtnMessage(title, rtnMsg, btnStyle,focus,fn, scope, value);
	}
	
	return {
		msg : showMessage,
		msgRtn : msgRtn,
		msgBox : msgBox
	};
}());

Ext.define('mixin.User', function() {
	return {
		login : {
			id : Ext.String.htmlDecode(login.username),
			name : Ext.String.htmlDecode(login.username),
			factory : Ext.String.htmlDecode(login.factory),
			locale : Ext.String.htmlDecode(login.locale),
			group : Ext.String.htmlDecode(login.group),
			programId : Ext.String.htmlDecode(login.programId || 'WEBClient')
		}
	};
}());
/*
 * TODO 이 Mixin은  CMN 모듈로 이동한다.
 */
Ext.define('mixin.UserInterface', function() {
	/* Navigation 영역에 탭을 추가하기 */
	function addNav(config) {
	}

	/* MainMenu 영역의 Side에 탭을 추가하기 */
	function addSideMenu(view, config) {
	}

	// TODO : resource List Main에 active 이벤트를 위해서 수정하였음. 문제가 된다면 기존
	// addContentView로 복원필요
	function addContentView(view) {
	}

	var _content_area = null;
	
	function getContentArea() {
		if(!_content_area)
			_content_area = Ext.getCmp('content');
		return _content_area;
	}
	
	var _title_component = null;
	
	function setTitle(title) {
		if(!_title_component)
			_title_component = Ext.getCmp('title');

		if(_title_component)
			_title_component.update({
				title : title
			});
	}

	/* Main Content 영역에 탭을 추가하기 - 히스토리에 연동되며 로드할 데이타의 키정보를 넘길 수 있다. */
	/* TODO doMenu 메쏘드의 명칭을 수정 ==> showContent 또는 show */
	function doMenu(menu, history) {
		if (!menu.viewModel) {
			SF.error('SYS-E002');
			return;
		}

		try {
			var content_area = getContentArea();
			
			/*
			 * 모듈 이름이 4자 이상인 경우는 커스터마이즈된 코드로 인식한다.
			 * 커스터마이즈된 코드는 MVC구조를 사용하므로, 뷰모델을 로드하기 전에, 관련된 컨트롤러를 먼저 동적으로 로드한다.
			 * 뷰모델과 관련된 컨트롤러는 뷰모델과 동일한 클래스명을 가져야 하며, {모듈명}.controller.{클래스명} 이름 구조를 가져야 한다.
			 */
			if(!Ext.ClassManager.get(menu.viewModel) && menu.viewModel.indexOf('.') > 3) {
				var controller = menu.viewModel.replace('.view.', '.controller.');
				if(controller)
					SF.controller.ApplicationController.unique.getController(controller).init();
			}
			
			var screen = content_area.getComponent(menu.itemId) || content_area.add(Ext.create(menu.viewModel, {
				itemId : menu.itemId,
				header : false,
				closable : false
			}));

			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로 keychange 이벤트를 발생시키도록 변경함.
			 */
			if (screen.setKeys) {
				screen.setKeys(menu.keys);
			}

			setTitle(screen.title);

			content_area.getLayout().setActiveItem(screen);

			return screen;
		} catch (e) {
			SF.error('SYS-E001', {
				view : menu.viewModel
			}, e);
		}
	}

	return {
		doMenu : doMenu,
		addContentView : addContentView,
		addNav : addNav,
		addSideMenu : addSideMenu
	};
}());

Ext.define('mixin.Util', function() {
	function camelize(src) {
		var lowers = src.toLowerCase();
		return lowers.replace(/[A-Z]([A-Z]+)|(?:^|[-_])(\w)/g, function(x, c) {
			var x0 = x.charAt(0);

			if (x0 == '-' || x0 == '_')
				return x.substr(1).toUpperCase();
			return x;
		});
	}
	
	function elapsedTime(from, to, unit) {
		var diff = to - from;

		// strip the miliseconds
		diff /= 1000;

		var seconds = Math.round(diff % 60);
		// remove seconds from the date
		diff = Math.round(diff / 60);
		// get minutes
		var minutes = Math.round(diff % 60);
		// remove minutes from the date
		diff = Math.round(diff / 60);
		// get hours
		var hours = Math.round(diff % 24);
		// remove hours from the date
		diff = Math.round(diff / 24);

		// the rest of Time Diff is number of days
		var days = diff;
		
		var text = 'Text.Elapsed Hours';
		
		if(unit) {
			switch(unit.charAt(0)) {
			case 's' :
				text = 'Text.Elapsed Seconds';
				break; 
			case 'm' :
				text = 'Text.Elapsed Minutes';
				break; 
			case 'h' :
				text = 'Text.Elapsed Hours';
				break; 
			case 'd' :
				text = 'Text.Elapsed Days';
				break; 
			}
		}
		
		return T(text, {
			days : days,
			hours : hours,
			minutes : minutes,
			seconds : seconds
		});
	}
	
	return {
		camelize : camelize,
		elapsedTime : elapsedTime
	};
}());

Ext.define('mixin.Logger', function() {
	
	var logger = Ext.create('Ext.util.Observable');
	logger.addEvents(
        'trace',
        'debug',
        'info',
        'warn',
        'error'
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
		logger.fireEvent('error', code, params, e);
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
Ext.define('mixin.DeepLink', function(){
	function getKeys() {
		return this._keys;
	}

	/*
	 * 브라우저 히스토리로 인식될 사용자 화면에게 데이타의 Key가 변경되었음을 알려주는 메쏘드이다.
	 * silent 파라미터는 화면의 Key는 변경하되, 브라우저 히스토리는 추가하지 말 것을 알려주는 것으로, 디폴트는 false 이다.
	 * Key가 실제로 변경되지 않았다고 하더라도, setKeys 메쏘드가 호출되면, keychange 이벤트가 발생한다.
	 * 
	 * FIXME 혹시 실제로 키가 변경된 경우에만 이벤트가 호출되어야 한다면..
	 * if(Ext.JSON.encode(this.getKeys()) !== Ext.JSON.encode(keys)) { ... } 으로 확인 후 발생토록 한다. 
	 */
	function setKeys(keys, silent) {
		this._keys = keys;
		
		this.fireEvent('keychange', this, keys);

		if(!silent)
			SF.history.add(this, keys);
	}
	
	return {
		getKeys : getKeys,
		setKeys : setKeys
	};
}());

/**
 * @class mixin.History
 * 
 */
Ext.define('mixin.History', function() {
	/* 네비게이션의 히스토리 시스템을 셋업한다. */
	Ext.util.History.init();

	var _locked = false;
	
	var _title_component = null;
	
	function parse(token) {
		if (!token)
			return {
				viewModel : undefined,
				keys : undefined
			};

		/*
		 * token은 ':' 구분자로 구분된 2개의 파라미터(viewModel : keys)로 이루어져있다. 그런데, 마지막 keys
		 * 파라미터의 경우에는 내부에 ':' 문자를 포함할 수 있으므로, token.split(':') 으로 해결할 수가 없다.
		 * 따라서, 정규표현식에 의한 token 분해 처리를 하도록 하였다.
		 */
		var params = token.match(/([^:]*):{0,1}([\S\s]*)/);
		params.shift();

		return {
			viewModel : params[0],
			keys : params[1] ? Ext.Object.fromQueryString(params[1], true) : undefined
		};
	}

	function setTitle(title) {
		if(!_title_component)
			_title_component = Ext.getCmp('title');

		if(_title_component)
			_title_component.update({
				title : title
			});
	}

	Ext.util.History.on('change', function(token) {
		if(!token)
			return;
		
		var anchor = parse(token);
		
		var vm = anchor.viewModel;
		var itemId = anchor.viewModel;
		var keys = anchor.keys;
		
		if(!vm) {
			SF.error('SYS-E002');
			return;
		}

		try {
			var content_area = Ext.getCmp('content');
			
			/*
			 * 모듈 이름이 4자 이상인 경우는 커스터마이즈된 코드로 인식한다.
			 * 커스터마이즈된 코드는 MVC구조를 사용하므로, 뷰모델을 로드하기 전에, 관련된 컨트롤러를 먼저 동적으로 로드한다.
			 * 뷰모델과 관련된 컨트롤러는 뷰모델과 동일한 클래스명을 가져야 하며, {모듈명}.controller.{클래스명} 이름 구조를 가져야 한다.
			 */
			if(!Ext.ClassManager.get(vm) && vm.indexOf('.') > 3) {
				var controller = vm.replace('.view.', '.controller.');
				if(controller) {
					/*
					 * Synchronously Loading 경고를 방지하기 위해서 명시적으로 Ext.syncRequire 를 선행적으로 호출함.
					 */
					Ext.syncRequire(controller);
					SF.controller.ApplicationController.unique.getController(controller).init();
				}
			}

			var screen = content_area.getComponent(itemId) || content_area.add(Ext.create(vm, {
				itemId : itemId,
				header : false,
				closable : false
			}));
			
			if(screen.setKeys) {
				/*
				 * History는 변경하지 말고, Keys 값만을 바꾸라.
				 * 이미 변경된 History에 의해서 수행되는 부분이므로, History를 변경하지 말 것을 두번째 파라미터로 전달한다.
				 */
				screen.setKeys(keys, true);
			}
			
			try {
				lock();

				setTitle(screen.title);

				content_area.getLayout().setActiveItem(screen);
			} finally {
				unlock();
			}

			return screen;
		} catch (e) {
			SF.error('SYS-E001', {
				view : vm
			}, e);
		}
	});
	
	/*
	 * History Change 이벤트가 발생하지 않는 경우에 강제로 발생시키는 메쏘드이다.
	 * 예를 들면, 화면이 최초에 열리는 시점에 발생시킨다. 
	 */
	function force() {
		Ext.util.History.fireEvent('change', Ext.util.History.getToken());
	}
	
	function anchor() {
		var args = [];
		for(var i = 0;i < arguments.length;i++) {
			if(!arguments[i])
				args[i] = '';
			else if(arguments[i] instanceof Array || arguments[i] instanceof Object)
				args[i] = Ext.Object.toQueryString(arguments[i], true);
			else
				args[i] = '' + arguments[i];
		}
		
		return args.join(':');
	}
	
	function add(view, keys, force) {
		if(_locked)
			return;

		var token = '';
		var viewModel = (typeof view === 'string') ? view : Ext.getClassName(view);
		
		/*
		 * view가 없이 호출하는 경우는 Anchor가 없는 URL을 History에 추가하라는 의미이다.
		 */
		if (viewModel) {
			if (keys !== undefined)
				token = anchor(viewModel, keys);
			else if (view.getKeys && view.getKeys() !== undefined)
				token = anchor(viewModel, view.getKeys());
			else
				token = anchor(viewModel);
		}

		var oldtoken = Ext.util.History.getToken();

		if ((!oldtoken) || oldtoken != token) {
			Ext.History.add(token, true, true);
		}
	}
	
	function back() {
		Ext.util.History.back();
	}

	function forward() {
		Ext.util.History.forward();
	}
	
	function isSameKey(key1, key2) {
		return Ext.JSON.encode(key1) === Ext.JSON.encode(key2);
	}
	
	function lock() {
		_locked = true;
	}
	
	function unlock() {
		_locked = false;
	}
	
	return {
		history : {
			force : force,
			add : add,
			back : back,
			forward : forward,
			isSameKey : isSameKey,
			lock : lock,
			unlock : unlock
		}
	};
}());

/*
 * Mixin Lock은 동기화된 처리를 위한 방법을 제공한다.
 * TODO 단위테스트 코드 작성.
 * 예시.		
 * - 아래 예시는 모든 Lock된 Function들이 처리된 다음에, ready에 등록한 Function이 실행되는 것을 보장한다.
		// 1. Lock 객체를 생성한다.
		var lock = SF.createLock();
		
		// 2. Array 형태의 대상에 대해서, 순차적으로 Lock을 적용하여 처리할 수 있다.
		lock.each([1, 2, 3, 4, 5], function(n, l) {
			setTimeout(function() {
				Ext.log(n);
				l.release();
			}, 1000);
		});

		// 3. 개별 Function에 대해서 Lock을 적용할 수 있다.
		lock.lock();
		setTimeout(function() {
			Ext.log('3000');
			lock.release();
		}, 3000);
		
		// 4. 앞에서 적용된 Lock이 모두 릴리즈 되는 시점에 처리될 Function은 ready 메쏘드에 등록한다.
		lock.ready(function() {
			Ext.log('Executed');
		});

 */

Ext.define('mixin.Lock', function() {
	function Lock() {
		this.count = 0;
		this.valid = true;
	}

	Lock.prototype.invalidate = function() {
		this.valid = false;
	};

	Lock.prototype.lock = function() {
		if (!this.valid)
			return;

		this.count++;
	};

	/*
	 * Lock.release(..) Lock을 release 시키면서, 계속 진행할 것인지 또는, 더 이상 진행하지 않을 것인지를
	 * argument로 결정할 수 있다.
	 */
	Lock.prototype.release = function(keepGoing) {
		if (!this.valid)
			return;

		if (keepGoing === false) {
			if (this.doneFn)
				this.doneFn();
			this.invalidate();

			return;
		}

		this.count = this.count - 1;
		if (0 < this.count)
			return;

		try {
			if (this.readyFn) {
				this.readyFn();
			}
		} finally {
			if (this.doneFn) {
				this.doneFn();
			}
		}
	};

	/*
	 * Lock release(true/false)에 관계없이 항상 실행되는 로직. ready()에 등록된 function이 실행된 후에
	 * 실행된다.
	 */
	Lock.prototype.done = function(fn, scope, args) {
		if (!this.valid)
			return;

		this.doneFn = function() {
			fn.apply(scope || this, args || []);
		};
	};

	/*
	 * Lock release(false)인 경우에는 실행되지 않는 로직임.
	 */
	Lock.prototype.ready = function(fn, scope, args) {
		if (!this.valid)
			return;

		if (this.count > 0) {
			this.readyFn = function() {
				fn.apply(scope || this, args || []);
			};

			return;
		}

		try {
			fn.apply(scope || this, args || []);
		} finally {
			if (this.doneFn)
				this.doneFn();
		}
	};

	Lock.prototype.reset = function() {
		this.count = 0;
		this.valid = true;

		delete this.readyFn;
		delete this.doneFn;
	};

	Lock.prototype.each = function(array, fn, scope, args) {
		if (!this.valid)
			return;

		this.lock();
		if (array.length === 0) {
			this.release();
			return;
		}

		var lock = new Lock();
		lock.lock();

		try {
			fn.call(scope || this, array[0], lock, args || []);
		} finally {
			/*
			 * fn 내에서 바로 lock.release(false) 한 경우에 대한 처리.
			 */
			if (!lock.valid) {
				this.release();
				return;
			}
		}

		var self = this;
		lock.done(function() {
			self.release();
		});

		lock.ready(function() {
			self.each(array.slice(1), fn, scope, args);
		}, this, args);
	};

	return {
		createLock : function() {
			return new Lock();
		}
	};
}());

Ext.define('mixin.Ajax', function() {
	function onComplete(conn, resp, options, eOpts) {
		var showFailureMsg = true;
		var showSuccessMsg = false;
		var responseObj = Ext.JSON.decode(resp.responseText);

		if (options.operation && options.operation.showFailureMsg != undefined) {
			showFailureMsg = options.operation.showFailureMsg;
		} else if (options.scope && options.scope.showFailureMsg != undefined) {
			showFailureMsg = options.scope.showFailureMsg;
		} else if (options.showFailureMsg != undefined) {
			showFailureMsg = options.showFailureMsg;
		}

		if (options.operation && options.operation.showSuccessMsg != undefined) {
			showSuccessMsg = options.operation.showSuccessMsg;
		} else if (options.scope && options.scope.showSuccessMsg != undefined) {
			showSuccessMsg = options.scope.showSuccessMsg;
		} else if (options.showSuccessMsg != undefined) {
			showSuccessMsg = options.showSuccessMsg;
		}

		if (Ext.isFunction(showFailureMsg)) {
			showFailureMsg = showFailureMsg(responseObj);
		}

		if (Ext.isFunction(showSuccessMsg)) {
			showSuccessMsg = showSuccessMsg(responseObj);
		}
		
		if (showSuccessMsg === true && responseObj.success === true) {
			SF.msgRtn(responseObj.msgcode, responseObj);
		}else if (showFailureMsg === true && responseObj.success === false) {
			SF.msgRtn(responseObj.msgcode, responseObj);
		}
	}
	
	function onException(conn, resp, options, eOpts) {
		if (resp.status === 0) {
			SF.error('SYS-E008');
			Ext.Msg.alert(T('Caption.Other.Communication Failure'), T('Message.SYS-E008'));
		} else if (resp.status == 404) {
			var msg = '[' + resp.status + ' ' + resp.statusText + '(' + options.url + ')]';
			SF.error('SYS-E013', {
				msg : msg
			});
			Ext.Msg.alert(T('Caption.Other.Not Found'), T('Message.SYS-E013', {
				msg : msg
			}));
		} else if (resp.status >= 400 && resp.status < 500) {
			SF.error('SYS-E009');
			Ext.Msg.confirm(T('Caption.Other.Invalid Session'), T('Message.SYS-E009'), function(btn) {
				if(btn === 'yes')
					document.location.reload();
			});
		} else if (resp.status >= 500) {
			SF.error('SYS-E010');
			Ext.Msg.alert(T('Caption.Other.Server Error'), T('Message.SYS-E010'));
		} else {
			var msg = '[' + resp.status + ' : ' + resp.statusText + ']';
			SF.error('SYS-E000', {
				msg : msg
			});
			Ext.Msg.alert(T('Caption.Other.Unknown Error'), T('Message.SYS-E000', {
				msg : msg
			}));
		}
	}
	
	function onBefore(conn, options, eOpts) {
	}
	
	Ext.Ajax.on('requestcomplete', onComplete);
	Ext.Ajax.on('requestexception', onException);
	Ext.Ajax.on('beforerequest', onBefore);

	return {
		ajax : {	
		}
	};
}());
Ext.define('mixin.Exporter', function() {
	
	function text(col, arr) {
		var length = col.length || 0;
		var maxCnt = 0;
		if (col && length > 0) {
			for ( var i = 0, length = col.length; i < length; i++) {
				if (col[i].hidden != true && col[i].exported != false) {
					if(col[i].xtype == 'rownumberer' || col[i].dataIndex || (col[i].items.getCount && col[i].items.getCount() > 0)){
						var item = [];
						var e = {};
						if (col[i].header || col[i].text){
							var header = col[i].header || col[i].text;
							if(header == '&#160'){
								//&nbsp는 '  '로 header 표시
								e['header'] = '  ';
							}else{
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

	function getExportColumns(grid) {
		var t = [];
		if (!grid)
			return [];
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
	};

	function getExportParams(title, grid, params) {
		params = params || {};
		if(grid){
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
	
	var form = null;
	
	function exportForm() {
		if(form)
			return form;
		
		/* TODO many iframes are generated on every export */
		var body = Ext.getBody();
		body.createChild({
			tag : 'iframe',
			cls : 'x-hidden',
			id : '_exportFrame',
			name : '_exportFrame'
		});
		
		form = body.createChild({
			tag : 'form',
			cls : 'x-hidden',
			id : '_exportForm',
			target : '_exportFrame'
		});
		
		return form;
	}

	function doExport(url, title, grid, params) {
		Ext.Ajax.request({
			url : url,
			params : getExportParams(title, grid, params) || {},
			form : exportForm(),
			isUpload : true
		});
	}
	
	function doDownload(url) {
		var downloader = Ext.getCmp('filedownloader');
		downloader.load({
		    url: url
		});
	}
	
	return {
		exporter : {
			doExport : doExport,
			doDownload : doDownload
		}
	};
}());

Ext.Loader.setPath('mixin', 'product/mixin');

Ext.define('SmartFactory', {
	
	alternateClassName : ['SF'],
	
	singleton : true,

	requires : [ 'mixin.DeepLink', 'mixin.AutoExpire', 'mixin.History', 'mixin.User', 'mixin.Mixin', 'mixin.Msg', 'mixin.UserInterface', 'mixin.ExtOverride', 'mixin.Util', 'mixin.Logger', 'mixin.Lock', 'mixin.Ajax', 'mixin.Exporter'],
	mixins : {
		user : 'mixin.User',
		expire : 'mixin.AutoExpire',
		mixin : 'mixin.Mixin',
		msg : 'mixin.Msg',
		history : 'mixin.History',
		ui : 'mixin.UserInterface',
		subitem : 'mixin.ExtOverride',
		constant : 'mixin.Constant',
		util : 'mixin.Util',
		logger : 'mixin.Logger',
		lock : 'mixin.Lock',
		ajax : 'mixin.Ajax',
		exporter : 'mixin.Exporter'
	}
});

Ext.define('SmartFactory.view.Viewport', {
	extend : 'Ext.container.Viewport',

	alias : 'xviewport',

	layout : 'fit',
	
	cls : 'unity',
	
	items : [{
		xtype : 'panel',
		id : 'content',
		layout : 'card',
		dockedItems : [{
			xtype : 'component',
			dock : 'top',
			id : 'title',
			tpl : '<h1>{title}</h1>',
			height : 68
		}, {
			/*
			 * Supplement를 사용하는 View의 트러블을 최소화하기 위한 장치로만 사용됨.
			 */
			layout : 'card',
			xtype : 'panel',
			id : 'east',
			cls : 'nav supplement',
			dock : 'right',
			width : 0,
			hidden : true,
			/* 
			 * 'east' 영역은 'base'라는 아이템의 View를 items에 가져야 한다.
			 * 보조 패널을 갖지 않는 컨텐트 뷰가 Activate될 때, 이 'base'뷰가 activate된다.
			 * 'base' 아이템은 'title' 속성을 가져야 하며, 'base'의 title이 Supplement Area의 기본 타이틀로 사용된다. 
			 */
			
			items : [{
				xtype : 'box',
				itemId : 'base',
				title : T('Caption.Other.Supplement'),
				preventHeader : true,
				cls : 'defaultSupplementImg'
			}]
		}]
	}],

	listeners : {
		afterrender : function() {
			setTimeout(function() {
				try {
					/* 
					 * 초기 UI가 완전히 렌더링되면, 강제로 History 변경 이벤트를 발생시킨다. 
					 */
					SF.history.force();
				} catch(e) {
				}
			}, 1);
		}
	}
});

Ext.define('SmartFactory.controller.ApplicationController', {
	extend: 'Ext.app.Controller',
	
	statics : {
		unique : null
	},
	
	init : function() {
		SmartFactory.controller.ApplicationController.unique = this;
		
		this.callParent();
	}

});
Ext.Loader.setConfig({
	enabled : true,
	paths : {
		'SmartFactory' : 'unity/SmartFactory.js',
		'CMN.controller' : 'unity/controller',
		'Ext.ux' : 'js/ux'
	}
});

Ext.require(['SmartFactory']);

Ext.module = function() {
	var modules_order = [];
	var modules = {};

	function getModules() {
		return modules;
	}

	function loadResources(module_name, compressed) {
		document.write('<script type="text/javascript" src="module/' + module_name + '/locale/' + login.locale + '.js"></script>');
		if(compressed)
			document.write('<script type="text/javascript" src="module/' + module_name + '/' + module_name + '.js"></script>');
	}
	
	function registerModule(module_name, controllers, compressed) {
		if (modules[module_name])
			return;

		modules[module_name] = controllers;
		modules_order.push(module_name);

		Ext.Loader.setPath(module_name, 'module/' + module_name);
		loadResources(module_name, compressed);
	}

	function getAllControllers() {
		var joined = [];
		for(var i = 0;i < modules_order.length;i++)
			joined = joined.concat(modules[modules_order[i]]);
		return joined;
	}
	
	return {
		modules : getModules,
		register : registerModule,
		controllers : getAllControllers
	};
	
}();

Ext.onReady(function() {
	Ext.application({
		name : 'SmartFactory',
		autoCreateViewport : true,

		controllers : [ 'SmartFactory.controller.ApplicationController' ]
				.concat(Ext.module.controllers()),

		launch : function() {
		}
	});
});

