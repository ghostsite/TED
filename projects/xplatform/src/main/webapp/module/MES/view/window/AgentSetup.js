Ext.define('MES.view.window.AgentSetup', {
	extend : 'Ext.panel.Panel',

	alias : 'widget.agentsetup',

	initComponent : function() {

		this.buttons = [ {
			itemId : 'btnReConnect',
			width : 150,
			text : T('Caption.Button.Save & Re-connect')
		}, {
			itemId : 'btnSave',
			text : T('Caption.Button.Save')
		}, {
			itemId : 'btnCancel',
			text : T('Caption.Button.Cancel')
		} ];

		this.callParent();

		var self = this;

		this.on('afterrender', function() {
			var agentSetting = SF.setting.get('agent-settings');
			if (agentSetting && agentSetting.agentURL) {
				var txtUrl = self.sub('txtUrl');
				var txtPort = self.sub('txtPort');
				var agentURL = agentSetting.agentURL ? Ext.String.trim(agentSetting.agentURL) : '';
				var url = agentURL.substr(5).split(':')[0];
				var port = agentURL.substr(5).split(':')[1];
				txtUrl.setValue(url);
				txtPort.setValue(port);
			}
		});

		this.sub('btnReConnect').on('click', function() {
			// MESAgent 접속 해제
			SF.agent.disconnect();
			// agent 설정정보 저장
			if (self.saveAgent() === true) {
				// MESAgent 접속
				SF.agent.connect();
				self.up().close();
			}
		});

		this.sub('btnSave').on('click', function() {
			self.saveAgent();
			self.up().close();
		});

		this.sub('btnCancel').on('click', function() {
			self.up().close();
		});
	},

	saveAgent : function() {
		var txtUrl = this.sub('txtUrl');
		var txtPort = this.sub('txtPort');
		var url = txtUrl.getValue() ? Ext.String.trim(txtUrl.getValue()) : '';
		var port = txtPort.getValue() ? Ext.String.trim(txtPort.getValue()) : '';
		var bCheck = true;
		var agentUrl = '';

		if (Ext.isEmpty(url)) {
			// Ext.Msg.alert('Error', T('Message.108'), function() {
			// txtUrl.focus();
			// });
			// return false;
			bCheck = false;
		}

		if (Ext.isEmpty(port)) {
			// Ext.Msg.alert('Error', T('Message.108'), function() {
			// txtPort.focus();
			// });
			// return false;
			bCheck = false;
		}

		if (txtUrl.isValid() == false) {
			// return false;
			bCheck = false;
		}

		if (txtPort.isValid() == false) {
			// return false;
			bCheck = false;
		}

		if (bCheck === true) {
			agentUrl = 'ws://' + url + ':' + port;
		} else {
			agentUrl = '';
		}

		SF.setting.set('agent-settings', {
			agentURL : agentUrl
		});
		return true;
	},

	items : [ {
		xtype : 'container',
		layout : 'anchor',
		cls : 'paddingAll7',
		defaults : {
			anchor : '100%'
		},
		items : [ {
			xtype : 'textfield',
			itemId : 'txtUrl',
			vtype : 'iPAddress',
			fieldLabel : T('Caption.Other.URL')
			//value : '127.0.0.1'
			//emptyText : '127.0.0.1'
		}, {
			xtype : 'textfield',
			itemId : 'txtPort',
			vtype : 'numbers',
			fieldLabel : T('Caption.Other.Port')
			//value : '81'
			//emptyText : '8080'
		} ]
	} ]
});