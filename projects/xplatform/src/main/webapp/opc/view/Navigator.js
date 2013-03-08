Ext.define('Opc.view.Navigator', {
	extend : 'Ext.panel.Panel',

	layout : 'card',

	xtype : 'navigator',

	id : 'navigator',

	bodyCls : 'contentCommon',

	dockedItems : [ {
		xtype : 'panel',
		id : 'opcStatus',
		dock : 'bottom',
		cls : 'outputMsg',
		tpl : '<span class="{iconCls} icon"></span><span class="msg">{title}</span>{msg}',
		data : {
			title : 'Ready',
			msg : ''
		},
		dockedItems : [ {
			xtype : 'button',
			dock : 'left',
			width : 50,
			itemId : 'Opc.view.FavoritesSetup',
			cls : 'btnBarsetting',
			text : 'more'
		} ]
	}, {
		xtype : 'toolbar',
		itemId : 'txbar',
		cls : 'favorBar',
		dock : 'left'
	}, {
		xtype : 'toolbar',
		dock : 'top',
		height : 35,
		cls : 'header',
		itemId : 'topBar',
		items : [ {
			xtype : 'button',
			itemId : 'btnFactory',
			cls : 'factoryName'
		}, {
			xtype : 'tbfill'
		}, {
			xtype : 'button',
			itemId : 'btnMenu',
			cls : 'iconHeader btnMenu'
		}, {
			xtype : 'button',
			itemId : 'btnSettings',
			cls : 'iconHeader btnSettings'
		}, {
			xtype : 'button',
			itemId : 'btnLogout',
			cls : 'iconHeader btnLogout'
		} ]
	}, {
		xtype : 'toolbar',
		dock : 'top',
		height : 40,
		cls : 'pageStatus',
		items : [ {
			cls : 'btnAddFavorite',
			id : 'addfavor'
		}, {
			itemId : 'pageTitle',
			cls : 'pageTitle'
		}, {
			xtype : 'tbfill'
		}, {
			xtype : 'button',
			itemId : 'btnUser',
			iconCls : 'iconUser',
			cls : 'userName'
		}, {
			xtype : 'button',
			id : 'serverIndicator',
			cls : 'btnServer off'
		}, {
			xtype : 'button',
			id : 'agentIndicator',
			cls : 'btnAgent off'
		}, {
			xtype : 'button',
			id : 'alarmIndicator',
			cls : 'btnAlarm off'
		}, {
			xtype : 'textcarousel',
			id : 'alm_tray_carousel',
			cls : 'trayNotice',
			data : [ {
				time : '10:39',
				text : 'Keep clean around your station.'
			}, {
				time : '11:28',
				text : 'Let\'s simplify our works.'
			}, {
				time : '17:19',
				text : 'Don\'t forget to meet today.'
			} ],
			width : 0
		}, {
			xtype : 'button',
			id : 'alm_tray_count',
			cls : 'trayNoticeCount',
			html : '3',
			hidden : true
		} ]
	} ],

	initComponent : function() {
		this.callParent();

		var topBar = this.down('#topBar');

		Ext.Array.each(SF.custom.top(), function(component) {
			try {
				topBar.insert(2, '-');
				topBar.insert(2, component);
			} catch (e) {
				SF.error('SYS-E004', {
					view : component
				}, e);
			}
		});
	},

	/*
	 * Navigator에서 현재 뷰가 클로즈되면, 이전 히스토리로 이동한다. 이 부분은 listener의 'remove' 로 대체하면
	 * 안된다. listener의 'remove' 이벤트는 버블링되는 이벤트를 다 받기 때문이다.
	 */
	onRemove : function(item, autoDestroy) {
		SF.history.back();

		this.callParent(arguments);
	}
});
