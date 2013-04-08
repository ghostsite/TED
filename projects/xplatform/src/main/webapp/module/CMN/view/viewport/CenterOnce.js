Ext.define('CMN.view.viewport.CenterOnce', { //一次只展示一个，覆盖

	extend : 'Ext.panel.Panel',

	xtype: 'centeronce',
	
	layout : 'fit',
	
	id : 'content',
	
	bodyCls : 'introImg',

	alias : 'widget.viewport.centeronce',

	enableTabScroll : true,

	/*
	 * TabPanel에 아무것도 없는 상태가 되면, 토큰이 없는 브라우저 History가 추가된다.
	 * 이 부분은 listener의 'remove' 로 대체하면 안된다.
	 * listener의 'remove' 이벤트는 버블링되는 이벤트를 다 받기 때문이다.
	 */
	onRemove: function(item, autoDestroy) {
		SF.history.back();
		this.callParent(arguments);
	}
});