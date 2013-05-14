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
	
	//2013.03.11 KKH 
	// filter, sort, group를 사용시 네이밍 충돌이 발생하여 server 와 param명칭을 정의함.
	Ext.override(Ext.data.proxy.Server, {
		sortParam : 'extjsSort',
		filterParam : 'extjsFilter',
		groupParam : 'extjsGroup'
	});
	
	//TODO  : 2013.02.05  mixin.Ajax onComplete에서 매번  json decode이 되므로 비효율적임
	// exception시에만 error message를 decode함. 단, success시 공용 팝업이 표시되지 않아 방법 모색 후 적용예정.
//	Ext.override(Ext.data.proxy.Server, {
//		constructor : function(config){
//			this.callOverridden([config]);
//			
//			this.addListener('exception', function(proxy, resp, operation){
//				if(!resp.responseText){
//					return;
//				}
//				var showFailureMsg = true; // user defined
//				var showSuccessMsg = false; //userdefined
//				
//				var responseObj = resp.reponseXML || Ext.JSON.decode(resp.responseText);
//				var options = resp.request.options;
//				
//				if (operation && operation.showFailureMsg != undefined) {
//					showFailureMsg = operation.showFailureMsg;
//				} else if (options.scope && options.scope.showFailureMsg != undefined) {
//					showFailureMsg = options.scope.showFailureMsg;
//				} else if (options.showFailureMsg != undefined) {
//					showFailureMsg = options.showFailureMsg;
//				}
//
//				if (operation && operation.showSuccessMsg != undefined) {
//					showSuccessMsg = operation.showSuccessMsg;
//				} else if (options.scope && options.scope.showSuccessMsg != undefined) {
//					showSuccessMsg = options.scope.showSuccessMsg;
//				} else if (options.showSuccessMsg != undefined) {
//					showSuccessMsg = options.showSuccessMsg;
//				}
//
//				if (Ext.isFunction(showFailureMsg)) {
//					showFailureMsg = showFailureMsg(responseObj);
//				}
//
//				if (Ext.isFunction(showSuccessMsg)) {
//					showSuccessMsg = showSuccessMsg(responseObj);
//				}
//
//				if (showSuccessMsg === true && operation.success === true) {
//					SF.msgRtn(responseObj.msgcode, responseObj);
//				}else if (showFailureMsg === true && operation.success === false) {
//					SF.msgRtn(responseObj.msgcode, responseObj);
//				}
//			});
//		}
//	});
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

	//注意：这个override只兼容extjs4.1.1,对于extjs4.2.0 or 4.2.1 会有exception，操作用户管理就能见异常。
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