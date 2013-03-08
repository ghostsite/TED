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
		
		SF.addSideMenu('Ext.button.Button', {
			text : SF.login.name + ' @ ' + SF.login.factory,
			cls : 'iconUser',
			menu : [ {
				text : T('Caption.Other.Profile'),
				handler : function() {
					SF.doMenu({
						viewModel : 'SEC.view.setup.UserProfile'
					});
				}
			}, {
				text : T('Caption.Other.Logout'),
				handler : function() {
					Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(confirm) {
						if (confirm === 'yes') {
							document.location.href = typeof(LOGOUT_URL) === 'undefined' ? 'logout?targetUrl=/home' : LOGOUT_URL;;
						}

					});
				}
			} ]
		});
		
	}
});