Ext.define('mixin.Msg', function() {
	var msgCt;

	function createBox(t, s) {
		return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
	}

	function showMessage(t, s) {
		if (!msgCt) {
			msgCt = Ext.core.DomHelper.insertFirst(document.body, {
				id : 'msg-div'
			}, true);
		}
		var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
		var m = Ext.core.DomHelper.append(msgCt, createBox(t, s), true);
		m.hide();
		m.slideIn('t').ghost("t", {
			delay : 1000,
			remove : true
		});
		// SF.sound.notice();
	}

	/*this method is copied from MessagePopup.js,add icon ,so MessagePopup.js 暂时不用了。*/
	var showRtnMessage = function(title, rtnMsg, btnStyle, focus, fn, scope, value) {
		if (!btnStyle)
			btnStyle = 'OK';
		var msg = rtnMsg;
		var fieldMsg = false;
		var warningMsg = false;
		var icon = Ext.MessageBox.INFO; //zhang added 

		if (!rtnMsg) {
			title = T('Caption.Other.No response');
			rtnMsg = T('Message.No response');
		}

		if (rtnMsg.result != undefined && rtnMsg.result.success === true) {
			// title = rtnMsg.result.msgcode;
			msg = rtnMsg.result.msg;
		} else if (rtnMsg.failureType) {
			icon = Ext.MessageBox.WARNING; //zhang added
			switch (rtnMsg.failureType) {
			case Ext.form.action.Action.CLIENT_INVALID:
				title = 'Failure';
				msg = T('Message.CLIENT_INVALID');
				break;
			case Ext.form.action.Action.CONNECT_FAILURE:
				title = 'Failure';
				msg = T('Message.CONNECT_FAILURE');
				break;
			case Ext.form.action.Action.SERVER_INVALID:
				title = 'Failure';
				msg = rtnMsg.result.msg;
				break;
			default:
				// title = rtnMsg.result.msgcode;
				msg = rtnMsg.result.msg;
				break;
			}
		} else if (rtnMsg.msgcode) {
			// title = rtnMsg.msgcode;
			msg = rtnMsg.msg;
		}

		if (rtnMsg.dberrmsg || (rtnMsg.result && rtnMsg.result.dberrmsg)) {
			var dberrmsg = rtnMsg.dberrmsg || rtnMsg.result.dberrmsg;
			var code = rtnMsg.msgcode || rtnMsg.result.msgcode;
			msg = code + " : " + dberrmsg;
		}

		if (rtnMsg.fieldmsg || (rtnMsg.result && rtnMsg.result.fieldmsg)) {
			var data = rtnMsg.fieldmsg || rtnMsg.result.fieldmsg;
			if (data.length > 0) {
				//this.store.loadData(data); //zhang comments
				fieldMsg = true;
			}
		}
		var txtLen = msg.length;
		var cnt = 0;
		if(txtLen>0){
			cnt = txtLen/50;
		}
		for(var i=0;i<cnt;i++){
			var space = msg.search(/\s/);
			if(space<0){
				var left = msg.substr(0,i*61+60);
				var right = msg.substr(i*61+60);
				msg = left+' '+right;
			}
		}
		
		var cfg = {
			fieldMsg : fieldMsg,
			warningMsg : warningMsg,

			icon:icon,
			title : title,
			msg : msg,
			//buttons : this[btnStyle],
			buttons: Ext.Msg.OK,
			callback : fn,
			scope : scope,
			value : value
		};
		return Ext.MessageBox.show(cfg);
	}
	
	var showMessage = function(cfg, msg, btnStyle, focus, fn, scope, value) {
		if (!btnStyle)
			btnStyle = 'OK';
		if (!focus)
			focus = 'ok';

		var btnFocus = Ext.Array.indexOf(this.buttonIds, focus);
		if (Ext.isString(cfg)) {
			cfg = {
				title : cfg,
				msg : msg,
				icon: Ext.MessageBox.INFO, //zhang added
				buttons : Ext.Msg.OK,
				callback : fn,
				scope : scope,
				value : value
			};
			if (btnFocus >= 0) {
				Ext.apply(cfg, {
					btnFocus : btnFocus
				});
			}
		} else if (cfg.fields && cfg.msg) {
			for ( var key in cfg.fields) {
				cfg.msg = cfg.msg.replace('{' + key + '}', cfg.fields[key]);
			}
		}
		return Ext.MessageBox.show(cfg);
	}
	
	/*
	 * TODO 아래 msgBox와 msgRtn은 MES 모듈의 mixin으로 이동해야 한다.
	 * zhang changed and removed MessagePopup.js
	 */
	function msgBox(title, msg) {
		showMessage(title, msg, btnStyle, focus, fn, scope, value);
	}

	function msgRtn(title, rtnMsg, btnStyle, focus, fn, scope, value) {
		showRtnMessage(title, rtnMsg, btnStyle, focus, fn, scope, value);
	}

	return {
		msg : showMessage,
		msgRtn : msgRtn,
		msgBox : msgBox
	};
}());