Ext.define('Opc.controller.Navigator', {
	extend : 'Ext.app.Controller',

	//stores : [ 'SEC.store.SecViewFavoritesListOut.list' ],
	stores : ['CMN.store.FavoriteStore'],   	views : [ 'Navigator' ],

	statics : {
		unique : null,
		uniqview : null
	},

	refs : [ {
		selector : 'navigator',
		ref : 'navigator'
	}, {
		selector : 'settings',
		ref : 'settings'
	}, {
		selector : 'intro',
		ref : 'intro'
	}, {
		selector : 'navigator #btnFactory',
		ref : 'factoryname'
	}, {
		selector : 'navigator #btnUser',
		ref : 'username'
	}, {
		selector : 'navigator #txbar',
		ref : 'txBar'
	}, {
		selector : 'navigator #pageTitle',
		ref : 'pageTitle'
	}, {
		selector : 'navigator #opcStatus',
		ref : 'opcStatus'
	}, {
		selector : '#agentIndicator',
		ref : 'agentIndicator'
	}, {
		selector : '#addfavor',
		ref : 'addFavor'
	} ],

	init : function() {
		Opc.controller.Navigator.unique = this;

		this.control({
			'navigator' : {
				render : this.onRender,
				afterrender : this.onAfterrender,
				checkfavor : this.onCheckFavor
			},
			'navigator button#btnSettings' : {
				click : this.onSettingsClick
			},
			'navigator button#btnFactory' : {
				click : this.onHomeClick
			},
			'navigator button#btnLogout' : {
				click : this.onLogoutClick
			},
			'navigator button#btnMenu' : {
				click : this.onMenuClick
			},
			'navigator #txbar' : {
				afterrender : this.onAfterRenderTxBar
			},
			'navigator #txbar button' : {
				click : this.onClickTxBarButton
			},
			'#opcStatus button' : {
				click : this.onClickTxBarButton
			},
			'#alm_tray_carousel' : {
				click : this.onAlarmCarouselClick
			},
			'#addfavor' : {
				click : this.onAddFavorite
			},
			'#alarmIndicator' : {
				click : this.onAlarmIndicatorClick
			}
		});
	},

	onRender : function(view) {
		Opc.controller.Navigator.uniqview = view;
	},

	onBackClick : function() {
		SF.history.back();
	},

	onForwardClick : function() {
		SF.history.forward();
	},

	onSettingsClick : function() {
		SF.go('Opc.view.Settings');
	},

	onMenuClick : function() {
		var store = Ext.getStore('SEC.store.SecViewFunctionListOut.list');
		if (store.count() <= 0) {
			store.load({
				params : {
					procstep : '1',
					programId : SF.login.programId,
					secGrpId : SF.login.group,
					funcGroup : ''
				}
			});
		}

		var box = this.getNavigator().getBox(true);
		Ext.create('Opc.view.Menu', {
			height : box.height - 80
		}).showAt(box.width - 330, 50);
	},

	onHomeClick : function() {
		SF.go('Opc.view.Intro');
	},

	onLogoutClick : function() {
		Ext.MessageBox.confirm('确认', '你确认退出系统?', function(confirm) {
			if (confirm === 'yes') {
				document.location.href = typeof (LOGOUT_URL) === 'undefined' ? 'logout?targetUrl=/opc' : LOGOUT_URL;
			}
		});
	},

	onAfterrender : function() {
		var self = this;

		/* 세션의 기본정보를 화면에 디스플레이한다. */
		this.getFactoryname().setText(SmartFactory.login.factory);
		this.getUsername().setText(SmartFactory.login.id);

		var token = Ext.History.getToken();

		if (token) {
			SF.history.force();
		} else {
			var defaultMenu = SmartFactory.setting.get('opc-default-menu');

			if (defaultMenu)
				SF.go(defaultMenu);
			else
				SF.history.force();
		}

		this.getOpcStatus().getEl().on('click', function(me, e) {
			if (e.id == 'opcStatus-body') {
				self.onClickLog();
			}
		});

		/* Agent의 커넥션 상태를 표시하기 위한 작업 */
		SF.agent.on('open', function(url) {
			self.getAgentIndicator().removeCls('off');
			SF.msg('WS-Connected', ' ' + url);
		});
		SF.agent.on('close', function(url, code, reason) {
			self.getAgentIndicator().addCls('off');
			SF.msg('WS-Disconnected', url + '(' + code + ':' + reason + ')');
		});
	},

	onCheckFavor : function() {
		var activeView = this.getNavigator().getLayout().getActiveItem();
		if (!activeView)
			return;
		var vm = Ext.getClassName(activeView);
		//var favorstore = Ext.getStore('SEC.store.SecViewFavoritesListOut.list');
		var favorstore = Ext.getStore('CMN.store.FavoriteStore');
		var menustore = Ext.getStore('SEC.store.SecViewFunctionListOut.list');
		var addFavor = this.getAddFavor();

		if (favorstore.find('path', vm) >= 0) {
			addFavor.show();
			addFavor.removeCls('off');
		} else if (menustore.find('path', vm) >= 0) {
			addFavor.show();
			addFavor.addCls('off');
		} else {
			addFavor.hide();
		}
	},

	onAfterRenderTxBar : function(view) {
		//var favorstore = Ext.getStore('SEC.store.SecViewFavoritesListOut.list');
		var favorstore = Ext.getStore('CMN.store.FavoriteStore');		favorstore.on('load', function(store) {
			var favors = [];
			store.each(function(record) {
				favors.push({
					xtype : 'button',
					//icon : 'image/menuIcon/' + record.get('iconIndex') + '_32.png',
					icon :  record.get('icon3'),
					//tooltip : record.get('userFuncDesc'),
					tooltipType : 'title',
					tooltip : record.get('qtip'),
					itemId : record.get('path')
				});
			});

			view.removeAll();
			view.add(favors);

			this.getNavigator().fireEvent('checkfavor');
		}, this);
		favorstore.load({
			showSuccessMsg : false,
			params : {
				procstep : '1',
				programId : SF.login.programId
			}
		});

		var menustore = Ext.getStore('SEC.store.SecViewFunctionListOut.list');
		var self = this;
		menustore.on('load', function(store) {
			self.getNavigator().fireEvent('checkfavor');
		});
		menustore.load({
			showSuccessMsg : false,
			params : {
				procstep : '1',
				programId : SF.login.programId,
				secGrpId : SF.login.group,
				funcGroup : ''
			}
		});
	},

	onClickLog : function() {
		SF.go('Opc.view.ViewLogInfo');
	},

	onClickTxBarButton : function(button) {
		if (button.itemId)
			SF.go(button.itemId);
	},

	onAlarmCarouselClick : function() {
		SF.go('Opc.view.Alarm');
	},

	onAlarmIndicatorClick : function() {
		SF.go('Opc.view.Alarm');
	},

	onAddFavorite : function(button) {
		var view = this.getNavigator().getLayout().getActiveItem();
		var procstep = (button.hasCls('off')) ? SF_STEP_CREATE : SF_STEP_DELETE;
		var funcName = '';

		if (procstep === SF_STEP_CREATE) {
			var record = Ext.getStore('SEC.store.SecViewFunctionListOut.list').findRecord('path', Ext.getClassName(view));
			if (!record) {
				return;
			}
			funcName = record.get('funcName');
		} else {
			var record = Ext.getStore('CMN.store.FavoriteStore').findRecord('path', Ext.getClassName(view));
			if (!record) {
				return;
			}
			funcName = record.get('funcName');
		}

		var params = {
			procstep : procstep,
			programId : SF.login.programId,
			funcName : funcName,
			userFuncDesc : view.title,
			seqNum : 1
		};

		Ext.Ajax.request({
			url : 'service/SecUpdateFavorites.json',
			params : params,
			success : function() {
				//Ext.getStore('SEC.store.SecViewFavoritesListOut.list').load({
				Ext.getStore('CMN.store.FavoriteStore').load({
					params : {
						procstep : '1',
						programId : SF.login.programId
					}
				});
			}
		});
	}
});