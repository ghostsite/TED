Ext.require([ 'CMN.mixin.Status', 'CMN.mixin.Search', 'CMN.mixin.Vtypes' ]);

Ext.define('CMN.controller.CMNController', {
	extend : 'Ext.app.Controller',

	requires : [ 'CMN.data.proxy.PayloadProxy', 'CMN.plugin.Supplement' ],

	stores : [ 'CMN.store.MainMenuStore', 'CMN.store.FavoriteStore', 'CMN.store.AppSearchStore', 'CMN.store.LogStore' ],
	models : [ 'CMN.model.MainMenu', 'CMN.model.Favorite', 'CMN.model.AppSearch', 'CMN.model.Log' ],
	views : [ 'CMN.view.viewport.Center', 'CMN.view.viewport.South', 'CMN.view.viewport.East', 'CMN.view.viewport.North', 'CMN.view.viewport.West',
			'CMN.view.common.MainMenu', 'CMN.view.common.SideMenu', 'CMN.view.common.AppTool', 'CMN.view.common.NavMainMenu',
			'CMN.view.common.NavFavorite', 'CMN.view.common.AppSearchField', 'CMN.view.form.DateTimeField', 'CMN.view.form.TimePeriodField',
			'CMN.view.form.DatePeriodField', 'CMN.view.form.DateTimePeriodField', 'CMN.view.common.RowStatic' ],

	init : function() {

		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});

		SF.mixin('CMN.mixin.Status');
		/* Application Search 기능은 사용하지 않는다. */ 
		/* SF.mixin('CMN.mixin.Search'); */
		SF.mixin('CMN.mixin.Vtypes');
	},

	onViewportRendered : function() {
		/* Load시에 사용한 로드 프로그레스바를 제거함 */
		var lp = document.getElementById('_loadprogress');
		if (lp)
			document.body.removeChild(lp);

		if(SF.search) {
			SF.addSideMenu('CMN.view.common.AppSearchField', {
				store : Ext.create('CMN.store.AppSearchStore')
			});
		}

		SF.addNav({
			xtype : 'cmn.nav_mainmenu',
			iconCls : 'iconsetDockMenu',
			itemId : 'navMainMenu',
			tabConfig : {
				tooltip : T('Caption.Other.Menu')
			}
		});

		SF.addNav({
			xtype : 'cmn.nav_favorite',
			iconCls : 'iconsetDockFavor',
			itemId : 'navFavor',
			tabConfig : {
				tooltip : T('Caption.Other.Favorites')
			}
		});
		
		this.setStatusBar();
	},
	
	setStatusBar : function() {
		// tray icon 추가
		SF.status.tray({
			xtype : 'button',
			id : 'log_tray',
			cls : 'trayError',
			text : '0',
			handler : function() {
				SF.doMenu({
					viewModel : 'CMN.view.common.ViewLogInfo'
				});
			}
		},0);
	}

});