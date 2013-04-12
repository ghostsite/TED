Ext.define('SEC.controller.SECController', {
	extend : 'Ext.app.Controller',
	
	requires : [ 'SEC.mixin.SessionInfo' ],

	stores : [],
	models : ['SEC.model.SecFunc'],
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
				value : SF.login.group,
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
		//profile 수정등록
		var MP_AllowUpdateProfile = SF.option.get('MP_AllowUpdateProfile')||{};
		
		if(MP_AllowUpdateProfile.value1 != 'N'){
			var MP_AssemblyNameOfProfile = SF.option.get('MP_AssemblyNameOfProfile')||{};
			
			userMenu.push({
				text : T('Caption.Other.Profile'),
				handler : function() {
					SF.doMenu({
						viewModel : MP_AssemblyNameOfProfile.value1 || 'SEC.view.setup.UserProfile'
					});
				}
			});
		}
		// 언어설정 메뉴 등록
		if(window.LANGUAGE_LIST && LANGUAGE_LIST.length> 0){
			var localeList = [];
			for(var i in LANGUAGE_LIST){
				localeList.push({
					xtype : 'menucheckitem',
					text : LANGUAGE_LIST[i].text,
					group : 'locale',
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
								url : 'service/secChangeLanguage.json',
								params : {
									procstep : '1',
									langCode : locale
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
				menu : {
					xtype : 'menu',
					ignoreParentClicks : true,
					items : localeList
				}
			});
		}
	
		userMenu.push({
			text : T('Caption.Other.Logout'),
			handler : function() {
				Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(confirm) {
					if (confirm === 'yes') {
					
						document.location.href = typeof(LOGOUT_URL) === 'undefined' ? 'logout?targetUrl=/showLogin' : LOGOUT_URL;;
					}
				});
			}
		});
		
		SF.addSideMenu('Ext.button.Button', {
			text : SF.login.name + ' @ ' + SF.login.factory,
			cls : 'iconUser',
			menu : userMenu
		});
	}
});