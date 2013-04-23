//itemId : BaseForm -> basebuttons
Ext.define('MES.view.form.field.BaseButtons', {
	/*
	 * 부모 클래스를 정의한다.
	 */
	extend : 'Ext.toolbar.Toolbar',

	/*
	 * common 뷰인 경우에는 Alias를 정의한다.
	 */
	alias : [ 'widget.basebuttons', 'widget.mes_view_basebuttons' ],

	/*
	 * 부모 레이아웃과 관련된 자신의 컴포넌트 속성을 정의한다.
	 */
	dock : 'bottom',

	/*
	 * 컨테이너로서의 속성 : layout, defaults, tools, items 등을 정의한다. 단, 복잡한 items, docked
	 * items 등은 initComponent에서 등록을 권장한다.
	 */
	defaults : {
		minWidth : 75
	},

	ui : 'footer',
	//checkbox 추가 후 사이즈 미지정시 4pix 어긋남
	
	height : 27,

	/*
	 * Init Component 메쏘드를 오버라이드 한다.
	 * 
	 * 1. items (정적인 컴포넌트)를 등록한다. 2. docked item들을 등록한다. 3. callParent()를 호출한다.
	 * 4. 동적인 컴포넌트와 리스너들을 등록한다.
	 */
	initComponent : function() {
		/*
		 * 정적인 컴포넌트들을 등록한다. Docked Item들을 등록한다.
		 */
		this.buttonsOpt = this.buttonsOpt || {};

		var tbarButtons = [];
		var tbfillCnt = 0;
		
		//버튼 권한 설정
		this.secControlList = this.secControlList ||{}; //권한설정버튼 목록
		
		Ext.Array.each(this.buttonsOpt, function(config, index, allItems) {
			config = config || {};
			config.params = config.params || {};
			config.result = config.result || {};

			//권한 여부  ture(사용), false(사용금지), null(무시) 
			if(this.isControlDisabled(config.itemId)===true){
				config.disabled = true;
			}
			
			this.zbtnclose.userConfig = {};
			
			switch (config.itemId) {
			case 'btnVersionUp':
				// 설정값이 없으면 Default configuration 추가(설정값 우선)

				if (config.confirm) {
					Ext.applyIf(config.confirm, {
						title : T('Caption.Button.Version Up'),
						msg : T('Message.Version Up')
					});
				}

				Ext.applyIf(config.result, {
					showSuccess : true,
					showFailure : true
				});

				this.zbtnversionup.userConfig = config;
				this.zbtnversionup.userConfig.checkValid = this.zbtnversionup.userConfig.checkValid==undefined?true:'';
				tbarButtons.push(this.zbtnversionup);
				break;
			case 'btnCreate':
				// 설정값이 없으면 Default configuration 추가(설정값 우선)

				if (config.confirm) {
					Ext.applyIf(config.confirm, {
						title : T('Caption.Button.Create'),
						msg : T('Message.Create')
					});
				}

				Ext.applyIf(config.result, {
					showSuccess : true,
					showFailure : true
				});

				this.zbtncreate.userConfig = config;
				this.zbtncreate.userConfig.checkValid = this.zbtncreate.userConfig.checkValid==undefined?true:'';
				
				tbarButtons.push(this.zbtncreate);
				break;
			case 'btnUpdate':
				// 설정값이 없으면 Default configuration 추가(설정값 우선)
				if (config.confirm) {
					Ext.applyIf(config.confirm, {
						title : T('Caption.Button.Update'),
						msg : T('Message.Update')
					});
				}

				Ext.applyIf(config.result, {
					showSuccess : true,
					showFailure : true
				});

				this.zbtnupdate.userConfig = config;
				this.zbtnupdate.userConfig.checkValid = this.zbtnupdate.userConfig.checkValid==undefined?true:'';
				tbarButtons.push(this.zbtnupdate);
				break;
			case 'btnDelete':
				// 설정값이 없으면 Default configuration 추가(설정값 우선)
				if (config.confirm) {
					Ext.applyIf(config.confirm, {
						title : T('Caption.Button.Delete'),
						msg : T('Message.Delete')
					});
				}

				Ext.applyIf(config.result, {
					showSuccess : true,
					showFailure : true
				});

				this.zbtndelete.userConfig = config;
				this.zbtndelete.userConfig.checkValid = this.zbtndelete.userConfig.checkValid==undefined?true:'';
				tbarButtons.push(this.zbtndelete);
				break;
			case 'btnUndelete':
				// 설정값이 없으면 Default configuration 추가(설정값 우선)
				if (config.confirm) {
					Ext.applyIf(config.confirm, {
						title : T('Caption.Button.Undelete'),
						msg : T('Message.Undelete')
					});
				}

				Ext.applyIf(config.result, {
					showSuccess : true,
					showFailure : true
				});

				this.zbtnundelete.userConfig = config;
				this.zbtnundelete.userConfig.checkValid = this.zbtnundelete.userConfig.checkValid==undefined?true:'';
				tbarButtons.push(this.zbtnundelete);
				break;
			case 'btnView':
				this.zbtnview.userConfig = config;
				tbarButtons.push(this.zbtnview);
				break;
			case 'btnProcess':
				// 설정값이 없으면 Default configuration 추가(설정값 우선)
				if (config.confirm) {
					Ext.applyIf(config.confirm, {
						title : T('Caption.Button.Process'),
						msg : T('Message.Process')
					});
				}

				Ext.applyIf(config.result, {
					showSuccess : true,
					showFailure : true
				});

				this.zbtnprocess.userConfig = config;
				this.zbtnprocess.userConfig.checkValid = this.zbtnprocess.userConfig.checkValid==undefined?true:'';
				tbarButtons.push(this.zbtnprocess);
				break;
			case 'btnRelease':
				// 설정값이 없으면 Default configuration 추가(설정값 우선)

				if (config.confirm) {
					Ext.applyIf(config.confirm, {
						title : T('Caption.Button.Release'),
						msg : T('Message.Release')
					});
				}

				Ext.applyIf(config.result, {
					showSuccess : true,
					showFailure : true
				});

				this.zbtnRelease.userConfig = config;
				this.zbtnRelease.userConfig.checkValid = this.zbtnRelease.userConfig.checkValid==undefined?true:'';
				tbarButtons.push(this.zbtnRelease);
				break;
			case 'btnRefresh':
				this.zbtnrefresh.userConfig = config;
				tbarButtons.push(this.zbtnrefresh);
				break;
			case 'btnClose':
				this.zbtnclose.userConfig = config;
				break;
			case 'tbfill':
				tbfillCnt++;
				this.zfill.userConfig = {};
				tbarButtons.push(this.zfill);
				break;
			case 'btnExport':
				this.zbtnexport.userConfig = config;
				tbarButtons.push(this.zbtnexport);
				break;
			}
		}, this);
		if (tbfillCnt == 0) {
			this.zfill.userConfig = {};
			tbarButtons.unshift(this.zfill);
		}
		// 설정된 userConfig가 없다면 빈값의 userConfig 생성
		tbarButtons.push(this.zbtnclose);

		this.items = tbarButtons;

		/*
		 * 부모의 컴포넌트 초기화 기본 로직을 호출한다.
		 */
		this.callParent();

		var self = this;

		this.addEvents({
			"beforeVersionUp" : true,
			"beforeCreate" : true,
			"beforeUpdate" : true,
			"beforeDelete" : true,
			"beforeUndelete" : true,
			"beforeProcess" : true,
			"beforeClose" : true,
			"beforeExport" : true,
			"beforeRelease" : true,
			"afterVersionUp" : true,
			"afterCreate" : true,
			"afterUpdate" : true,
			"afterDelete" : true,
			"afterUndelete" : true,
			"afterProcess" : true,
			"afterView" : true,
			"afterClose" : true, // 이벤트명에 'close'를 사용하면 안됩니다.
			"afterRefresh" : true,
			"afterRelease" : true
		});

		/*
		 * 부가적인 작업을 한다. - 동적인 컴포넌트 추가 - 리스너 등록
		 */
		for ( var i in this.items.items) {
			var item = this.items.getAt(i);

			// item disabled 설정(default : false)
			var cfgDisabled = !!item.userConfig.disabled;
			item.disabled = cfgDisabled;

			// item hidden 설정(default : false)
			var cfgHidden = !!item.userConfig.hidden;
			item.hidden = cfgHidden;

			var cfgText = item.userConfig.text;
			if (cfgText) {
				item.text = cfgText;
			}

			// item event 설정
			item.on('click', function(me, e, eOpts) {
				var confirmConfig = me.userConfig.confirm;

				if (confirmConfig) {
					var title = confirmConfig.title || T('Caption.Other.Confirm');
					var msg = confirmConfig.msg || T('Message.10');

					if (confirmConfig.fields) {
						var fieldValues = self.getClientForm().getFieldValues();
						for ( var key in confirmConfig.fields) {
							msg = msg.replace('{' + key + '}', fieldValues[confirmConfig.fields[key]]);
						}
					}

					Ext.MessageBox.confirm(title, msg, function showResult(result) {
						if (result == 'yes') {
							self.itemAction(me);
						}
					});
				} else {
					self.itemAction(me);
				}
			});

			item.on('enable', function(me, eOpts) {
				if(self.isControlDisabled(me.itemId)===true){
					me.setDisabled(true);
				}
			});
		}
	},
	isControlDisabled : function(itemId){
		//권한 여부  ture(사용), false(사용금지), null(무시) 
		var disabled = false;
		
		if(itemId && this.secChecked === true){
			if(this.secControlList[itemId] == ''){
				disabled = true;
			}
		}
		
		return disabled;
	},
	getClientForm : function() {
		if (!this.clientForm) {
			this.clientForm = this.up('form').getForm();
		}

		return this.clientForm;
	},
	getBaseFormPanel : function() {
		if (!this.baseFormPanel) {
			this.baseFormPanel = this.up('form');
		}

		return this.baseFormPanel;
	},
	setClientForm : function(form) {
		this.clientForm = form;
	},
	setBaseFormPanel : function(formPanel) {
		this.baseFormPanel = formPanel;
	},

	onBtnVersionUp : function(params, config, self, baseForm) {
		self.getClientForm().submit({
			params : params,
			url : config.url,
			showFailureMsg : false,
			showSuccessMsg : false,
			success : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterVersionUp', form, action, true, baseForm);
				};
				if (config.result.showSuccess) {
					self.showVersionupMsg(action, fireEvent);
				} else
					fireEvent();
			},
			failure : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterVersionUp', form, action, false, baseForm);
				};
				if (config.result.showFailure) {
					self.showVersionupMsg(action, fireEvent);
				} else
					fireEvent();
			}
		});
	},

	onBtnCreate : function(params, config, self, baseForm) {
		self.getClientForm().submit({
			params : params,
			url : config.url,
			showFailureMsg : false,
			showSuccessMsg : false,
			success : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterCreate', form, action, true, baseForm);
				};
				if (config.result.showSuccess) {
					self.showCreateMsg(action, fireEvent);
				} else
					fireEvent();
			},
			failure : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterCreate', form, action, false, baseForm);
				};
				if (config.result.showFailure) {
					self.showCreateMsg(action, fireEvent);
				} else
					fireEvent();
			}
		});
	},
	onBtnUpdate : function(params, config, self, baseForm) {
		self.getClientForm().submit({
			params : params,
			url : config.url,
			showFailureMsg : false,
			showSuccessMsg : false,
			success : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterUpdate', form, action, true, baseForm);
				};
				if (config.result.showSuccess) {
					self.showUpdateMsg(action, fireEvent);
				} else
					fireEvent();
			},
			failure : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterUpdate', form, action, false, baseForm);
				};
				if (config.result.showFailure) {
					self.showUpdateMsg(action, fireEvent);
				} else
					fireEvent();
			}
		});
	},

	onBtnDelete : function(params, config, self, baseForm) {
		self.getClientForm().submit({
			params : params,
			url : config.url,
			showFailureMsg : false,
			showSuccessMsg : false,
			success : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterDelete', form, action, true, baseForm);
				};
				if (config.result.showSuccess) {
					self.showDeleteMsg(action, fireEvent);
				} else
					fireEvent();
			},
			failure : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterDelete', form, action, false, baseForm);
				};
				if (config.result.showFailure) {
					self.showDeleteMsg(action, fireEvent);
				} else
					fireEvent();
			}
		});
	},

	onBtnUndelete : function(params, config, self, baseForm) {
		self.getClientForm().submit({
			params : params,
			url : config.url,
			showFailureMsg : false,
			showSuccessMsg : false,
			success : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterUndelete', form, action, true, baseForm);
				};
				if (config.result.showSuccess) {
					self.showUndeleteMsg(action, fireEvent);
				} else
					fireEvent();
			},
			failure : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterUndelete', form, action, false, baseForm);
				};
				if (config.result.showFailure) {
					self.showUndeleteMsg(action, fireEvent);
				} else
					fireEvent();
			}
		});
	},

	onBtnClose : function(self, baseForm) {
		self.fireEvent('afterClose', baseForm);
	},

	onBtnProcess : function(params, config, self, baseForm) {
		self.getClientForm().submit({
			params : params,
			url : config.url,
			showFailureMsg : false,
			showSuccessMsg : false,
			success : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterProcess', form, action, true, baseForm);
				};
				if (config.result.showSuccess) {
					self.showProcessMsg(action, fireEvent);
				} else
					fireEvent();
			},
			failure : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterProcess', form, action, false, baseForm);
				};
				if (config.result.showFailure) {
					self.showProcessMsg(action, fireEvent);
				} else
					fireEvent();
			}
		});
	},
	
	onBtnRelease : function(params, config, self, baseForm) {
		self.getClientForm().submit({
			params : params,
			url : config.url,
			showFailureMsg : false,
			showSuccessMsg : false,
			success : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterRelease', form, action, true, baseForm);
				};
				if (config.result.showSuccess) {
					self.showReleaseMsg(action, fireEvent);
				} else
					fireEvent();
			},
			failure : function(form, action) {
				var fireEvent = function() {
					self.fireEvent('afterRelease', form, action, false, baseForm);
				};
				if (config.result.showFailure) {
					self.showReleaseMsg(action, fireEvent);
				} else
					fireEvent();
			}
		});
	},

	onExportGrid : function(baseForm, targetGrid, params, url, title) {
		var grid = null;
		if (Ext.typeOf(targetGrid) == 'string')
			grid = baseForm.sub(targetGrid);
		
		if(!title){
			if(grid && grid.title){
				title = grid.title;
			}
			else{
				title = baseForm.title||'';
			}
		}
				
		SF.exporter.doExport(url,title, grid, params);
	},

	showVersionupMsg : function(action, fireEvent) {
		if (action.result != undefined && action.result.success === true) {
			this.sucessSubmitMsg(action, fireEvent);
		} else {
			this.errorSubmitMsg(action, fireEvent);
		}
	},
	showCreateMsg : function(action, fireEvent) {
		if (action.result != undefined && action.result.success === true) {
			this.sucessSubmitMsg(action, fireEvent);
		} else {
			this.errorSubmitMsg(action, fireEvent);
		}
	},
	showUpdateMsg : function(action, fireEvent) {
		if (action.result != undefined && action.result.success === true) {
			this.sucessSubmitMsg(action, fireEvent);
		} else {
			this.errorSubmitMsg(action, fireEvent);
		}
	},
	showDeleteMsg : function(action, fireEvent) {
		if (action.result != undefined && action.result.success === true) {
			this.sucessSubmitMsg(action, fireEvent);
		} else {
			this.errorSubmitMsg(action, fireEvent);
		}
	},
	showUndeleteMsg : function(action, fireEvent) {
		if (action.result != undefined && action.result.success === true) {
			this.sucessSubmitMsg(action, fireEvent);
		} else {
			this.errorSubmitMsg(action, fireEvent);
		}
	},
	showProcessMsg : function(action, fireEvent) {
		if (action.result != undefined && action.result.success === true) {
			this.sucessSubmitMsg(action, fireEvent);
		} else {
			this.errorSubmitMsg(action, fireEvent);
		}
	},
	
	showReleaseMsg : function(action, fireEvent) {
		if (action.result != undefined && action.result.success === true) {
			this.sucessSubmitMsg(action, fireEvent);
		} else {
			this.errorSubmitMsg(action, fireEvent);
		}
	},

	sucessSubmitMsg : function(action, fireEvent) {
//		console.log('button success');
		SF.msgRtn(action.result.msgcode, action, 'OK', 'ok', fireEvent, this);
	},

	errorSubmitMsg : function(action, fireEvent) {
		var title = 'failure';
		if (action.result)
			title = action.result.msgcode;
//		console.log('button error');
		SF.msgRtn(title, action, 'OK', 'ok', fireEvent, this);
	},

	itemAction : function(item) {
		var self = this;
		var form = self.getClientForm();
		var baseForm = self.getBaseFormPanel();
		var addParams = Ext.clone(item.userConfig.params) || {};

		//2012.11.02 KKH 
		//TODO : 이벤트 체크 위치 미확정
		if(item.userConfig.checkValid && SF.cf.isValidTab(form.owner,true) === false)
			return false;
		
		switch (item.itemId) {
		case 'btnVersionUp':
			if (self.fireEvent('beforeVersionUp', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onBtnVersionUp(addParams, item.userConfig, self, baseForm);
			}
			break;
		case 'btnCreate':
			if (self.fireEvent('beforeCreate', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onBtnCreate(addParams, item.userConfig, self, baseForm);
			}
			break;
		case 'btnUpdate':
			if (self.fireEvent('beforeUpdate', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onBtnUpdate(addParams, item.userConfig, self, baseForm);
			}
			break;
		case 'btnDelete':
			if (self.fireEvent('beforeDelete', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onBtnDelete(addParams, item.userConfig, self, baseForm);
			}
			break;
		case 'btnUndelete':
			if (self.fireEvent('beforeUndelete', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onBtnUndelete(addParams, item.userConfig, self, baseForm);
			}
			break;
		case 'btnClose':
			if (self.fireEvent('beforeClose', baseForm) !== false) {
				self.onBtnClose(self, baseForm);
			}
			break;
		case 'btnProcess':
			if (self.fireEvent('beforeProcess', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onBtnProcess(addParams, item.userConfig, self, baseForm);
			}
			break;
		case 'btnRelease':
			if (self.fireEvent('beforeRelease', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onBtnRelease(addParams, item.userConfig, self, baseForm);
			}
			break;
		case 'btnRefresh':
			self.fireEvent('afterRefresh', form, baseForm);
			break;
		case 'btnView':
			self.fireEvent('afterView', form, baseForm);
			break;
		case 'btnExport':
			if (self.fireEvent('beforeExport', form, addParams, item.userConfig.url, baseForm) !== false) {
				self.onExportGrid(baseForm, item.userConfig.targetGrid, addParams, item.userConfig.url, item.title);
			}
			break;
		}
	},

	/*
	 * toolBar에 item을 추가한다. - index : toolBar에 출력할 버튼에 순서 - options : toolBar에
	 * 추가할 버튼 { xtype : button, text : 'Close' }
	 */
	addItem : function(index, options) {
		
		var control = null;
		
		if (!options)
			return;
		
		if(this.isControlDisabled(options.itemId)===true){
			options.disabled = true;
		}
		control = this.insert(index, options);

		if (options.eventName && options.eventFn) {
			this.sub(options.itemId).on(options.eventName, options.eventFn);
		}
		
		return control;
	},

	/*
	 * toolBar에 지정한 item에 disabled을 설정한다. - itemId : index 또는 itemId - disabled :
	 * true, false
	 */
	disabledItem : function(itemId, disabled) {
		var item = Ext.isNumber(itemId) ? this.items.getAt(itemId) : this.items.get(itemId);
		if (!item)
			return;
		
		if(this.isControlDisabled(itemId)===true){
			disabled = true;
		}
		
		if (disabled)
			item.disable();
		else
			item.enable();
	},

	/*
	 * toolBar에 지정한 item에 hidden을 설정한다. - itemId : index 또는 itemId - hidden :
	 * true, false
	 */
	hiddenItem : function(itemId, hidden) {
		if (Ext.isNumber(itemId)) {
			this.items.getAt(itemId).hidden = hidden;
		} else {
			this.items.get(itemId).hidden = hidden;
		}
	},

	/*
	 * toolBar에 지정한 item을 반환한다. - itemId : index 또는 itemId
	 */
	getItem : function(itemId) {
		if (Ext.isNumber(itemId)) {
			return this.items.getAt(itemId);
		} else {
			return this.items.get(itemId);
		}
	},

	zfill : {
		xtype : 'tbfill',
		itemId : 'tbfill',
		minWidth : 0
	},

	zbtnversionup : {
		xtype : 'button',
		cls : 'fontWeightBold',
		text : T('Caption.Button.Version Up'),
		itemId : 'btnVersionUp'
	},

	zbtncreate : {
		xtype : 'button',
		text : T('Caption.Button.Create'),
		itemId : 'btnCreate'
	},

	zbtnupdate : {
		xtype : 'button',
		text : T('Caption.Button.Update'),
		itemId : 'btnUpdate'
	},

	zbtndelete : {
		xtype : 'button',
		text : T('Caption.Button.Delete'),
		itemId : 'btnDelete'
	},

	zbtnundelete : {
		xtype : 'button',
		text : T('Caption.Button.Undelete'),
		itemId : 'btnUndelete'
	},

	zbtnclose : {
		xtype : 'button',
		text : T('Caption.Button.Close'),
		itemId : 'btnClose'
	},

	zbtnprocess : {
		xtype : 'button',
		text : T('Caption.Button.Process'),
		itemId : 'btnProcess'
	},

	zbtnview : {
		xtype : 'button',
		text : T('Caption.Button.View'),
		itemId : 'btnView'
	},

	zbtnrefresh : {
		xtype : 'button',
		text : T('Caption.Button.Refresh'),
		itemId : 'btnRefresh'
	},

	zbtnexport : {
		xtype : 'button',
		text : T('Caption.Button.Export'),
		itemId : 'btnExport'
	},
	
	zbtnRelease : {
		xtype : 'button',
		text : T('Caption.Button.Release'),
		itemId : 'btnRelease'
	}
});