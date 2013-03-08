Ext.define('mixin.Msg', function(){
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
		//SF.sound.notice();
	}
	
	/*
	 * TODO 아래 msgBox와 msgRtn은 MES 모듈의 mixin으로 이동해야 한다.
	 */
	function msgBox(title, msg, btnStyle,focus,fn, scope, value){
		var box = Ext.create('MES.view.window.MessagePopup');
		box.showMessage(title, msg, btnStyle,focus,fn, scope, value);
	}

	function msgRtn(title, rtnMsg, btnStyle,focus,fn, scope, value){
		var box = Ext.create('MES.view.window.MessagePopup');
		box.showRtnMessage(title, rtnMsg, btnStyle,focus,fn, scope, value);
	}
	
	return {
		msg : showMessage,
		msgRtn : msgRtn,
		msgBox : msgBox
	};
}());
