Ext.define('SEC.controller.SECController', {
	extend : 'Ext.app.Controller',
	
	requires : [ 'SEC.mixin.SessionInfo' ],

	stores : [],
	models : [],
	views : [],

	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});
		
		SF.mixin('SEC.mixin.SessionInfo');
	},

	onViewportRendered : function() {
		if(typeof(roleList) !== 'undefined') {
			SF.addSideMenu('Ext.form.ComboBox', {
				store : Ext.create('Ext.data.Store', {
					fields : ['name'],
					data : roleList.list
				}),
				queryMode : 'local',
			    displayField: 'name',
				valueField: 'name',
				editable : false,
				listConfig : {
					getInnerTpl : function() {
						return '<div class="appSearchItem"><span class="kind">Role</span> <span class="key">{name}</span></div>'; 
					}, 
					minWidth : 140
				},
				listeners : {
					'select' : function(combo, records, eOpts) {
						var role = records[0].get('name');
						var store = Ext.getStore('CMN.store.MainMenuStore');
						store.proxy.extraParams.secGrpId = role;
						store.load();
					}
				}
			});
		}
		
		//user menu
		var userMenu =  [ ];
		userMenu.push({
			text : T('Caption.Other.Profile'),
			icon : 'image/icon/properties.gif',
			handler : function() {
				SF.doMenu({
					viewModel : 'SEC.view.setup.UserProfile'
				});
			}
		});
		// 언어설정 메뉴 등록
		if(window.LANGUAGE_LIST && LANGUAGE_LIST.length> 0){
			var localeList = [];
			for(var i in LANGUAGE_LIST){
				localeList.push({
					xtype : 'menucheckitem',
					text : LANGUAGE_LIST[i].text,
					group : 'locale',
					icon: LANGUAGE_LIST[i].icon, //zhang added
					inputValue : LANGUAGE_LIST[i].locale,
					checked : (SF.login.locale==LANGUAGE_LIST[i].locale),
					checkHandler : function (item, checked){
						if(checked){
							var locale = item.inputValue;
							if(!locale){
								Ext.Msg.alert('Error', 'Please, select the language.');
								return;
							}
							SF.cf.callService({
								url : 'user/changeLanguage',
								params : {
									language : locale
								},
								callback : function(options, success, response) {
									if(success)
										location.reload();
								}
							});
						}
					}
				});
			}
			userMenu.push({
				text : T('Caption.Other.Language'),
				icon : 'image/icon/shuffle.png', //zhang added 
				menu : {
					xtype : 'menu',
					ignoreParentClicks : true,
					items : localeList
				}
			});
		}
	
		userMenu.push({
			text : T('Caption.Other.Logout'),
			icon : 'image/icon/logout.png',
			handler : function() {
				Ext.MessageBox.confirm('提示', '你确认退出系统?', function(confirm) {
					if (confirm === 'yes') {
						document.location.href = typeof(LOGOUT_URL) === 'undefined' ? 'logout?targetUrl=/showLogin' : LOGOUT_URL;;
					}
				});
			}
		});
		
		SF.addSideMenu('Ext.button.Button', {
			text : SF.login.name,
			cls : 'iconUser',
			menu : userMenu
		});
	}
});