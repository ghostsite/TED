Ext.define('MEStouch.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            login: 'login',
			factoryName: 'login [name=j_factory]',
            loginName: 'login [name=j_username]',
            password: 'login [name=j_password]',
            resetButton: 'login button[itemId=resetButton]',
            loginButton: 'login button[itemId=loginButton]',
            saveToggle: 'login togglefield[itemId=save]'
        },

        control: {
            login: {
                initialize: 'onInit'
            },
            factoryName: {
                change: 'onFactoryNameChanged'
            },
            loginName: {
                change: 'onLoginNameChanged'
            },
            password: {
                change: 'onPasswordChanged'
            },
            resetButton: {
                tap: 'onButtonReset'
            },
            loginButton: {
                tap: 'onButtonLogin'
            }
        }
    },

    onFactoryNameChanged: function(f, value) {
        f.setValue(value.toUpperCase());
    },

    onLoginNameChanged: function(f, value) {
        f.setValue(value.toUpperCase());
    },

    onPasswordChanged: function(f, value) {
        f.setValue(value.toUpperCase());
    },

    onButtonLogin: function() {
        var self = this;

        MEStouch.setting.set('SavePassword', self.getSaveToggle().getValue() ? 'Y': 'N');
        if (self.getSaveToggle().getValue()) {
            MEStouch.setting.set('DefaultFactory', self.getFactoryName().getValue());
            MEStouch.setting.set('DefaultLogin', self.getLoginName().getValue());
            MEStouch.setting.set('DefaultPassword', MEStouch.base64.encode(self.getPassword().getValue()));
        }

        this.getLogin().submit({
            method: 'POST',
            scope: this,
            success: function(form, response) {
				self.gotoMain();
            },
            failure: function(form, response) {
				/* 개발모드인 경우는 아래와 같이 */
				if(document.location.href.indexOf('/m/') < 0) {
					Ext.Msg.confirm('로그인 실패', '개발 모드이므로, 로그인 바이패스 하시겠습니까?', function(confirm) {
						if (confirm === 'yes') {
							self.gotoMain();
						}
					});
				} else {
	                Ext.Msg.alert('로그인 실패', '오류원인 : ' + response.status + ' - ' + response.statusText);
				}
            }
        });
    },

    onButtonReset: function() {
        this.getLogin().reset();
    },

    onInit: function() {
		this.getFactoryName().setValue(MEStouch.setting.get('DefaultFactory'));
        this.getLoginName().setValue(MEStouch.setting.get('DefaultLogin'));
        this.getPassword().setValue(MEStouch.base64.decode(MEStouch.setting.get('DefaultPassword')));
        this.getSaveToggle().setValue(MEStouch.setting.get('SavePassword') === 'N' ? 0: 1);
    },

	gotoMain: function() {
		var self = this;
		
		var count = 0;

		function forSync() {
			if(++count === 3) {
				// TODO Confirm
				Ext.Viewport.removeAll(true, false); /* Ext.Msg 까지 사라지므로, 버그를 유발한다. */
				// self.getLogin().destroy();
				Ext.Viewport.add(Ext.create('MEStouch.view.Main', {})).show();
			}
		}

		Ext.getStore('BasViewDataListOut').load(forSync);
		Ext.getStore('RasViewEventListOut').load(forSync);
		Ext.getStore('RasViewResourceListOut').load(forSync);
	}

});