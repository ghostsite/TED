Ext.define('MEStouch.controller.Setting', {
    extend: 'Ext.app.Controller',
    requires: [
    'MEStouch.mixin.Setting'
    ],

    config: {
        refs: {
            setting: 'setting',
			factoryField: 'setting [itemId=factory]',
            resourceField: 'setting [itemId=resource]',
			resourceHiddenField: 'setting [name=resId]',
            billingField: 'setting [itemId=billing]',
            resourceListButton: 'setting button[itemId=resourcelist]',
			logoutButton: 'setting button[itemId=logout]'
        },

        control: {
            setting: {
                initialize: 'onInit'
            },
			factoryField: {
				change: 'onFactoryChanged'
			},
            resourceHiddenField: {
                change: 'changeResource'
            },
            resourceListButton: {
                tap: 'selectResource'
            },
            billingField: {
                change: 'changeBilling'
            },
			logoutButton: {
				tap: 'onLogout'
			}
        }
    },
	
    onInit: function() {
	    this.getResourceField().isField = true;
    
		this.getFactoryField().setValue(MEStouch.setting.get('DefaultFactory'));
        this.getResourceField().setValue(MEStouch.setting.get('DefaultResourceDisp'));
        this.getResourceHiddenField().setValue(MEStouch.setting.get('DefaultResource'));
        this.getBillingField().setValue(MEStouch.setting.get('DefaultBilling') === 'N' ? 0: 1);
    },
	
	onFactoryChanged: function(field, value) {
		var factory = value ? value.toUpperCase() : '';
        MEStouch.setting.set('DefaultFactory', value);
	},

    selectResource: function(field) {
        this.getSetting().push({
            xtype: 'reslist',
            displayTarget: this.getResourceField(),
			valueTarget: this.getResourceHiddenField(),
            navigationView: this.getSetting()
        });
    },

    changeResource: function(field, value) {
        MEStouch.setting.set('DefaultResourceDisp', this.getResourceField().getValue());
        MEStouch.setting.set('DefaultResource', value);
    },

    changeBilling: function(field, x, y, value) {
        MEStouch.setting.set('DefaultBilling', value ? 'Y': 'N');
    },

	onLogout: function() {
		Ext.Msg.confirm('로그아웃', '정말 로그아웃하시겠습니까?', function(confirm) {
			if (confirm === 'yes') {
				MEStouch.setting.set('DefaultLogin', '');
				MEStouch.setting.set('DefaultPassword', '');

				document.location.href = 'logout';
			}
		});
	}

});