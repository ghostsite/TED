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

	/*
	 * TODO 아래 msgBox와 msgRtn은 MES 모듈의 mixin으로 이동해야 한다.
	 * zhang changed and removed MessagePopup.js
	 */
	function msgBox(title, msg) {
		SF.alertInfo(title,msg);
	}

	function msgRtn(title, rtnMsg, btnStyle, focus, fn, scope, value) {
		var icon = Ext.MessageBox.INFO; //zhang added
		if (!rtnMsg) {
			title = T('Caption.Other.No response');
			rtnMsg = T('Message.No response');
		}

		if (rtnMsg.result != undefined && rtnMsg.result.success === true) {
			// title = rtnMsg.result.msgcode;
			msg = rtnMsg.result.msg;
		} else if (rtnMsg.failureType) {
			icon = Ext.MessageBox.ERROR; //zhang added
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
			on = Ext.MessageBox.ERROR; //zhang added
			msg = rtnMsg.msg;
		}
		
		Ext.Msg.alert({
			title : title,
			icon : icon,
			msg : msg,
			buttons : Ext.Msg.OK
		});
	}

	return {
		msg : showMessage,
		msgRtn : msgRtn,
		msgBox : msgBox
	};
}());